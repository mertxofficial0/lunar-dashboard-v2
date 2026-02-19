import loaderVideo from "../../assets/sloader.mp4";

export default function RouteLoading() {
  return (
    <div className="absolute inset-0 bg-[#F5F6F8] flex items-center justify-center z-9999">
      <div className="flex flex-col items-center">
        
        <video
          src={loaderVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-[180px] h-auto object-contain mb-5"
        />

        {/* BAŞLIK */}
        <h2 className="text-[16px] font-semibold -mt-22 text-slate-900">
          Hang tight
        </h2>

        {/* ALT TEXT */}
        <p className="text-[12.5px] text-slate-500 mt-1">
          Loading your Trades...
        </p>

      </div>
    </div>
  );
}
