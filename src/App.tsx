import React, { useState, useEffect } from 'react';
import { WorkshopConfig, AppMode } from './types';
import { AudienceView } from './components/AudienceView';
import { AdminPanel } from './components/AdminPanel';

const DEFAULT_CONFIG: WorkshopConfig = {
  title: 'بوابة MusiTeacher الذكية: هندسة وتطوير الورش الاحترافية',
  description: 'نستعد للانطلاق في رحلة تقنية وإبداعية استثنائية. ابقوا معنا!',
  presenterName: 'حسين الملك',
  presenterTitle: 'مبرمج ومطور منصة ميوزي تيتشر',
  presenterAvatar: '',
  durationSeconds: 1800, // 30 minutes
  bgType: 'default',
  bgUrl: '',
  videoVolume: 1,
  isMuted: false,
  overlayOpacity: 60,
  tickerMessages: [
    '✦ أهلاً بكم في ورش منصة MusiTeacher الذكية ✦',
    '✦ يرجى التأكد من جاهزية أجهزتكم وسماعات الرأس ✦',
    '✦ سيتم فتح باب الأسئلة والنقاش في نهاية الورشة ✦',
  ],
  tickerSpeed: 25,
  tickerBgColor: '#1e1b4b',
  tickerTextColor: '#ffffff',
  motivationalMessages: [
    'أهلاً بكم في عالم MusiTeacher',
    'نستعد للانطلاق، ابقوا معنا',
    'رحلتكم نحو المعرفة والإبداع تبدأ بعد قليل',
    'جهّزوا أسئلتكم، فلدينا الكثير لنكتشفه معاً',
  ],
  activeTemplateName: 'الافتراضي',
};

export function App() {
  const [config, setConfig] = useState<WorkshopConfig>(() => {
    const saved = localStorage.getItem('musiteacher_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  const [timeLeft, setTimeLeft] = useState<number>(config.durationSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mode, setMode] = useState<AppMode>('audience');
  const [savedTemplates, setSavedTemplates] = useState<string[]>(['الافتراضي', 'ورشة موسيقية', 'دورة برمجية']);

  // Broadcast channel for real-time multi-tab/window sync
  useEffect(() => {
    const channel = new BroadcastChannel('musiteacher_sync');

    // Send state on update if in admin mode
    if (mode === 'admin') {
      channel.postMessage({ config, timeLeft, isRunning });
    }

    channel.onmessage = (event) => {
      if (event.data && mode === 'audience') {
        if (event.data.config) setConfig(event.data.config);
        if (event.data.timeLeft !== undefined) setTimeLeft(event.data.timeLeft);
        if (event.data.isRunning !== undefined) setIsRunning(event.data.isRunning);
      }
    };

    return () => channel.close();
  }, [config, timeLeft, isRunning, mode]);

  // Save config to localStorage
  useEffect(() => {
    localStorage.setItem('musiteacher_config', JSON.stringify(config));
  }, [config]);

  // Precise Timer interval
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSaveTemplate = (templateName: string) => {
    localStorage.setItem(`musiteacher_tpl_${templateName}`, JSON.stringify(config));
    if (!savedTemplates.includes(templateName)) {
      setSavedTemplates([...savedTemplates, templateName]);
    }
  };

  const handleLoadTemplate = (templateName: string) => {
    const saved = localStorage.getItem(`musiteacher_tpl_${templateName}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
        setTimeLeft(parsed.durationSeconds);
      } catch (e) {}
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-950">
      {mode === 'audience' ? (
        <AudienceView
          config={config}
          timeLeft={timeLeft}
          isRunning={isRunning}
          onOpenAdmin={() => setMode('admin')}
        />
      ) : (
        <AdminPanel
          config={config}
          setConfig={setConfig}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          onCloseAdmin={() => setMode('audience')}
          onSaveTemplate={handleSaveTemplate}
          onLoadTemplate={handleLoadTemplate}
          savedTemplates={savedTemplates}
        />
      )}
    </div>
  );
}

export default App;