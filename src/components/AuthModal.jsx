import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { signIn, signUp, signInWithGoogle, isDemoMode } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    let res;
    if (isSignUp) {
      res = await signUp(email, password, displayName);
    } else {
      res = await signIn(email, password);
    }

    setLoading(false);

    if (res?.error) {
      const msg = res.error.message || 'Authentication failed. Please check credentials.';
      if (msg.includes('already registered') || msg.includes('duplicate')) {
        setErrorMsg('This email address is already registered. Please sign in instead.');
      } else if (msg.includes('Invalid login')) {
        setErrorMsg('Invalid email or password. Please try again.');
      } else {
        setErrorMsg(msg);
      }
    } else {
      onClose();
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(error.message || 'Google OAuth failed.');
    } else {
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(8px)', padding: '20px'
    }}>
      <div className="modal-content" style={{
        background: 'rgba(30, 41, 59, 0.98)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        padding: '24px',
        color: '#fff',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        position: 'relative'
      }}>
        
        {/* Close Button */}
        <button
          type="button"
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span className="resource-badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-secondary)', fontSize: '10px' }}>
            {isDemoMode ? 'OFFLINE SIMULATION ACTIVE' : 'SECURE ENTRY'}
          </span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', margin: '6px 0 2px 0' }}>
            {isSignUp ? 'Create your Account' : 'Welcome to EntreVision'}
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
            {isSignUp ? 'Sign up to save matching business plans and post ideas' : 'Sign in to access your saved opportunities'}
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '6px',
            padding: '10px',
            fontSize: '11px',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <AlertCircle className="w-4 h-4" style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {isSignUp && (
            <div>
              <label className="input-label" style={{ fontSize: '11px' }}>Display Name</label>
              <div style={{ position: 'relative' }}>
                <User className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  className="text-input" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Rajesh Kumar"
                  style={{ paddingLeft: '34px', margin: 0 }}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="input-label" style={{ fontSize: '11px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                className="text-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rajesh@email.com"
                style={{ paddingLeft: '34px', margin: 0 }}
                required
              />
            </div>
          </div>

          <div>
            <label className="input-label" style={{ fontSize: '11px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                className="text-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                style={{ paddingLeft: '34px', margin: 0 }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              border: 'none',
              padding: '10px 0',
              fontWeight: 'bold',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '6px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogIn className="w-4 h-4" /> {loading ? 'Processing...' : isSignUp ? 'Register & Enter' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', fontSize: '10px', color: 'var(--text-muted)' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }}></div>
          <span style={{ padding: '0 8px' }}>OR CONTINUE WITH</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }}></div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            color: '#fff',
            padding: '9px 0',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.06)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.03)'}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C18.155 2.502 15.427 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.745-.079-1.3-.176-1.859H12.24z" />
          </svg>
          Google Account
        </button>

        {/* Mode Toggle */}
        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '12px' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {isSignUp ? 'Already registered?' : "New to the platform?"}{' '}
          </span>
          <button
            type="button"
            style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
            onClick={() => {
              setErrorMsg('');
              setIsSignUp(!isSignUp);
            }}
          >
            {isSignUp ? 'Sign In here' : 'Register an Account'}
          </button>
        </div>

      </div>
    </div>
  );
}
