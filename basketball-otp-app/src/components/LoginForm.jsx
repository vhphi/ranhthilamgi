import React, { useState } from 'react';
import { ArrowRight, Lock, User, UserPlus, X } from 'lucide-react';
import Logo from './Logo';

const initialRegistration = {
  username: '',
  email: '',
  password: '',
  fullName: '',
  dateOfBirth: '',
  gender: '',
  height: '',
  weight: '',
  aspiration: '',
};

const inputClassName =
  'w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all';

export const LoginForm = ({ onLoginSuccess, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [registration, setRegistration] = useState(initialRegistration);
  const [registrationError, setRegistrationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tài khoản và mật khẩu');
      return;
    }
    setError('');
    onLoginSuccess(username);
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistration((current) => ({ ...current, [name]: value }));
    setRegistrationError('');
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    if (!onRegister) {
      setRegistrationError('Chưa thể gửi đăng ký vì ứng dụng chưa kết nối dịch vụ đăng ký.');
      return;
    }

    onRegister({
      ...registration,
      height: Number(registration.height),
      weight: Number(registration.weight),
    });
  };

  const closeRegistration = () => {
    setIsRegistrationOpen(false);
    setRegistrationError('');
  };

  return (
    <>
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative transition-all animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
            <Logo className="text-slate-950 animate-pulse" width={360} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Đăng Nhập
          </h1>
          <p className="text-sm text-slate-400 mt-1"></p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Tên đăng nhập / Email
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-bold rounded-xl text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Tiếp tục</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-5">
          Chưa có tài khoản?{' '}
          <button
            type="button"
            onClick={() => setIsRegistrationOpen(true)}
            className="font-semibold text-orange-400 hover:text-orange-300 transition-colors"
          >
            Ghi danh
          </button>
        </p>
      </div>

      {isRegistrationOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeRegistration();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-title"
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fadeIn"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-orange-400 mb-2">
                  <UserPlus className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Tạo tài khoản</span>
                </div>
                <h2 id="registration-title" className="text-2xl font-bold text-white">Ghi danh</h2>
                <p className="text-sm text-slate-400 mt-1">Vui lòng điền thông tin bên dưới.</p>
              </div>
              <button
                type="button"
                onClick={closeRegistration}
                aria-label="Đóng cửa sổ ghi danh"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {registrationError && (
              <div role="alert" className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-xl">
                {registrationError}
              </div>
            )}

            <form onSubmit={handleRegistrationSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="registration-username" className="block text-xs font-semibold text-slate-300 mb-1.5">Tên tài khoản</label>
                <input
                  id="registration-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  minLength={3}
                  required
                  value={registration.username}
                  onChange={handleRegistrationChange}
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="registration-email" className="block text-xs font-semibold text-slate-300 mb-1.5">Email</label>
                <input
                  id="registration-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={registration.email}
                  onChange={handleRegistrationChange}
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="registration-password" className="block text-xs font-semibold text-slate-300 mb-1.5">Mật khẩu</label>
                <input
                  id="registration-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={registration.password}
                  onChange={handleRegistrationChange}
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="registration-full-name" className="block text-xs font-semibold text-slate-300 mb-1.5">Tên đầy đủ</label>
                <input
                  id="registration-full-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={registration.fullName}
                  onChange={handleRegistrationChange}
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="registration-date-of-birth" className="block text-xs font-semibold text-slate-300 mb-1.5">Ngày sinh</label>
                <input
                  id="registration-date-of-birth"
                  name="dateOfBirth"
                  type="date"
                  autoComplete="bday"
                  required
                  value={registration.dateOfBirth}
                  onChange={handleRegistrationChange}
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="registration-gender" className="block text-xs font-semibold text-slate-300 mb-1.5">Giới tính</label>
                <select
                  id="registration-gender"
                  name="gender"
                  required
                  value={registration.gender}
                  onChange={handleRegistrationChange}
                  className={inputClassName}
                >
                  <option value="" disabled>Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>
              <div>
                <label htmlFor="registration-height" className="block text-xs font-semibold text-slate-300 mb-1.5">Chiều cao (cm)</label>
                <input
                  id="registration-height"
                  name="height"
                  type="number"
                  min="1"
                  max="300"
                  required
                  value={registration.height}
                  onChange={handleRegistrationChange}
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="registration-weight" className="block text-xs font-semibold text-slate-300 mb-1.5">Cân nặng (kg)</label>
                <input
                  id="registration-weight"
                  name="weight"
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={registration.weight}
                  onChange={handleRegistrationChange}
                  className={inputClassName}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="registration-aspiration" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nguyện vọng <span className="font-normal text-slate-500">(không bắt buộc)</span>
                </label>
                <textarea
                  id="registration-aspiration"
                  name="aspiration"
                  rows="3"
                  value={registration.aspiration}
                  onChange={handleRegistrationChange}
                  className={`${inputClassName} resize-y`}
                />
              </div>
              <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeRegistration}
                  className="px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-bold text-slate-950 transition-all"
                >
                  Gửi đăng ký
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};