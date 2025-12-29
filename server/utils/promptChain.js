// Prompt chaining utilities for breaking large prompts into smaller, cacheable chunks
const { cacheWrapper, hashObject } = require('./cache');
const { generateContent, retryWithBackoff } = require('./openrouter');

/**
 * Chain Step 1: Prioritize skills by importance
 * Fast, cacheable, ~200 tokens output
 */
async function prioritizeSkills(skillGaps) {
  const cacheKey = `priority:${hashObject(skillGaps)}`;
  
  const { data, fromCache } = await cacheWrapper(
    cacheKey,
    7 * 24 * 60 * 60, // 7 days
    async () => {
      const prompt = `Given these skill gaps, return ONLY a JSON array of skill names sorted by importance (highest to lowest):

${JSON.stringify(skillGaps, null, 2)}

Return format: ["SkillName1", "SkillName2", ...]

Consider:
1. Impact on target role
2. Prerequisite dependencies
3. Learning difficulty vs. value`;

      const response = await retryWithBackoff(async () => {
        return await generateContent(prompt);
      });
      
      // Clean markdown code blocks
      let jsonText = response.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }
      
      return JSON.parse(jsonText);
    }
  );

  return data;
}

/**
 * Chain Step 2: Generate weekly structure
 * Medium complexity, ~500 tokens output
 */
async function generateWeeklyStructure(priorities, targetRole, hoursPerWeek) {
  const cacheKey = `weeks:${hashObject({ priorities, targetRole, hoursPerWeek })}`;
  
  const { data, fromCache } = await cacheWrapper(
    cacheKey,
    7 * 24 * 60 * 60, // 7 days
    async () => {
      const totalSkills = priorities.length;
      const estimatedWeeks = Math.ceil(totalSkills * 2); // ~2 weeks per skill
      
      const prompt = `Create a ${estimatedWeeks}-week learning plan for these skills IN ORDER:
${priorities.join(', ')}

Target Role: ${targetRole || 'Not specified'}
Available Time: ${hoursPerWeek} hours/week

Return ONLY valid JSON array:
[
  {
    "week": 1,
    "skill": "SkillName",
    "topics": ["Topic1", "Topic2", "Topic3"],
    "estimatedHours": ${hoursPerWeek},
    "practiceProject": "Specific project description",
    "milestones": ["Milestone1", "Milestone2"]
  },
  ...
]

Rules:
1. Each week focuses on ONE skill
2. Topics should be specific and sequential
3. Practice projects must be concrete and achievable
4. Milestones are measurable outcomes`;

      const response = await retryWithBackoff(async () => {
        return await generateContent(prompt);
      });
      
      let jsonText = response.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }
      
      try {
        return JSON.parse(jsonText);
      } catch (parseError) {
        console.error('❌ JSON parse error in weekly structure:', parseError.message);
        console.log('📝 Attempting to fix malformed JSON...');
        
        try {
          // Common fixes for AI-generated JSON
          let fixed = jsonText
            // Remove trailing commas before closing brackets
            .replace(/,(\s*[}\]])/g, '$1')
            // Fix incomplete arrays (missing closing bracket)
            .replace(/(\{[^}]*$)/, '$1}]');
          
          // If still not valid, try to extract just the array part
          const arrayMatch = fixed.match(/\[[\s\S]*\]/);
          if (arrayMatch) {
            fixed = arrayMatch[0];
          }
          
          const parsed = JSON.parse(fixed);
          console.log('✅ Successfully recovered malformed JSON');
          return parsed;
        } catch (secondError) {
          console.error('❌ Could not recover JSON. Response preview:');
          console.error('First 300 chars:', jsonText.substring(0, 300));
          console.error('Last 300 chars:', jsonText.substring(Math.max(0, jsonText.length - 300)));
          throw new Error(`AI returned invalid JSON: ${parseError.message}`);
        }
      }
    }
  );

  return data;
}

/**
 * Chain Step 3: Fetch resources for a single week
 * Small, highly cacheable, ~300 tokens output
 */
async function fetchWeekResources(week) {
  const cacheKey = `resources:${hashObject(week)}`;
  
  const { data, fromCache } = await cacheWrapper(
    cacheKey,
    14 * 24 * 60 * 60, // 14 days (resources don't change often)
    async () => {
      const prompt = `Find 3-4 FREE learning resources for:
Skill: ${week.skill}
Topics: ${week.topics.join(', ')}

Return ONLY valid JSON array:
[
  {
    "title": "Resource name",
    "url": "https://...",
    "type": "video|documentation|article|course",
    "duration": "X hours"
  },
  ...
]

Requirements:
1. Resources must be FREE (no paid courses)
2. URLs must be real and accessible
3. Prefer official documentation and reputable sources
4. Include variety (video + docs + practice)`;

      const response = await retryWithBackoff(async () => {
        return await generateContent(prompt);
      });
      
      let jsonText = response.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }
      
      return JSON.parse(jsonText);
    }
  );

  return data;
}

/**
 * Main chained roadmap generation
 * Combines all steps with parallel resource fetching
 */
