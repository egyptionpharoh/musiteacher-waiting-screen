import React, { useEffect, useState } from 'react';
import { WorkshopConfig } from '../types';
import { Sparkles, Volume2, VolumeX, Maximize, Shield, User, Clock, Bell } from 'lucide-react';

interface AudienceViewProps {
  config: WorkshopConfig;
  timeLeft: number;
  isRunning: boolean;
  onOpenAdmin: () => void;
}

export const AudienceView: React.FC<AudienceViewProps> = ({
  config,
  timeLeft,
  isRunning,
  onOpenAdmin,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(config.isMuted);

  // Rotate motivational messages every 8 seconds
  useEffect(() => {
    if (!config.motivationalMessages || config.motivationalMessages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % config.motivationalMessages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [config.motivationalMessages]);

  // Format time (HH:MM:SS or MM:SS)
  const formatTime = (totalSeconds: number) => {
    if (totalSeconds < 0) totalSeconds = 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Dynamic status/alert message based on time left
  const getDynamicAlert = () => {
    if (timeLeft === 0) return 'حان وقت الانطلاق! أهلاً بكم في ورشتنا التدريبية';
    if (timeLeft <= 60) return 'دقائق معدودة ونبدأ، الرجاء الاستعداد والتواجد بالقرب من الشاشة!';
    if (timeLeft <= 300) return 'تبقي أقل من 5 دقائق! جهزوا أسئلتكم وأوراقكم.';
    if (timeLeft <= 600) return 'اقترب موعد الورشة (أقل من 10 دقائق)، ابقوا معنا!';
    return config.motivationalMessages[currentMessageIndex] || 'أهلاً بكم في عالم MusiTeacher';
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between bg-gray-950 text-white select-none font-sans rtl">
      {/* Background Media */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {config.bgType === 'video' && config.bgUrl ? (
          <video
            src={config.bgUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />
        ) : config.bgType === 'image' && config.bgUrl ? (
          <img src={config.bgUrl} alt="Background" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950" />
        )}
        {/* Overlay Opacity */}
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: config.overlayOpacity / 100 }}
        />
      </div>

      {/* Floating Admin & Fullscreen Controls (Discreetly at top-right) */}
      <div className="absolute top-6 left-6 z-30 flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={toggleFullscreen}
          className="p-3 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full border border-white/10 text-white shadow-lg transition-transform hover:scale-105"
          title="ملء الشاشة"
        >
          <Maximize className="w-5 h-5" />
        </button>
        {config.bgType === 'video' && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full border border-white/10 text-white shadow-lg transition-transform hover:scale-105"
            title={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-green-400" />}
          </button>
        )}
        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600/80 hover:bg-indigo-600 backdrop-blur-md rounded-full border border-indigo-400/30 text-white text-sm font-medium shadow-lg transition-transform hover:scale-105"
          title="لوحة الإدارة"
        >
          <Shield className="w-4 h-4" />
          <span>لوحة الإدارة</span>
        </button>
      </div>

      {/* Header: Logo & Branding */}
      <div className="relative z-20 flex items-center justify-between px-10 pt-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 p-0.5 shadow-2xl shadow-purple-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-gray-900 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-blue-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wide bg-gradient-to-r from-blue-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              بوابة MusiTeacher الذكية
            </h1>
            <p className="text-xs text-gray-400 tracking-wider">MusiTeacher Smart Workshop</p>
          </div>
        </div>

        {/* Workshop Title Badge */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-1">الورشة الحالية</span>
          <span className="text-lg font-bold text-white bg-white/10 backdrop-blur-md px-5 py-1.5 rounded-full border border-white/10">
            {config.title || 'ورشة تدريبية تفاعلية'}
          </span>
        </div>
      </div>

      {/* Main Center Content: Countdown & Motivation */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4 my-auto text-center">
        {/* Subtitle / Description */}
        <p className="text-indigo-200 text-lg md:text-xl font-medium max-w-2xl mb-6 drop-shadow-md">
          {config.description || 'نستعد للانطلاق، يرجى البقاء في مكانكم وتحضير أدواتكم الإبداعية.'}
        </p>

        {/* Countdown Box */}
        <div className="relative group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000 animate-pulse" />
          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/15 px-12 py-8 rounded-3xl shadow-2xl flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-6xl md:text-8xl font-black tracking-wider bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent font-mono">
                {formatTime(timeLeft)}
              </span>
              <div className="flex items-center gap-2 mt-2 text-indigo-300 text-sm font-semibold">
                <Clock className="w-4 h-4" />
                <span>{isRunning ? 'العداد يعمل... البث سيبدأ قريباً' : 'العداد متوقف مؤقتاً'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Motivational Message Banner */}
        <div className="mt-8 bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg max-w-xl animate-fade-in">
          <Bell className="w-5 h-5 text-yellow-400 shrink-0 animate-bounce" />
          <p className="text-sm md:text-base font-medium text-gray-200">
            {getDynamicAlert()}
          </p>
        </div>
      </div>

      {/* Footer: Presenter Info & Ticker */}
      <div className="relative z-20 flex flex-col">
        {/* Presenter Info Card */}
        <div className="px-10 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl shadow-xl">
            {config.presenterAvatar ? (
              <img
                src={config.presenterAvatar}
                alt={config.presenterName}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-600/30 border-2 border-indigo-500 flex items-center justify-center text-indigo-300">
                <User className="w-6 h-6" />
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-white">{config.presenterName}</h3>
              <p className="text-xs text-indigo-300 font-medium">{config.presenterTitle}</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
            <span>بث مباشر مؤمن عبر منصة MusiTeacher</span>
          </div>
        </div>

        {/* Ticker Marquee Bar */}
        {config.tickerMessages && config.tickerMessages.length > 0 && (
          <div
            className="w-full py-3 overflow-hidden border-t shadow-2xl flex items-center"
            style={{
              backgroundColor: config.tickerBgColor || '#1e1b4b',
              color: config.tickerTextColor || '#ffffff',
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <div className="bg-indigo-600 px-4 py-1 text-xs font-bold uppercase tracking-wider mx-4 rounded shadow shrink-0 z-10">
              شريط MusiTeacher الإخباري
            </div>
            <div className="overflow-hidden whitespace-nowrap w-full">
              <div
                className="inline-block animate-marquee font-medium text-sm md:text-base"
                style={{ animationDuration: `${config.tickerSpeed || 25}s` }}
              >
                {config.tickerMessages.join('     ✦     ')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};