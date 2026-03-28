import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Heart, 
  Activity, 
  ArrowRight, 
  Check, 
  ChevronLeft,
  Wind,
  Droplets,
  Scale,
  Ruler
} from 'lucide-react';

interface OnboardingProps {
  userName: string;
  onComplete: (data: any) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ userName, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    bloodType: '',
    conditions: [] as string[],
    weight: '',
    height: '',
    pulse: ''
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleComplete = () => {
    onComplete(formData);
  };

  const steps = [
    { id: 1, title: 'Welcome', icon: <Heart className="text-red-500" /> },
    { id: 2, title: 'Profile', icon: <User className="text-primary" /> },
    { id: 3, title: 'Health', icon: <Activity className="text-teal-custom" /> },
    { id: 4, title: 'Vitals', icon: <Wind className="text-amber-500" /> }
  ];

  return (
    <div className="fixed inset-0 z-[10000] bg-bg-custom flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-2 relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${step >= s.id ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-white dark:bg-card-custom text-text-3 border border-border-custom'}`}>
                  {step > s.id ? <Check size={20} /> : s.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider absolute -bottom-6 ${step >= s.id ? 'text-primary' : 'text-text-3'}`}>{s.title}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 bg-border-custom relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-primary"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: step > s.id ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white dark:bg-card-custom rounded-[32px] shadow-2xl border border-border-custom p-10 md:p-14 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <span className="text-4xl">👋</span>
                </div>
                <h2 className="text-3xl font-extrabold mb-4">Hello, {userName}!</h2>
                <p className="text-text-2 text-lg mb-10">We're so glad you're here. Let's take 2 minutes to set up your health profile so we can provide the best insights for you.</p>
                <button 
                  onClick={nextStep}
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 text-lg"
                >
                  Let's Get Started <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <User size={24} className="text-primary" />
                  Tell us a bit about yourself
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="block text-xs font-bold text-text-3 mb-2 uppercase tracking-wide">Age</label>
                      <input 
                        type="number"
                        className="w-full p-4 bg-bg-custom border border-border-custom rounded-xl outline-none focus:border-primary transition-colors text-lg font-medium"
                        placeholder="e.g. 28"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="block text-xs font-bold text-text-3 mb-2 uppercase tracking-wide">Blood Type</label>
                      <select 
                        className="w-full p-4 bg-bg-custom border border-border-custom rounded-xl outline-none focus:border-primary transition-colors text-lg font-medium appearance-none"
                        value={formData.bloodType}
                        onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                      >
                        <option value="">Select</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-text-3 mb-4 uppercase tracking-wide">Gender</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Male', 'Female', 'Other'].map(g => (
                        <button 
                          key={g}
                          onClick={() => setFormData({...formData, gender: g})}
                          className={`py-3 rounded-xl border font-bold transition-all ${formData.gender === g ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-bg-custom border-border-custom text-text-2 hover:border-primary'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex gap-4">
                  <button onClick={prevStep} className="p-4 rounded-xl border border-border-custom hover:bg-bg-custom transition-all"><ChevronLeft size={24} /></button>
                  <button 
                    onClick={nextStep}
                    disabled={!formData.age || !formData.gender}
                    className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Continue <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <Activity size={24} className="text-teal-custom" />
                  Your Health History
                </h2>
                <p className="text-text-3 text-sm mb-8">This helps us customize your health dashboard and alerts.</p>
                <div className="space-y-6">
                  <div className="form-group">
                    <label className="block text-xs font-bold text-text-3 mb-4 uppercase tracking-wide">Chronic Conditions (Optional)</label>
                    <div className="flex flex-wrap gap-2">
                      {['Diabetes', 'Hypertension', 'Asthma', 'Thyroid', 'Heart Disease', 'None'].map(c => (
                        <button 
                          key={c}
                          onClick={() => {
                            const newConditions = formData.conditions.includes(c) 
                              ? formData.conditions.filter(item => item !== c)
                              : [...formData.conditions, c];
                            setFormData({...formData, conditions: newConditions});
                          }}
                          className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${formData.conditions.includes(c) ? 'bg-teal-custom text-white border-teal-custom shadow-lg shadow-teal-custom/20' : 'bg-bg-custom border-border-custom text-text-2 hover:border-teal-custom'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-amber-bg/30 border border-amber-custom/20 rounded-2xl p-6 flex gap-4 items-start">
                    <div className="w-10 h-10 bg-amber-bg rounded-xl flex items-center justify-center text-amber-custom shrink-0 mt-1">
                      <Droplets size={20} />
                    </div>
                    <div>
                      <h4 className="text-amber-900 dark:text-amber-200 font-bold text-sm mb-1">Privacy Guarantee</h4>
                      <p className="text-xs text-amber-800/70 dark:text-amber-200/50 leading-relaxed">Your medical information is encrypted using industry-standard protocols. Only you and professionals YOU authorize can see this data.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex gap-4">
                  <button onClick={prevStep} className="p-4 rounded-xl border border-border-custom hover:bg-bg-custom transition-all"><ChevronLeft size={24} /></button>
                  <button 
                    onClick={nextStep}
                    className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                  >
                    Continue <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <Wind size={24} className="text-amber-500" />
                  Initial Vitals
                </h2>
                <p className="text-text-3 text-sm mb-8">This will be your baseline for future tracking.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group relative">
                    <label className="block text-xs font-bold text-text-3 mb-2 uppercase tracking-wide flex items-center gap-2">
                       <Scale size={14} /> Weight (kg)
                    </label>
                    <input 
                      type="number"
                      className="w-full p-4 bg-bg-custom border border-border-custom rounded-xl outline-none focus:border-primary transition-colors text-lg font-medium"
                      placeholder="e.g. 70"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    />
                  </div>
                  <div className="form-group relative">
                    <label className="block text-xs font-bold text-text-3 mb-2 uppercase tracking-wide flex items-center gap-2">
                      <Ruler size={14} /> Height (cm)
                    </label>
                    <input 
                      type="number"
                      className="w-full p-4 bg-bg-custom border border-border-custom rounded-xl outline-none focus:border-primary transition-colors text-lg font-medium"
                      placeholder="e.g. 175"
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                    />
                  </div>
                  <div className="form-group md:col-span-2">
                    <label className="block text-xs font-bold text-text-3 mb-2 uppercase tracking-wide flex items-center gap-2">
                      <Heart size={14} /> Current Heart Rate (BPM)
                    </label>
                    <div className="flex gap-4 items-center">
                      <input 
                        type="number"
                        className="flex-1 p-4 bg-bg-custom border border-border-custom rounded-xl outline-none focus:border-primary transition-colors text-lg font-medium"
                        placeholder="e.g. 72"
                        value={formData.pulse}
                        onChange={(e) => setFormData({...formData, pulse: e.target.value})}
                      />
                      <div className="w-14 h-14 bg-red-bg rounded-xl flex items-center justify-center text-red-custom animate-pulse shadow-inner">
                        <Activity size={24} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex gap-4">
                  <button onClick={prevStep} className="p-4 rounded-xl border border-border-custom hover:bg-bg-custom transition-all"><ChevronLeft size={24} /></button>
                  <button 
                    onClick={handleComplete}
                    className="flex-1 py-4 bg-teal-custom text-white font-bold rounded-2xl shadow-xl shadow-teal-custom/20 hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                  >
                    Complete Onboarding <Check size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
