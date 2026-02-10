const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export interface AnalyticsData {
    totalQuizzes: number;
    averageScore: number;
    highestScore: number;
    quizHistory: Array<{
        id: string;
        date: string;
        category: string;
        questionsCount: number;
        score: number;
        status: 'completed' | 'in-progress';
    }>;
}

export interface AppAnalyticsData {
    pathsCompleted: number;
    totalLearningHours: number;
    pathsInProgress: number;
    domains: {
        name: string;
        count: number;
        description: string;
    }[];
    recentActivity: {
        id: string;
        pathTitle: string;
        progress: number;
        lastActivity: string;
        estimatedCompletion: string;
        quizTrend: number[];
        difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    }[];
    skillInsights: {
        skill: string;
        level: number;
        progress: number;
        projects: number;
    }[];
}

export const getQuizAnalytics = async (userId: string): Promise<AnalyticsData> => {
    const response = await fetch(`${API_BASE_URL}/analytics/quiz`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch quiz analytics');
    }

    const result = await response.json();
    return result.data;
};

export const getAppAnalytics = async (userId: string): Promise<AppAnalyticsData> => {
    const response = await fetch(`${API_BASE_URL}/analytics/app`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch app analytics');
    }

    const result = await response.json();
    return result.data;
};
