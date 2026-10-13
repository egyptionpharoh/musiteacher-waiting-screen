import React, { useState } from 'react';
import { WorkshopConfig } from '../types';
import { Play, Pause, RotateCcw, Plus, Trash2, Save, Monitor, Upload, Settings, Clock, MessageSquare, User, Palette } from 'lucide-react';

interface AdminPanelProps {
  config: WorkshopConfig;
  setConfig: React.Dispatch<React.SetStateAction<WorkshopConfig>>;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseAdmin: () => void;
  onSaveTemplate: (templateName: string) => void;
  onLoadTemplate: (templateName: string) => void;
  savedTemplates: string[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  config,
  setConfig,
  timeLeft,
  setTimeLeft,
  isRunning,
  setIsRunning,
  onCloseAdmin,
  onSaveTemplate,
  onLoadTemplate,
  savedTemplates,
}) => {
  const [activeTab, setActiveTab] = useState<'timer' | 'media' | 'ticker' | 'presenter' | 'workshop'>('timer');
  const [newTickerText, setNewTickerText] = useState('');
  const [newMotivationalText, setNewMotivationalText] = useState('');
  const [customMinutesInput, setCustomMinutesInput] = useState('30');
  const [templateInputName, setTemplateInputName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'avatar') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'image') {
      setConfig((prev) => ({ ...prev, bgType: 'image', bgUrl: url }));
    } else if (type === 'video') {
      setConfig((prev) => ({ ...prev, bgType: 'video', bgUrl: url }));
    } else if (type === 'avatar') {
      setConfig((prev) => ({ ...prev, presenterAvatar: url }));
    }
  };

  const addTickerMessage = () => {
    if (!newTickerText.trim()) return;
    setConfig((prev) => ({
      ...prev,
      tickerMessages: [...prev.tickerMessages, newTickerText.trim()],
    }));
    setNewTickerText('');
  };

  const removeTickerMessage = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      tickerMessages: prev.tickerMessages.filter((_, i) => i !== index),
    }));
  };

  const addMotivationalMessage = () => {
    if (!newMotivationalText.trim()) return;
    setConfig((prev) => ({
      ...prev,
      motivationalMessages: [...prev.motivationalMessages, newMotivationalText.trim()],
    }));
    setNewMotivationalText('');
  };

  const removeMotivationalMessage = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      motivationalMessages: prev.motivationalMessages.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/90 backdrop-blur-xl flex flex-col h-screen overflow-hidden rtl font-sans text-gray-100">
      {/* Top Bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">لوحة تحكم شاشة الانتظار – MusiTeacher</h2>
            <p className="text-xs text-gray-400">إدارة الورشة، المؤقت، الخلفيات، والشريط الإخباري بكل سهولة</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onCloseAdmin}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
          >
            <Monitor className="w-5 h-5" />
            <span>عرض شاشة الجمهور</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-72 bg-gray-900/50 border-l border-gray-800 p-6 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('timer')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'timer' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span>العد التنازلي والوقت</span>
          </button>
          <button
            onClick={() => setActiveTab('workshop')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'workshop' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>معلومات الورشة</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'media' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Upload className="w-5 h-5" />
            <span>الخلفيات والوسائط</span>
          </button>
          <button
            onClick={() => setActiveTab('ticker')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'ticker' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>الشريط الإخباري والرسائل</span>
          </button>
          <button
            onClick={() => setActiveTab('presenter')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'presenter' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <User className="w-5 h-5" />
            <span>بيانات المقدم</span>
          </button>

          {/* Templates Section */}
          <div className="mt-auto pt-6 border-t border-gray-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">القوالب والجلسات</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="اسم القالب..."
                value={templateInputName}
                onChange={(e) => setTemplateInputName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => {
                  if (templateInputName.trim()) {
                    onSaveTemplate(templateInputName.trim());
                    setTemplateInputName('');
                  }
                }}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow"
                title="حفظ القالب"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
            {savedTemplates.length > 0 && (
              <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                {savedTemplates.map((tpl) => (
                  <button
                    key={tpl}
                    onClick={() => onLoadTemplate(tpl)}
                    className="text-right text-xs px-3 py-2 bg-gray-800/60 hover:bg-gray-800 rounded-lg text-gray-300 transition"
                  >
                    📂 {tpl}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tab Panels */}
        <div className="flex-1 p-8 overflow-y-auto bg-gray-950">
          {/* 1. Timer Tab */}
          {activeTab === 'timer' && (
            <div className="max-w-3xl space-y-8">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <span>التحكم في العد التنازلي</span>
                </h3>

                <div className="flex items-center gap-4 bg-gray-950 p-6 rounded-2xl border border-gray-800 justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">الوقت المتبقي الحالي</span>
                    <span className="text-4xl font-black font-mono text-indigo-400">
                      {Math.floor(timeLeft / 60)} دقيقة و {timeLeft % 60} ثانية
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition ${
                        isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'
                      }`}
                    >
                      {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      <span>{isRunning ? 'إيقاف مؤقت' : 'بدء العد التنازلي'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsRunning(false);
                        setTimeLeft(config.durationSeconds);
                      }}
                      className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl shadow transition"
                      title="إعادة ضبط"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <label className="text-sm font-semibold text-gray-300 block mb-3">اختيار مدة سريعة</label>
                  <div className="grid grid-cols-5 gap-3">
                    {[5, 10, 15, 30, 60].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => {
                          const secs = mins * 60;
                          setConfig((prev) => ({ ...prev, durationSeconds: secs }));
                          setTimeLeft(secs);
                          setIsRunning(false);
                        }}
                        className="py-3 bg-gray-800 hover:bg-indigo-600 rounded-xl text-sm font-bold text-gray-200 hover:text-white transition shadow"
                      >
                        {mins} دقيقة
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Duration Input */}
                <div className="flex gap-4 items-end pt-4 border-t border-gray-800">
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-300 block mb-2">تحديد مدة مخصصة (بالدقائق)</label>
                    <input
                      type="number"
                      value={customMinutesInput}
                      onChange={(e) => setCustomMinutesInput(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-700 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const mins = parseInt(customMinutesInput) || 30;
                      const secs = mins * 60;
                      setConfig((prev) => ({ ...prev, durationSeconds: secs }));
                      setTimeLeft(secs);
                      setIsRunning(false);
                    }}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow"
                  >
                    تطبيق المدة
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Workshop Info Tab */}
          {activeTab === 'workshop' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-white">إعدادات الورشة التدريبية</h3>
                <div>
                  <label className="text-sm font-semibold text-gray-300 block mb-2">عنوان الورشة</label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-300 block mb-2">وصف قصير للورشة</label>
                  <textarea
                    rows={3}
                    value={config.description}
                    onChange={(e) => setConfig({ ...config, description: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Media Tab */}
          {activeTab === 'media' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl space-y-6">
                <h3 className="text-lg font-bold text-white">خلفية شاشة الانتظار (صورة أو فيديو)</h3>

                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setConfig({ ...config, bgType: 'default' })}
                    className={`p-4 rounded-2xl border font-bold text-sm transition ${
                      config.bgType === 'default'
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                        : 'bg-gray-950 border-gray-800 text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    🎨 تدرج افتراضي
                  </button>
                  <label className={`p-4 rounded-2xl border font-bold text-sm cursor-pointer transition text-center flex flex-col items-center justify-center gap-1 ${
                    config.bgType === 'image'
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:bg-gray-800'
                  }`}>
                    <span>🖼️ رفع صورة</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="hidden" />
                  </label>
                  <label className={`p-4 rounded-2xl border font-bold text-sm cursor-pointer transition text-center flex flex-col items-center justify-center gap-1 ${
                    config.bgType === 'video'
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:bg-gray-800'
                  }`}>
                    <span>🎬 رفع فيديو</span>
                    <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="hidden" />
                  </label>
                </div>

                {/* Overlay Opacity */}
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-300">شفافية طبقة التعتيم فوق الخلفية</label>
                    <span className="text-indigo-400 font-bold">{config.overlayOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.overlayOpacity}
                    onChange={(e) => setConfig({ ...config, overlayOpacity: Number(e.target.value) })}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Ticker Tab */}
          {activeTab === 'ticker' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl space-y-6">
                <h3 className="text-lg font-bold text-white">الشريط الإخباري المتحرك والرسائل التحفيزية</h3>

                {/* Add Ticker Message */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-300">إضافة رسالة جديدة للشريط الإخباري</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="مثال: موعدنا اليوم الساعة 8 مساءً..."
                      value={newTickerText}
                      onChange={(e) => setNewTickerText(e.target.value)}
                      className="flex-1 bg-gray-950 border border-gray-700 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={addTickerMessage}
                      className="px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>إضافة</span>
                    </button>
                  </div>
                </div>

                {/* Ticker List */}
                <div className="space-y-2">
                  <span className="text-xs text-gray-400">الرسائل الحالية في الشريط:</span>
                  {config.tickerMessages.map((msg, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-950 px-4 py-3 rounded-xl border border-gray-800">
                      <span className="text-sm text-gray-200">{msg}</span>
                      <button
                        onClick={() => removeTickerMessage(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Motivational Messages Rotation */}
                <div className="pt-6 border-t border-gray-800 space-y-3">
                  <label className="text-sm font-semibold text-gray-300">إضافة رسالة تحفيزية متغيرة أثناء الانتظار</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="مثال: رحلتكم نحو الإبداع تبدأ بعد قليل..."
                      value={newMotivationalText}
                      onChange={(e) => setNewMotivationalText(e.target.value)}
                      className="flex-1 bg-gray-950 border border-gray-700 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={addMotivationalMessage}
                      className="px-6 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>إضافة</span>
                    </button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {config.motivationalMessages.map((msg, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-950 px-4 py-3 rounded-xl border border-gray-800">
                        <span className="text-sm text-gray-200">{msg}</span>
                        <button
                          onClick={() => removeMotivationalMessage(index)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. Presenter Tab */}
          {activeTab === 'presenter' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl space-y-6">
                <h3 className="text-lg font-bold text-white">معلومات مقدم الورشة</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-300 block mb-2">اسم المقدم</label>
                    <input
                      type="text"
                      value={config.presenterName}
                      onChange={(e) => setConfig({ ...config, presenterName: e.target.value })}
                      className="w-full bg-gray-950 border border-gray-700 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-300 block mb-2">المسمى التعريفي</label>
                    <input
                      type="text"
                      value={config.presenterTitle}
                      onChange={(e) => setConfig({ ...config, presenterTitle: e.target.value })}
                      className="w-full bg-gray-950 border border-gray-700 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-300 block mb-2">صورة المقدم الشخصية</label>
                  <label className="inline-flex items-center gap-3 px-6 py-3 bg-gray-950 border border-gray-700 hover:border-indigo-500 rounded-xl cursor-pointer text-sm font-medium text-gray-300 transition">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    <span>اختر صورة شخصية...</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};