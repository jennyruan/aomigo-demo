import { useState, useEffect } from 'react';
import { Check, Mail, User, Users, Shield, Sparkles, ChevronRight, Phone, Linkedin, MessageSquare, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export function Landing() {
  const [activeSection, setActiveSection] = useState('events');
  const [showRules, setShowRules] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [contestFormData, setContestFormData] = useState({
    firstName: '',
    email: '',
    isParent: false,
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
    }
  }

  async function handleContestSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!contestFormData.firstName.trim() || !contestFormData.email.trim()) {
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
            first_name: contestFormData.firstName.trim(),
            email: contestFormData.email.trim().toLowerCase(),
            is_parent_demo_user: contestFormData.isParent,
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
        setContestFormData({ firstName: '', email: '', isParent: false });
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFECB3' }}>
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#FF9A56', borderBottom: '4px solid black' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center" style={{ border: '3px solid black' }}>
              <span className="text-3xl">🐼</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900">AOMIGO</h1>
          </div>

          <nav className="flex justify-center gap-3">
            <button
              onClick={() => scrollToSection('events')}
              className={`px-6 py-2 font-black text-sm sm:text-base rounded-lg transition-all ${
                activeSection === 'events'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
              style={{ border: '3px solid black', boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
            >
              Events
            </button>
            <button
              onClick={() => scrollToSection('collab')}
              className={`px-6 py-2 font-black text-sm sm:text-base rounded-lg transition-all ${
                activeSection === 'collab'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
              style={{ border: '3px solid black', boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
            >
              Collab
            </button>
            <button
              onClick={() => scrollToSection('demo')}
              className={`px-6 py-2 font-black text-sm sm:text-base rounded-lg transition-all ${
                activeSection === 'demo'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
              style={{ border: '3px solid black', boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
            >
              Demo
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section id="events" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FFECB3', minHeight: '70vh' }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block bg-white px-6 py-3 rounded-full font-black text-lg mb-6" style={{ border: '4px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
                🎨 AOMIGO Logo Lab - Join Now!
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-3 leading-tight">
                Make our logo and win $1024!
              </h2>
              <p className="text-2xl sm:text-3xl font-black mb-8" style={{ color: '#FF9A56' }}>
                Turn A-O-M-I-G-O into our new logo!
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 mb-8 max-w-xl mx-auto" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
              {isContestSubmitted ? (
                <div className="text-center py-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#A8E6CF', border: '4px solid black' }}>
                    <Check className="w-12 h-12 text-gray-900" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">You're in the contest!</h3>
                  <p className="text-gray-700 font-bold mb-4">
                    Check your email for submission details!
                  </p>
                  <button
                    onClick={() => setIsContestSubmitted(false)}
                    className="font-bold underline"
                    style={{ color: '#FF9A56' }}
                  >
                    Add another entry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContestSubmit} className="space-y-4">
                  <div className="text-left">
                    <label className="block text-gray-900 font-black mb-2 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      First Name
                    </label>
                    <input
                      type="text"
                      value={contestFormData.firstName}
                      onChange={(e) => setContestFormData({ ...contestFormData, firstName: e.target.value })}
                      placeholder="Your first name"
                      className="w-full px-4 py-3 rounded-lg text-lg font-bold focus:outline-none focus:ring-4"
                      style={{ border: '4px solid black', backgroundColor: '#FFECB3' }}
                      required
                    />
                  </div>

                  <div className="text-left">
                    <label className="block text-gray-900 font-black mb-2 flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={contestFormData.email}
                      onChange={(e) => setContestFormData({ ...contestFormData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg text-lg font-bold focus:outline-none focus:ring-4"
                      style={{ border: '4px solid black', backgroundColor: '#FFECB3' }}
                      required
                    />
                  </div>

                  <div className="flex items-start gap-3 text-left p-4 rounded-lg" style={{ backgroundColor: '#FFB3D9', border: '4px solid black' }}>
                    <input
                      type="checkbox"
                      id="isParent"
                      checked={contestFormData.isParent}
                      onChange={(e) => setContestFormData({ ...contestFormData, isParent: e.target.checked })}
                      className="w-6 h-6 mt-1 rounded cursor-pointer"
                      style={{ border: '3px solid black' }}
                    />
                    <label htmlFor="isParent" className="text-gray-900 font-black cursor-pointer">
                      I'm a parent interested in AOMIGO for my child
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isContestSubmitting}
                    className="w-full text-white px-8 py-4 rounded-xl font-black text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:translate-y-[-2px]"
                    style={{
                      backgroundColor: '#FF9A56',
                      border: '4px solid black',
                      boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                    }}
                  >
                    {isContestSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        Joining...
                      </>
                    ) : (
                      <>
                        Join Contest
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
                <h4 className="font-black text-gray-900 text-lg mb-2">For Everyone</h4>
                <p className="text-gray-900 font-bold">All ages welcome!</p>
              </div>
              <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: '#FFB3D9', border: '5px solid black', boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)' }}>
                <div className="text-4xl mb-3">📸</div>
                <h4 className="font-black text-gray-900 text-lg mb-2">Easy Upload</h4>
                <p className="text-gray-900 font-bold">Photo, drawing, or digital</p>
              </div>
              <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: '#A8E6CF', border: '5px solid black', boxShadow: '5px 5px 0px 0px rgba(0,0,0,1)' }}>
                <div className="text-4xl mb-3">💰</div>
                <h4 className="font-black text-gray-900 text-lg mb-2">$1024 Prize</h4>
                <p className="text-gray-900 font-bold">Cash or any wish!</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden mb-6" style={{ border: '6px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
              <button
                onClick={() => setShowRules(!showRules)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl sm:text-2xl font-black text-gray-900">Contest Rules</span>
                <ChevronDown className={`w-6 h-6 transition-transform ${showRules ? 'rotate-180' : ''}`} />
              </button>

              {showRules && (
                <div className="px-6 pb-6 border-t-4 border-black">
                  <ul className="space-y-3 text-gray-900 font-bold mt-4">
                    <li className="flex items-start gap-3">
                      <span className="text-xl">✅</span>
                      <span>Use letters A, O, M, I, G, O as shapes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl">✅</span>
                      <span>Submit through your AOMIGO account portal</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl">✅</span>
                      <span>Accepts: images, photos, PDF, Word docs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl">✅</span>
                      <span>Take photo/screenshot in portal</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl">✅</span>
                      <span>Posts appear in forum for likes/comments</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl">📅</span>
                      <span>Deadline: Nov 30, 11:59 PM</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl">🏆</span>
                      <span>Winner announced: Dec 14, 11:59 PM</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl">🎁</span>
                      <span>Prizes: Grand Prize $1024, Funniest, Most Creative, Rainbow Colors, Youngest Artist awards</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 text-center" style={{ border: '6px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
              <h3 className="text-2xl font-black text-gray-900 mb-4">⏰ Contest Ends In:</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#FF9A56', border: '4px solid black' }}>
                  <div className="text-4xl font-black text-white">{timeLeft.days}</div>
                  <div className="text-sm font-black text-gray-900">DAYS</div>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#B39DDB', border: '4px solid black' }}>
                  <div className="text-4xl font-black text-white">{timeLeft.hours}</div>
                  <div className="text-sm font-black text-gray-900">HOURS</div>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFB3D9', border: '4px solid black' }}>
                  <div className="text-4xl font-black text-white">{timeLeft.minutes}</div>
                  <div className="text-sm font-black text-gray-900">MIN</div>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#A8E6CF', border: '4px solid black' }}>
                  <div className="text-4xl font-black text-white">{timeLeft.seconds}</div>
                  <div className="text-sm font-black text-gray-900">SEC</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="collab" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#B39DDB' }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#B3D4FF', border: '4px solid black' }}>
                    <Users className="w-7 h-7 text-gray-900" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900">👤 Investor Inquiry</h2>
                </div>

                {isInvestorSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#A8E6CF', border: '4px solid black' }}>
                      <Check className="w-12 h-12 text-gray-900" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Thank you!</h3>
                    <p className="text-gray-700 font-bold mb-6">
                      We'll be in touch soon!
                    </p>
                    <button
                      onClick={() => setIsInvestorSubmitted(false)}
                      className="font-bold underline"
                      style={{ color: '#B39DDB' }}
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInvestorSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="text-left">
                        <label className="block text-gray-900 font-black mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          First Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={investorFormData.firstName}
                          onChange={(e) => setInvestorFormData({ ...investorFormData, firstName: e.target.value })}
                          placeholder="John"
                          className="w-full px-4 py-3 rounded-lg font-bold focus:outline-none focus:ring-4"
                          style={{ border: '4px solid black', backgroundColor: '#FFECB3' }}
                          required
                        />
                      </div>

                      <div className="text-left">
                        <label className="block text-gray-900 font-black mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={investorFormData.lastName}
                          onChange={(e) => setInvestorFormData({ ...investorFormData, lastName: e.target.value })}
                          placeholder="Doe"
                          className="w-full px-4 py-3 rounded-lg font-bold focus:outline-none focus:ring-4"
                          style={{ border: '4px solid black', backgroundColor: '#FFECB3' }}
                        />
                      </div>
                    </div>

                    <div className="text-left">
                      <label className="block text-gray-900 font-black mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        value={investorFormData.email}
                        onChange={(e) => setInvestorFormData({ ...investorFormData, email: e.target.value })}
                        placeholder="investor@example.com"
                        className="w-full px-4 py-3 rounded-lg font-bold focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FFECB3' }}
                        required
                      />
                    </div>

                    <div className="text-left">
                      <label className="block text-gray-900 font-black mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={investorFormData.phoneNumber}
                        onChange={(e) => setInvestorFormData({ ...investorFormData, phoneNumber: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 rounded-lg font-bold focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FFECB3' }}
                      />
                    </div>

                    <div className="text-left">
                      <label className="block text-gray-900 font-black mb-2 flex items-center gap-2">
                        <Linkedin className="w-4 h-4" />
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={investorFormData.linkedinUrl}
                        onChange={(e) => setInvestorFormData({ ...investorFormData, linkedinUrl: e.target.value })}
                        placeholder="linkedin.com/in/yourprofile"
                        className="w-full px-4 py-3 rounded-lg font-bold focus:outline-none focus:ring-4"
                        style={{ border: '4px solid black', backgroundColor: '#FFECB3' }}
                      />
                    </div>

                    <div className="text-left">
                      <label className="block text-gray-900 font-black mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </label>
                      <textarea
                        value={investorFormData.message}
                        onChange={(e) => setInvestorFormData({ ...investorFormData, message: e.target.value })}
                        placeholder="Tell us about your interest..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg font-bold focus:outline-none focus:ring-4 resize-none"
                        style={{ border: '4px solid black', backgroundColor: '#FFECB3' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isInvestorSubmitting}
                      className="w-full text-white px-8 py-3 rounded-xl font-black text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:translate-y-[-2px]"
                      style={{
                        backgroundColor: '#B39DDB',
                        border: '4px solid black',
                        boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
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
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900">✨ Our Mission</h2>
                </div>

                <div className="space-y-5 text-gray-900">
                  <div className="p-5 rounded-xl" style={{ backgroundColor: '#FFECB3', border: '4px solid black' }}>
                    <h3 className="text-lg font-black mb-3 flex items-center gap-2">
                      <Users className="w-6 h-6" />
                      👥 Community & Companion
                    </h3>
                    <p className="font-bold text-base leading-relaxed">
                      AOMIGO is an AI-powered digital pets ecosystem that shadows verified users' real identity,
                      providing a friendly and safe community for everybody to connect.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl" style={{ backgroundColor: '#FFECB3', border: '4px solid black' }}>
                    <h3 className="text-lg font-black mb-3 flex items-center gap-2">
                      <Shield className="w-6 h-6" />
                      🎯 Our Major Goal
                    </h3>
                    <p className="font-bold text-base leading-relaxed">
                      Help people express their needs bravely and connect them with effective support timely,
                      using AOMIGO's mechanisms and algorithms. Our AI digital pet's 24/7 companion is the
                      backup plan after the encouraged real-life connections.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl" style={{ backgroundColor: '#FFECB3', border: '4px solid black' }}>
                    <h3 className="text-lg font-black mb-3 flex items-center gap-2">
                      <Sparkles className="w-6 h-6" />
                      🔮 Our Vision
                    </h3>
                    <p className="font-bold text-base leading-relaxed">
                      Our vision covers lifestyle brand, IoT, and enterprise solutions for educational
                      institutions as CRM and security systems.
                    </p>
                  </div>

                  <div className="text-center pt-4 border-t-4 border-black">
                    <p className="text-xl font-black" style={{ color: '#FF9A56' }}>
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
              <div className="inline-block bg-white px-8 py-4 rounded-full font-black text-2xl sm:text-3xl mb-6" style={{ border: '4px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
                ✨ Try AOMIGO Demo
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
                Experience AOMIGO Now
              </h2>
              <p className="text-xl font-black" style={{ color: '#FF9A56' }}>
                See how your AI pet companion helps you learn better!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-8 text-center" style={{ border: '6px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
                <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#FF9A56', border: '4px solid black' }}>
                  <span className="text-5xl">🐼</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Meet Your Pet</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#B3D4FF', border: '4px solid black' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🧠</span>
                      <div className="flex-1 text-left">
                        <p className="font-black text-gray-900 text-sm">Brain Power</p>
                        <div className="w-full h-3 rounded-full mt-1" style={{ backgroundColor: '#FFECB3', border: '2px solid black' }}>
                          <div className="h-full rounded-full" style={{ width: '50%', backgroundColor: '#B3D4FF' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFB3D9', border: '4px solid black' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">❤️</span>
                      <div className="flex-1 text-left">
                        <p className="font-black text-gray-900 text-sm">Energy</p>
                        <div className="w-full h-3 rounded-full mt-1" style={{ backgroundColor: '#FFECB3', border: '2px solid black' }}>
                          <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: '#FFB3D9' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl flex items-center justify-between" style={{ backgroundColor: '#B39DDB', border: '4px solid black' }}>
                    <span className="font-black text-white">⭐ Level 1</span>
                    <span className="font-black text-white">🔥 2 Days</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8" style={{ border: '6px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">📚</span>
                  <h3 className="text-2xl font-black text-gray-900">Teach</h3>
                </div>
                <p className="text-gray-900 font-bold mb-6">
                  Share what you learned with your pet
                </p>
                <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#A8E6CF', border: '4px solid black' }}>
                  <p className="text-sm text-gray-900 font-bold italic">
                    "I learned about photosynthesis today!"
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFECB3', border: '4px solid black' }}>
                  <p className="text-sm font-black text-gray-900 mb-2">🤔 Your pet asks:</p>
                  <p className="text-sm text-gray-900 font-bold">
                    "What role does chlorophyll play?"
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8" style={{ border: '6px solid black', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">👥</span>
                  <h3 className="text-2xl font-black text-gray-900">Connect</h3>
                </div>
                <p className="text-gray-900 font-bold mb-6">
                  Find study buddies
                </p>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: '#FFB3D9', border: '4px solid black' }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF9A56', border: '3px solid black' }}>
                      <span className="text-2xl">🦊</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-black text-gray-900">Mia's Fox</p>
                      <p className="text-sm font-bold text-gray-700">Studying Biology</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: '#B3D4FF', border: '4px solid black' }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#B39DDB', border: '3px solid black' }}>
                      <span className="text-2xl">🐼</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-black text-gray-900">Jake's Panda</p>
                      <p className="text-sm font-bold text-gray-700">Studying Chemistry</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 sm:p-12" style={{ border: '6px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl">⏰</span>
                <h3 className="text-3xl font-black text-gray-900">Review & Remember</h3>
              </div>
              <p className="text-xl text-gray-900 font-bold mb-8">
                AOMIGO uses spaced repetition to help you remember!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#A8E6CF', border: '5px solid black', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}>
                  <div className="text-4xl mb-3">📚</div>
                  <p className="font-black text-gray-900 text-lg">Biology</p>
                  <p className="text-sm font-bold text-gray-700 mt-2">Review in 2 days</p>
                </div>
                <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#FF9A56', border: '5px solid black', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}>
                  <div className="text-4xl mb-3">🧮</div>
                  <p className="font-black text-white text-lg">Math</p>
                  <p className="text-sm font-black text-gray-900 mt-2">Review NOW!</p>
                </div>
                <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#B39DDB', border: '5px solid black', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}>
                  <div className="text-4xl mb-3">🌍</div>
                  <p className="font-black text-white text-lg">History</p>
                  <p className="text-sm font-bold text-gray-100 mt-2">Review in 1 day</p>
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
            <h3 className="text-3xl font-black text-gray-900">AOMIGO</h3>
          </div>
          <p className="text-gray-900 font-black mb-2 text-lg">
            Your AI Learning Companion
          </p>
          <p className="text-gray-900 font-bold">
            © 2025 AOMIGO. All rights reserved.
          </p>
          <p className="text-xl font-black text-gray-900 mt-4">
            Together We Got This 🐾
          </p>
        </div>
      </footer>
    </div>
  );
}
