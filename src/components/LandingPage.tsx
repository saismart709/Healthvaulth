import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Activity, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone, 
  Users, 
  Zap,
  Globe,
  Stethoscope
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewDemo }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-bg-custom text-text-custom overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-card-custom/80 backdrop-blur-md border-b border-border-custom">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Stethoscope size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">Health<span className="text-primary">Vault</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-2">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#security" className="hover:text-primary transition-colors">Security</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onViewDemo}
              className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors"
            >
              Live Demo
            </button>
            <button 
              onClick={onGetStarted}
              className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all hover:scale-105 active:scale-95"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-teal-custom/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              v2.0 Now Live — Intelligent Health Monitoring
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1]">
              Your Health, <span className="text-primary">Securely Vaulted.</span>
            </h1>
            <p className="text-xl text-text-2 mb-10 leading-relaxed">
              The intelligent, all-in-one platform for vitals tracking, medical records, and emergency alerts. Take control of your medical life today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/25 hover:bg-primary-dark transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-lg"
              >
                Get Started for Free <ArrowRight size={20} />
              </button>
              <button 
                onClick={onViewDemo}
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-card-custom border border-border-custom font-bold rounded-2xl hover:bg-bg-custom transition-all flex items-center justify-center gap-2 text-lg"
              >
                View Live Demo
              </button>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 opacity-60">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-teal-custom" />
                <span className="text-sm font-medium">HIPAA Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-teal-custom" />
                <span className="text-sm font-medium">E2E Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-teal-custom" />
                <span className="text-sm font-medium">GDPR Compliant</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative px-4"
          >
            <div className="max-w-5xl mx-auto bg-white dark:bg-card-custom rounded-[32px] shadow-2xl border border-border-custom overflow-hidden">
              <div className="bg-bg-custom border-b border-border-custom p-4 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto w-64 h-6 bg-border-custom rounded-lg opacity-40"></div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 bg-bg-custom rounded-2xl animate-pulse"></div>
                  ))}
                </div>
                <div className="mt-8 h-64 bg-bg-custom rounded-2xl animate-pulse"></div>
              </div>
            </div>
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 hidden lg:block"
            >
              <div className="bg-white dark:bg-card-custom p-4 rounded-2xl shadow-xl border border-border-custom flex items-center gap-4">
                <div className="w-12 h-12 bg-red-bg rounded-xl flex items-center justify-center text-red-custom">
                  <Activity size={24} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-text-3">Heart Rate</div>
                  <div className="text-xl font-bold">72 BPM</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-40 -left-10 hidden lg:block"
            >
              <div className="bg-white dark:bg-card-custom p-4 rounded-2xl shadow-xl border border-border-custom flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-bg rounded-xl flex items-center justify-center text-primary">
                  <Shield size={24} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-text-3">Security</div>
                  <div className="text-xl font-bold">Secure Vault</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-card-custom">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-primary text-sm font-bold uppercase tracking-widest mb-3">Core Features</h2>
            <h3 className="text-4xl font-bold mb-6">Built for your modern healthcare needs</h3>
            <p className="text-text-2">We've combined advanced biometric tracking with military-grade encryption to create the ultimate personal health dashboard.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { 
                icon: <Activity className="text-red-custom" />, 
                title: "Vitals Tracking", 
                desc: "Monitor heart rate, blood pressure, and glucose with high-precision charts.",
                bg: "bg-red-bg"
              },
              { 
                icon: <Lock className="text-primary" />, 
                title: "Encrypted Vault", 
                desc: "Your medical documents are encrypted locally and never stored in plain text.",
                bg: "bg-primary-bg"
              },
              { 
                icon: <Zap className="text-amber-custom" />, 
                title: "Intelligent Alerts", 
                desc: "AI detects abnormal patterns and alerts your emergency contacts instantly.",
                bg: "bg-amber-bg"
              },
              { 
                icon: <Users className="text-teal-custom" />, 
                title: "Doctor Access", 
                desc: "Securely share temporary access to your health vault with medical professionals.",
                bg: "bg-teal-bg"
              }
            ].map((f, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="group p-8 rounded-[32px] bg-bg-custom hover:bg-white dark:hover:bg-sidebar border border-border-custom hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{f.title}</h4>
                <p className="text-text-2 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-[48px] p-12 md:p-20 relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
              <Shield className="w-full h-full transform translate-x-1/4 translate-y-1/4" />
            </div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-white/80 text-sm font-bold uppercase tracking-widest mb-4">Security First</h2>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">Privacy is not a feature, it's our foundation.</h3>
                <div className="space-y-6 text-white/80">
                  {[
                    "Client-side encryption for all sensitive health data.",
                    "Multi-factor authentication for every login attempt.",
                    "Automated data backups in secure, geographically redundant locations.",
                    "Transparent privacy controls — you decide who sees what."
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="mt-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} className="text-white" />
                      </div>
                      <p className="text-lg font-medium">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-[32px] p-8 border border-white/20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <div className="text-white text-lg font-bold">HealthVault Mobile</div>
                    <div className="text-white/60 text-sm">Coming Soon to iOS & Android</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-white/20 rounded-full w-full"></div>
                  <div className="h-4 bg-white/20 rounded-full w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded-full w-5/6"></div>
                </div>
                <button className="mt-8 w-full py-4 bg-white text-primary font-extrabold rounded-2xl hover:bg-blue-50 transition-colors shadow-xl">
                  Join the Waitlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border-custom">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Stethoscope size={16} />
            </div>
            <span className="text-lg font-bold tracking-tight">Health<span className="text-primary">Vault</span></span>
          </div>
          <p className="text-text-3 text-sm">
            © 2026 HealthVault. Securely managing health data across the globe.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="p-2 bg-bg-custom rounded-xl text-text-2 hover:text-primary transition-colors"><Globe size={20} /></a>
            <a href="#" className="p-2 bg-bg-custom rounded-xl text-text-2 hover:text-primary transition-colors"><Users size={20} /></a>
            <a href="#" className="p-2 bg-bg-custom rounded-xl text-text-2 hover:text-primary transition-colors"><Shield size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};
