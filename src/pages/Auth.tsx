import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X, Loader2, ArrowLeft } from 'lucide-react';
import { signUpWithEmail, signInWithEmail } from '../lib/firebase';
import { isSupabaseConfigured } from '../lib/supabase';
import { useStore } from '../hooks/useStore';
import { PetAvatar } from '../components/PetAvatar';
import { toast } from 'sonner';
import { createProfile } from '../lib/database/profiles';

export function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      if (emailInput && emailInput === document.activeElement) return;
    }
    const firstInput = document.querySelector('input[type="email"]') as HTMLInputElement;
    firstInput?.focus();
  }, []);

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getPasswordStrength = (pass: string): { label: string; color: string; width: string } => {
    if (pass.length === 0) return { label: '', color: '', width: '0%' };
    if (pass.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (pass.length < 10) return { label: 'Medium', color: 'bg-orange-500', width: '66%' };
    const hasLetters = /[a-zA-Z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    if (hasLetters && hasNumbers) {
      return { label: 'Strong', color: 'bg-green-500', width: '100%' };
    }
    return { label: 'Medium', color: 'bg-orange-500', width: '66%' };
  };

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const passwordsDontMatch = confirmPassword.length > 0 && password !== confirmPassword;
  const passwordStrength = getPasswordStrength(password);

  const canSubmit = mode === 'signin'
    ? isValidEmail(email) && password.length >= 6
    : isValidEmail(email) && password.length >= 6 && passwordsMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);

    try {
      if (mode === 'signup') {
        const user = await signUpWithEmail(email, password);
        if (isSupabaseConfigured) {
          const timestamp = new Date().toISOString();
          await createProfile({
            id: user.uid,
            pet_name: 'AOMIGO',
            intelligence: 0,
            health: 100,
            level: 1,
            day_streak: 0,
            last_activity_date: timestamp.split('T')[0],
            language_preference: 'en',
            created_at: timestamp,
            updated_at: timestamp,
          });
        }
        toast.success('Welcome to AOMIGO! 🐾');
        navigate('/home');
      } else {
        await signInWithEmail(email, password);
        toast.success('Welcome back! 👋');
        navigate('/home');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Something went wrong';

      if (errorMessage.includes('already exists') || errorMessage.includes('already registered')) {
        toast.error('This email is already taken! Try logging in instead.');
      } else if (errorMessage.includes('Invalid') || errorMessage.includes('incorrect')) {
        toast.error('Oops! Wrong email or password. Try again!');
      } else {
        toast.error('Hmm, that didn\'t work. Let\'s try again!');
      }
    } finally {
      setLoading(false);
    }
  }


  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && canSubmit) {
      handleSubmit(e as any);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <PetAvatar size="large" />
          </div>
          <h1 className="text-4xl font-bold text-orange-600 mb-2">
            AOMIGO
          </h1>
          <p className="text-brown-700 text-lg">
            Your Learning Buddy! 🐾
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                  : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                  : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" onKeyPress={handleKeyPress}>
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                {mode === 'signup' ? 'Create Password' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-600 hover:text-brown-800"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {mode === 'signup' && password.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-brown-600">Password Strength:</span>
                    <span className={`font-semibold ${
                      passwordStrength.label === 'Strong' ? 'text-green-600' :
                      passwordStrength.label === 'Medium' ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${passwordStrength.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-brown-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                      passwordsDontMatch
                        ? 'border-red-400 focus:ring-red-500'
                        : passwordsMatch
                        ? 'border-green-400 focus:ring-green-500'
                        : 'border-orange-200 focus:ring-orange-500'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-brown-600 hover:text-brown-800"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {confirmPassword.length > 0 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {passwordsMatch ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
                {passwordsDontMatch && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    Passwords don't match! Please try again.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                mode === 'signup' ? 'Sign Up! 🚀' : 'Sign In! 🎉'
              )}
            </button>
          </form>

          {/* Demo mode removed — authentication is handled by Firebase */}
        </div>

        <div className="mt-6 text-center text-sm text-brown-600">
          <p>🎃 Halloween Theme Edition 🎃</p>
          <p className="mt-2">Learn cool stuff with your pet buddy!</p>
        </div>
      </div>
    </div>
  );
}
