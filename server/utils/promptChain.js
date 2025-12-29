// Prompt chaining utilities for breaking large prompts into smaller, cacheable chunks
const { cacheWrapper, hashObject } = require('./cache');

/**
 * Retry wrapper for Gemini API calls with exponential backoff
 * Handles rate limit errors (429) automatically
 */
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Check if it's a rate limit error
      const isRateLimit = error.message?.includes('429') || 
                          error.message?.includes('quota') ||
                          error.message?.includes('Too Many Requests');
      
      if (!isRateLimit || attempt === maxRetries - 1) {
        throw error; // Not a rate limit or last attempt, throw error
      }

      // Extract retry delay from error message if available
      let retryDelay = 20000; // Default 20 seconds
      const retryMatch = error.message?.match(/retry in ([\d.]+)s/i);
      if (retryMatch) {
        retryDelay = Math.ceil(parseFloat(retryMatch[1]) * 1000);
      } else {
        // Exponential backoff: 20s, 40s, 80s
        retryDelay = 20000 * Math.pow(2, attempt);
      }

      console.log(`⏳ Rate limit hit. Retrying in ${retryDelay / 1000}s... (Attempt ${attempt + 1}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}


/**
 * Chain Step 1: Prioritize skills by importance
 * Fast, cacheable, ~200 tokens output
 */
async function prioritizeSkills(model, skillGaps) {
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

      const result = await retryWithBackoff(async () => {
        return await model.generateContent(prompt);
      });
      const response = result.response.text().trim();
      
      // Clean markdown code blocks
      let jsonText = response;
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
async function generateWeeklyStructure(model, priorities, targetRole, hoursPerWeek) {
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

      const result = await retryWithBackoff(async () => {
        return await model.generateContent(prompt);
      });
      const response = result.response.text().trim();
      
      let jsonText = response;
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
async function fetchWeekResources(model, week) {
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

      const result = await retryWithBackoff(async () => {
        return await model.generateContent(prompt);
      });
      const response = result.response.text().trim();
      
      let jsonText = response;
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
async function generateChainedRoadmap(model, skillGaps, targetRole, hoursPerWeek) {
  console.log('🔗 Starting chained roadmap generation...');
  const startTime = Date.now();

  try {
    // Step 1: Prioritize skills (1-2 seconds)
    console.log('📊 Step 1/3: Prioritizing skills...');
    const priorities = await prioritizeSkills(model, skillGaps);
    console.log(`✅ Prioritized ${priorities.length} skills`);

    // Step 2: Generate weekly structure (2-3 seconds)
    console.log('📅 Step 2/3: Generating weekly structure...');
    const weeks = await generateWeeklyStructure(model, priorities, targetRole, hoursPerWeek);
    console.log(`✅ Generated ${weeks.length} weeks`);

    // Step 3: Fetch resources in parallel (3-4 seconds total, not per week!)
    console.log('📚 Step 3/3: Fetching resources (parallel)...');
    const resourcePromises = weeks.map(week => fetchWeekResources(model, week));
    const resources = await Promise.all(resourcePromises);
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

module.exports = {
  prioritizeSkills,
  generateWeeklyStructure,
  fetchWeekResources,
  generateChainedRoadmap
};
