"use client";

import { useState, useMemo } from "react";
import { Roadmap, Topic, TopicMeta, Subtopic } from "../../types/types";

/**
 * Lock rule:
 *   Topic[N] is locked  →  Topic[N-1].isCompleted === false
 *                            OR Topic[N-1] needs its quiz (subtopics done but topic.isCompleted still false)
 *   Subtopic[M] inside a topic is locked  →  Subtopic[M-1].isCompleted === false
 *
 * Quiz rule (placeholder – the quiz system will flip topic.isCompleted):
 *   needsQuiz = every subtopic completed BUT topic.isCompleted === false
 *
 * The quiz owner will call your API  PATCH /roadmaps/:id/topics/:idx  { isCompleted: true }
 * once the user passes. Until then the next topic stays locked.
 */
export function useRoadmapState(roadmap: Roadmap) {
  const [expandedTopicIndex, setExpandedTopicIndex] = useState<number | null>(
    null
  );

  /* ── derive per-topic metadata ── */
  const topicMetas: TopicMeta[] = useMemo(() => {
    return roadmap.topics.map((topic, index) => {
      const completedCount = topic.subtopics.filter(
        (s) => s.isCompleted
      ).length;
      const total = topic.subtopics.length;
      const allSubtopicsDone = total > 0 && completedCount === total;

      // lock: first topic never locked; otherwise previous topic must be fully done (including quiz)
      const prevTopic: Topic | undefined =
        index > 0 ? roadmap.topics[index - 1] : undefined;
      const isLocked =
        index > 0 && prevTopic !== undefined && !prevTopic.isCompleted;

      return {
        topic,
        index,
        isLocked,
        isActive: expandedTopicIndex === index,
        isCompleted: topic.isCompleted,
        needsQuiz: allSubtopicsDone && !topic.isCompleted,
        progressPercent:
          total === 0 ? 0 : Math.round((completedCount / total) * 100),
      };
    });
  }, [roadmap.topics, expandedTopicIndex]);

  /* ── derive lock state for subtopics inside an expanded topic ── */
  function getSubtopicLocked(
    topicIndex: number,
    subtopicIndex: number
  ): boolean {
    if (subtopicIndex === 0) return false; // first subtopic is always open
    const prev = roadmap.topics[topicIndex]?.subtopics[subtopicIndex - 1];
    return prev ? !prev.isCompleted : false;
  }

  /* ── toggle expand ── */
  function toggleTopic(index: number) {
    // locked topics cannot be expanded
    if (topicMetas[index]?.isLocked) return;
    setExpandedTopicIndex((prev) => (prev === index ? null : index));
  }

  /* ── overall roadmap progress ── */
  const overallProgress = useMemo(() => {
    const totalSubs = roadmap.topics.reduce(
      (a, t) => a + t.subtopics.length,
      0
    );
    if (totalSubs === 0) return 0;
    const doneSubs = roadmap.topics.reduce(
      (a, t) => a + t.subtopics.filter((s) => s.isCompleted).length,
      0
    );
    return Math.round((doneSubs / totalSubs) * 100);
  }, [roadmap.topics]);

  return {
    topicMetas,
    expandedTopicIndex,
    toggleTopic,
    getSubtopicLocked,
    overallProgress,
  };
}
