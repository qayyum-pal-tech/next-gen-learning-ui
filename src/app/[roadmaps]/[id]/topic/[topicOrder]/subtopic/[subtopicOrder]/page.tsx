"use client";

import { useEffect, useState, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRoadmap } from "@/utils/hooks/useRoadmap";
import {
    contentExists,
    generateContent,
    getContent,
    regenerateContent,
} from "@/utils/apis/contentApi";
import SubtopicContent from "@/app/components/SubtopicContent";
import { SubtopicContent as SubtopicContentType } from "@/types/types";
import { ArrowLeft, Loader2, AlertCircle, Clock } from "lucide-react";
import { Shell } from "@/utils/svgs/Shell";
import { useAuthStore } from "@/store/auth.store";
import LearningLogModal from "@/app/components/LearningLogModal";

export default function SubtopicPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const USER_ID = user?._id || user?.id;
    // Parse params
    // app/[roadmaps]/[id]/topic/[topicOrder]/subtopic/[subtopicOrder]
    const roadmapId = params?.id as string;
    const topicOrder = parseInt(params?.topicOrder as string);
    const subtopicOrder = parseInt(params?.subtopicOrder as string);

    // 1. Fetch Basic Roadmap Data (for titles/context)
    const { roadmap, isLoading: isRoadmapLoading, markSubtopicDone } = useRoadmap(roadmapId, USER_ID);

    // State
    const [content, setContent] = useState<SubtopicContentType | null>(null);
    const [status, setStatus] = useState<
        "idle" | "checking" | "generating" | "fetching" | "success" | "error"
    >("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [trackedSeconds, setTrackedSeconds] = useState(0);

    // Active Timer logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (document.hasFocus()) {
                setTrackedSeconds(prev => prev + 1);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Derived
    const topic = roadmap?.topics.find((t) => t.order === topicOrder);
    const subtopic = topic?.subtopics.find((s) => s.order === subtopicOrder);

    const handleToggleComplete = async () => {
        if (!subtopic) return;
        try {
            await markSubtopicDone(topicOrder, subtopicOrder, !subtopic.isCompleted);
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    console.log("topic", topic);
    console.log("subtopic", subtopic);

    // 2. Main Logic: Check Exists -> Fetch or Generate
    useEffect(() => {
        if (!roadmap || !topic || !subtopic) return;

        // Prevent re-running if already loading or finished
        if (status !== "idle") return;

        const init = async () => {
            try {
                setStatus("checking");
                const exists = await contentExists(roadmapId, topicOrder, subtopicOrder);

                if (exists) {
                    setStatus("fetching");
                    const data = await getContent(roadmapId, topicOrder, subtopicOrder);
                    setContent(data);
                    setStatus("success");
                } else {
                    // Generate
                    setStatus("generating");
                    const data = await generateContent({
                        roadmapId,
                        topicOrder,
                        subtopicOrder,
                        subtopicTitle: subtopic.title,
                        topicContext: topic.title,
                        difficultyLevel: roadmap.difficultyLevel || "beginner",
                    });
                    setContent(data);
                    setStatus("success");
                }
            } catch (err: any) {
                console.error("Content Error:", err);
                setErrorMsg(err.message || "Failed to load content.");
                setStatus("error");
            }
        };

        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roadmapId, topicOrder, subtopicOrder, !!roadmap, !!topic, !!subtopic, status]);

    // Handlers
    const handleRegenerate = async (instructions?: string) => {
        if (!content || !topic || !subtopic) return;
        setIsRegenerating(true);
        try {
            const data = await regenerateContent(
                roadmapId,
                topicOrder,
                subtopicOrder,
                {
                    subtopicTitle: subtopic.title,
                    topicContext: topic.title,
                    difficultyLevel: roadmap?.difficultyLevel || "beginner",
                    additionalInstructions: instructions,
                }
            );
            setContent(data);
        } catch (err) {
            console.error("Regenerate Error:", err);
            // Optional: show toast
        } finally {
            setIsRegenerating(false);
        }
    };

    /* ── Renders ── */

    // 1. Loading Roadmap
    if (isRoadmapLoading || !roadmap) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
        );
    }

    // 2. Invalid Params
    if (!topic || !subtopic) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-xl font-bold">Module Not Found</h1>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-cyan-400 hover:underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // 3. Loading / Generating Content
    if (status === "generating" || status === "checking" || status === "fetching") {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse" />
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin relative z-10" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {status === "generating" ? "Creating Content..." : "Loading Module..."}
                    </h2>
                    <p className="text-gray-400 max-w-md">
                        {status === "generating"
                            ? "Our AI is analyzing the topic, preparing study materials, and curating resources for you."
                            : "Fetching the latest learning materials."}
                    </p>
                </div>
            </div>
        );
    }

    // 4. Error
    if (status === "error") {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
                <p className="text-gray-400 mb-6">{errorMsg}</p>
                <button
                    onClick={() => setStatus("idle")} // Retry
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                    Try Again
                </button>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-sm text-gray-500 hover:text-white"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // 5. Success
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
            <Shell>
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Nav */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Roadmap
                        </button>

                        <button
                            onClick={() => setIsLogModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 font-medium rounded-xl transition-all duration-300"
                        >
                            <Clock className="w-4 h-4" />
                            Log Learning Time
                        </button>
                    </div>

                    {content && (
                        <SubtopicContent
                            content={content}
                            onRegenerate={handleRegenerate}
                            isRegenerating={isRegenerating}
                            isCompleted={subtopic.isCompleted}
                            onToggleComplete={handleToggleComplete}
                        />
                    )}

                    <LearningLogModal
                        isOpen={isLogModalOpen}
                        onClose={() => setIsLogModalOpen(false)}
                        roadmapId={roadmapId}
                        topicTitle={subtopic.title}
                        suggestedMinutes={Math.floor(trackedSeconds / 60) || 1}
                    />
                </div>
            </Shell>
        </div>
    );
}
