import React from 'react';
import { CheckCircle2, Trophy } from 'lucide-react';

export const SuccessView = ({ username, onReset }) => (
  <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl text-center animate-fadeIn relative overflow-hidden">
    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
      <CheckCircle2 className="w-10 h-10" />
    </div>

    <h2 className="text-2xl font-black text-white mb-2">Tuyệt vời!</h2>
    <p className="text-sm text-slate-400 mb-6">
      Kỹ năng ném bóng xuất sắc!
    </p>

    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 mb-6 flex items-center justify-center gap-3">
      <Trophy className="w-6 h-6 text-amber-400" />
      <span className="text-xs text-slate-300 font-semibold">
        Tài khoản: <strong className="text-orange-400">{username}</strong> đã đăng nhập.
      </span>
    </div>

    <button
      onClick={onReset}
      className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all border border-slate-700"
    >Kiểm tra lịch thi đấu
      {/* Đăng xuất & Thử lại */}
    </button>
  </div>
);