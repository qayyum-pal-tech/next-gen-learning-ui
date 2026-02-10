"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/atom-one-dark.css"; // Import highlight styles
import { SubtopicContent as SubtopicContentType } from "@/types/types";
import {
    BookOpen,
    Code,
    HelpCircle,
    RefreshCw,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Clock,
    CheckCircle,
    Copy,
    Check,
    Sparkles,
    Zap,
} from "lucide-react";
import { useEffect } from "react";

interface SubtopicContentProps {
    content: SubtopicContentType;
    onRegenerate: (instructions?: string) => void;
    isRegenerating: boolean;
    isCompleted: boolean;
    onToggleComplete: () => void;
    version?: string;
}

export default function SubtopicContent({
    content,
    onRegenerate,
    isRegenerating,
    isCompleted,
    onToggleComplete,
    version,
}: SubtopicContentProps) {
    const [activeTab, setActiveTab] = useState<"study" | "qa" | "resources">("study");
    const [showRegenerateModal, setShowRegenerateModal] = useState(false);
    const [instructions, setInstructions] = useState("");
    const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);

    // Selection detection logic
    useEffect(() => {
        const handleSelection = () => {
            const sel = window.getSelection();
            if (sel && sel.toString().trim() && activeTab === "study") {
                const range = sel.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                
                // Only show if the selection is within the prose area (optional but good)
                // For simplicity, we show it if there's any text selected in the window
                // since this component dominates the page during study.
                
                setSelection({
                    text: sel.toString().trim(),
                    x: rect.left + rect.width / 2,
                    y: rect.top, // Use viewport coordinates for fixed positioning
                });
            } else {
                setSelection(null);
            }
        };

        const handleDocumentClick = (e: MouseEvent) => {
            // If clicking outside the selection button, clear selection
            if (selection && !(e.target as HTMLElement).closest('.ask-ai-btn')) {
                // We use a small timeout to allow the button click to register first
                setTimeout(() => setSelection(null), 100);
            }
        };

        document.addEventListener("mouseup", handleSelection);
        return () => {
            document.removeEventListener("mouseup", handleSelection);
        };
    }, [activeTab, selection]);

    const handleAskAI = () => {
        if (selection) {
            const event = new CustomEvent("openChatbotWithQuery", { detail: selection.text });
            window.dispatchEvent(event);
            setSelection(null);
            // Clear the actual text selection for better UX
            window.getSelection()?.removeAllRanges();
        }
    };

    const handleConfirmRegenerate = () => {
        onRegenerate(instructions);
        setShowRegenerateModal(false);
        setInstructions("");
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
            {/* Regenerate Modal */}
            {showRegenerateModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0a0a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 text-cyan-400" />
                            Regenerate Content
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Provide instructions on how to improve this content. The AI will regenerate the module based on your feedback.
                        </p>
                        <textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="e.g., Explain more about React Hooks, add more code examples..."
                            className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 mb-6 resize-none"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowRegenerateModal(false)}
                                className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmRegenerate}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition"
                            >
                                Regenerate
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-cyan-400 mb-2 font-medium">
                            <span className="px-2 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-500/20">
                                Module {content.topicOrder}.{content.subtopicOrder}
                            </span>
                            {content.estimatedReadTime && (
                                <span className="flex items-center gap-1 text-gray-400">
                                    <Clock className="w-3 h-3" /> {content.estimatedReadTime}
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {content.subtopicTitle}
                        </h1>
                        <div className="flex items-center gap-2 text-xs">
                            {version && (
                                <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider">
                                    Version: {version}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onToggleComplete}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isCompleted
                                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30"
                                : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                                }`}
                        >
                            <CheckCircle className={`w-4 h-4 ${isCompleted ? "fill-emerald-400/20" : ""}`} />
                            {isCompleted ? "Completed" : "Mark as Complete"}
                        </button>

                        <button
                            onClick={() => setShowRegenerateModal(true)}
                            disabled={isRegenerating}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all disabled:opacity-50"
                        >
                            <RefreshCw
                                className={`w-4 h-4 ${isRegenerating ? "animate-spin" : ""}`}
                            />
                            {isRegenerating ? "Regenerating..." : "Regenerate"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-black/20">
                <TabButton
                    active={activeTab === "study"}
                    onClick={() => setActiveTab("study")}
                    icon={<BookOpen className="w-4 h-4" />}
                    label="Study Material"
                />
                {(content.interviewQuestions.length > 0) && (
                    <TabButton
                        active={activeTab === "qa"}
                        onClick={() => setActiveTab("qa")}
                        icon={<HelpCircle className="w-4 h-4" />}
                        label={`Interview Q&A (${content.interviewQuestions.length})`}
                    />
                )}
                {(content.articleLinks.length > 0 ||
                    content.documentationLinks.length > 0) && (
                        <TabButton
                            active={activeTab === "resources"}
                            onClick={() => setActiveTab("resources")}
                            icon={<ExternalLink className="w-4 h-4" />}
                            label="Resources"
                        />
                    )}
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 min-h-[500px]">
                {activeTab === "study" && (
                    <div className="prose prose-invert prose-cyan max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeHighlight]}
                            components={{
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    return !inline && match ? (
                                        <div className="relative group">
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">
                                                    {match[1]}
                                                </div>
                                            </div>
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        </div>
                                    ) : (
                                        <code className="bg-white/10 px-1 py-0.5 rounded text-cyan-300" {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                pre({ children }) {
                                    return (
                                        <pre className="bg-gray-950/80 border border-white/10 rounded-xl p-4 overflow-x-auto my-6 shadow-inner">
                                            {children}
                                        </pre>
                                    );
                                },
                                h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xl font-bold text-cyan-100 mt-8 mb-4">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-lg font-semibold text-white mt-6 mb-3">{children}</h3>,
                                p: ({ children }) => <p className="text-gray-300 leading-7 mb-4">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6 ml-4">{children}</ul>,
                                li: ({ children }) => <li className="marker:text-cyan-500">{children}</li>,
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-cyan-500 pl-4 py-1 italic bg-cyan-950/10 rounded-r-lg my-6 text-gray-300">
                                        {children}
                                    </blockquote>
                                ),
                            }}
                        >
                            {content.content}
                        </ReactMarkdown>

                        {/* Explicit Code Examples Section if distinct from content */}
                        {content.codeExamples?.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-white/10">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Code className="w-5 h-5 text-purple-400" />
                                    Code Examples
                                </h2>
                                <div className="space-y-6">
                                    {content.codeExamples.map((example, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-gray-950 border border-white/10 rounded-xl overflow-hidden"
                                        >
                                            <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-300">
                                                    {example.title}
                                                </span>
                                                <span className="text-xs text-gray-500 uppercase">
                                                    {example.language}
                                                </span>
                                            </div>
                                            <div className="p-4 overflow-x-auto text-sm">
                                                <pre>
                                                    <code className={`language-${example.language}`}>
                                                        {example.code}
                                                    </code>
                                                </pre>
                                            </div>
                                            {example.explanation && (
                                                <div className="px-4 py-3 bg-blue-950/10 border-t border-white/5 text-sm text-gray-400">
                                                    {example.explanation}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "qa" && (
                    <div className="space-y-4 max-w-3xl mx-auto">
                        {content.interviewQuestions.map((qa, idx) => (
                            <QAItem key={idx} qa={qa} />
                        ))}
                    </div>
                )}

                {activeTab === "resources" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {content.documentationLinks?.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Official Documentation</h3>
                                <div className="space-y-3">
                                    {content.documentationLinks.map((link, idx) => (
                                        <ResourceCard key={idx} link={link} />
                                    ))}
                                </div>
                            </div>
                        )}
                        {content.articleLinks?.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Curated Articles</h3>
                                <div className="space-y-3">
                                    {content.articleLinks.map((link, idx) => (
                                        <ResourceCard key={idx} link={link} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Floating Selection Button */}
            {selection && (
                <div
                    className="fixed z-[100] transform -translate-x-1/2 -translate-y-full mb-3 pointer-events-auto ask-ai-btn"
                    style={{ 
                        left: `${selection.x}px`, 
                        top: `${selection.y}px`,
                    }}
                >
                    <button
                        onClick={handleAskAI}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all border border-cyan-400/30 animate-in fade-in zoom-in duration-200"
                    >
                        <Sparkles className="w-4 h-4 text-cyan-200" />
                        Ask LearnBot AI
                        <Zap className="w-3 h-3 text-yellow-400" />
                    </button>
                    {/* Tiny arrow */}
                    <div className="absolute top-[calc(100%-1px)] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-cyan-600" />
                </div>
            )}
        </div>
    );
}

function TabButton({
    active,
    onClick,
    icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`
        flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative
        ${active ? "text-cyan-400 bg-white/5" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"}
      `}
        >
            {icon}
            {label}
            {active && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            )}
        </button>
    );
}

function QAItem({ qa }: { qa: SubtopicContentType["interviewQuestions"][0] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden transition-all hover:border-white/20">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left"
            >
                <span className="font-medium text-white pr-4">{qa.question}</span>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                        className={`text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wider ${qa.difficulty === "easy"
                            ? "text-green-400 bg-green-500/10"
                            : qa.difficulty === "hard"
                                ? "text-red-400 bg-red-500/10"
                                : "text-amber-400 bg-amber-500/10"
                            }`}
                    >
                        {qa.difficulty}
                    </span>
                    {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            </button>
            {isOpen && (
                <div className="px-4 pb-4 pt-0 border-t border-white/5">
                    <div className="mt-4 prose prose-invert prose-sm max-w-none text-gray-300">
                        <ReactMarkdown>{qa.answer}</ReactMarkdown>
                    </div>
                    {qa.tags && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                            {qa.tags.map(tag => (
                                <span key={tag} className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">#{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function ResourceCard({ link }: { link: SubtopicContentType["articleLinks"][0] }) {
    return (
        <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition group"
        >
            <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-cyan-100 group-hover:text-cyan-400 transition">{link.title}</h4>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-cyan-400" />
            </div>
            {link.description && <p className="text-sm text-gray-400 mt-1">{link.description}</p>}
            {link.source && <div className="mt-3 text-xs text-gray-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span> {link.source}</div>}
        </a>
    )
}
