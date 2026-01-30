export default function ConnectingLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-6">
        
        {/* Animated Spinner */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-blue-300 border-b-transparent rounded-full animate-ping opacity-40"></div>
        </div>

        {/* Text */}
        <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
          Connecting to server
          <span className="dot-animation">...</span>
        </h1>

        {/* Sub text */}
        <p className="text-slate-400 text-sm">
          Please wait while we establish a secure connection
        </p>
      </div>

      {/* Dot Animation Style */}
      <style>{`
        .dot-animation::after {
          content: '';
          animation: dots 1.5s steps(4, end) infinite;
        }
        @keyframes dots {
          0% { content: '' }
          25% { content: '.' }
          50% { content: '..' }
          75% { content: '...' }
          100% { content: '' }
        }
      `}</style>
    </div>
  );
}
