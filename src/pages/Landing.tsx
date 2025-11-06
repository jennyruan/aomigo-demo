import { useState } from 'react';
import { Check, Mail, User, Users, Shield, Sparkles, ChevronRight, Phone, Linkedin, MessageSquare, BookOpen, Map, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { PetAvatar } from '../components/PetAvatar';

export function Landing() {
  const [demoFormData, setDemoFormData] = useState({
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
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);
  const [isDemoSubmitted, setIsDemoSubmitted] = useState(false);
  const [isInvestorSubmitting, setIsInvestorSubmitting] = useState(false);
  const [isInvestorSubmitted, setIsInvestorSubmitted] = useState(false);

  async function handleDemoSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!demoFormData.firstName.trim() || !demoFormData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(demoFormData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsDemoSubmitting(true);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            first_name: demoFormData.firstName.trim(),
            email: demoFormData.email.trim().toLowerCase(),
            is_parent_demo_user: demoFormData.isParent,
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
        setIsDemoSubmitted(true);
        toast.success('Successfully joined the demo waitlist!');
        setDemoFormData({ firstName: '', email: '', isParent: false });

        setTimeout(() => {
          const demoSection = document.getElementById('demo-section');
          if (demoSection) {
            demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsDemoSubmitting(false);
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
    <div className="min-h-screen bg-yellow-300">
      <header className="bg-orange-400 border-b-4 border-black py-6 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-3">
            <span className="text-5xl">🐶</span>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900">AOMIGO</h1>
          </div>
        </div>
      </header>

      <main>
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-yellow-300 via-orange-200 to-purple-200">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-purple-400 text-white px-8 py-4 rounded-full font-black text-xl sm:text-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
              🎉 AOMIGO Launch Event - Coming Soon!
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Your AI Pet Companion<br />
              <span className="text-orange-600">That Helps You Learn</span>
            </h2>

            <p className="text-xl sm:text-2xl text-gray-800 font-bold mb-12">
              Join the waitlist and be the first to experience AOMIGO!
            </p>

            <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10 max-w-2xl mx-auto">
              {isDemoSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border-3 border-black">
                    <Check className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4">You're on the list!</h3>
                  <p className="text-lg text-gray-700 font-semibold mb-6">
                    Check out the demo below to see AOMIGO in action!
                  </p>
                  <button
                    onClick={() => setIsDemoSubmitted(false)}
                    className="text-orange-600 hover:text-orange-700 font-bold underline"
                  >
                    Add another email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} className="space-y-6">
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">
                    Join Our Waitlist
                  </h3>

                  <div className="text-left">
                    <label className="block text-gray-900 font-bold mb-2 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      First Name
                    </label>
                    <input
                      type="text"
                      value={demoFormData.firstName}
                      onChange={(e) => setDemoFormData({ ...demoFormData, firstName: e.target.value })}
                      placeholder="Enter your first name"
                      className="w-full px-4 py-3 border-3 border-black rounded-xl text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-orange-400"
                      required
                    />
                  </div>

                  <div className="text-left">
                    <label className="block text-gray-900 font-bold mb-2 flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={demoFormData.email}
                      onChange={(e) => setDemoFormData({ ...demoFormData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border-3 border-black rounded-xl text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-orange-400"
                      required
                    />
                  </div>

                  <div className="flex items-start gap-3 text-left bg-purple-100 border-3 border-black rounded-xl p-4">
                    <input
                      type="checkbox"
                      id="isParent"
                      checked={demoFormData.isParent}
                      onChange={(e) => setDemoFormData({ ...demoFormData, isParent: e.target.checked })}
                      className="w-6 h-6 mt-1 border-3 border-black rounded cursor-pointer"
                    />
                    <label htmlFor="isParent" className="text-gray-900 font-bold cursor-pointer">
                      I'm a parent interested in AOMIGO for my child
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isDemoSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-black text-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isDemoSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        Joining...
                      </>
                    ) : (
                      <>
                        Join Waitlist
                        <ChevronRight className="w-6 h-6" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-blue-300 border-3 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-4xl mb-3">🎓</div>
                <h4 className="font-black text-gray-900 text-lg mb-2">For Students</h4>
                <p className="text-gray-800 font-semibold">Learn better with your AI pet companion</p>
              </div>
              <div className="bg-pink-300 border-3 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-4xl mb-3">👨‍👩‍👧</div>
                <h4 className="font-black text-gray-900 text-lg mb-2">For Parents</h4>
                <p className="text-gray-800 font-semibold">Safe community for your children</p>
              </div>
              <div className="bg-green-300 border-3 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-4xl mb-3">👨‍🏫</div>
                <h4 className="font-black text-gray-900 text-lg mb-2">For Teachers</h4>
                <p className="text-gray-800 font-semibold">Empower students to learn together</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-purple-300">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-blue-400 rounded-full flex items-center justify-center border-3 border-black">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Investor Inquiry</h2>
                </div>

                {isInvestorSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border-3 border-black">
                      <Check className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Thank you!</h3>
                    <p className="text-gray-700 font-semibold mb-6">
                      We'll be in touch soon to discuss opportunities.
                    </p>
                    <button
                      onClick={() => setIsInvestorSubmitted(false)}
                      className="text-purple-600 hover:text-purple-700 font-bold underline"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInvestorSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="text-left">
                        <label className="block text-gray-900 font-bold mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={investorFormData.firstName}
                          onChange={(e) => setInvestorFormData({ ...investorFormData, firstName: e.target.value })}
                          placeholder="John"
                          className="w-full px-4 py-3 border-3 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-purple-400"
                          required
                        />
                      </div>

                      <div className="text-left">
                        <label className="block text-gray-900 font-bold mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={investorFormData.lastName}
                          onChange={(e) => setInvestorFormData({ ...investorFormData, lastName: e.target.value })}
                          placeholder="Doe"
                          className="w-full px-4 py-3 border-3 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-purple-400"
                        />
                      </div>
                    </div>

                    <div className="text-left">
                      <label className="block text-gray-900 font-bold mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={investorFormData.email}
                        onChange={(e) => setInvestorFormData({ ...investorFormData, email: e.target.value })}
                        placeholder="investor@example.com"
                        className="w-full px-4 py-3 border-3 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-purple-400"
                        required
                      />
                    </div>

                    <div className="text-left">
                      <label className="block text-gray-900 font-bold mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={investorFormData.phoneNumber}
                        onChange={(e) => setInvestorFormData({ ...investorFormData, phoneNumber: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 border-3 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-purple-400"
                      />
                    </div>

                    <div className="text-left">
                      <label className="block text-gray-900 font-bold mb-2 flex items-center gap-2">
                        <Linkedin className="w-4 h-4" />
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={investorFormData.linkedinUrl}
                        onChange={(e) => setInvestorFormData({ ...investorFormData, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full px-4 py-3 border-3 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-purple-400"
                      />
                    </div>

                    <div className="text-left">
                      <label className="block text-gray-900 font-bold mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </label>
                      <textarea
                        value={investorFormData.message}
                        onChange={(e) => setInvestorFormData({ ...investorFormData, message: e.target.value })}
                        placeholder="Tell us about your interest in AOMIGO..."
                        rows={4}
                        className="w-full px-4 py-3 border-3 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-purple-400 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isInvestorSubmitting}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-xl font-black text-lg border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

              <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-orange-400 rounded-full flex items-center justify-center border-3 border-black">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Our Mission</h2>
                </div>

                <div className="space-y-6 text-gray-800 leading-relaxed">
                  <div className="bg-yellow-100 border-3 border-black rounded-2xl p-5">
                    <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-6 h-6 text-orange-600" />
                      Community & Companion
                    </h3>
                    <p className="font-semibold text-base">
                      AOMIGO is an AI-powered digital pets ecosystem that shadows verified users' real identity,
                      providing a friendly and safe community for everybody to connect.
                    </p>
                  </div>

                  <div className="bg-purple-100 border-3 border-black rounded-2xl p-5">
                    <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-purple-600" />
                      Our Major Goal
                    </h3>
                    <p className="font-semibold text-base">
                      Help people express their needs bravely and connect them with effective support timely,
                      using AOMIGO's mechanisms and algorithms. Our AI digital pet's 24/7 companion is the
                      backup plan after the encouraged real-life connections.
                    </p>
                  </div>

                  <div className="bg-blue-100 border-3 border-black rounded-2xl p-5">
                    <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                      Our Vision
                    </h3>
                    <p className="font-semibold text-base">
                      Our vision covers lifestyle brand, IoT, and enterprise solutions for educational
                      institutions as CRM and security systems.
                    </p>
                  </div>

                  <div className="text-center pt-4 border-t-4 border-black">
                    <p className="text-xl font-black text-orange-600">
                      Together We Got This 🐶
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="demo-section" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-300 via-yellow-200 to-pink-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-green-400 text-white px-8 py-4 rounded-full font-black text-2xl sm:text-3xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                ✨ Try AOMIGO Demo
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
                Experience AOMIGO Now
              </h2>
              <p className="text-xl text-gray-800 font-bold">
                See how your AI pet companion helps you learn better!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
                <div className="mb-6">
                  <PetAvatar size="large" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Meet Your Pet</h3>
                <div className="space-y-3 w-full">
                  <div className="bg-blue-100 border-3 border-black rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🧠</span>
                      <div className="text-left">
                        <p className="font-bold text-gray-900">Brain Power</p>
                        <div className="w-full bg-gray-200 h-3 rounded-full border-2 border-black mt-1">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: '50%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-pink-100 border-3 border-black rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">❤️</span>
                      <div className="text-left">
                        <p className="font-bold text-gray-900">Energy</p>
                        <div className="w-full bg-gray-200 h-3 rounded-full border-2 border-black mt-1">
                          <div className="bg-pink-500 h-full rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-100 border-3 border-black rounded-xl p-4 flex items-center justify-between">
                    <span className="font-black text-gray-900">⭐ Level 1</span>
                    <span className="font-black text-gray-900">🔥 2 Day Streak</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-8 h-8 text-green-600" />
                  <h3 className="text-2xl font-black text-gray-900">Teach</h3>
                </div>
                <p className="text-gray-800 font-semibold mb-6">
                  Share what you learned today with your pet through text, voice, or images
                </p>
                <div className="bg-green-100 border-3 border-black rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-800 font-semibold italic">
                    "I learned about photosynthesis today! Plants use sunlight to make food..."
                  </p>
                </div>
                <div className="bg-yellow-100 border-3 border-black rounded-xl p-4">
                  <p className="text-sm font-bold text-gray-900 mb-2">🤔 Your pet asks:</p>
                  <p className="text-sm text-gray-800 font-semibold">
                    "That's interesting! What role does chlorophyll play in photosynthesis?"
                  </p>
                </div>
              </div>

              <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-8 h-8 text-purple-600" />
                  <h3 className="text-2xl font-black text-gray-900">Connect</h3>
                </div>
                <p className="text-gray-800 font-semibold mb-6">
                  Find study buddies and share your learning journey with the community
                </p>
                <div className="space-y-3">
                  <div className="bg-blue-100 border-3 border-black rounded-xl p-4 flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center border-2 border-black">
                      <span className="text-2xl">🦊</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-black text-gray-900">Mia's Fox</p>
                      <p className="text-sm font-semibold text-gray-700">Studying Biology</p>
                    </div>
                  </div>
                  <div className="bg-pink-100 border-3 border-black rounded-xl p-4 flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center border-2 border-black">
                      <span className="text-2xl">🐼</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-black text-gray-900">Jake's Panda</p>
                      <p className="text-sm font-semibold text-gray-700">Studying Chemistry</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-4 border-black rounded-3xl p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-4 mb-8">
                <Clock className="w-10 h-10 text-orange-600" />
                <h3 className="text-3xl font-black text-gray-900">Review & Remember</h3>
              </div>
              <p className="text-xl text-gray-800 font-semibold mb-8">
                AOMIGO uses spaced repetition to help you remember what you learned. Review at the perfect time to maximize retention!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-green-100 border-3 border-black rounded-xl p-6 text-center">
                  <div className="text-4xl mb-3">📚</div>
                  <p className="font-black text-gray-900 text-lg">Biology</p>
                  <p className="text-sm font-semibold text-green-700 mt-2">Review in 2 days</p>
                </div>
                <div className="bg-orange-100 border-3 border-black rounded-xl p-6 text-center">
                  <div className="text-4xl mb-3">🧮</div>
                  <p className="font-black text-gray-900 text-lg">Math</p>
                  <p className="text-sm font-semibold text-red-700 mt-2">Review NOW!</p>
                </div>
                <div className="bg-purple-100 border-3 border-black rounded-xl p-6 text-center">
                  <div className="text-4xl mb-3">🌍</div>
                  <p className="font-black text-gray-900 text-lg">History</p>
                  <p className="text-sm font-semibold text-purple-700 mt-2">Review in 1 day</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-orange-400 border-t-4 border-black py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🐶</span>
            <h3 className="text-2xl font-black text-gray-900">AOMIGO</h3>
          </div>
          <p className="text-gray-900 font-bold mb-2">
            Your AI Learning Companion
          </p>
          <p className="text-gray-800 font-semibold">
            © 2025 AOMIGO. All rights reserved.
          </p>
          <p className="text-lg font-black text-orange-600 mt-4">
            Together We Got This 🐶
          </p>
        </div>
      </footer>
    </div>
  );
}
