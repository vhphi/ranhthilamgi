import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { LoginForm } from './components/LoginForm';
import { BasketballOtpArena } from './components/BasketballOtpArena';
import { SuccessView } from './components/SuccessView';
import { soundFx } from './utils/SoundEngine';

export default function App() {
  const [step, setStep] = useState('login'); // 'login' | 'otp' | 'success'
  const [username, setUsername] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const handleLoginSuccess = (user) => {
    setUsername(user);
    setStep('otp');
  };

  const handleOtpSuccess = () => {
    setStep('success');
  };

  const toggleAudio = () => {
    const mutedState = soundFx.toggleMute();
    setIsMuted(mutedState);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-orange-500 selection:text-white">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <button
        onClick={toggleAudio}
        className="absolute top-5 right-5 z-50 p-3 bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md rounded-full border border-slate-700 text-slate-300 hover:text-white transition-all shadow-lg"
        title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
      >
        {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
      </button>

      <div className="w-full max-w-md relative z-10 transition-all duration-500">
        {step === 'login' && <LoginForm onLoginSuccess={handleLoginSuccess} />}
        {step === 'otp' && <BasketballOtpArena onBack={() => setStep('login')} onComplete={handleOtpSuccess} />}
        {step === 'success' && <SuccessView username={username} onReset={() => setStep('login')} />}
      </div>
    </div>
  );
}