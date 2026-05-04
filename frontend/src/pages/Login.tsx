import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Code2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function apiFetch(path: string, body: object) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Something went wrong');
  return data;
}

const api = {
  loginPassword: (identifier: string, password: string) =>
    apiFetch('/auth/login', { identifier, password, loginType: 'PASSWORD' }),

  register: (data: {
    name: string;
    userName: string;
    email: string;
    password: string;
  }) => apiFetch('/auth/register', data),

  verifyRegisterOtp: (email: string, otp: string) =>
    apiFetch('/auth/verify-register-otp', { email, otp }),
};

type Screen = 'login' | 'register' | 'verifyOtp';


const Login: React.FC = () => {

  const [name,] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');


  const registerMut = useMutation({
    mutationFn: () =>
      api.register({ name, userName: name, email, password }),
    onSuccess: () => {
      setScreen('verifyOtp');
    },
    onError: (e: Error) => setError(e.message),
  });

  const verifyOtpMut = useMutation({
    mutationFn: () => api.verifyRegisterOtp(email, otp),
    onSuccess: () => {
      navigate('/dashboard');
    },
    onError: (e: Error) => setError(e.message),
  });

  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('login');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loginMut = useMutation({
    mutationFn: () => api.loginPassword(identifier, password),
    onSuccess: () => {
      setError(null)
      navigate('/dashboard')
    },
    onError: (e: Error) => setError(e.message),
  })

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-100 px-4 my-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[400px] bg-white rounded-lg shadow-md border border-gray-200 p-6"
      >

        <div className="text-center mb-6">
          <div className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center">
            <Code2 className="h-8 w-8 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            WELCOME TO IRON CODE
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Access your dashboard and get coding
          </p>
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">Or, sign in with your email</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <AnimatePresence mode="wait">
          {screen === 'login' && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                loginMut.mutate();
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <input
                  type="text"
                  placeholder="Enter Your Email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-full  border border-gray-300 focus:border-gray-300 focus:bg-white outline-none text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Password</label>
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-full  border border-gray-300 focus:border-gray-300 focus:bg-white outline-none text-sm"
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="flex justify-end text-sm">
                <button type="button" className="text-gray-900 hover:text-black">
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loginMut.isPending}
                className="w-full py-3 rounded-full bg-black text-white text-sm font-semibold hover:opacity-90 transition"
              >
                {loginMut.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Login'
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-2">
                Don’t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setScreen('register')}
                  className="font-semibold text-black"
                >
                  Register
                </button>
              </p>
            </motion.form>
          )}

          {screen === 'register' && (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                registerMut.mutate();
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm text-gray-400">Username</label>
                <input
                  type="text"
                  value={userName}
                  placeholder="Enter Your Username"
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-full border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Email</label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-full border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Password</label>
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-full border border-gray-300 text-sm"
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={registerMut.isPending}
                className="w-full py-3 rounded-full bg-black text-white text-sm font-semibold"
              >
                {registerMut.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Send OTP'
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button onClick={() => setScreen('login')} className="font-semibold text-black">
                  Login
                </button>
              </p>
            </motion.form>
          )}{screen === 'verifyOtp' && (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                verifyOtpMut.mutate();
              }}
              className="space-y-4"
            >
              <p className="text-sm text-gray-500 text-center">
                Enter OTP sent to {email}
              </p>

              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full px-4 py-3 rounded-full border border-gray-300 text-sm text-center tracking-widest"
              />

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={verifyOtpMut.isPending}
                className="w-full py-3 rounded-full bg-black text-white text-sm font-semibold"
              >
                {verifyOtpMut.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Verify & Register'
                )}
              </button>

              <button
                type="button"
                onClick={() => setScreen('register')}
                className="text-sm text-gray-500 w-full"
              >
                Back
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
