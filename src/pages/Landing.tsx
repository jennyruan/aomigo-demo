import { useState } from 'react';
import { Check, Mail, User, Heart, Users, Shield, Sparkles, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function Landing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    isParent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            first_name: formData.firstName.trim(),
            email: formData.email.trim().toLowerCase(),
            is_parent: formData.isParent,
          },
        ]);

      if (error) {
        if (error.code === '23505') {
          toast.error('This email is already on our waitlist!');
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        toast.success('Successfully joined the waitlist!');
        setFormData({ firstName: '', email: '', isParent: false });
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-yellow-300">
      <header className="bg-orange-400 border-b-4 border-black py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-5xl">🐶</span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">AOMIGO</h1>
          </div>
          <button
            onClick={() => navigate('/auth')}
            className="bg-purple-400 hover:bg-purple-500 text-white px-6 py-2 sm:py-3 rounded-xl font-bold border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-sm sm:text-base"
          >
            Sign In
          </button>
        </div>
      </header>

      <main>
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-yellow-300 via-orange-200 to-purple-200">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-purple-400 text-white px-6 py-3 rounded-full font-bold border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
              <span className="text-xl">🎉 AOMIGO Launch Event - Coming Soon!</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Your AI Pet Companion<br />
              <span className="text-orange-600">That Helps You Learn</span>
            </h2>

            <p className="text-xl sm:text-2xl text-gray-800 font-bold mb-12">
              Join the waitlist and be the first to experience AOMIGO!
            </p>

            <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10 max-w-2xl mx-auto">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border-3 border-black">
                    <Check className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4">You're on the list!</h3>
                  <p className="text-lg text-gray-700 font-semibold mb-6">
                    We'll email you when AOMIGO launches. Get ready for an amazing learning adventure!
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-orange-600 hover:text-orange-700 font-bold underline"
                  >
                    Add another email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border-3 border-black rounded-xl text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-orange-400"
                      required
                    />
                  </div>

                  <div className="flex items-start gap-3 text-left bg-purple-100 border-3 border-black rounded-xl p-4">
                    <input
                      type="checkbox"
                      id="isParent"
                      checked={formData.isParent}
                      onChange={(e) => setFormData({ ...formData, isParent: e.target.checked })}
                      className="w-6 h-6 mt-1 border-3 border-black rounded cursor-pointer"
                    />
                    <label htmlFor="isParent" className="text-gray-900 font-bold cursor-pointer">
                      I'm a parent interested in AOMIGO for my child
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-black text-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
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

        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-orange-300">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 sm:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center border-3 border-black">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Our Mission</h2>
              </div>

              <div className="space-y-6 text-gray-800 text-lg leading-relaxed">
                <div className="bg-yellow-100 border-3 border-black rounded-2xl p-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    <Users className="w-7 h-7 text-orange-600" />
                    Community & Companion
                  </h3>
                  <p className="font-semibold">
                    AOMIGO is an AI-powered digital pets ecosystem that shadows verified users' real identity,
                    providing a friendly and safe community for everybody to connect.
                  </p>
                </div>

                <div className="bg-purple-100 border-3 border-black rounded-2xl p-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    <Shield className="w-7 h-7 text-purple-600" />
                    Our Major Goal
                  </h3>
                  <p className="font-semibold">
                    Help people express their needs bravely and connect them with effective support timely,
                    using AOMIGO's mechanisms and algorithms. Our AI digital pet's 24/7 companion is the
                    backup plan after the encouraged real-life connections.
                  </p>
                </div>

                <div className="bg-blue-100 border-3 border-black rounded-2xl p-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    <Sparkles className="w-7 h-7 text-blue-600" />
                    Our Vision
                  </h3>
                  <p className="font-semibold">
                    Our vision covers lifestyle brand, IoT, and enterprise solutions for educational
                    institutions as CRM and security systems.
                  </p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t-4 border-black text-center">
                <p className="text-2xl font-black text-orange-600 mb-2">
                  Together We Got This 🐶
                </p>
                <p className="text-gray-700 font-bold">
                  Building a safer, smarter learning community
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-purple-300">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8">
              How AOMIGO Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-black text-gray-900 mb-3">1. Teach Your Pet</h3>
                <p className="text-gray-800 font-semibold">
                  Share what you learned today with your AI pet through text, voice, or images
                </p>
              </div>

              <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left">
                <div className="text-4xl mb-4">🤔</div>
                <h3 className="text-xl font-black text-gray-900 mb-3">2. Answer Questions</h3>
                <p className="text-gray-800 font-semibold">
                  Your pet asks follow-up questions to deepen your understanding
                </p>
              </div>

              <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-black text-gray-900 mb-3">3. Connect with Others</h3>
                <p className="text-gray-800 font-semibold">
                  Your pet shares your learning journey and connects you with study buddies
                </p>
              </div>

              <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-black text-gray-900 mb-3">4. Review & Grow</h3>
                <p className="text-gray-800 font-semibold">
                  Spaced repetition helps you remember, and your pet levels up with you!
                </p>
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
