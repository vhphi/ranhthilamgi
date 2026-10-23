import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, KeyRound, RefreshCw, Sparkles } from 'lucide-react';
import { OTP_LENGTH, DIGITS, generateRandomOTP } from '../constants/game';
import { soundFx } from '../utils/SoundEngine';
import { BasketballIcon } from './BasketballIcon';

export const BasketballOtpArena = ({ onBack, onComplete }) => {
  const [targetOTP, setTargetOTP] = useState([]);
  const [enteredOTP, setEnteredOTP] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [isShooting, setIsShooting] = useState(false);
  const [netSwishAnim, setNetSwishAnim] = useState(false);
  const [missedMessage, setMissedMessage] = useState(null);

  const canvasRef = useRef(null);

  const ballStateRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 20,
    active: false,
    number: 1,
    trail: []
  });

  const hoopStateRef = useRef({
    x: 0,
    direction: 1,
    speed: 1.2
  });

  const initNewOTP = useCallback(() => {
    const newOtp = generateRandomOTP();
    setTargetOTP(newOtp);
    setEnteredOTP([]);
  }, []);

  useEffect(() => {
    initNewOTP();
  }, [initNewOTP]);

  const handleScoreBall = useCallback((num) => {
    setEnteredOTP((prev) => {
      if (prev.length >= OTP_LENGTH) return prev;

      const nextIndex = prev.length;
      const expectedNum = targetOTP[nextIndex];

      //if (num === expectedNum) {
        const updated = [...prev, num];
        if (updated.length === OTP_LENGTH) {
          soundFx.playSuccessFanfare();
          setTimeout(() => onComplete(), 500);
        }
        return updated;
      //} else {
    //     soundFx.playRimHit();
    //     setMissedMessage(`Sai số rồi! Cần chọn số ${expectedNum}`);
    //     setTimeout(() => setMissedMessage(null), 2000);
    //     return prev;
    //   }
    });
  }, [targetOTP, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      // Oscillating Hoop
      const hoop = hoopStateRef.current;
      const minX = width * 0.25;
      const maxX = width * 0.75;

      if (hoop.x === 0) hoop.x = width * 0.5;

      hoop.x += hoop.speed * hoop.direction;
      if (hoop.x >= maxX) {
        hoop.x = maxX;
        hoop.direction = -1;
      } else if (hoop.x <= minX) {
        hoop.x = minX;
        hoop.direction = 1;
      }

      // Draw Backboard & Hoop Rim
      const hoopX = hoop.x;
      const hoopY = 85;
      const rimRadius = 38;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.fillRect(hoopX - 60, hoopY - 60, 120, 70);
      ctx.strokeRect(hoopX - 60, hoopY - 60, 120, 70);

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(hoopX - 25, hoopY - 25, 50, 35);

      ctx.beginPath();
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 6;
      ctx.arc(hoopX, hoopY, rimRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Net
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5;
      const netY = hoopY + 45;
      for (let i = -rimRadius; i <= rimRadius; i += 12) {
        ctx.moveTo(hoopX + i, hoopY);
        ctx.lineTo(hoopX + i * 0.5, netY);
      }
      ctx.stroke();

      // Ball Physics
      const ball = ballStateRef.current;
      if (ball.active) {
        ball.vy += 0.45;
        ball.x += ball.vx;
        ball.y += ball.vy;

        ball.trail.push({ x: ball.x, y: ball.y });
        if (ball.trail.length > 8) ball.trail.shift();

        ball.trail.forEach((t, index) => {
          ctx.beginPath();
          ctx.arc(t.x, t.y, ball.radius * (index / ball.trail.length) * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(249, 115, 22, ${index / 15})`;
          ctx.fill();
        });

        ctx.save();
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ea580c';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(ball.x - ball.radius, ball.y);
        ctx.lineTo(ball.x + ball.radius, ball.y);
        ctx.moveTo(ball.x, ball.y - ball.radius);
        ctx.lineTo(ball.y, ball.y + ball.radius);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ball.number.toString(), ball.x, ball.y);
        ctx.restore();

        const distToHoop = Math.hypot(ball.x - hoopX, ball.y - hoopY);
        if (distToHoop < rimRadius && Math.abs(ball.vy) > 0 && ball.y >= hoopY - 10 && ball.y <= hoopY + 20) {
          ball.active = false;
          setIsShooting(false);
          soundFx.playSwish();
          setNetSwishAnim(true);
          setTimeout(() => setNetSwishAnim(false), 600);
          handleScoreBall(ball.number);
        } else if (ball.y > height + 50 || ball.x < -50 || ball.x > width + 50) {
          ball.active = false;
          setIsShooting(false);
          soundFx.playRimHit();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [selectedNumber, handleScoreBall]);

  const shootBall = (number = selectedNumber) => {
    if (isShooting || enteredOTP.length >= OTP_LENGTH) return;

    soundFx.playBounce();
    setIsShooting(true);
    setSelectedNumber(number);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    const hoopX = hoopStateRef.current.x || width * 0.5;
    const hoopY = 85;

    const startX = width * 0.5;
    const startY = height - 40;

    const timeInAir = 40;
    const vx = (hoopX - startX) / timeInAir;
    const vy = (hoopY - startY - 0.5 * 0.45 * Math.pow(timeInAir, 2)) / timeInAir;

    ballStateRef.current = {
      x: startX,
      y: startY,
      vx,
      vy,
      radius: 20,
      active: true,
      number,
      trail: []
    };
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center animate-fadeIn">
      <div className="w-full flex items-center justify-between mb-2">
        <button
          onClick={onBack}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5 text-orange-400 font-bold text-sm">
          <KeyRound className="w-4 h-4" />
          <span>Ném Bóng Nhập OTP</span>
        </div>
        <button
          onClick={initNewOTP}
          className="p-2 text-slate-400 hover:text-orange-400 rounded-lg hover:bg-slate-800/50 transition-all"
          title="Tạo lại mã OTP"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-slate-950/80 rounded-2xl p-3 w-full border border-slate-800/80 mb-3 text-center">
        <span className="text-xs text-slate-400 block mb-1">Mã OTP yêu cầu (Hãy ném từng số vào rổ):</span>
        <div className="flex justify-center gap-2">
          {targetOTP.map((digit, idx) => {
            const isFilled = idx < enteredOTP.length;
            const isCurrentTarget = idx === enteredOTP.length;
            return (
              <div
                key={idx}
                className={`w-9 h-11 rounded-lg border-2 flex items-center justify-center font-extrabold text-lg transition-all ${
                  isFilled
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 scale-105'
                    : isCurrentTarget
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400 animate-pulse'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {isFilled ? enteredOTP[idx] : '?'}
              </div>
            );
          })}
        </div>
      </div>

      <div 
        onDoubleClick={shootBall}
        className="relative w-full h-56 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center cursor-pointer select-none group"
        title="Nhấp đúp chuột để ném bóng!"
      >
        <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />

        <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] text-slate-400 pointer-events-none transition-opacity opacity-75 group-hover:opacity-100">
          💡 Nhấp đúp chuột để ném
        </div>

        {netSwishAnim && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold animate-bounce pointer-events-none">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VÀO RỔ!</span>
          </div>
        )}

        {missedMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg pointer-events-none">
            {missedMessage}
          </div>
        )}
      </div>

      <div className="w-full mt-4">
        <div className="text-xs text-slate-400 mb-2 font-medium flex justify-between items-center">
          <span>Chọn quả bóng số:</span>
          <span className="text-orange-400 font-bold">Số đang chọn: {selectedNumber}</span>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-4">
          {DIGITS.map((num) => {
            const isSelected = selectedNumber === num;
            return (
              <button
                key={num}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  shootBall(num);
                }}
                onClick={() => {
                  setSelectedNumber(num);
                  soundFx.playClick();
                }}
                className={`h-11 rounded-xl font-black text-sm transition-all flex items-center justify-center shadow-md active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-tr from-orange-500 to-amber-400 text-slate-950 border-2 border-white scale-105 shadow-orange-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => shootBall(selectedNumber)}
          disabled={isShooting || enteredOTP.length >= OTP_LENGTH}
          className={`w-full py-3.5 rounded-xl font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
            isShooting || enteredOTP.length >= OTP_LENGTH
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 active:scale-[0.98] shadow-orange-500/30'
          }`}
        >
          <BasketballIcon className="w-5 h-5" />
          <span>Ném Bóng Ngay</span>
        </button>
      </div>
    </div>
  );
};