import { useState, useEffect } from 'react';
import { Check, Mail, User, Users, Shield, Sparkles, ChevronRight, Phone, Linkedin, MessageSquare, ChevronDown, Menu, X, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface AvatarConfig {
  animal: string;
  eyes: string;
  ears: string;
  mouth: string;
  pattern: string;
}

export function Landing() {
  const [activeSection, setActiveSection] = useState('events');
  const [showRules, setShowRules] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [contestFormData, setContestFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    isParent: false,
    isOrganization: false,
    wantsMoreEvents: true,
  });

  const [authFormData, setAuthFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    rememberMe: false,
  });

  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    animal: 'panda',
    eyes: 'normal',
    ears: 'normal',
    mouth: 'smile',
    pattern: 'solid',
  });

  const [investorFormData, setInvestorFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    linkedinUrl: '',
    message: '',
  });

  const [isContestSubmitting, setIsContestSubmitting] = useState(false);
  const [isContestSubmitted, setIsContestSubmitted] = useState(false);
  const [isInvestorSubmitting, setIsInvestorSubmitting] = useState(false);
  const [isInvestorSubmitted, setIsInvestorSubmitted] = useState(false);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  const animalEmojis: Record<string, string> = {
    panda: '🐼',
    fox: '🦊',
    cat: '🐱',
    dog: '🐶',
    rabbit: '🐰',
    bear: '🐻',
  };

  useEffect(() => {
    const targetDate = new Date('2025-11-30T23:59:59').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
      setShowMobileMenu(false);
    }
  }

  function randomizeAvatar() {
    const animals = ['panda', 'fox', 'cat', 'dog', 'rabbit', 'bear'];
    const eyeStyles = ['normal', 'happy', 'sleepy', 'star', 'hearts'];
    const earStyles = ['normal', 'floppy', 'pointy', 'round'];
    const mouthStyles = ['smile', 'happy', 'tongue', 'surprised', 'cute'];
    const patterns = ['solid', 'spots', 'stripes', 'gradient', 'hearts', 'stars'];

    setAvatarConfig({
      animal: animals[Math.floor(Math.random() * animals.length)],
      eyes: eyeStyles[Math.floor(Math.random() * eyeStyles.length)],
      ears: earStyles[Math.floor(Math.random() * earStyles.length)],
      mouth: mouthStyles[Math.floor(Math.random() * mouthStyles.length)],
      pattern: patterns[Math.floor(Math.random() * patterns.length)],
    });
  }

  async function handleContestSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!contestFormData.name.trim() || !contestFormData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contestFormData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsContestSubmitting(true);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            first_name: contestFormData.name.trim(),
            email: contestFormData.email.trim().toLowerCase(),
            phone_number: contestFormData.phoneNumber.trim() || null,
            is_parent_demo_user: contestFormData.isParent,
            is_organization_user: contestFormData.isOrganization,
            wants_more_events: contestFormData.wantsMoreEvents,
            user_type: 'demo',
          },
        ]);

      if (error) {
        if (error.code === '23505') {
          toast.error('This email is already registered!');
        } else {
          throw error;
        }
      } else {
        setIsContestSubmitted(true);
        toast.success('Successfully joined the contest!');
        setContestFormData({
          name: '',
          email: '',
          phoneNumber: '',
          isParent: false,
          isOrganization: false,
          wantsMoreEvents: true,
        });
      }
    } catch (error) {
      console.error('Error joining contest:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsContestSubmitting(false);
    }
  }

  async function handleInvestorSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!investorFormData.firstName.trim() || !investorFormData.email.trim()) {
      toast.error('Please fill in required fields (First Name and Email)');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(investorFormData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsInvestorSubmitting(true);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            first_name: investorFormData.firstName.trim(),
            last_name: investorFormData.lastName.trim() || null,
            email: investorFormData.email.trim().toLowerCase(),
            phone_number: investorFormData.phoneNumber.trim() || null,
            linkedin_url: investorFormData.linkedinUrl.trim() || null,
            message: investorFormData.message.trim() || null,
            user_type: 'investor',
          },
        ]);

      if (error) {
        if (error.code === '23505') {
          toast.error('This email is already registered!');
        } else {
          throw error;
        }
      } else {
        setIsInvestorSubmitted(true);
        toast.success('Thank you for your interest! We will be in touch soon.');
        setInvestorFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          linkedinUrl: '',
          message: '',
        });
      }
    } catch (error) {
      console.error('Error submitting investor info:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsInvestorSubmitting(false);
    }
  }

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (authMode === 'signup') {
      if (!authFormData.name.trim() || !authFormData.email.trim() || !authFormData.password) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (authFormData.password !== authFormData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      if (authFormData.password.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authFormData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsAuthSubmitting(true);

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: authFormData.email.trim().toLowerCase(),
          password: authFormData.password,
          options: {
            data: {
              name: authFormData.name.trim(),
              organization_name: authFormData.organizationName.trim() || null,
              avatar_config: avatarConfig,
            },
          },
        });

        if (error) throw error;

        toast.success('Account created successfully! Check your email to verify.');
        setShowAuthModal(false);
        setAuthFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          organizationName: '',
          rememberMe: false,
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authFormData.email.trim().toLowerCase(),
          password: authFormData.password,
        });

        if (error) throw error;

        toast.success('Signed in successfully!');
        setShowAuthModal(false);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsAuthSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFECB3' }}>
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#FF9A56', borderBottom: '4px solid black' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center" style={{ border: '3px solid black' }}>
                <span className="text-2xl">🐼</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black" style={{ color: '#2C3E50' }}>AOMIGO</h1>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scrollToSection('events')}
                className="px-4 py-2 font-black text-base rounded-lg transition-all hover:bg-white hover:bg-opacity-20"
                style={{ color: activeSection === 'events' ? '#2C3E50' : 'white' }}
              >
                Events
              </button>
              <span className="text-white font-black">|</span>
              <button
                onClick={() => scrollToSection('collab')}
                className="px-4 py-2 font-black text-base rounded-lg transition-all hover:bg-white hover:bg-opacity-20"
                style={{ color: activeSection === 'collab' ? '#2C3E50' : 'white' }}
              >
                Investor & Collab
              </button>
              <span className="text-white font-black">|</span>
              <button
                onClick={() => scrollToSection('demo')}
                className="px-4 py-2 font-black text-base rounded-lg transition-all hover:bg-white hover:bg-opacity-20"
                style={{ color: activeSection === 'demo' ? '#2C3E50' : 'white' }}
              >
                Demo
              </button>
              <span className="text-white font-black">|</span>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 font-black text-base bg-white rounded-lg transition-all hover:bg-opacity-90"
                style={{ border: '3px solid black', boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)', color: '#2C3E50' }}
              >
                Sign In/Up
              </button>
            </nav>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg bg-white"
              style={{ border: '3px solid black' }}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {showMobileMenu && (
            <nav className="md:hidden py-4 border-t-4 border-black">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => scrollToSection('events')}
                  className="px-4 py-3 font-black text-lg text-left bg-white rounded-lg"
                  style={{ border: '3px solid black' }}
                >
                  Events
                </button>
                <button
                  onClick={() => scrollToSection('collab')}
                  className="px-4 py-3 font-black text-lg text-left bg-white rounded-lg"
                  style={{ border: '3px solid black' }}
                >
                  Investor & Collab
                </button>
                <button
                  onClick={() => scrollToSection('demo')}
                  className="px-4 py-3 font-black text-lg text-left bg-white rounded-lg"
                  style={{ border: '3px solid black' }}
                >
                  Demo
                </button>
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="px-4 py-3 font-black text-lg text-left bg-white rounded-lg"
                  style={{ border: '3px solid black' }}
                >
                  Sign In/Up
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black" style={{ color: '#2C3E50' }}>
                  {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                </h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  style={{ border: '3px solid black' }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setAuthMode('signin')}
                  className={`flex-1 py-3 rounded-lg font-black text-lg transition-all ${
                    authMode === 'signin' ? 'bg-gray-900 text-white' : 'bg-gray-100'
                  }`}
                  style={{ border: '3px solid black' }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-3 rounded-lg font-black text-lg transition-all ${
                    authMode === 'signup' ? 'bg-gray-900 text-white' : 'bg-gray-100'
                  }`}
                  style={{ border: '3px solid black' }}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <>
                    <div className="text-left">
                      <label className="block font-black mb-2 text-lg" style={{ color: '#2C3E50' }}>
                        Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={authFormData.name}
                        onChange={(e) => setAuthFormData({ ...authFormData, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-lg text-lg font-bold focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FFECB3' }}
                        required
                      />
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-2 text-lg" style={{ color: '#2C3E50' }}>
                        Organization Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={authFormData.organizationName}
                        onChange={(e) => setAuthFormData({ ...authFormData, organizationName: e.target.value })}
                        placeholder="Your organization"
                        className="w-full px-4 py-3 rounded-lg text-lg font-bold focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FFECB3' }}
                      />
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-2 text-lg" style={{ color: '#2C3E50' }}>
                        Choose Your Avatar
                      </label>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl" style={{ backgroundColor: '#FFB3D9', border: '4px solid black' }}>
                          {animalEmojis[avatarConfig.animal]}
                        </div>
                        <button
                          type="button"
                          onClick={randomizeAvatar}
                          className="px-4 py-2 font-black rounded-lg text-white"
                          style={{ backgroundColor: '#B39DDB', border: '3px solid black', boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                        >
                          Randomize
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {['panda', 'fox', 'cat', 'dog', 'rabbit', 'bear'].map((animal) => (
                          <button
                            key={animal}
                            type="button"
                            onClick={() => setAvatarConfig({ ...avatarConfig, animal })}
                            className={`p-3 rounded-lg font-bold text-3xl ${
                              avatarConfig.animal === animal ? 'ring-4 ring-offset-2' : ''
                            }`}
                            style={{
                              backgroundColor: avatarConfig.animal === animal ? '#A8E6CF' : '#FFB3D9',
                              border: '3px solid black',
                            }}
                          >
                            {animalEmojis[animal]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="text-left">
                  <label className="block font-black mb-2 text-lg" style={{ color: '#2C3E50' }}>
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={authFormData.email}
                    onChange={(e) => setAuthFormData({ ...authFormData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg text-lg font-bold focus:outline-none focus:ring-4"
                    style={{ border: '4px solid black', backgroundColor: '#FFECB3' }}
                    required
                  />
                </div>

                <div className="text-left">
                  <label className="block font-black mb-2 text-lg" style={{ color: '#2C3E50' }}>
                    Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={authFormData.password}
                      onChange={(e) => setAuthFormData({ ...authFormData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg text-lg font-bold focus:outline-none focus:ring-4 pr-12"
                      style={{ border: '4px solid black', backgroundColor: '#FFECB3' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>
                </div>

                {authMode === 'signup' && (
                  <div className="text-left">
                    <label className="block font-black mb-2 text-lg" style={{ color: '#2C3E50' }}>
                      Confirm Password <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={authFormData.confirmPassword}
                        onChange={(e) => setAuthFormData({ ...authFormData, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-lg text-lg font-bold focus:outline-none focus:ring-4 pr-12"
                        style={{ border: '4px solid black', backgroundColor: '#FFECB3' }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </button>
                    </div>
                  </div>
                )}

                {authMode === 'signin' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={authFormData.rememberMe}
                      onChange={(e) => setAuthFormData({ ...authFormData, rememberMe: e.target.checked })}
                      className="w-5 h-5 rounded cursor-pointer"
                      style={{ border: '3px solid black' }}
                    />
                    <label htmlFor="rememberMe" className="font-bold text-lg cursor-pointer" style={{ color: '#2C3E50' }}>
                      Remember me
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthSubmitting}
                  className="w-full text-white px-8 py-4 rounded-xl font-black text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:translate-y-[-2px]"
                  style={{
                    backgroundColor: '#FF9A56',
                    border: '4px solid black',
                    boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                  }}
                >
                  {isAuthSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      {authMode === 'signin' ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                      <ChevronRight className="w-6 h-6" />
                    </>
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full" style={{ borderTop: '3px solid black' }}></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 font-black text-lg" style={{ backgroundColor: 'white', color: '#2C3E50' }}>
                      OR
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full px-4 py-3 rounded-lg font-black text-lg flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition-all"
                    style={{ border: '3px solid black', boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                  >
                    <span className="text-2xl">🔵</span>
                    Continue with Google
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-3 rounded-lg font-black text-lg flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition-all"
                    style={{ border: '3px solid black', boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                  >
                    <span className="text-2xl">🍎</span>
                    Continue with Apple
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <main>
        <section id="events" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FFECB3' }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block bg-white px-6 py-3 rounded-full font-black text-lg sm:text-xl mb-6" style={{ border: '4px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)', lineHeight: '1.2' }}>
                🎨 AOMIGO Logo Lab - Join Now!
              </div>

              <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                Make our logo and win $1024!
              </h2>
              <p className="text-2xl sm:text-3xl font-black mb-3" style={{ color: '#FF9A56', lineHeight: '1.2' }}>
                Turn A-O-M-I-G-O into our new logo!
              </p>
              <p className="text-xl sm:text-2xl font-black mb-8" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                🎉 Why $1024? Because 10/24 is AOMIGO's birthday!
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 mb-8 max-w-xl mx-auto" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
              {isContestSubmitted ? (
                <div className="text-center py-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#A8E6CF', border: '4px solid black' }}>
                    <Check className="w-12 h-12 text-gray-900" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black mb-3" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                    You're in the contest!
                  </h3>
                  <p className="text-lg font-bold mb-4" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                    Check your email for submission details!
                  </p>
                  <button
                    onClick={() => setIsContestSubmitted(false)}
                    className="font-bold underline text-lg"
                    style={{ color: '#FF9A56' }}
                  >
                    Add another entry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContestSubmit} className="space-y-4">
                  <div className="text-left">
                    <label className="block font-black mb-2 text-lg" style={{ color: '#2C3E50' }}>
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={contestFormData.name}
                      onChange={(e) => setContestFormData({ ...contestFormData, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-lg text-lg font-bold focus:outline-none focus:ring-4"
                      style={{ border: '4px solid black', backgroundColor: '#FFECB3', lineHeight: '1.6' }}
                      required
                    />
                  </div>

                  <div className="text-left">
                    <label className="block font-black mb-2 text-lg" style={{ color: '#2C3E50' }}>
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={contestFormData.email}
                      onChange={(e) => setContestFormData({ ...contestFormData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg text-lg font-bold focus:outline-none focus:ring-4"
                      style={{ border: '4px solid black', backgroundColor: '#FFECB3', lineHeight: '1.6' }}
                      required
                    />
                  </div>

                  <div className="text-left">
                    <label className="block font-black mb-2 text-lg" style={{ color: '#2C3E50' }}>
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={contestFormData.phoneNumber}
                      onChange={(e) => setContestFormData({ ...contestFormData, phoneNumber: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 rounded-lg text-lg font-bold focus:outline-none focus:ring-4"
                      style={{ border: '4px solid black', backgroundColor: '#FFECB3', lineHeight: '1.6' }}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-left p-4 rounded-lg" style={{ backgroundColor: '#FFB3D9', border: '4px solid black' }}>
                      <input
                        type="checkbox"
                        id="isParent"
                        checked={contestFormData.isParent}
                        onChange={(e) => setContestFormData({ ...contestFormData, isParent: e.target.checked })}
                        className="w-6 h-6 mt-1 rounded cursor-pointer flex-shrink-0"
                        style={{ border: '3px solid black' }}
                      />
                      <label htmlFor="isParent" className="font-black cursor-pointer text-base sm:text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                        I'm a parent interested in AOMIGO for my child
                      </label>
                    </div>

                    <div className="flex items-start gap-3 text-left p-4 rounded-lg" style={{ backgroundColor: '#B3D4FF', border: '4px solid black' }}>
                      <input
                        type="checkbox"
                        id="isOrganization"
                        checked={contestFormData.isOrganization}
                        onChange={(e) => setContestFormData({ ...contestFormData, isOrganization: e.target.checked })}
                        className="w-6 h-6 mt-1 rounded cursor-pointer flex-shrink-0"
                        style={{ border: '3px solid black' }}
                      />
                      <label htmlFor="isOrganization" className="font-black cursor-pointer text-base sm:text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                        I'm interested in AOMIGO for my organization
                      </label>
                    </div>

                    <div className="flex items-start gap-3 text-left p-4 rounded-lg" style={{ backgroundColor: '#A8E6CF', border: '4px solid black' }}>
                      <input
                        type="checkbox"
                        id="wantsMoreEvents"
                        checked={contestFormData.wantsMoreEvents}
                        onChange={(e) => setContestFormData({ ...contestFormData, wantsMoreEvents: e.target.checked })}
                        className="w-6 h-6 mt-1 rounded cursor-pointer flex-shrink-0"
                        style={{ border: '3px solid black' }}
                      />
                      <label htmlFor="wantsMoreEvents" className="font-black cursor-pointer text-base sm:text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                        I want to participate in more events like this!
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isContestSubmitting}
                    className="w-full text-white px-8 py-4 rounded-xl font-black text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:translate-y-[-2px]"
                    style={{
                      backgroundColor: '#FF9A56',
                      border: '4px solid black',
                      boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                      lineHeight: '1.2',
                    }}
                  >
                    {isContestSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        Joining...
                      </>
                    ) : (
                      <>
                        Sign Up & Join Contest
                        <ChevronRight className="w-6 h-6" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: '#B3D4FF', border: '5px solid black', boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)' }}>
                <div className="text-4xl mb-3">👥</div>
                <h4 className="font-black text-xl mb-2" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                  For Everyone
                </h4>
                <p className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                  All ages welcome!
                </p>
              </div>
              <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: '#FFB3D9', border: '5px solid black', boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)' }}>
                <div className="text-4xl mb-3">📸</div>
                <h4 className="font-black text-xl mb-2" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                  Easy Upload
                </h4>
                <p className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                  Photo, drawing, or digital
                </p>
              </div>
              <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: '#A8E6CF', border: '5px solid black', boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)' }}>
                <div className="text-4xl mb-3">💰</div>
                <h4 className="font-black text-xl mb-2" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                  $1024 Prize
                </h4>
                <p className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                  Cash or any wish!
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 mb-8" style={{ border: '5px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
              <p className="text-xl sm:text-2xl font-black text-center" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                Grand Prize: $1024 cash OR any wish AOMIGO will grant up to $1024!
              </p>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden mb-6" style={{ border: '6px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
              <button
                onClick={() => setShowRules(!showRules)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl sm:text-2xl font-black" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                  Contest Rules
                </span>
                <ChevronDown className={`w-6 h-6 transition-transform ${showRules ? 'rotate-180' : ''}`} />
              </button>

              {showRules && (
                <div className="px-6 pb-6 border-t-4 border-black">
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">✅</span>
                      <span className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                        Use letters A, O, M, I, G, O as shapes
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">✅</span>
                      <span className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                        Submit through your AOMIGO account portal
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">✅</span>
                      <span className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                        Accepts: images, photos, PDF, Word docs
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">✅</span>
                      <span className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                        Take photo/screenshot in portal
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">✅</span>
                      <span className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                        Posts appear in forum for likes/comments
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">📅</span>
                      <span className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                        Deadline: Nov 30, 11:59 PM
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">🏆</span>
                      <span className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                        Winner announced: Dec 14, 11:59 PM
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">🎁</span>
                      <span className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                        Prizes: Grand Prize $1024, Funniest, Most Creative, Rainbow Colors, Youngest Artist awards
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 text-center" style={{ border: '6px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
              <h3 className="text-2xl sm:text-3xl font-black mb-4" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                ⏰ Contest Ends In:
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#FF9A56', border: '4px solid black' }}>
                  <div className="text-4xl font-black text-white" style={{ lineHeight: '1' }}>{timeLeft.days}</div>
                  <div className="text-sm font-black mt-2" style={{ color: '#2C3E50' }}>DAYS</div>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#B39DDB', border: '4px solid black' }}>
                  <div className="text-4xl font-black text-white" style={{ lineHeight: '1' }}>{timeLeft.hours}</div>
                  <div className="text-sm font-black mt-2" style={{ color: '#2C3E50' }}>HOURS</div>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFB3D9', border: '4px solid black' }}>
                  <div className="text-4xl font-black text-white" style={{ lineHeight: '1' }}>{timeLeft.minutes}</div>
                  <div className="text-sm font-black mt-2" style={{ color: '#2C3E50' }}>MIN</div>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#A8E6CF', border: '4px solid black' }}>
                  <div className="text-4xl font-black text-white" style={{ lineHeight: '1' }}>{timeLeft.seconds}</div>
                  <div className="text-sm font-black mt-2" style={{ color: '#2C3E50' }}>SEC</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="collab" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#B39DDB' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black text-center mb-12" style={{ color: 'white', lineHeight: '1.2' }}>
              👥 Investor & Collab Inquiry
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#B3D4FF', border: '4px solid black' }}>
                    <Users className="w-7 h-7" style={{ color: '#2C3E50' }} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                    Get In Touch
                  </h3>
                </div>

                {isInvestorSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#A8E6CF', border: '4px solid black' }}>
                      <Check className="w-12 h-12" style={{ color: '#2C3E50' }} />
                    </div>
                    <h4 className="text-2xl font-black mb-4" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                      Thank you!
                    </h4>
                    <p className="font-bold mb-6 text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                      We'll be in touch soon!
                    </p>
                    <button
                      onClick={() => setIsInvestorSubmitted(false)}
                      className="font-bold underline text-lg"
                      style={{ color: '#B39DDB' }}
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInvestorSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="text-left">
                        <label className="block font-black mb-2 text-lg" style={{ color: '#2C3E50' }}>
                          First Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={investorFormData.firstName}
                          onChange={(e) => setInvestorFormData({ ...investorFormData, firstName: e.target.value })}
                          placeholder="John"
                          className="w-full px-4 py-3 rounded-lg font-bold text-lg focus:outline-none focus:ring-4"
                          style={{ border: '4px solid black', backgroundColor: '#FFECB3', lineHeight: '1.6' }}
                          required
                        />
                      </div>

                      <div className="text-left">
                        <label className="block font-black mb-2 text-lg" style={{ color: '#2C3E50' }}>
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={investorFormData.lastName}
                          onChange={(e) => setInvestorFormData({ ...investorFormData, lastName: e.target.value })}
                          placeholder="Doe"
                          className="w-full px-4 py-3 rounded-lg font-bold text-lg focus:outline-none focus:ring-4"
                          style={{ border: '4px solid black', backgroundColor: '#FFECB3', lineHeight: '1.6' }}
                        />
                      </div>
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-2 text-lg" style={{ color: '#2C3E50' }}>
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        value={investorFormData.email}
                        onChange={(e) => setInvestorFormData({ ...investorFormData, email: e.target.value })}
                        placeholder="investor@example.com"
                        className="w-full px-4 py-3 rounded-lg font-bold text-lg focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FFECB3', lineHeight: '1.6' }}
                        required
                      />
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-2 text-lg" style={{ color: '#2C3E50' }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={investorFormData.phoneNumber}
                        onChange={(e) => setInvestorFormData({ ...investorFormData, phoneNumber: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 rounded-lg font-bold text-lg focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FFECB3', lineHeight: '1.6' }}
                      />
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-2 text-lg" style={{ color: '#2C3E50' }}>
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={investorFormData.linkedinUrl}
                        onChange={(e) => setInvestorFormData({ ...investorFormData, linkedinUrl: e.target.value })}
                        placeholder="linkedin.com/in/yourprofile"
                        className="w-full px-4 py-3 rounded-lg font-bold text-lg focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FFECB3', lineHeight: '1.6' }}
                      />
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-2 text-lg" style={{ color: '#2C3E50' }}>
                        Message
                      </label>
                      <textarea
                        value={investorFormData.message}
                        onChange={(e) => setInvestorFormData({ ...investorFormData, message: e.target.value })}
                        placeholder="Tell us about your interest..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg font-bold text-lg focus:outline-none focus:ring-4 resize-none"
                        style={{ border: '4px solid black', backgroundColor: '#FFECB3', lineHeight: '1.6' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isInvestorSubmitting}
                      className="w-full text-white px-8 py-3 rounded-xl font-black text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:translate-y-[-2px]"
                      style={{
                        backgroundColor: '#B39DDB',
                        border: '4px solid black',
                        boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                        lineHeight: '1.2',
                      }}
                    >
                      {isInvestorSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Inquiry
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="bg-white rounded-2xl p-8" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF9A56', border: '4px solid black' }}>
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                    Our Mission
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="p-5 rounded-xl" style={{ backgroundColor: '#FFECB3', border: '4px solid black' }}>
                    <h4 className="text-xl font-black mb-3 flex items-center gap-2" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                      <Users className="w-6 h-6" />
                      Community & Companion
                    </h4>
                    <p className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                      AOMIGO is a digital companion ecosystem that shadows verified users' real identity,
                      providing a friendly and safe community for everybody to connect.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl" style={{ backgroundColor: '#FFECB3', border: '4px solid black' }}>
                    <h4 className="text-xl font-black mb-3 flex items-center gap-2" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                      <Shield className="w-6 h-6" />
                      Connecting People
                    </h4>
                    <p className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                      Help people express their needs bravely and connect them with effective support timely.
                      Our digital companion's 24/7 presence is the backup plan after the encouraged real-life connections.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl" style={{ backgroundColor: '#FFECB3', border: '4px solid black' }}>
                    <h4 className="text-xl font-black mb-3 flex items-center gap-2" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                      <Sparkles className="w-6 h-6" />
                      Our Vision
                    </h4>
                    <p className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                      Building a lifestyle brand with IoT integration and enterprise solutions for educational
                      institutions as CRM and security systems.
                    </p>
                  </div>

                  <div className="text-center pt-4 border-t-4 border-black">
                    <p className="text-2xl font-black" style={{ color: '#FF9A56', lineHeight: '1.2' }}>
                      Together We Got This 🐾
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FFECB3' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-white px-8 py-4 rounded-full font-black text-2xl sm:text-3xl mb-6" style={{ border: '4px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)', lineHeight: '1.2' }}>
                ✨ Try AOMIGO Demo
              </div>
              <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                Experience AOMIGO Now
              </h2>
              <p className="text-xl sm:text-2xl font-black" style={{ color: '#FF9A56', lineHeight: '1.6' }}>
                See how your digital companion connects you with others!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
              <button
                onClick={() => toast.info('Individual demo coming soon!')}
                className="bg-white p-8 rounded-2xl font-black text-2xl transition-all hover:translate-y-[-4px] text-center"
                style={{
                  border: '6px solid black',
                  boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                  color: '#2C3E50',
                  lineHeight: '1.2',
                }}
              >
                <div className="text-5xl mb-4">🐼</div>
                <div className="mb-2">Try Individual Demo</div>
                <p className="text-lg font-bold" style={{ lineHeight: '1.6' }}>
                  Connect with community friends
                </p>
              </button>

              <button
                onClick={() => toast.info('Enterprise demo coming soon!')}
                className="bg-white p-8 rounded-2xl font-black text-2xl transition-all hover:translate-y-[-4px] text-center"
                style={{
                  border: '6px solid black',
                  boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                  color: '#2C3E50',
                  lineHeight: '1.2',
                }}
              >
                <div className="text-5xl mb-4">🏢</div>
                <div className="mb-2">Try Enterprise Demo</div>
                <p className="text-lg font-bold" style={{ lineHeight: '1.6' }}>
                  Organization management system
                </p>
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 sm:p-12 mb-12" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
              <h3 className="text-3xl sm:text-4xl font-black mb-8 text-center" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                🏢 Enterprise Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl" style={{ backgroundColor: '#B3D4FF', border: '4px solid black' }}>
                  <div className="text-3xl mb-3">🎨</div>
                  <h4 className="font-black text-xl mb-2" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                    Custom Branded Companions
                  </h4>
                  <p className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                    Digital companions customized for your organization
                  </p>
                </div>

                <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFB3D9', border: '4px solid black' }}>
                  <div className="text-3xl mb-3">🔗</div>
                  <h4 className="font-black text-xl mb-2" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                    CRM Integration
                  </h4>
                  <p className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                    Seamless integration for educational institutions
                  </p>
                </div>

                <div className="p-6 rounded-xl" style={{ backgroundColor: '#A8E6CF', border: '4px solid black' }}>
                  <div className="text-3xl mb-3">🛡️</div>
                  <h4 className="font-black text-xl mb-2" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                    Security & Safety
                  </h4>
                  <p className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                    Advanced security and community safety systems
                  </p>
                </div>

                <div className="p-6 rounded-xl" style={{ backgroundColor: '#B39DDB', border: '4px solid black' }}>
                  <div className="text-3xl mb-3">📊</div>
                  <h4 className="font-black text-xl mb-2 text-white" style={{ lineHeight: '1.2' }}>
                    Analytics Dashboard
                  </h4>
                  <p className="font-bold text-lg text-white" style={{ lineHeight: '1.6' }}>
                    Real-time community management and insights
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-8 text-center" style={{ border: '6px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
                <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#FF9A56', border: '4px solid black' }}>
                  <span className="text-5xl">🐼</span>
                </div>
                <h3 className="text-2xl font-black mb-4" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                  Your Companion
                </h3>
                <p className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                  A digital friend that keeps you company 24/7 and helps you connect with others
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8" style={{ border: '6px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">👥</span>
                  <h3 className="text-2xl font-black" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                    Connect
                  </h3>
                </div>
                <p className="font-bold text-lg mb-6" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                  Find community friends who share your interests
                </p>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: '#FFB3D9', border: '4px solid black' }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FF9A56', border: '3px solid black' }}>
                      <span className="text-2xl">🦊</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-black" style={{ color: '#2C3E50' }}>Mia's Fox</p>
                      <p className="text-sm font-bold" style={{ color: '#2C3E50', lineHeight: '1.6' }}>Community Member</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: '#B3D4FF', border: '4px solid black' }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#B39DDB', border: '3px solid black' }}>
                      <span className="text-2xl">🐼</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-black" style={{ color: '#2C3E50' }}>Jake's Panda</p>
                      <p className="text-sm font-bold" style={{ color: '#2C3E50', lineHeight: '1.6' }}>Community Member</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8" style={{ border: '6px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">💬</span>
                  <h3 className="text-2xl font-black" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
                    Support
                  </h3>
                </div>
                <p className="font-bold text-lg mb-6" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                  Express your needs and get timely support from the community
                </p>
                <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#A8E6CF', border: '4px solid black' }}>
                  <p className="text-sm font-bold italic" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                    "I'm looking for friends who love art!"
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFECB3', border: '4px solid black' }}>
                  <p className="text-sm font-black mb-2" style={{ color: '#2C3E50' }}>
                    🤝 Community responds:
                  </p>
                  <p className="text-sm font-bold" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
                    "Join our art club! We meet every week."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FF9A56', borderTop: '4px solid black' }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center" style={{ border: '3px solid black' }}>
              <span className="text-3xl">🐼</span>
            </div>
            <h3 className="text-3xl font-black" style={{ color: '#2C3E50' }}>AOMIGO</h3>
          </div>
          <p className="font-black mb-2 text-xl" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
            Your Digital Companion
          </p>
          <p className="font-bold text-lg" style={{ color: '#2C3E50', lineHeight: '1.6' }}>
            © 2025 AOMIGO. All rights reserved.
          </p>
          <p className="text-2xl font-black mt-4" style={{ color: '#2C3E50', lineHeight: '1.2' }}>
            Together We Got This 🐾
          </p>
        </div>
      </footer>
    </div>
  );
}
