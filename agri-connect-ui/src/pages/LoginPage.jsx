import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { farmerLogin } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await farmerLogin({ phone: form.phone, password: form.password });
      if (res.data && res.data.farmer) {
        localStorage.setItem('farmer', JSON.stringify(res.data.farmer));
        localStorage.setItem('farmerPhone', res.data.farmer.phone);
        navigate('/dashboard'); // ✅ Use navigate
      } else {
        setMessage('Login failed! Please check your details.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Login failed! Please check your details.');
    }
  };

  return (
    <div className="min-h-screen relative p-4 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1620200423727-8127f75d7f53?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Rounded vignette corners like the mock */}
      <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-black/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/20 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl flex flex-col md:flex-row items-start md:items-center justify-between gap-10 md:gap-16 pt-10 md:pt-0">
        {/* Left hero text */}
        <div className="text-white px-2 md:px-0 md:w-1/2">
          <p className="uppercase tracking-widest text-emerald-300/90 text-sm mb-3">Agriculture</p>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">AGRI CONNECT</h1>
          <p className="mt-4 text-slate-100/90 max-w-md">
            Connect with the farming community. Get prices, advice, tips, and marketplace — all in one place.
          </p>
        </div>

        {/* Right glassmorphic login card */}
        <div className="md:w-[460px] w-full">
          <div className="backdrop-blur-xl bg-white/20 border border-white/25 rounded-3xl shadow-2xl p-6 sm:p-8 text-white">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Welcome back</h2>
                <p className="text-white/80 mt-1">Sign in with your phone number and password.</p>
              </div>

              <label className="label text-white/90" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Enter your number"
                value={form.phone}
                onChange={handleChange}
                required
                className="input mb-4"
              />

              <div className="flex items-center justify-between">
                <label className="label text-white/90" htmlFor="password">Password</label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-white/80 text-sm hover:text-white underline-offset-2 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
                className="input mb-4"
              />

              <button type="submit" className="btn-primary w-full py-2">SIGN IN</button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="h-px flex-1 bg-white/40" />
                <span className="text-white/80 text-sm">or</span>
                <div className="h-px flex-1 bg-white/40" />
              </div>

              {/* Google-styled create account */}
              <button
                type="button"
                onClick={() => navigate('/create-account')}
                className="w-full inline-flex items-center justify-center gap-3 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 transition-colors py-2"
                aria-label="Create an Account"
              >
    
                <span className="text-white">Create an Account</span>
              </button>

              {message && <p className="alert-error mt-4 text-center">{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
