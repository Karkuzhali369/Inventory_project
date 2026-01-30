export default function SavingLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 text-white">
      <div className="flex flex-col items-center gap-6">

        {/* Database Animation */}
        <div className="relative flex flex-col items-center">
          
          {/* Database Stack */}
          <div className="w-24 h-10 bg-blue-600 rounded-t-full shadow-lg"></div>
          <div className="w-24 h-6 bg-blue-500"></div>
          <div className="w-24 h-6 bg-blue-400 rounded-b-full"></div>

          {/* Uploading Blocks */}
          <div className="absolute -top-10 flex gap-2">
            <div className="w-3 h-3 bg-white rounded-sm animate-upload delay-0"></div>
            <div className="w-3 h-3 bg-white rounded-sm animate-upload delay-200"></div>
            <div className="w-3 h-3 bg-white rounded-sm animate-upload delay-400"></div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-xl md:text-2xl font-semibold tracking-wide text-center">
          Saving to database
          <span className="dot-animation"></span>
        </h1>

        <p className="text-slate-400 text-sm text-center">
          Please wait while your data is being stored securely
        </p>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes upload {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(40px); opacity: 0; }
        }
        .animate-upload {
          animation: upload 1.5s infinite ease-in-out;
        }
        .delay-0 { animation-delay: 0s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }

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
