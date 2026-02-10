export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-xl">
        {children}
      </div>
    </div>
  );
}
