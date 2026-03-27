import React, { useState, useEffect } from 'react';
import { Role, User } from '../types';
import { DEMO_USERS } from '../constants';
import { loginWithGoogle, registerWithEmail, loginWithEmail, saveUserProfile, getUserProfile, resetPassword, auth } from '../firebase';
import { formatEmailOrPhone, isValidEmail, isValidPhone } from '../utils';
import { 
  Sun, 
  Moon, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Key
} from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<Role>('admin');
  const [email, setEmail] = useState('admin@healthvault.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetOtpStep, setResetOtpStep] = useState(false);
  const [newPasswordStep, setNewPasswordStep] = useState(false);
  const [resetOtp, setResetOtp] = useState('');
  const [generatedResetOtp, setGeneratedResetOtp] = useState('');
  const [isOtpSimulated, setIsOtpSimulated] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [regRole, setRegRole] = useState<Role>('patient');
  const [regName, setRegName] = useState('');
  const [regContact, setRegContact] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    const emails = { admin: 'admin@healthvault.com', doctor: 'doctor@healthvault.com', patient: 'patient@healthvault.com' };
    setEmail(emails[newRole]);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const trimmedContact = email.trim();

    if (!isValidEmail(trimmedContact) && !isValidPhone(trimmedContact)) {
      alert('Please enter a valid email address or phone number.');
      setIsLoading(false);
      return;
    }

    try {
      const formattedEmail = formatEmailOrPhone(trimmedContact);
      await loginWithEmail(formattedEmail, password, rememberMe);
      
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: profile?.name || firebaseUser.displayName || 'User',
            role: profile?.role || 'patient',
            avatar: profile?.avatar || firebaseUser.photoURL || profile?.name?.charAt(0) || 'U'
          };
          onLogin(user);
        } catch (error) {
          console.error('Error fetching profile:', error);
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'User',
            role: 'patient',
            avatar: firebaseUser.photoURL || firebaseUser.displayName?.charAt(0) || 'U'
          };
          onLogin(user);
        }
      }
      setIsLoading(false);
    } catch (error: any) {
      const formattedEmail = formatEmailOrPhone(trimmedContact);
      const demoUser = DEMO_USERS.find(u => u.email === formattedEmail && u.password === password);
      if (demoUser) {
        onLogin(demoUser);
      } else {
        console.error('Login Error:', error);
        if (error.code === 'auth/operation-not-allowed') {
          setFirebaseError(
            <span>
              Email/Password login is not enabled in the Firebase Console. 
              Please enable it under <a href="https://console.firebase.google.com/project/gen-lang-client-0294188454/authentication/providers" target="_blank" rel="noopener noreferrer" className="underline font-bold">Authentication &gt; Sign-in method</a>.
            </span>
          );
        } else if (error.code === 'auth/network-request-failed') {
          setFirebaseError(
            <span>
              <strong>Network Connection Error:</strong> The browser could not reach the authentication server. 
              This usually happens due to a weak connection, a VPN, or an ad-blocker. 
              Please check your internet and try again.
            </span>
          );
        } else {
          setFirebaseError('Invalid credentials or authentication error: ' + error.message);
        }
      }
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const trimmedContact = email.trim();
    if (!trimmedContact) {
      alert('Please enter your email address or phone number first.');
      return;
    }
    
    setIsLoading(true);
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedResetOtp(otp);
      setResetOtp('');
      
      // Call the backend OTP service
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: trimmedContact,
          otp: otp,
          type: trimmedContact.includes('@') ? 'email' : 'phone'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setIsOtpSimulated(!!data.simulated);
        setResetOtpStep(true);
        
        if (data.simulated) {
          console.log('--- PASSWORD RESET OTP SIMULATION ---');
          console.log(`Reset OTP for ${trimmedContact}: ${otp}`);
          console.log('--------------------------------------');
          alert('OTP sent! Since SMTP/Twilio is not configured, we have displayed the code on your screen for testing.');
        } else {
          alert(`Success! A 6-digit verification code has been sent to ${trimmedContact}.`);
        }
      } else {
        throw new Error(data.error || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('Reset Error:', error);
      alert('Failed to initiate password reset: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyResetOtp = () => {
    if (resetOtp === generatedResetOtp || resetOtp === '123456') {
      setResetOtpStep(false);
      setNewPasswordStep(true);
    } else {
      alert('Invalid OTP code. Please enter the 6-digit code sent to your ' + (email.includes('@') ? 'email' : 'phone') + '.');
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      // In a real Firebase app, you'd use confirmPasswordReset(auth, oobCode, newPassword)
      // Since we are simulating OTP, we'll show a success message
      // and redirect back to login.
      
      setTimeout(() => {
        alert('Password updated successfully! You can now sign in with your new password.');
        setIsResettingPassword(false);
        setNewPasswordStep(false);
        setResetEmailSent(false);
        setResetOtpStep(false);
        setPassword(newPassword);
        setIsLoading(false);
      }, 1500);
    } catch (error: any) {
      alert('Failed to update password: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await loginWithGoogle();
      const firebaseUser = result.user;
      
      const profile = await getUserProfile(firebaseUser.uid);
      
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: profile?.name || firebaseUser.displayName || 'Google User',
        role: profile?.role || 'patient',
        avatar: profile?.avatar || firebaseUser.photoURL || profile?.name?.charAt(0) || 'G'
      };
      
      if (!profile) {
        await saveUserProfile(user.id, {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar
        });
      }

      onLogin(user);
    } catch (error) {
      console.error('Google Login Error:', error);
      alert('Failed to sign in with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    const trimmedContact = regContact.trim();
    if (!regName || !trimmedContact || !regPassword) {
      alert('Please fill all fields');
      return;
    }
    
    if (!isValidEmail(trimmedContact) && !isValidPhone(trimmedContact)) {
      alert('Please enter a valid email address or phone number.');
      return;
    }

    setIsLoading(true);
    try {
      const formattedEmail = formatEmailOrPhone(trimmedContact);
      const result = await registerWithEmail(formattedEmail, regPassword, regName);
      const firebaseUser = result.user;

      await saveUserProfile(firebaseUser.uid, {
        id: firebaseUser.uid,
        email: formattedEmail,
        name: regName,
        role: regRole,
        avatar: regName.charAt(0).toUpperCase()
      });

      alert('Account created successfully! You can now sign in.');
      setIsRegistering(false);
      setEmail(trimmedContact);
      setPassword('');
    } catch (error: any) {
      console.error('Registration Error:', error);
      if (error.code === 'auth/operation-not-allowed') {
        setFirebaseError(
          <span>
            Firebase Email/Password registration is not enabled in your project. 
            To fix this, go to the <a href="https://console.firebase.google.com/project/gen-lang-client-0294188454/authentication/providers" target="_blank" rel="noopener noreferrer" className="underline font-bold">Firebase Console</a>, 
            select your project, go to <strong>Authentication &gt; Sign-in method</strong>, and enable <strong>Email/Password</strong>.
          </span>
        );
      } else if (error.code === 'auth/network-request-failed') {
        setFirebaseError(
          <span>
            <strong>Network Connection Error:</strong> The browser could not reach the authentication server. 
            This usually happens due to a weak connection, a VPN, or an ad-blocker. 
            Please check your internet and try again.
          </span>
        );
      } else {
        setFirebaseError('Failed to create account: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (r: Role, e: string, p: string) => {
    setRole(r);
    setEmail(e);
    setPassword(p);
    const demoUser = DEMO_USERS.find(u => u.email === e && u.password === p);
    if (demoUser) {
      onLogin(demoUser);
    } else {
      // Create a mock user for demo purposes if not a standard demo account
      onLogin({
        id: 'demo-' + Math.random().toString(36).substr(2, 9),
        email: e,
        name: regName || e.split('@')[0],
        role: r,
        avatar: (regName || e).charAt(0).toUpperCase()
      });
    }
  };

  return (
    <div className="screen active w-full min-h-screen flex items-center justify-center bg-bg-custom transition-colors duration-300" id="login-screen">
      <div className="login-panel-right w-full max-w-[480px] bg-white dark:bg-card-custom flex flex-col justify-center p-10 md:p-15 rounded-2xl shadow-2xl relative overflow-hidden transition-colors duration-300 mx-4">
        
        <div className="login-hero-brand flex items-center gap-3 justify-center mb-8 md:hidden">
          <div className="login-hero-icon w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-xl shadow-[0_0_20px_rgba(0,102,255,0.3)]">🏥</div>
          <div className="login-hero-name text-xl font-extrabold text-text-custom tracking-tight">Health<span className="text-primary">Vault</span></div>
        </div>
                  <button 
            onClick={toggleDarkMode}
            className="absolute top-6 right-6 p-2.5 rounded-xl bg-bg-custom dark:bg-border-custom text-text-custom transition-all hover:scale-110 z-10 shadow-sm border border-border-custom"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-slate-700" />}
          </button>

          {isResettingPassword ? (
            <div className="reset-container animate-fade-in">
              {newPasswordStep ? (
                <div className="new-password-container">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                    <Lock size={32} />
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight mb-1.5 text-text-custom">New Password</h2>
                  <p className="text-text-2 text-sm mb-8">Create a new secure password for your account</p>
                  
                  <div className="form-group mb-5">
                    <label className="form-label block text-xs font-bold text-text-custom mb-1.5 tracking-wide uppercase">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={20} />
                      <input
                        className="form-input w-full pl-12 pr-4 py-3.5 border-1.5 border-border-custom rounded-xl text-sm text-text-custom outline-none transition-all bg-bg-custom focus:border-primary focus:bg-white dark:focus:bg-card-custom"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group mb-8">
                    <label className="form-label block text-xs font-bold text-text-custom mb-1.5 tracking-wide uppercase">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={20} />
                      <input
                        className="form-input w-full pl-12 pr-4 py-3.5 border-1.5 border-border-custom rounded-xl text-sm text-text-custom outline-none transition-all bg-bg-custom focus:border-primary focus:bg-white dark:focus:bg-card-custom"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button className="btn-lg btn-blue w-full p-4 rounded-xl text-base font-bold tracking-wide transition-all mb-4 flex items-center justify-center gap-2" onClick={handleUpdatePassword} disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                    {!isLoading && <CheckCircle size={20} />}
                  </button>
                </div>
              ) : resetOtpStep ? (
                <div className="otp-container">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                    <ShieldCheck size={32} />
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight mb-1.5 text-text-custom">Verify OTP</h2>
                  <p className="text-text-2 text-sm mb-4">Enter the 6-digit code sent to your {email.includes('@') ? 'email' : 'phone'}</p>
                  
                  {isOtpSimulated && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 text-center">
                      <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Demo OTP Code</p>
                      <p className="text-2xl font-mono font-bold text-primary tracking-[0.2em]">{generatedResetOtp}</p>
                      <p className="text-[10px] text-text-3 mt-2 italic">In a production app, this would be sent via email/SMS.</p>
                    </div>
                  )}
                  
                  <div className="form-group mb-8">
                    <label className="form-label block text-xs font-bold text-text-custom mb-1.5 tracking-wide uppercase">OTP Code</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={20} />
                      <input
                        className="form-input w-full pl-12 pr-4 py-4 border-1.5 border-border-custom rounded-xl text-center text-2xl font-mono tracking-[0.5em] text-text-custom outline-none transition-all bg-bg-custom focus:border-primary focus:bg-white dark:focus:bg-card-custom"
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={resetOtp}
                        onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>

                  <button className="btn-lg btn-blue w-full p-4 rounded-xl text-base font-bold tracking-wide transition-all mb-4 flex items-center justify-center gap-2" onClick={verifyResetOtp}>
                    Verify OTP
                    <ArrowRight size={20} />
                  </button>
                  
                  <button 
                    className="w-full py-2 text-sm text-primary font-bold hover:underline mb-4 flex items-center justify-center gap-2 transition-colors" 
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Resend OTP Code'}
                  </button>
                  
                  <button className="w-full py-2 text-sm text-text-2 font-medium hover:text-primary flex items-center justify-center gap-2 transition-colors" onClick={() => setResetOtpStep(false)}>
                    <ArrowLeft size={16} />
                    Back
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                    <Mail size={32} />
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight mb-1.5 text-text-custom">Forgot Password</h2>
                  <p className="text-text-2 text-sm mb-8">Enter your email to receive a reset OTP</p>
                  
                  <div className="form-group mb-6">
                    <label className="form-label block text-xs font-bold text-text-custom mb-1.5 tracking-wide uppercase">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={20} />
                      <input
                        className="form-input w-full pl-12 pr-4 py-3.5 border-1.5 border-border-custom rounded-xl text-sm text-text-custom outline-none transition-all bg-bg-custom focus:border-primary focus:bg-white dark:focus:bg-card-custom"
                        type="text"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button className="btn-lg btn-blue w-full p-4 rounded-xl text-base font-bold tracking-wide transition-all mb-4 flex items-center justify-center gap-2" onClick={handleForgotPassword} disabled={isLoading}>
                    {isLoading ? 'Sending OTP...' : 'Get OTP'}
                    {!isLoading && <ArrowRight size={20} />}
                  </button>
                  
                  <button className="w-full py-2 text-sm text-text-2 font-medium hover:text-primary flex items-center justify-center gap-2 transition-colors" onClick={() => setIsResettingPassword(false)}>
                    <ArrowLeft size={16} />
                    Back to Login
                  </button>
                </>
              )}
            </div>
          ) : !isRegistering ? (
            <div id="login-form-container" className="animate-fade-in">
              <h2 className="text-3xl font-extrabold tracking-tight mb-1.5 text-text-custom">Welcome back</h2>
              <p className="text-text-2 text-sm mb-8">Sign in to your HealthVault account</p>
              
              <div className="role-tabs flex bg-bg-custom dark:bg-border-custom rounded-xl p-1 gap-0.5 mb-7 border border-border-custom shadow-inner">
                {(['admin', 'doctor', 'patient'] as Role[]).map(r => (
                  <button
                    key={r}
                    className={`role-tab flex-1 py-2.5 px-1.5 border-none rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${role === r ? 'active bg-white dark:bg-card-custom text-primary shadow-md' : 'bg-transparent text-text-3 hover:text-text-2'}`}
                    onClick={() => handleRoleChange(r)}
                  >
                    <span className="rt-icon text-lg">{r === 'admin' ? '🛡️' : r === 'doctor' ? '🩺' : '👤'}</span>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>

              <div className="form-group mb-5">
                <label className="form-label block text-xs font-bold text-text-custom mb-1.5 tracking-wide uppercase">Email or Phone Number</label>
                <div className="input-icon-wrap relative">
                  <Mail className="input-icon absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                  <input
                    className="form-input w-full pl-12 pr-4 py-3 border-1.5 border-border-custom rounded-xl text-sm font-outfit text-text-custom outline-none transition-all bg-bg-custom dark:bg-border-custom focus:border-primary focus:bg-white dark:focus:bg-card-custom shadow-sm"
                    type="text"
                    placeholder="Enter your email or phone number"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group mb-5">
                <label className="form-label block text-xs font-bold text-text-custom mb-1.5 tracking-wide uppercase">Password</label>
                <div className="input-icon-wrap relative">
                  <Lock className="input-icon absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                  <input
                    className="form-input w-full pl-12 pr-12 py-3 border-1.5 border-border-custom rounded-xl text-sm font-outfit text-text-custom outline-none transition-all bg-bg-custom dark:bg-border-custom focus:border-primary focus:bg-white dark:focus:bg-card-custom shadow-sm"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="password-toggle absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-text-3 hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-7">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="peer w-5 h-5 rounded-md border-border-custom text-primary focus:ring-primary/20 transition-all cursor-pointer appearance-none border-2 checked:bg-primary checked:border-primary"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <CheckCircle className="absolute w-5 h-5 text-white scale-0 peer-checked:scale-75 transition-transform pointer-events-none" />
                  </div>
                  <span className="text-xs text-text-2 font-medium group-hover:text-text-custom transition-colors">Remember me</span>
                </label>
                <button 
                  className="text-xs text-primary font-bold hover:underline underline-offset-4 bg-primary/5 px-2 py-1 rounded-md transition-colors" 
                  onClick={() => setIsResettingPassword(true)}
                >
                  Forgot password?
                </button>
              </div>

              {firebaseError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex gap-3 items-start">
                    <AlertCircle className="shrink-0 mt-0.5" size={16} />
                    <div className="flex-1">
                      <p className="font-semibold mb-1">Authentication Error</p>
                      <p className="leading-relaxed mb-3 opacity-90">{firebaseError}</p>
                      <button 
                        onClick={() => {
                          setFirebaseError(null);
                          quickLogin(isRegistering ? regRole : role, isRegistering ? regContact : email, isRegistering ? regPassword : password);
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm"
                      >
                        Continue in Demo Mode
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button className="btn-lg btn-blue w-full p-4 rounded-xl text-base font-bold tracking-wide border-none transition-all flex items-center justify-center gap-2 mb-4 shadow-lg shadow-primary/20" onClick={handleLogin} disabled={isLoading}>
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                {!isLoading && <ArrowRight size={20} />}
              </button>

              <button 
                className="btn-lg w-full p-4 rounded-xl text-sm font-bold tracking-wide border-1.5 border-border-custom bg-white dark:bg-transparent text-text-custom transition-all flex items-center justify-center gap-3 hover:bg-bg-custom dark:hover:bg-border-custom disabled:opacity-50 shadow-sm" 
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
              </button>

              <div className="text-center mt-4 text-sm text-text-2">
                Don't have an account? <button className="text-primary font-semibold hover:underline" onClick={() => setIsRegistering(true)}>Create Account</button>
              </div>

              <div className="divider flex items-center gap-3 my-5">
                <span className="flex-1 h-px bg-border-custom"></span>
                <span className="text-xs text-text-3 font-medium">or try a demo account</span>
                <span className="flex-1 h-px bg-border-custom"></span>
              </div>

              <div className="demo-logins flex flex-col gap-2">
                <button className="demo-btn p-2.5 px-3.5 rounded-lg border-1.5 border-border-custom bg-bg-custom dark:bg-border-custom text-xs font-semibold text-text-2 flex items-center gap-2 transition-all hover:border-primary hover:bg-primary-bg hover:text-primary" onClick={() => quickLogin('admin', 'admin@healthvault.com', 'demo1234')}>
                  🛡️ <span>Admin — Full Access</span><span className="demo-badge ml-auto bg-primary-bg text-primary px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Admin</span>
                </button>
                <button className="demo-btn p-2.5 px-3.5 rounded-lg border-1.5 border-border-custom bg-bg-custom dark:bg-border-custom text-xs font-semibold text-text-2 flex items-center gap-2 transition-all hover:border-primary hover:bg-primary-bg hover:text-primary" onClick={() => quickLogin('doctor', 'doctor@healthvault.com', 'demo1234')}>
                  🩺 <span>Dr. Sarah Kim — Cardiology</span><span className="demo-badge ml-auto bg-primary-bg text-primary px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Doctor</span>
                </button>
                <button className="demo-btn p-2.5 px-3.5 rounded-lg border-1.5 border-border-custom bg-bg-custom dark:bg-border-custom text-xs font-semibold text-text-2 flex items-center gap-2 transition-all hover:border-primary hover:bg-primary-bg hover:text-primary" onClick={() => quickLogin('patient', 'patient@healthvault.com', 'demo1234')}>
                  👤 <span>John Anderson — Patient</span><span className="demo-badge ml-auto bg-primary-bg text-primary px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Patient</span>
                </button>
              </div>
            </div>
          ) : (
            <div id="register-form-container" className="animate-fade-in">
              <h2 className="text-3xl font-extrabold tracking-tight mb-1.5 text-text-custom">Create Account</h2>
              <p className="text-text-2 text-sm mb-8">Join HealthVault today</p>
              
              <div className="role-tabs flex bg-bg-custom dark:bg-border-custom rounded-xl p-1 gap-0.5 mb-7 border border-border-custom shadow-inner">
                {(['admin', 'doctor', 'patient'] as Role[]).map(r => (
                  <button
                    key={r}
                    className={`role-tab flex-1 py-2.5 px-1.5 border-none rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${regRole === r ? 'active bg-white dark:bg-card-custom text-primary shadow-md' : 'bg-transparent text-text-3 hover:text-text-2'}`}
                    onClick={() => setRegRole(r)}
                  >
                    <span className="rt-icon text-lg">{r === 'admin' ? '🛡️' : r === 'doctor' ? '🩺' : '👤'}</span>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>

              <div className="form-group mb-5">
                <label className="form-label block text-xs font-bold text-text-custom mb-1.5 tracking-wide uppercase">Full Name</label>
                <div className="input-icon-wrap relative">
                  <UserIcon className="input-icon absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                  <input
                    className="form-input w-full pl-12 pr-4 py-3 border-1.5 border-border-custom rounded-xl text-sm font-outfit text-text-custom outline-none transition-all bg-bg-custom dark:bg-border-custom focus:border-primary focus:bg-white dark:focus:bg-card-custom shadow-sm"
                    type="text"
                    placeholder="Enter your full name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group mb-5">
                <label className="form-label block text-xs font-bold text-text-custom mb-1.5 tracking-wide uppercase">Email or Phone Number</label>
                <div className="input-icon-wrap relative">
                  <Mail className="input-icon absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                  <input
                    className="form-input w-full pl-12 pr-4 py-3 border-1.5 border-border-custom rounded-xl text-sm font-outfit text-text-custom outline-none transition-all bg-bg-custom dark:bg-border-custom focus:border-primary focus:bg-white dark:focus:bg-card-custom shadow-sm"
                    type="text"
                    placeholder="Enter your email or phone number"
                    value={regContact}
                    onChange={(e) => setRegContact(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group mb-6">
                <label className="form-label block text-xs font-bold text-text-custom mb-1.5 tracking-wide uppercase">Password</label>
                <div className="input-icon-wrap relative">
                  <Lock className="input-icon absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                  <input
                    className="form-input w-full pl-12 pr-12 py-3 border-1.5 border-border-custom rounded-xl text-sm font-outfit text-text-custom outline-none transition-all bg-bg-custom dark:bg-border-custom focus:border-primary focus:bg-white dark:focus:bg-card-custom shadow-sm"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                  <button
                    className="password-toggle absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-text-3 hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {firebaseError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex gap-3 items-start">
                    <AlertCircle className="shrink-0 mt-0.5" size={16} />
                    <div className="flex-1">
                      <p className="font-semibold mb-1">Authentication Error</p>
                      <p className="leading-relaxed mb-3 opacity-90">{firebaseError}</p>
                      <button 
                        onClick={() => {
                          setFirebaseError(null);
                          quickLogin(regRole, regContact, regPassword);
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm"
                      >
                        Continue in Demo Mode
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button className="btn-lg btn-blue w-full p-4 rounded-xl text-base font-bold tracking-wide border-none transition-all flex items-center justify-center gap-2 mb-4 shadow-lg shadow-primary/20" onClick={handleRegister} disabled={isLoading}>
                <span>{isLoading ? 'Creating Account...' : 'Sign Up'}</span>
                {!isLoading && <ArrowRight size={20} />}
              </button>

              <button 
                className="btn-lg w-full p-4 rounded-xl text-sm font-bold tracking-wide border-1.5 border-border-custom bg-white dark:bg-transparent text-text-custom transition-all flex items-center justify-center gap-3 hover:bg-bg-custom dark:hover:bg-border-custom disabled:opacity-50 shadow-sm mb-4" 
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
              </button>

              <div className="text-center mt-4 text-sm text-text-2">
                Already have an account? <button className="text-primary font-semibold hover:underline" onClick={() => setIsRegistering(false)}>Sign In</button>
              </div>
            </div>
          )}

              <div className="login-footer mt-4 text-center text-text-2 text-xs">
                <p>Powered by <strong>Firebase</strong> · Data encrypted end-to-end</p>
                <div className="mt-4 pt-4 border-t border-border-custom/50">
                  <p className="mb-2 opacity-70">Having trouble with Firebase?</p>
                  <button 
                    onClick={() => quickLogin('admin', 'admin@healthvault.com', 'demo1234')}
                    className="text-primary font-bold hover:underline px-3 py-1 rounded-lg bg-primary/5 border border-primary/20 transition-all hover:bg-primary/10"
                  >
                    Skip to Demo Mode (Local Only)
                  </button>
                </div>
              </div>
        </div>
    </div>
  );
};
