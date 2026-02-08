"use client";

interface ProgressRingProps {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  showLabel?: boolean;
}

export default function ProgressRing({
  value,
  size = 56,
  stroke = 5,
  color = "#06b6d4",
  showLabel = true,
}: ProgressRingProps) {
  const R = (size - stroke) / 2;
  const C = 2 * Math.PI * R;
  const offset = C - (value / 100) * C;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.5s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </svg>
      {showLabel && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
          {value}%
        </span>
      )}
    </div>
  );
}