async function generateChainedRoadmap(skillGaps, targetRole, hoursPerWeek) {
  console.log('🔗 Starting chained roadmap generation...');
  const startTime = Date.now();

  try {
    // Step 1: Prioritize skills
    console.log('📊 Step 1/3: Prioritizing skills...');
    const priorities = await prioritizeSkills(skillGaps);
    console.log(`✅ Prioritized ${priorities.length} skills`);

    // Step 2: Generate 6-week structure
    console.log('📅 Step 2/3: Generating 6-week structure...');
    
    // Create custom prompt for 6 weeks
    const cacheKey = `weeks:${hashObject({ priorities: priorities.slice(0, 6), targetRole, hoursPerWeek })}`;
    const { data: weeks } = await cacheWrapper(
      cacheKey,
      7 * 24 * 60 * 60,
      async () => {
        const prompt = `Create a FOCUSED 6-week learning roadmap for: ${targetRole}

Priority skills (top 6):
${priorities.slice(0, 6).join('\n')}

Time: ${hoursPerWeek}h/week

Return ONLY JSON array of EXACTLY 6 weeks:
[{
  "week": 1,
  "title": "Week title",
  "skill": "Skill name",
  "topics": ["topic1", "topic2", "topic3"],
  "estimatedHours": ${hoursPerWeek},
  "practiceProject": "Project description",
  "milestones": ["milestone1", "milestone2"]
}]`;

        const response = await retryWithBackoff(async () => {
          return await generateContent(prompt);
        });

        let jsonText = response.trim();
        if (jsonText.startsWith('```json')) {
          jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace(/```\n?/g, '');
        }

        return JSON.parse(jsonText);
      }
    );
    
    console.log(`✅ Generated ${weeks.length} weeks`);

    // Step 3: Fetch resources for all weeks (no delays - let API handle rate limits)
    console.log('📚 Step 3/3: Fetching resources...');
    const resources = [];
    
    for (let i = 0; i < weeks.length; i++) {
      console.log(`📖 Fetching resources for Week ${i + 1}/${weeks.length}...`);
      const weekResources = await fetchWeekResources(weeks[i]);
      resources.push(weekResources);
    }
    
    console.log(`✅ Fetched resources for ${resources.length} weeks`);

    // Combine results
    const roadmap = {
      totalWeeks: weeks.length,
      totalHours: weeks.reduce((sum, w) => sum + w.estimatedHours, 0),
      weeklyPlan: weeks.map((week, idx) => ({
        ...week,
        resources: resources[idx]
      })),
      milestones: weeks
        .filter((w, idx) => (idx + 1) % 4 === 0) // Every 4 weeks
        .map(w => ({
          week: w.week,
          title: `Complete ${w.skill}`,
          description: w.practiceProject
        }))
    };

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Roadmap generated in ${duration}s`);

    return roadmap;

  } catch (error) {
    console.error('❌ Chained roadmap generation failed:', error);
    throw error;
  }
}

/**
 * Progressive roadmap generation - streams weeks as they're generated
 * Returns Week 1 immediately, then generates rest in background
 */
async function generateProgressiveRoadmap(skillGaps, targetRole, hoursPerWeek, onProgress) {
  console.log('🚀 Starting PROGRESSIVE roadmap generation (6 weeks)...');
  const startTime = Date.now();

  try {
    // Step 1: Prioritize skills
    onProgress('status', { message: 'Analyzing skill gaps...' });
    const priorities = await prioritizeSkills(skillGaps);
    
    // Step 2: Generate 6-week structure (reduced from 12-18)
    onProgress('status', { message: 'Creating learning path...' });
    
    // Modified prompt for 6 weeks only
    const weekPrompt = `Create a FOCUSED 6-week learning roadmap for: ${targetRole}

Priority skills (top 6):
${priorities.slice(0, 6).join('\n')}

Time: ${hoursPerWeek}h/week

Return ONLY JSON array of EXACTLY 6 weeks:
[{
  "week": 1,
  "title": "Week title",
  "skill": "Skill name",
  "topics": ["topic1", "topic2", "topic3"],
  "estimatedHours": ${hoursPerWeek},
  "practiceProject": "Project description",
  "milestones": ["milestone1", "milestone2"]
}]`;

    const weeksResponse = await retryWithBackoff(async () => {
      return await generateContent(weekPrompt);
    });

    let jsonText = weeksResponse.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const weeks = JSON.parse(jsonText);
    
    // Step 3: Fetch resources for Week 1 IMMEDIATELY
    onProgress('status', { message: 'Fetching resources for Week 1...' });
    const week1Resources = await fetchWeekResources(weeks[0]);
    
    // Send Week 1 to client IMMEDIATELY
    const week1Complete = {
      ...weeks[0],
      resources: week1Resources
    };
    
    onProgress('week', { 
      week: week1Complete,
      totalWeeks: 6,
      currentWeek: 1
    });

    // Step 4: Generate remaining weeks in background with shorter delays
    for (let i = 1; i < weeks.length; i++) {
      const week = weeks[i];
      
      // Shorter delay for better UX (10s instead of 15s)
      onProgress('status', { message: `Generating Week ${i + 1}/6...` });
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      const weekResources = await fetchWeekResources(week);
      const weekComplete = {
        ...week,
        resources: weekResources
      };
      
      onProgress('week', {
        week: weekComplete,
        totalWeeks: 6,
        currentWeek: i + 1
      });
    }

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Progressive roadmap completed in ${elapsedTime}s`);
    
    onProgress('complete', {
      totalWeeks: 6,
      generationTime: elapsedTime
    });

  } catch (error) {
    console.error('❌ Progressive roadmap failed:', error);
    onProgress('error', { message: error.message });
    throw error;
  }
}

module.exports = {
  prioritizeSkills,
  generateWeeklyStructure,
  fetchWeekResources,
  generateChainedRoadmap,
  generateProgressiveRoadmap
};
