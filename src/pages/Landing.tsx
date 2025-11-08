import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Users, Shield, Sparkles, ChevronRight, Menu, X, Eye, EyeOff, Volume2, Pause, Linkedin, Instagram, Star, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '../lib/api/client';
import { useStore } from '../hooks/useStore';
import { signIn as firebaseSignIn, signUp as firebaseSignUp } from '../lib/firebase';

interface AvatarConfig {
  animal: string;
  eyes: string;
  ears: string;
  mouth: string;
  pattern: string;
}

type InvestorInquiryType = 'Investor' | 'Collab' | 'Group' | 'Consumer' | 'Other';

interface ContestFormState {
  name: string;
  email: string;
  phoneNumber: string;
  isParent: boolean;
  isOrganization: boolean;
  wantsMoreEvents: boolean;
}

interface AuthFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationName: string;
  rememberMe: boolean;
}

interface InvestorFormState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  linkedinUrl: string;
  message: string;
  inquiryType: InvestorInquiryType;
  customInquiryType: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialContestForm: ContestFormState = {
  name: '',
  email: '',
  phoneNumber: '',
  isParent: false,
  isOrganization: false,
  wantsMoreEvents: true,
};

const initialAuthForm: AuthFormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  organizationName: '',
  rememberMe: false,
};

const initialInvestorForm: InvestorFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  linkedinUrl: '',
  message: '',
  inquiryType: 'Investor',
  customInquiryType: '',
};

