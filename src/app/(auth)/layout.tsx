export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen bg-hero-gradient flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="star-field" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-900/80 border border-white/10 rounded-3xl shadow-card backdrop-blur-xl p-8">
          {children}
        </div>

        <p className="text-center mt-4 text-xs text-gray-600">
          🌟 Summer Quest &bull; Road to 2nd Grade
        </p>
      </div>
    </main>
  );
}
