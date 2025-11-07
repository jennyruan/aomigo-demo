import { useState, useEffect } from 'react';
import { Check, Mail, User, Users, Shield, Sparkles, ChevronRight, Phone, Linkedin, MessageSquare, ChevronDown, Menu, X, Eye, EyeOff, Heart, BookOpen } from 'lucide-react';
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

  const animalNames: Record<string, string> = {
    panda: 'PANDA',
    fox: 'FOX',
    cat: 'CAT',
    dog: 'DOG',
    rabbit: 'RABBIT',
    bear: 'BEAR',
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
      toast.error('Please fill in required fields');
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

  const LogoComponent = () => (
    <div className="flex flex-col items-center justify-center" style={{ position: 'relative' }}>
      <svg width="120" height="140" viewBox="0 0 120 140" style={{ display: 'block' }}>
        <text x="10" y="30" style={{ fontSize: '32px', fontWeight: '900', fill: '#2C3E50', fontFamily: 'Inter' }}>A</text>
        <text x="40" y="50" style={{ fontSize: '32px', fontWeight: '900', fill: '#2C3E50', fontFamily: 'Inter' }}>O</text>
        <text x="70" y="70" style={{ fontSize: '32px', fontWeight: '900', fill: '#2C3E50', fontFamily: 'Inter' }}>M</text>
        <text x="50" y="90" style={{ fontSize: '32px', fontWeight: '900', fill: '#2C3E50', fontFamily: 'Inter' }}>I</text>
        <text x="30" y="110" style={{ fontSize: '32px', fontWeight: '900', fill: '#2C3E50', fontFamily: 'Inter' }}>G</text>
        <text x="60" y="130" style={{ fontSize: '32px', fontWeight: '900', fill: '#2C3E50', fontFamily: 'Inter' }}>O</text>
        <ellipse cx="55" cy="130" rx="8" ry="8" fill="#FF6B35" />
      </svg>
      <div className="text-xl font-black mt-2" style={{ color: '#2C3E50' }}>AOMIGO</div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FED766' }} data-version="orange-yellow-theme-v2">
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#FF6B35', borderBottom: '4px solid black' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-black" style={{ color: '#2C3E50' }}>AOMIGO</div>
            </div>

            <nav className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => scrollToSection('events')}
                className="px-4 py-2 font-bold text-base rounded-lg transition-all hover:bg-white hover:bg-opacity-20"
                style={{ color: activeSection === 'events' ? '#2C3E50' : 'white' }}
              >
                Events
              </button>
              <span className="text-white font-bold">|</span>
              <button
                onClick={() => scrollToSection('collab')}
                className="px-4 py-2 font-bold text-base rounded-lg transition-all hover:bg-white hover:bg-opacity-20"
                style={{ color: activeSection === 'collab' ? '#2C3E50' : 'white' }}
              >
                Investor & Collab
              </button>
              <span className="text-white font-bold">|</span>
              <button
                onClick={() => scrollToSection('demo')}
                className="px-4 py-2 font-bold text-base rounded-lg transition-all hover:bg-white hover:bg-opacity-20"
                style={{ color: activeSection === 'demo' ? '#2C3E50' : 'white' }}
              >
                Demo
              </button>
              <span className="text-white font-bold">|</span>
              <button
                onClick={() => scrollToSection('story')}
                className="px-4 py-2 font-bold text-base rounded-lg transition-all hover:bg-white hover:bg-opacity-20"
                style={{ color: activeSection === 'story' ? '#2C3E50' : 'white' }}
              >
                Story
              </button>
              <span className="text-white font-bold">|</span>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 font-bold text-base bg-white rounded-lg transition-all hover:bg-opacity-90"
                style={{ border: '3px solid black', boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)', color: '#2C3E50' }}
              >
                Sign In/Up
              </button>
            </nav>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg bg-white"
              style={{ border: '3px solid black' }}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {showMobileMenu && (
            <nav className="lg:hidden py-4 border-t-4 border-black">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => scrollToSection('events')}
                  className="px-4 py-3 font-bold text-lg text-left bg-white rounded-lg"
                  style={{ border: '3px solid black' }}
                >
                  Events
                </button>
                <button
                  onClick={() => scrollToSection('collab')}
                  className="px-4 py-3 font-bold text-lg text-left bg-white rounded-lg"
                  style={{ border: '3px solid black' }}
                >
                  Investor & Collab
                </button>
                <button
                  onClick={() => scrollToSection('demo')}
                  className="px-4 py-3 font-bold text-lg text-left bg-white rounded-lg"
                  style={{ border: '3px solid black' }}
                >
                  Demo
                </button>
                <button
                  onClick={() => scrollToSection('story')}
                  className="px-4 py-3 font-bold text-lg text-left bg-white rounded-lg"
                  style={{ border: '3px solid black' }}
                >
                  Story
                </button>
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="px-4 py-3 font-bold text-lg text-left bg-white rounded-lg"
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

              <form onSubmit={handleAuthSubmit} className="space-y-5">
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
                        className="w-full px-4 py-4 rounded-lg text-lg font-semibold focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FED766' }}
                        required
                      />
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-2 text-lg" style={{ color: '#2C3E50' }}>
                        Organization (Optional)
                      </label>
                      <input
                        type="text"
                        value={authFormData.organizationName}
                        onChange={(e) => setAuthFormData({ ...authFormData, organizationName: e.target.value })}
                        placeholder="Your organization"
                        className="w-full px-4 py-4 rounded-lg text-lg font-semibold focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FED766' }}
                      />
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-3 text-lg" style={{ color: '#2C3E50' }}>
                        Choose Your Companion
                      </label>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-28 h-28 rounded-full flex flex-col items-center justify-center" style={{ backgroundColor: '#FFB3D9', border: '4px solid black' }}>
                          <div className="text-4xl mb-1">{animalNames[avatarConfig.animal].charAt(0)}</div>
                          <div className="text-xs font-bold" style={{ color: '#2C3E50' }}>{animalNames[avatarConfig.animal]}</div>
                        </div>
                        <button
                          type="button"
                          onClick={randomizeAvatar}
                          className="px-5 py-3 font-black rounded-lg text-white text-base"
                          style={{ backgroundColor: '#FF6B35', border: '3px solid black', boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
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
                            className={`p-4 rounded-lg font-bold ${
                              avatarConfig.animal === animal ? 'ring-4 ring-offset-2' : ''
                            }`}
                            style={{
                              backgroundColor: avatarConfig.animal === animal ? '#A8E6CF' : '#FFB3D9',
                              border: '3px solid black',
                            }}
                          >
                            <div className="text-sm">{animalNames[animal]}</div>
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
                    className="w-full px-4 py-4 rounded-lg text-lg font-semibold focus:outline-none focus:ring-4"
                    style={{ border: '4px solid black', backgroundColor: '#FED766' }}
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
                      placeholder="Enter password"
                      className="w-full px-4 py-4 rounded-lg text-lg font-semibold focus:outline-none focus:ring-4 pr-12"
                      style={{ border: '4px solid black', backgroundColor: '#FED766' }}
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
                        placeholder="Confirm password"
                        className="w-full px-4 py-4 rounded-lg text-lg font-semibold focus:outline-none focus:ring-4 pr-12"
                        style={{ border: '4px solid black', backgroundColor: '#FED766' }}
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
                    backgroundColor: '#FF6B35',
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
              </form>
            </div>
          </div>
        </div>
      )}

      <main>
        <section id="events" className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FED766' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-5xl sm:text-6xl font-black mb-6" style={{ color: '#2C3E50' }}>
                Make our logo and win $1024!
              </h2>
              <p className="text-3xl sm:text-4xl font-black mb-4" style={{ color: '#FF6B35' }}>
                Turn A-O-M-I-G-O into our new logo!
              </p>
              <p className="text-2xl font-black mb-8" style={{ color: '#2C3E50' }}>
                Why $1024? Because 10/24 is AOMIGO's birthday!
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 sm:p-10 mb-10 max-w-2xl mx-auto" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
              {isContestSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#A8E6CF', border: '4px solid black' }}>
                    <Check className="w-16 h-16" style={{ color: '#2C3E50' }} />
                  </div>
                  <h3 className="text-3xl font-black mb-4" style={{ color: '#2C3E50' }}>
                    You're in the contest!
                  </h3>
                  <p className="text-xl font-semibold mb-6" style={{ color: '#2C3E50' }}>
                    Check your email for submission details!
                  </p>
                  <button
                    onClick={() => setIsContestSubmitted(false)}
                    className="font-bold underline text-xl"
                    style={{ color: '#FF6B35' }}
                  >
                    Add another entry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContestSubmit} className="space-y-6">
                  <div className="text-left">
                    <label className="block font-black mb-3 text-xl" style={{ color: '#2C3E50' }}>
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={contestFormData.name}
                      onChange={(e) => setContestFormData({ ...contestFormData, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-5 py-4 rounded-lg text-xl font-semibold focus:outline-none focus:ring-4"
                      style={{ border: '4px solid black', backgroundColor: '#FED766' }}
                      required
                    />
                  </div>

                  <div className="text-left">
                    <label className="block font-black mb-3 text-xl" style={{ color: '#2C3E50' }}>
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={contestFormData.email}
                      onChange={(e) => setContestFormData({ ...contestFormData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-5 py-4 rounded-lg text-xl font-semibold focus:outline-none focus:ring-4"
                      style={{ border: '4px solid black', backgroundColor: '#FED766' }}
                      required
                    />
                  </div>

                  <div className="text-left">
                    <label className="block font-black mb-3 text-xl" style={{ color: '#2C3E50' }}>
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={contestFormData.phoneNumber}
                      onChange={(e) => setContestFormData({ ...contestFormData, phoneNumber: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-5 py-4 rounded-lg text-xl font-semibold focus:outline-none focus:ring-4"
                      style={{ border: '4px solid black', backgroundColor: '#FED766' }}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 text-left p-5 rounded-lg" style={{ backgroundColor: '#FFB3D9', border: '4px solid black' }}>
                      <input
                        type="checkbox"
                        id="isParent"
                        checked={contestFormData.isParent}
                        onChange={(e) => setContestFormData({ ...contestFormData, isParent: e.target.checked })}
                        className="w-6 h-6 mt-1 rounded cursor-pointer flex-shrink-0"
                        style={{ border: '3px solid black' }}
                      />
                      <label htmlFor="isParent" className="font-bold cursor-pointer text-lg" style={{ color: '#2C3E50' }}>
                        I'm a parent interested in AOMIGO for my child
                      </label>
                    </div>

                    <div className="flex items-start gap-4 text-left p-5 rounded-lg" style={{ backgroundColor: '#B3D4FF', border: '4px solid black' }}>
                      <input
                        type="checkbox"
                        id="isOrganization"
                        checked={contestFormData.isOrganization}
                        onChange={(e) => setContestFormData({ ...contestFormData, isOrganization: e.target.checked })}
                        className="w-6 h-6 mt-1 rounded cursor-pointer flex-shrink-0"
                        style={{ border: '3px solid black' }}
                      />
                      <label htmlFor="isOrganization" className="font-bold cursor-pointer text-lg" style={{ color: '#2C3E50' }}>
                        I'm interested in AOMIGO for my organization
                      </label>
                    </div>

                    <div className="flex items-start gap-4 text-left p-5 rounded-lg" style={{ backgroundColor: '#A8E6CF', border: '4px solid black' }}>
                      <input
                        type="checkbox"
                        id="wantsMoreEvents"
                        checked={contestFormData.wantsMoreEvents}
                        onChange={(e) => setContestFormData({ ...contestFormData, wantsMoreEvents: e.target.checked })}
                        className="w-6 h-6 mt-1 rounded cursor-pointer flex-shrink-0"
                        style={{ border: '3px solid black' }}
                      />
                      <label htmlFor="wantsMoreEvents" className="font-bold cursor-pointer text-lg" style={{ color: '#2C3E50' }}>
                        I want to participate in more events like this!
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isContestSubmitting}
                    className="w-full text-white px-8 py-5 rounded-xl font-black text-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:translate-y-[-2px]"
                    style={{
                      backgroundColor: '#FF6B35',
                      border: '4px solid black',
                      boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                    }}
                  >
                    {isContestSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
                        Joining...
                      </>
                    ) : (
                      <>
                        Sign Up & Join Contest
                        <ChevronRight className="w-7 h-7" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="p-8 rounded-2xl text-center" style={{ backgroundColor: '#B3D4FF', border: '5px solid black', boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)' }}>
                <div className="text-5xl mb-4">+</div>
                <h4 className="font-black text-2xl mb-3" style={{ color: '#2C3E50' }}>
                  For Everyone
                </h4>
                <p className="font-semibold text-lg" style={{ color: '#2C3E50' }}>
                  All ages welcome!
                </p>
              </div>
              <div className="p-8 rounded-2xl text-center" style={{ backgroundColor: '#FFB3D9', border: '5px solid black', boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)' }}>
                <div className="text-5xl mb-4">^</div>
                <h4 className="font-black text-2xl mb-3" style={{ color: '#2C3E50' }}>
                  Easy Upload
                </h4>
                <p className="font-semibold text-lg" style={{ color: '#2C3E50' }}>
                  Photo, drawing, or digital
                </p>
              </div>
              <div className="p-8 rounded-2xl text-center" style={{ backgroundColor: '#A8E6CF', border: '5px solid black', boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)' }}>
                <div className="text-5xl mb-4">$</div>
                <h4 className="font-black text-2xl mb-3" style={{ color: '#2C3E50' }}>
                  $1024 Prize
                </h4>
                <p className="font-semibold text-lg" style={{ color: '#2C3E50' }}>
                  Cash or your choice!
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden mb-8" style={{ border: '6px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
              <button
                onClick={() => setShowRules(!showRules)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl font-black" style={{ color: '#2C3E50' }}>
                  Contest Rules
                </span>
                <ChevronDown className={`w-7 h-7 transition-transform ${showRules ? 'rotate-180' : ''}`} />
              </button>

              {showRules && (
                <div className="px-6 pb-6 border-t-4 border-black">
                  <ul className="space-y-4 mt-6">
                    <li className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0">+</span>
                      <span className="font-semibold text-lg" style={{ color: '#2C3E50' }}>
                        Use letters A, O, M, I, G, O as shapes
                      </span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0">+</span>
                      <span className="font-semibold text-lg" style={{ color: '#2C3E50' }}>
                        Submit through your AOMIGO account portal
                      </span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0">+</span>
                      <span className="font-semibold text-lg" style={{ color: '#2C3E50' }}>
                        Accepts: images, photos, PDF, Word docs
                      </span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0">+</span>
                      <span className="font-semibold text-lg" style={{ color: '#2C3E50' }}>
                        Posts appear in forum for likes and comments
                      </span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0">-</span>
                      <span className="font-semibold text-lg" style={{ color: '#2C3E50' }}>
                        Deadline: Nov 30, 11:59 PM
                      </span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0">*</span>
                      <span className="font-semibold text-lg" style={{ color: '#2C3E50' }}>
                        Winner announced: Dec 14, 11:59 PM
                      </span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0">^</span>
                      <span className="font-semibold text-lg" style={{ color: '#2C3E50' }}>
                        Prizes: Grand Prize $1024, Funniest, Most Creative, Rainbow Colors, Youngest Artist awards
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-8 text-center" style={{ border: '6px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
              <h3 className="text-3xl font-black mb-6" style={{ color: '#2C3E50' }}>
                Contest Ends In:
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-6 rounded-xl" style={{ backgroundColor: '#FF6B35', border: '4px solid black' }}>
                  <div className="text-5xl font-black text-white mb-2">{timeLeft.days}</div>
                  <div className="text-base font-black" style={{ color: '#2C3E50' }}>DAYS</div>
                </div>
                <div className="p-6 rounded-xl" style={{ backgroundColor: '#B39DDB', border: '4px solid black' }}>
                  <div className="text-5xl font-black text-white mb-2">{timeLeft.hours}</div>
                  <div className="text-base font-black" style={{ color: '#2C3E50' }}>HOURS</div>
                </div>
                <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFB3D9', border: '4px solid black' }}>
                  <div className="text-5xl font-black text-white mb-2">{timeLeft.minutes}</div>
                  <div className="text-base font-black" style={{ color: '#2C3E50' }}>MIN</div>
                </div>
                <div className="p-6 rounded-xl" style={{ backgroundColor: '#A8E6CF', border: '4px solid black' }}>
                  <div className="text-5xl font-black text-white mb-2">{timeLeft.seconds}</div>
                  <div className="text-base font-black" style={{ color: '#2C3E50' }}>SEC</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="collab" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#B39DDB' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl sm:text-6xl font-black text-center mb-16" style={{ color: 'white' }}>
              Investor & Collab Inquiry
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white rounded-2xl p-10" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#B3D4FF', border: '4px solid black' }}>
                    <Users className="w-8 h-8" style={{ color: '#2C3E50' }} />
                  </div>
                  <h3 className="text-3xl font-black" style={{ color: '#2C3E50' }}>
                    Get In Touch
                  </h3>
                </div>

                {isInvestorSubmitted ? (
                  <div className="text-center py-10">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#A8E6CF', border: '4px solid black' }}>
                      <Check className="w-14 h-14" style={{ color: '#2C3E50' }} />
                    </div>
                    <h4 className="text-3xl font-black mb-4" style={{ color: '#2C3E50' }}>
                      Thank you!
                    </h4>
                    <p className="font-semibold mb-6 text-xl" style={{ color: '#2C3E50' }}>
                      We'll be in touch soon!
                    </p>
                    <button
                      onClick={() => setIsInvestorSubmitted(false)}
                      className="font-bold underline text-xl"
                      style={{ color: '#B39DDB' }}
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInvestorSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="text-left">
                        <label className="block font-black mb-2 text-xl" style={{ color: '#2C3E50' }}>
                          First Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={investorFormData.firstName}
                          onChange={(e) => setInvestorFormData({ ...investorFormData, firstName: e.target.value })}
                          placeholder="John"
                          className="w-full px-4 py-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-4"
                          style={{ border: '4px solid black', backgroundColor: '#FED766' }}
                          required
                        />
                      </div>

                      <div className="text-left">
                        <label className="block font-black mb-2 text-xl" style={{ color: '#2C3E50' }}>
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={investorFormData.lastName}
                          onChange={(e) => setInvestorFormData({ ...investorFormData, lastName: e.target.value })}
                          placeholder="Doe"
                          className="w-full px-4 py-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-4"
                          style={{ border: '4px solid black', backgroundColor: '#FED766' }}
                        />
                      </div>
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-2 text-xl" style={{ color: '#2C3E50' }}>
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        value={investorFormData.email}
                        onChange={(e) => setInvestorFormData({ ...investorFormData, email: e.target.value })}
                        placeholder="investor@example.com"
                        className="w-full px-4 py-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FED766' }}
                        required
                      />
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-2 text-xl" style={{ color: '#2C3E50' }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={investorFormData.phoneNumber}
                        onChange={(e) => setInvestorFormData({ ...investorFormData, phoneNumber: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FED766' }}
                      />
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-2 text-xl" style={{ color: '#2C3E50' }}>
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={investorFormData.linkedinUrl}
                        onChange={(e) => setInvestorFormData({ ...investorFormData, linkedinUrl: e.target.value })}
                        placeholder="linkedin.com/in/yourprofile"
                        className="w-full px-4 py-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FED766' }}
                      />
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-2 text-xl" style={{ color: '#2C3E50' }}>
                        Message
                      </label>
                      <textarea
                        value={investorFormData.message}
                        onChange={(e) => setInvestorFormData({ ...investorFormData, message: e.target.value })}
                        placeholder="Tell us about your interest..."
                        rows={4}
                        className="w-full px-4 py-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-4 resize-none"
                        style={{ border: '4px solid black', backgroundColor: '#FED766' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isInvestorSubmitting}
                      className="w-full text-white px-8 py-4 rounded-xl font-black text-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:translate-y-[-2px]"
                      style={{
                        backgroundColor: '#B39DDB',
                        border: '4px solid black',
                        boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                      }}
                    >
                      {isInvestorSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Inquiry
                          <ChevronRight className="w-6 h-6" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="bg-white rounded-2xl p-10" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF6B35', border: '4px solid black' }}>
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-black" style={{ color: '#2C3E50' }}>
                    Our Mission
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-xl" style={{ backgroundColor: '#FED766', border: '4px solid black' }}>
                    <h4 className="text-2xl font-black mb-4 flex items-center gap-3" style={{ color: '#2C3E50' }}>
                      <Users className="w-7 h-7" />
                      Community & Companion
                    </h4>
                    <p className="font-semibold text-lg leading-relaxed" style={{ color: '#2C3E50' }}>
                      AOMIGO is a digital companion ecosystem that shadows verified users' real identity,
                      providing a friendly and safe community for everybody to connect.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl" style={{ backgroundColor: '#FED766', border: '4px solid black' }}>
                    <h4 className="text-2xl font-black mb-4 flex items-center gap-3" style={{ color: '#2C3E50' }}>
                      <Shield className="w-7 h-7" />
                      Connecting People
                    </h4>
                    <p className="font-semibold text-lg leading-relaxed" style={{ color: '#2C3E50' }}>
                      Help people express their needs bravely and connect them with effective support timely.
                      Our digital companion's 24/7 presence is the backup plan after the encouraged real-life connections.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl" style={{ backgroundColor: '#FED766', border: '4px solid black' }}>
                    <h4 className="text-2xl font-black mb-4 flex items-center gap-3" style={{ color: '#2C3E50' }}>
                      <Sparkles className="w-7 h-7" />
                      Our Vision
                    </h4>
                    <p className="font-semibold text-lg leading-relaxed" style={{ color: '#2C3E50' }}>
                      Building a lifestyle brand with IoT integration and enterprise solutions for educational
                      institutions as CRM and security systems.
                    </p>
                  </div>

                  <div className="text-center pt-4 border-t-4 border-black">
                    <p className="text-2xl font-black" style={{ color: '#FF6B35' }}>
                      We Empower People
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FED766' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-5xl sm:text-6xl font-black mb-6" style={{ color: '#2C3E50' }}>
                Experience AOMIGO Now
              </h2>
              <p className="text-2xl font-black mb-10" style={{ color: '#FF6B35' }}>
                See how your digital companion connects you with others!
              </p>

              <button
                onClick={() => toast.info('Demo coming soon!')}
                className="bg-white px-16 py-6 rounded-full font-black text-3xl transition-all hover:translate-y-[-4px] inline-block"
                style={{
                  border: '6px solid black',
                  boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                  color: '#2C3E50',
                }}
              >
                Try AOMIGO Demo
              </button>
            </div>
          </div>
        </section>

        <section id="story" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FFB3D9' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-5xl sm:text-6xl font-black mb-6" style={{ color: '#2C3E50' }}>
                Meet Our Founders
              </h2>
              <p className="text-2xl font-black" style={{ color: '#2C3E50' }}>
                The hearts behind AOMIGO
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white rounded-2xl p-10" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 text-4xl font-black" style={{ backgroundColor: '#FF6B35', border: '4px solid black', color: 'white' }}>
                    J
                  </div>
                  <div>
                    <h3 className="text-4xl font-black mb-2" style={{ color: '#2C3E50' }}>
                      Jenny
                    </h3>
                    <p className="text-xl font-bold" style={{ color: '#FF6B35' }}>
                      Co-Founder
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xl font-semibold leading-relaxed" style={{ color: '#2C3E50' }}>
                    Growing up, I experienced firsthand the power of having someone who truly listens. As an educator and technologist, I witnessed countless students struggle not because they lacked ability, but because they lacked support and connection.
                  </p>
                  <p className="text-xl font-semibold leading-relaxed" style={{ color: '#2C3E50' }}>
                    AOMIGO was born from a simple belief: everyone deserves a companion who's always there, who understands them, and who helps them find their community. Technology should bring us together, not isolate us further.
                  </p>
                  <p className="text-xl font-semibold leading-relaxed" style={{ color: '#2C3E50' }}>
                    Through AOMIGO, we're building bridges between people, creating safe spaces for authentic expression, and empowering individuals to reach out for the support they need.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-10" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 text-4xl font-black" style={{ backgroundColor: '#B39DDB', border: '4px solid black', color: 'white' }}>
                    J
                  </div>
                  <div>
                    <h3 className="text-4xl font-black mb-2" style={{ color: '#2C3E50' }}>
                      Jessi
                    </h3>
                    <p className="text-xl font-bold" style={{ color: '#B39DDB' }}>
                      Co-Founder
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xl font-semibold leading-relaxed" style={{ color: '#2C3E50' }}>
                    My journey in community building and mental health advocacy showed me that many people suffer in silence, not because help isn't available, but because taking that first step feels overwhelming.
                  </p>
                  <p className="text-xl font-semibold leading-relaxed" style={{ color: '#2C3E50' }}>
                    With AOMIGO, we're creating a gentle introduction to connection. Your digital companion is always ready to listen, never judges, and helps you build the confidence to reach out to real people when you're ready.
                  </p>
                  <p className="text-xl font-semibold leading-relaxed" style={{ color: '#2C3E50' }}>
                    We're not replacing human connection—we're facilitating it. We're giving people the courage to be vulnerable, the platform to express themselves, and the community to support them.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-white rounded-2xl p-10 text-center" style={{ border: '6px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
              <Heart className="w-16 h-16 mx-auto mb-6" style={{ color: '#FF6B35' }} />
              <h3 className="text-4xl font-black mb-4" style={{ color: '#2C3E50' }}>
                Join Our Journey
              </h3>
              <p className="text-2xl font-semibold leading-relaxed mb-6" style={{ color: '#2C3E50' }}>
                We're building AOMIGO with love, care, and a deep commitment to empowering people everywhere. Whether you're a user, investor, or partner, you're part of this movement.
              </p>
              <p className="text-3xl font-black" style={{ color: '#FF6B35' }}>
                We Empower People
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FF6B35', borderTop: '4px solid black' }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-3xl font-black mb-4" style={{ color: 'white' }}>AOMIGO</div>
          <p className="font-black mb-3 text-2xl" style={{ color: 'white' }}>
            Your Digital Companion
          </p>
          <p className="font-semibold text-lg" style={{ color: 'white' }}>
            2025 AOMIGO. All rights reserved.
          </p>
          <p className="text-2xl font-black mt-6" style={{ color: 'white' }}>
            We Empower People
          </p>
        </div>
      </footer>
    </div>
  );
}