export function Landing() {
  const [activeSection, setActiveSection] = useState('events');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [jennyAudioPlaying, setJennyAudioPlaying] = useState(false);
  const [contestFormData, setContestFormData] = useState<ContestFormState>(initialContestForm);
  const [authFormData, setAuthFormData] = useState<AuthFormState>(initialAuthForm);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    animal: 'panda',
    eyes: 'normal',
    ears: 'normal',
    mouth: 'smile',
    pattern: 'solid',
  });

  const [investorFormData, setInvestorFormData] = useState<InvestorFormState>(initialInvestorForm);

  const [isContestSubmitting, setIsContestSubmitting] = useState(false);
  const [isContestSubmitted, setIsContestSubmitted] = useState(false);
  const [isInvestorSubmitting, setIsInvestorSubmitting] = useState(false);
  const [isInvestorSubmitted, setIsInvestorSubmitted] = useState(false);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const { createProfile, syncSession } = useStore();
  const navigate = useNavigate();

  const handleContestChange = useCallback(<T extends keyof ContestFormState>(field: T, value: ContestFormState[T]) => {
    setContestFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetContestForm = useCallback(() => {
    setContestFormData({ ...initialContestForm });
  }, []);

  const handleAuthChange = useCallback(<T extends keyof AuthFormState>(field: T, value: AuthFormState[T]) => {
    setAuthFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetAuthForm = useCallback(() => {
    setAuthFormData({ ...initialAuthForm });
  }, []);

  const handleInvestorChange = useCallback(<T extends keyof InvestorFormState>(field: T, value: InvestorFormState[T]) => {
    setInvestorFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetInvestorForm = useCallback(() => {
    setInvestorFormData({ ...initialInvestorForm });
  }, []);

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

    if (!EMAIL_REGEX.test(contestFormData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsContestSubmitting(true);

    try {
      await apiClient.request('/api/v1/waitlist', {
        method: 'POST',
        body: {
          first_name: contestFormData.name.trim(),
          email: contestFormData.email.trim().toLowerCase(),
          phone_number: contestFormData.phoneNumber.trim() || null,
          is_parent_demo_user: contestFormData.isParent,
          is_organization_user: contestFormData.isOrganization,
          wants_more_events: contestFormData.wantsMoreEvents,
          user_type: 'demo',
        },
      });

      setIsContestSubmitted(true);
      toast.success('Successfully joined the contest!');
      resetContestForm();
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

    if (!EMAIL_REGEX.test(investorFormData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsInvestorSubmitting(true);

    try {
      await apiClient.request('/api/v1/waitlist', {
        method: 'POST',
        body: {
          first_name: investorFormData.firstName.trim(),
          last_name: investorFormData.lastName.trim() || null,
          email: investorFormData.email.trim().toLowerCase(),
          phone_number: investorFormData.phoneNumber.trim() || null,
          linkedin_url: investorFormData.linkedinUrl.trim() || null,
          message: investorFormData.message.trim() || null,
          user_type: 'investor',
          inquiry_type:
            investorFormData.inquiryType === 'Other'
              ? investorFormData.customInquiryType.trim() || 'Other'
              : investorFormData.inquiryType,
        },
      });

      setIsInvestorSubmitted(true);
      toast.success('Thank you for your interest! We will be in touch soon.');
      resetInvestorForm();
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

    if (!EMAIL_REGEX.test(authFormData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsAuthSubmitting(true);

    try {
      if (authMode === 'signup') {
        const email = authFormData.email.trim().toLowerCase();
        await firebaseSignUp(email, authFormData.password);
        await syncSession();

        const avatarPayload: Record<string, unknown> = { ...avatarConfig };

        await createProfile({
          display_name: authFormData.name.trim(),
          organization_name: authFormData.organizationName.trim() || null,
          avatar_config: avatarPayload,
        });

        // ensure store/session reflects new profile, then navigate home
        await syncSession();
        toast.success('Account created successfully!');
        resetAuthForm();
        setShowAuthModal(false);
  navigate('/home');
      } else {
        const email = authFormData.email.trim().toLowerCase();
        await firebaseSignIn(email, authFormData.password);
        await syncSession();
        toast.success('Signed in successfully!');
        // after sign-in, ensure profile loaded and navigate home
  navigate('/home');
      }

      setShowAuthModal(false);
      resetAuthForm();
    } catch (error: any) {
      console.error('Auth error:', error);
      let errorMessage = 'Authentication failed. Please try again.';

      if (error && typeof error === 'object') {
        if ('code' in error && typeof error.code === 'string') {
          switch (error.code) {
            case 'auth/email-already-in-use':
              errorMessage = 'This email is already registered.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Invalid email address provided.';
              break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              errorMessage = 'Incorrect email or password.';
              break;
            case 'auth/weak-password':
              errorMessage = 'Password should be at least 6 characters.';
              break;
            default:
              errorMessage = 'Authentication failed. Please try again.';
          }
        } else if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsAuthSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FADF0B' }} data-version="colorful-blocks-v3">
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#F26523', borderBottom: '4px solid black' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img
                src="/aomigo-logo-yellow.png"
                alt="AOMIGO Logo"
                className="h-12 w-12"
              />
              <div className="text-2xl font-black" style={{ color: 'white' }}>AOMIGO</div>
            </div>

            <nav className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => scrollToSection('events')}
                className="px-3 py-2 font-bold text-sm rounded-lg transition-all hover:bg-white hover:bg-opacity-20 whitespace-nowrap"
                style={{ color: activeSection === 'events' ? 'black' : 'white', textShadow: '2px 4px 4px rgba(255,255,255,0.5)', backgroundColor: activeSection === 'events' ? '#B4FF39' : 'transparent' }}
              >
                EVENTS
              </button>
              <span className="text-white font-bold" style={{ textShadow: '2px 4px 4px rgba(255,255,255,0.5)' }}>|</span>
              <button
                onClick={() => scrollToSection('collab')}
                className="px-3 py-2 font-bold text-sm rounded-lg transition-all hover:bg-white hover:bg-opacity-20 whitespace-nowrap"
                style={{ color: activeSection === 'collab' ? 'black' : 'white', textShadow: '2px 4px 4px rgba(255,255,255,0.5)', backgroundColor: activeSection === 'collab' ? '#B4FF39' : 'transparent' }}
              >
                VIBE CHECK
              </button>
              <span className="text-white font-bold" style={{ textShadow: '2px 4px 4px rgba(255,255,255,0.5)' }}>|</span>
              <button
                onClick={() => scrollToSection('story')}
                className="px-3 py-2 font-bold text-sm rounded-lg transition-all hover:bg-white hover:bg-opacity-20 whitespace-nowrap"
                style={{ color: activeSection === 'story' ? 'black' : 'white', textShadow: '2px 4px 4px rgba(255,255,255,0.5)', backgroundColor: activeSection === 'story' ? '#B4FF39' : 'transparent' }}
              >
                STORY
              </button>
              <span className="text-white font-bold">|</span>
              <a
                href="https://demo.aomigo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 font-bold text-sm rounded-lg transition-all hover:bg-opacity-90 whitespace-nowrap"
                style={{ border: '3px solid black', boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)', color: 'black', backgroundColor: '#B4FF39' }}
              >
                USER DEMO
              </a>
              <a
                href="https://groupdemo.aomigo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 font-bold text-sm rounded-lg transition-all hover:bg-opacity-90 whitespace-nowrap"
                style={{ border: '3px solid black', boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)', color: 'black', backgroundColor: '#B4FF39' }}
              >
                GROUP DEMO
              </a>
              <span className="text-white font-bold">|</span>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-3 py-2 font-bold text-sm bg-white rounded-lg transition-all hover:bg-opacity-90 whitespace-nowrap"
                style={{ border: '3px solid black', boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)', color: 'black', backgroundColor: '#B4FF39' }}
              >
                SIGN IN/UP
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
                  className="px-4 py-3 font-bold text-lg text-left rounded-lg"
                  style={{ border: '3px solid black', backgroundColor: activeSection === 'events' ? '#B4FF39' : 'white', color: 'black' }}
                >
                  EVENTS
                </button>
                <button
                  onClick={() => scrollToSection('collab')}
                  className="px-4 py-3 font-bold text-lg text-left rounded-lg"
                  style={{ border: '3px solid black', backgroundColor: activeSection === 'collab' ? '#B4FF39' : 'white', color: 'black' }}
                >
                  VIBE CHECK
                </button>
                <button
                  onClick={() => scrollToSection('story')}
                  className="px-4 py-3 font-bold text-lg text-left rounded-lg"
                  style={{ border: '3px solid black', backgroundColor: activeSection === 'story' ? '#B4FF39' : 'white', color: 'black' }}
                >
                  STORY
                </button>
                <a
                  href="https://demo.aomigo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 font-bold text-lg text-left rounded-lg"
                  style={{ border: '3px solid black', backgroundColor: '#B4FF39', color: 'black' }}
                >
                  INDIVIDUAL USER DEMO
                </a>
                <a
                  href="https://groupdemo.aomigo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 font-bold text-lg text-left rounded-lg"
                  style={{ border: '3px solid black', backgroundColor: '#B4FF39', color: 'black' }}
                >
                  GROUP USER DEMO
                </a>
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="px-4 py-3 font-bold text-lg text-left bg-white rounded-lg"
                  style={{ border: '3px solid black' }}
                >
                  SIGN IN/UP
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
                <h2 className="text-3xl font-black" style={{ color: 'black' }}>
                  {authMode === 'signin' ? 'SIGN IN' : 'SIGN UP'}
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
                  SIGN IN
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-3 rounded-lg font-black text-lg transition-all ${
                    authMode === 'signup' ? 'bg-gray-900 text-white' : 'bg-gray-100'
                  }`}
                  style={{ border: '3px solid black' }}
                >
                  SIGN UP
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-5">
                {authMode === 'signup' && (
                  <>
                    <div className="text-left">
                      <label className="block font-black mb-2 text-lg" style={{ color: 'black' }}>
                        Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={authFormData.name}
                        onChange={(e) => handleAuthChange('name', e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-4 rounded-lg text-lg font-semibold focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FADF0B' }}
                        required
                      />
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-2 text-lg" style={{ color: 'black' }}>
                        Organization (Optional)
                      </label>
                      <input
                        type="text"
                        value={authFormData.organizationName}
                        onChange={(e) => handleAuthChange('organizationName', e.target.value)}
                        placeholder="Your organization"
                        className="w-full px-4 py-4 rounded-lg text-lg font-semibold focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FADF0B' }}
                      />
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-3 text-lg" style={{ color: 'black' }}>
                        Choose Your Companion
                      </label>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-28 h-28 rounded-full flex flex-col items-center justify-center" style={{ backgroundColor: '#FFA040', border: '4px solid black' }}>
                          <div className="text-4xl mb-1">{animalNames[avatarConfig.animal].charAt(0)}</div>
                          <div className="text-xs font-bold" style={{ color: 'black' }}>{animalNames[avatarConfig.animal]}</div>
                        </div>
                        <button
                          type="button"
                          onClick={randomizeAvatar}
                          className="px-5 py-3 font-black rounded-lg text-white text-base"
                          style={{ backgroundColor: '#FF9F40', border: '3px solid black', boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                        >
                          RANDOMIZE
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
                  <label className="block font-black mb-2 text-lg" style={{ color: 'black' }}>
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={authFormData.email}
                    onChange={(e) => handleAuthChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-4 rounded-lg text-lg font-semibold focus:outline-none focus:ring-4"
                    style={{ border: '4px solid black', backgroundColor: '#FADF0B' }}
                    required
                  />
                </div>

                <div className="text-left">
                  <label className="block font-black mb-2 text-lg" style={{ color: 'black' }}>
                    Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={authFormData.password}
                      onChange={(e) => handleAuthChange('password', e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-4 py-4 rounded-lg text-lg font-semibold focus:outline-none focus:ring-4 pr-12"
                      style={{ border: '4px solid black', backgroundColor: '#FADF0B' }}
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
                    <label className="block font-black mb-2 text-lg" style={{ color: 'black' }}>
                      Confirm Password <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={authFormData.confirmPassword}
                        onChange={(e) => handleAuthChange('confirmPassword', e.target.value)}
                        placeholder="Confirm password"
                        className="w-full px-4 py-4 rounded-lg text-lg font-semibold focus:outline-none focus:ring-4 pr-12"
                        style={{ border: '4px solid black', backgroundColor: '#FADF0B' }}
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
                      onChange={(e) => handleAuthChange('rememberMe', e.target.checked)}
                      className="w-5 h-5 rounded cursor-pointer"
                      style={{ border: '3px solid black' }}
                    />
                    <label htmlFor="rememberMe" className="font-bold text-lg cursor-pointer" style={{ color: 'black' }}>
                      Remember me
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthSubmitting}
                  className="w-full text-white px-8 py-4 rounded-xl font-black text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:translate-y-[-2px]"
                  style={{
                    backgroundColor: '#FF9F40',
                    border: '4px solid black',
                    boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                  }}
                >
                  {isAuthSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      {authMode === 'signin' ? 'SIGNING IN...' : 'CREATING ACCOUNT...'}
                    </>
                  ) : (
                    <>
                      {authMode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
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
        <section id="events" className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FADF0B' }}>
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center mb-10" style={{ border: '6px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
              <h3 className="text-2xl sm:text-3xl font-black mb-6" style={{ color: 'black' }}>
                Help us design AOMIGO's logo!
              </h3>
              <p className="text-base sm:text-lg font-semibold leading-relaxed mb-8 max-w-3xl mx-auto" style={{ color: 'black' }}>
                AOMIGO is your AI-powered playground where you learn, grow, and have fun with friends! Whether you're working on homework, playing games, or doing group projects, we're here to help. We're a friendly community where everyone - kids, parents, teachers, and teams - can connect and achieve amazing things together. We believe in making everyone's life easier and more fun!
              </p>
              <h3 className="text-2xl sm:text-3xl font-black mb-6" style={{ color: 'black' }}>
                Submit your design in...
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 sm:p-6 rounded-xl" style={{ backgroundColor: '#00C8FF', border: '4px solid black' }}>
                  <div className="text-3xl sm:text-5xl font-black mb-1 sm:mb-2" style={{ color: 'black' }}>{timeLeft.days}</div>
                  <div className="text-xs sm:text-base font-black" style={{ color: 'black' }}>DAYS</div>
                </div>
                <div className="p-4 sm:p-6 rounded-xl" style={{ backgroundColor: '#F26522', border: '4px solid black' }}>
                  <div className="text-3xl sm:text-5xl font-black mb-1 sm:mb-2" style={{ color: 'white' }}>{timeLeft.hours}</div>
                  <div className="text-xs sm:text-base font-black" style={{ color: 'white' }}>HOURS</div>
                </div>
                <div className="p-4 sm:p-6 rounded-xl" style={{ backgroundColor: '#FF9F40', border: '4px solid black' }}>
                  <div className="text-3xl sm:text-5xl font-black mb-1 sm:mb-2" style={{ color: 'black' }}>{timeLeft.minutes}</div>
                  <div className="text-xs sm:text-base font-black" style={{ color: 'black' }}>MIN</div>
                </div>
                <div className="p-4 sm:p-6 rounded-xl" style={{ backgroundColor: '#B4FF39', border: '4px solid black' }}>
                  <div className="text-3xl sm:text-5xl font-black mb-1 sm:mb-2" style={{ color: 'black' }}>{timeLeft.seconds}</div>
                  <div className="text-xs sm:text-base font-black" style={{ color: 'black' }}>SEC</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 sm:p-10 mb-10 max-w-2xl mx-auto" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
              {isContestSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#B4FF39', border: '4px solid black' }}>
                    <Check className="w-16 h-16" style={{ color: 'black' }} />
                  </div>
                  <h3 className="text-3xl font-black mb-4" style={{ color: 'black' }}>
                    You're in the contest!
                  </h3>
                  <p className="text-xl font-semibold mb-6" style={{ color: 'black' }}>
                    Check your email for submission details!
                  </p>
                  <button
                    onClick={() => setIsContestSubmitted(false)}
                    className="font-bold underline text-xl"
                    style={{ color: '#F26522' }}
                  >
                    ADD ANOTHER ENTRY
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContestSubmit} className="space-y-6">
                  <div className="text-left">
                    <label className="block font-black mb-3 text-xl" style={{ color: 'black' }}>
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={contestFormData.name}
                      onChange={(e) => handleContestChange('name', e.target.value)}
                      placeholder="Your name"
                      className="w-full px-5 py-4 rounded-lg text-xl font-semibold focus:outline-none focus:ring-4"
                      style={{ border: '4px solid black', backgroundColor: '#FADF0B' }}
                      required
                    />
                  </div>

                  <div className="text-left">
                    <label className="block font-black mb-3 text-xl" style={{ color: 'black' }}>
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={contestFormData.email}
                      onChange={(e) => handleContestChange('email', e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-5 py-4 rounded-lg text-xl font-semibold focus:outline-none focus:ring-4"
                      style={{ border: '4px solid black', backgroundColor: '#FADF0B' }}
                      required
                    />
                  </div>

                  <div className="text-left">
                    <label className="block font-black mb-3 text-xl" style={{ color: 'black' }}>
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={contestFormData.phoneNumber}
                      onChange={(e) => handleContestChange('phoneNumber', e.target.value)}
                      placeholder="+1 (xxx) 867-5309"
                      className="w-full px-5 py-4 rounded-lg text-xl font-semibold focus:outline-none focus:ring-4"
                      style={{ border: '4px solid black', backgroundColor: '#FADF0B' }}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 text-left p-5 rounded-lg" style={{ backgroundColor: '#FFA040', border: '4px solid black' }}>
                      <input
                        type="checkbox"
                        id="isParent"
                        checked={contestFormData.isParent}
                        onChange={(e) => handleContestChange('isParent', e.target.checked)}
                        className="w-6 h-6 mt-1 rounded cursor-pointer flex-shrink-0"
                        style={{ border: '3px solid black' }}
                      />
                      <label htmlFor="isParent" className="font-bold cursor-pointer text-lg" style={{ color: 'black' }}>
                        I'm a parent interested in AOMIGO for my child
                      </label>
                    </div>

                    <div className="flex items-start gap-4 text-left p-5 rounded-lg" style={{ backgroundColor: '#00C8FF', border: '4px solid black' }}>
                      <input
                        type="checkbox"
                        id="isOrganization"
                        checked={contestFormData.isOrganization}
                        onChange={(e) => handleContestChange('isOrganization', e.target.checked)}
                        className="w-6 h-6 mt-1 rounded cursor-pointer flex-shrink-0"
                        style={{ border: '3px solid black' }}
                      />
                      <label htmlFor="isOrganization" className="font-bold cursor-pointer text-lg" style={{ color: 'black' }}>
                        I'm interested in AOMIGO for my organization
                      </label>
                    </div>

                    <div className="flex items-start gap-4 text-left p-5 rounded-lg" style={{ backgroundColor: '#B4FF39', border: '4px solid black' }}>
                      <input
                        type="checkbox"
                        id="wantsMoreEvents"
                        checked={contestFormData.wantsMoreEvents}
                        onChange={(e) => handleContestChange('wantsMoreEvents', e.target.checked)}
                        className="w-6 h-6 mt-1 rounded cursor-pointer flex-shrink-0"
                        style={{ border: '3px solid black' }}
                      />
                      <label htmlFor="wantsMoreEvents" className="font-bold cursor-pointer text-lg" style={{ color: 'black' }}>
                        I want to participate in more events like this!
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isContestSubmitting}
                      className="w-full text-white px-8 py-5 rounded-xl font-black text-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:translate-y-[-2px]"
                      style={{
                        backgroundColor: '#F16523',
                        border: '4px solid black',
                        boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                      }}
                    >
                      {isContestSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
                          JOINING...
                        </>
                      ) : (
                        <>
                          SIGN UP & SUBMIT LOGO
                          <ChevronRight className="w-7 h-7" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="p-8 rounded-2xl text-center" style={{ backgroundColor: '#00C8FF', border: '5px solid black', boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)' }}>
                <div className="text-5xl mb-4">A</div>
                <h4 className="font-black text-2xl mb-3" style={{ color: 'black' }}>
                  Design Rules
                </h4>
                <p className="font-semibold text-lg" style={{ color: 'black' }}>
                  Combine shapes from A-O-M-I-G-O letters creatively!
                </p>
              </div>
              <div className="p-8 rounded-2xl text-center" style={{ backgroundColor: '#F26523', border: '5px solid black', boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)' }}>
                <div className="text-5xl mb-4">$</div>
                <h4 className="font-black text-2xl mb-3" style={{ color: 'black' }}>
                  $1024 Prize
                </h4>
                <p className="font-semibold text-lg" style={{ color: 'black' }}>
                  Winner announced 12/14! Other awards too!
                </p>
              </div>
              <div className="p-8 rounded-2xl text-center" style={{ backgroundColor: '#B4FF39', border: '5px solid black', boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)' }}>
                <div className="text-5xl mb-4">^</div>
                <h4 className="font-black text-2xl mb-3" style={{ color: 'black' }}>
                  Easy Upload
                </h4>
                <p className="font-semibold text-lg" style={{ color: 'black' }}>
                  Sign up and submit in your portal!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="collab" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#00C8FF' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl sm:text-6xl font-black text-center mb-4" style={{ color: 'black', textShadow: '2px 4px 4px rgba(255,255,255,0.5)' }}>
              VIBE CHECK
            </h2>
            <p className="text-xl sm:text-2xl font-semibold text-center mb-16" style={{ color: 'black' }}>
              Got ideas? Questions? Want to work with us? Drop us a line!
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white rounded-2xl p-10" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F26522', border: '4px solid black' }}>
                    <Users className="w-8 h-8" style={{ color: 'white' }} />
                  </div>
                  <h3 className="text-3xl font-black" style={{ color: 'black' }}>
                    Slide Into DMs
                  </h3>
                </div>

                {isInvestorSubmitted ? (
                  <div className="text-center py-10">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#B4FF39', border: '4px solid black' }}>
                      <Check className="w-14 h-14" style={{ color: 'black' }} />
                    </div>
                    <h4 className="text-3xl font-black mb-4" style={{ color: 'black' }}>
                      Thank you!
                    </h4>
                    <p className="font-semibold mb-6 text-xl" style={{ color: 'black' }}>
                      We'll be in touch soon!
                    </p>
                    <button
                      onClick={() => setIsInvestorSubmitted(false)}
                      className="font-bold underline text-xl"
                      style={{ color: '#B39DDB' }}
                    >
                      SUBMIT ANOTHER INQUIRY
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInvestorSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="text-left">
                        <label className="block font-black mb-2 text-xl" style={{ color: 'black' }}>
                          First Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={investorFormData.firstName}
                          onChange={(e) => handleInvestorChange('firstName', e.target.value)}
                          placeholder="Slim"
                          className="w-full px-4 py-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-4"
                          style={{ border: '4px solid black', backgroundColor: '#FADF0B' }}
                          required
                        />
                      </div>

                      <div className="text-left">
                        <label className="block font-black mb-2 text-xl" style={{ color: 'black' }}>
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={investorFormData.lastName}
                          onChange={(e) => handleInvestorChange('lastName', e.target.value)}
                          placeholder="Shady"
                          className="w-full px-4 py-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-4"
                          style={{ border: '4px solid black', backgroundColor: '#FADF0B' }}
                        />
                      </div>
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-2 text-xl" style={{ color: 'black' }}>
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        value={investorFormData.email}
                        onChange={(e) => handleInvestorChange('email', e.target.value)}
                        placeholder="investor@example.com"
                        className="w-full px-4 py-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FADF0B' }}
                        required
                      />
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-2 text-xl" style={{ color: 'black' }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={investorFormData.phoneNumber}
                        onChange={(e) => handleInvestorChange('phoneNumber', e.target.value)}
                        placeholder="+1 (xxx) 867-5309"
                        className="w-full px-4 py-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FADF0B' }}
                      />
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-2 text-xl" style={{ color: 'black' }}>
                        DM Type <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={investorFormData.inquiryType}
                        onChange={(e) => handleInvestorChange('inquiryType', e.target.value as InvestorInquiryType)}
                        className="w-full px-4 py-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FADF0B' }}
                        required
                      >
                        <option value="Investor">Investor</option>
                        <option value="Collab">Collab</option>
                        <option value="Group">Group</option>
                        <option value="Consumer">Consumer</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {investorFormData.inquiryType === 'Other' && (
                      <div className="text-left">
                        <label className="block font-black mb-2 text-xl" style={{ color: 'black' }}>
                          Please specify <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={investorFormData.customInquiryType}
                          onChange={(e) => handleInvestorChange('customInquiryType', e.target.value)}
                          placeholder="Enter your inquiry type"
                          className="w-full px-4 py-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-4"
                          style={{ border: '4px solid black', backgroundColor: '#FADF0B' }}
                          required
                        />
                      </div>
                    )}

                    <div className="text-left">
                      <label className="block font-black mb-2 text-xl" style={{ color: 'black' }}>
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={investorFormData.linkedinUrl}
                        onChange={(e) => handleInvestorChange('linkedinUrl', e.target.value)}
                        placeholder="linkedin.com/in/yourprofile"
                        className="w-full px-4 py-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FADF0B' }}
                      />
                    </div>

                    <div className="text-left">
                      <label className="block font-black mb-2 text-xl" style={{ color: 'black' }}>
                        Message
                      </label>
                      <textarea
                        value={investorFormData.message}
                        onChange={(e) => handleInvestorChange('message', e.target.value)}
                        placeholder="Tell us about your interest..."
                        rows={4}
                        className="w-full px-4 py-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-4 resize-none"
                        style={{ border: '4px solid black', backgroundColor: '#FADF0B' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isInvestorSubmitting}
                      className="w-full text-white px-8 py-4 rounded-xl font-black text-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:translate-y-[-2px]"
                      style={{
                        backgroundColor: '#F16523',
                        border: '4px solid black',
                        boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                      }}
                    >
                      {isInvestorSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
                          SUBMITTING...
                        </>
                      ) : (
                        <>
                          SUBMIT
                          <ChevronRight className="w-6 h-6" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="bg-white rounded-2xl p-10" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#B4FF39', border: '4px solid black' }}>
                    <Sparkles className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-3xl font-black" style={{ color: 'black' }}>
                    Our Mission
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-xl" style={{ backgroundColor: '#FADF0B', border: '4px solid black' }}>
                    <h4 className="text-2xl font-black mb-4 flex items-center gap-3" style={{ color: 'black' }}>
                      <Star className="w-7 h-7" />
                      Good Cause
                    </h4>
                    <p className="font-semibold text-lg leading-relaxed" style={{ color: 'black' }}>
                      We help everyone do good things together! When you help someone, they help others too. Making the world better, one friend at a time.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl" style={{ backgroundColor: '#FADF0B', border: '4px solid black' }}>
                    <h4 className="text-2xl font-black mb-4 flex items-center gap-3" style={{ color: 'black' }}>
                      <Shield className="w-7 h-7" />
                      Clean Community
                    </h4>
                    <p className="font-semibold text-lg leading-relaxed" style={{ color: 'black' }}>
                      No annoying ads here! We check everything to keep AOMIGO friendly and kind. Like a playground where everyone plays nice.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl" style={{ backgroundColor: '#FADF0B', border: '4px solid black' }}>
                    <h4 className="text-2xl font-black mb-4 flex items-center gap-3" style={{ color: 'black' }}>
                      <Heart className="w-7 h-7" />
                      Effective Support
                    </h4>
                    <p className="font-semibold text-lg leading-relaxed" style={{ color: 'black' }}>
                      Your AI pet friend is always with you! We help you find the right friends and get help super fast. Like having a best friend in your pocket 24/7.
                    </p>
                  </div>

                  <div className="text-center pt-4 border-t-4 border-black">
                    <p className="text-2xl font-black" style={{ color: '#F26522' }}>
                      We Empower People
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 max-w-4xl mx-auto">
              <a
                href="https://demo.aomigo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-white px-6 py-4 rounded-xl font-black text-xl transition-all flex items-center justify-center gap-2 hover:translate-y-[-2px]"
                style={{
                  backgroundColor: '#FFA13F',
                  border: '4px solid black',
                  boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                }}
              >
                INDIVIDUAL USER DEMO
              </a>
              <a
                href="https://groupdemo.aomigo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-white px-6 py-4 rounded-xl font-black text-xl transition-all flex items-center justify-center gap-2 hover:translate-y-[-2px]"
                style={{
                  backgroundColor: '#00B4AC',
                  border: '4px solid black',
                  boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                }}
              >
                GROUP USER DEMO
              </a>
            </div>
          </div>
        </section>


        <section id="story" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FFA040' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-5xl sm:text-6xl font-black mb-6" style={{ color: 'black', textShadow: '2px 4px 4px rgba(255,255,255,0.5)' }}>
                AOMIGO STORY
              </h2>
              <p className="text-2xl font-black" style={{ color: 'black' }}>
                The hearts behind AOMIGO
              </p>
            </div>

            <div className="max-w-full">
              <div className="bg-white rounded-2xl p-6 sm:p-10" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
                <div className="flex items-start gap-4 sm:gap-6 mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center flex-shrink-0 text-3xl sm:text-4xl font-black" style={{ backgroundColor: '#00C8FF', border: '4px solid black', color: 'black' }}>
                    J
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl sm:text-4xl font-black mb-2" style={{ color: 'black' }}>
                      Jenny
                    </h3>
                    <p className="text-lg sm:text-xl font-bold mb-2" style={{ color: '#00C8FF' }}>
                      Founder
                    </p>
                    <p className="text-base sm:text-lg font-semibold" style={{ color: 'black' }}>
                      @jennyruanworks
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (jennyAudioPlaying) {
                        window.speechSynthesis.cancel();
                        setJennyAudioPlaying(false);
                      } else {
                        const text = "Hi! This is Jenny Ruan, the founder of AOMIGO. I was raised by my grandparents after my parents separated when I was 5. My grandparents understood the importance of education and overfeeding a kid, but had no clue about a kid's curiosity and dreams. It took me 3 years to convince them to buy me a laptop, and a whole year in elementary school to save enough for a guitar (could have been a DJ now, just saying). My grandparents could afford the purchase, but they didn't share my interests, thus they didn't support my dreams. We don't always get support easily. That's why I founded AOMIGO. I want to build a modern community that can quickly and safely connect people's needs and provide support. We are all people, people love helping people. We are AOMIGO, we empower people.";
                        const speech = new SpeechSynthesisUtterance(text);
                        speech.rate = 0.95;
                        speech.pitch = 1.1;

                        const voices = window.speechSynthesis.getVoices();
                        const femaleVoice = voices.find(voice =>
                          voice.name.includes('Female') ||
                          voice.name.includes('Samantha') ||
                          voice.name.includes('Victoria') ||
                          voice.name.includes('Karen') ||
                          voice.name.includes('Fiona') ||
                          (voice.lang.startsWith('en') && voice.name.includes('Google') && voice.name.includes('US'))
                        );
                        if (femaleVoice) speech.voice = femaleVoice;

                        speech.onstart = () => setJennyAudioPlaying(true);
                        speech.onend = () => setJennyAudioPlaying(false);
                        speech.onerror = () => setJennyAudioPlaying(false);

                        window.speechSynthesis.speak(speech);
                      }
                    }}
                    className="p-3 rounded-lg hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#00C8FF', border: '3px solid black' }}
                  >
                    {jennyAudioPlaying ? (
                      <Pause className="w-6 h-6" style={{ color: 'black' }} />
                    ) : (
                      <Volume2 className="w-6 h-6" style={{ color: 'black' }} />
                    )}
                  </button>
                </div>
                <div className="space-y-5 mb-6">
                  <p className="text-base sm:text-xl font-semibold leading-loose" style={{ color: 'black' }}>
                    Hi! This is Jenny Ruan, the founder of AOMIGO. I was raised by my grandparents after my parents separated when I was 5. My grandparents understood the importance of education and overfeeding a kid, but had no clue about a kid's curiosity and dreams.
                  </p>
                  <p className="text-base sm:text-xl font-semibold leading-loose" style={{ color: 'black' }}>
                    It took me 3 years to convince them to buy me a laptop, and a whole year in elementary school to save enough for a guitar (could have been a DJ now, just saying). My grandparents could afford the purchase, but they didn't share my interests, thus they didn't support my dreams.
                  </p>
                  <p className="text-base sm:text-xl font-semibold leading-loose" style={{ color: 'black' }}>
                    We don't always get support easily. That's why I founded AOMIGO. I want to build a modern community that can quickly and safely connect people's needs and provide support. We are all people, people love helping people.
                  </p>
                  <p className="text-base sm:text-xl font-semibold leading-loose" style={{ color: 'black' }}>
                    We are AOMIGO, we empower people.
                  </p>
                </div>
                <div className="flex gap-4 justify-start">
                  <a
                    href="https://x.com/jennyruanworks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#00C8FF', border: '3px solid black' }}
                  >
                    <X className="w-6 h-6" style={{ color: 'black' }} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/jiani-ruan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#00C8FF', border: '3px solid black' }}
                  >
                    <Linkedin className="w-6 h-6" style={{ color: 'black' }} />
                  </a>
                  <a
                    href="https://www.instagram.com/jennyruanworks/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#00C8FF', border: '3px solid black' }}
                  >
                    <Instagram className="w-6 h-6" style={{ color: 'black' }} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F26523', borderTop: '4px solid black' }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/aomigo-logo-yellow.png"
              alt="AOMIGO Logo"
              className="h-16 w-16"
            />
            <div className="text-3xl font-black" style={{ color: 'white' }}>AOMIGO</div>
          </div>
          <p className="text-2xl font-black mb-3" style={{ color: 'white' }}>
            We Empower People
          </p>
          <p className="font-semibold text-lg" style={{ color: 'white' }}>
            2025 AOMIGO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
