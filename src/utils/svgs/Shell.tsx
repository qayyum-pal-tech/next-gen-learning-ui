/* ───────────────────────────────────────────────
   Static star & nebula data – generated once,
   rendered as fixed absolutely-positioned divs.
   ─────────────────────────────────────────────── */
const STARS = Array.from({ length: 150 }, (_, i) => ({
  x: (Math.sin(i * 137.508) * 0.5 + 0.5) * 100,
  y: (Math.cos(i * 97.31) * 0.5 + 0.5) * 100,
  size: 1 + (i % 3) * 0.9,
  opacity: 0.12 + (i % 5) * 0.1,
}));

const NEBULAE = [
  { left: "8%", top: "15%", w: 420, h: 420, color: "#6366f1", opacity: 0.055 },
  { left: "70%", top: "55%", w: 520, h: 520, color: "#06b6d4", opacity: 0.045 },
  { left: "42%", top: "80%", w: 360, h: 360, color: "#a855f7", opacity: 0.06 },
];

export const Shell = ({ children }: { children: React.ReactNode }) => (
  <div
    className="min-h-screen relative overflow-hidden"
    style={{
      background:
        "linear-gradient(170deg, #0a0e1a 0%, #0f1529 40%, #080c18 100%)",
    }}
  >
    {/* stars */}
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {STARS.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>

    {/* nebula blobs */}
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {NEBULAE.map((n, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: n.left,
            top: n.top,
            width: n.w,
            height: n.h,
            background: n.color,
            filter: "blur(90px)",
            opacity: n.opacity,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>

    {/* content */}
    <div className="relative" style={{ zIndex: 1 }}>
      {children}
    </div>
  </div>
);
