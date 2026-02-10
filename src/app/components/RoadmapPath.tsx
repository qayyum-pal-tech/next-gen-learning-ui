"use client";

import { motion } from "framer-motion";

interface RoadmapPathProps {
    points: { x: number; y: number }[];
    height: number;
}

export default function RoadmapPath({ points, height }: RoadmapPathProps) {
    if (points.length < 2) return null;
    let pathD = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];

        const cp1x = current.x;
        const cp1y = current.y + (next.y - current.y) / 2;
        const cp2x = next.x;
        const cp2y = current.y + (next.y - current.y) / 2;

        pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox={`0 0 100 ${height}`}
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                    <stop offset="20%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="80%" stopColor="#a855f7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
                </linearGradient>
            </defs>

            <path
                d={pathD}
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.2"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="12 12"
                vectorEffect="non-scaling-stroke"
            />

            <motion.path
                d={pathD}
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                style={{
                    filter: "drop-shadow(0 0 6px rgba(6, 182, 212, 0.6))"
                }}
            />
        </svg>
    );
}