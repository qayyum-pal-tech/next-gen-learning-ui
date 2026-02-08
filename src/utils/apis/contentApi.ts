/**
 * contentApi.ts
 *
 * Client-side wrapper for specialized subtopic content endpoints.
 */

import { SubtopicContent, GenerateContentDto } from "@/types/types";

/* ─── config ─── */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/* ─── shared helpers ─── */
async function assertOk(res: Response): Promise<void> {
    if (!res.ok) {
        let message = `HTTP ${res.status}`;
        try {
            const body = await res.text();
            if (body) message += ` – ${body}`;
        } catch {
            // ignore
        }
        throw new Error(message);
    }
}

/**
 * Check if content exists for a subtopic
 * GET /content/exists/:roadmapId/:topicOrder/:subtopicOrder
 */
export async function contentExists(
    roadmapId: string,
    topicOrder: number,
    subtopicOrder: number
): Promise<boolean> {
    const res = await fetch(
        `${BASE_URL}/content/exists/${encodeURIComponent(
            roadmapId
        )}/${topicOrder}/${subtopicOrder}`
    );
    await assertOk(res);
    const data = await res.json();
    return data.exists;
}

/**
 * Generate content for a subtopic
 * POST /content/generate
 */
export async function generateContent(
    dto: GenerateContentDto
): Promise<SubtopicContent> {
    const res = await fetch(`${BASE_URL}/content/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
    await assertOk(res);
    return res.json();
}

/**
 * Get content for a specific subtopic
 * GET /content/:roadmapId/:topicOrder/:subtopicOrder
 */
export async function getContent(
    roadmapId: string,
    topicOrder: number,
    subtopicOrder: number
): Promise<SubtopicContent> {
    const res = await fetch(
        `${BASE_URL}/content/${encodeURIComponent(
            roadmapId
        )}/${topicOrder}/${subtopicOrder}`
    );
    await assertOk(res);
    return res.json();
}

/**
 * Regenerate content (force update)
 * POST /content/regenerate/:roadmapId/:topicOrder/:subtopicOrder
 */
export async function regenerateContent(
    roadmapId: string,
    topicOrder: number,
    subtopicOrder: number,
    body: {
        subtopicTitle: string;
        topicContext?: string;
        difficultyLevel?: string;
        additionalInstructions?: string;
    }
): Promise<SubtopicContent> {
    const res = await fetch(
        `${BASE_URL}/content/regenerate/${encodeURIComponent(
            roadmapId
        )}/${topicOrder}/${subtopicOrder}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }
    );
    await assertOk(res);
    return res.json();
}
