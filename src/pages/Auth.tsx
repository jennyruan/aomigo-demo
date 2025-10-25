import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../hooks/useStore';
import { t, getCurrentLocale } from '../lib/i18n';
import { PetAvatar } from '../components/PetAvatar';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signInDemo } = useStore();
  const navigate = useNavigate();
  const locale = getCurrentLocale();

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Check your email for confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDemoMode() {
    signInDemo();
    navigate('/home');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <PetAvatar size="large" />
          </div>
          <h1 className="text-4xl font-bold text-orange-600 mb-2">
            {t('app.title', locale)}
          </h1>
          <p className="text-brown-700">
            Your AI-Powered Learning Companion
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-8">
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : isSignUp ? t('auth.signup', locale) : t('auth.login', locale)}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-orange-600 text-sm hover:underline"
            >
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-orange-100">
            <button
              onClick={handleDemoMode}
              className="w-full bg-purple-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              {t('auth.demoMode', locale)}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-brown-600">
          <p>🎃 Halloween Theme Edition 🎃</p>
          <p className="mt-2">Learn, Review, and Grow with Aomigo!</p>
        </div>
      </div>
    </div>
  );
}
