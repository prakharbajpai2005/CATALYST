export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
    // User endpoints
    createUser: async (username: string, email: string) => {
        const res = await fetch(`${API_BASE_URL}/user/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email })
        });
        return res.json();
    },

    getUser: async (userId: string) => {
        const res = await fetch(`${API_BASE_URL}/user/${userId}`);
        return res.json();
    },

    updateXP: async (userId: string, xpGained: number) => {
        const res = await fetch(`${API_BASE_URL}/user/update-xp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, xpGained })
        });
        return res.json();
    },

    // Skill Tree endpoints
    getSkillTree: async (userId: string) => {
        const res = await fetch(`${API_BASE_URL}/skill-tree/${userId}`);
        return res.json();
    },

    unlockSkill: async (userId: string, skillId: string) => {
        const res = await fetch(`${API_BASE_URL}/skill-tree/unlock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, skillId })
        });
        return res.json();
    },

    // Simulation endpoints
    startSimulation: async (userId: string, skillId: string) => {
        const res = await fetch(`${API_BASE_URL}/simulation/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, skillId })
        });
        return res.json();
    },

    submitResponse: async (simulationId: string, userInput: string) => {
        const res = await fetch(`${API_BASE_URL}/simulation/respond`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ simulationId, userInput })
        });
        return res.json();
    },

    completeSimulation: async (simulationId: string) => {
        const res = await fetch(`${API_BASE_URL}/simulation/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ simulationId })
        });
        return res.json();
    },

    getSimulationHistory: async (userId: string) => {
        const res = await fetch(`${API_BASE_URL}/simulation/history/${userId}`);
        return res.json();
    }
};
