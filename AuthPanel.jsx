import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, LockKeyhole, X } from 'lucide-react';
import { signIn, signOut, signUp } from './authApi.js';
import './auth.css';

export default function AuthPanel({ onClose, user, onUserChange }) {
  const [mode, setMode] = useState('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('auth-open');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('auth-open');
    };
  }, [onClose]);

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    setBusy(true);
    try {
      const account = mode === 'signup'
        ? await signUp({ full_name: fullName, email, password })
        : await signIn({ email, password });
      onUserChange(account);
      onClose();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    setMessage('');
    try {
      await signOut();
      onUserChange(null);
      setMode('signup');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  return <div className="auth-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="auth-panel" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button className="auth-close" type="button" onClick={onClose} aria-label="Close sign in"><X size={19} /></button>
      <div className="auth-art">
        <span className="auth-kicker">ENIGMA TECH CLUB / MEMBER ACCESS</span>
        <div className="auth-orbit auth-orbit--one" /><div className="auth-orbit auth-orbit--two" />
        <span className="auth-mark">e<span>.</span></span>
        <div className="auth-art-note"><span>YOUR PEOPLE ARE HERE.</span><small>IDEAS IN MOTION — SINCE 2018</small></div>
      </div>
      <div className="auth-content">
        {user ? <>
          <p className="auth-eyebrow"><LockKeyhole size={14} /> MEMBER ACCOUNT</p>
          <h2 id="auth-title">Good to<br /><span>see you.</span></h2>
          <p className="auth-intro">You’re signed in as <strong>{user.email}</strong>.</p>
          {message && <p className="auth-message" role="alert">{message}</p>}
          <button className="auth-submit" type="button" onClick={logout} disabled={busy}>{busy ? 'PLEASE WAIT…' : 'SIGN OUT'} <ArrowRight size={17} /></button>
        </> : <>
          <p className="auth-eyebrow"><LockKeyhole size={14} /> {mode === 'signup' ? 'A PLACE IN THE CLUB' : 'MEMBER ACCESS'}</p>
          <h2 id="auth-title">{mode === 'signup' ? <>Find your<br /><span>people.</span></> : <>Welcome<br /><span>back.</span></>}</h2>
          <p className="auth-intro">{mode === 'signup' ? 'Make an account and get closer to what we’re building.' : 'Sign in to your Enigma member account.'}</p>
          <form className="auth-form" onSubmit={submit}>
            {mode === 'signup' && <label>FULL NAME<input autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required maxLength={150} /></label>}
            <label>EMAIL ADDRESS<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <label>PASSWORD<input type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={mode === 'signup' ? 8 : undefined} /></label>
            {mode === 'signup' && <small className="auth-hint">Use at least 8 characters. We’ll keep your account details private.</small>}
            {message && <p className="auth-message" role="alert">{message}</p>}
            <button className="auth-submit" type="submit" disabled={busy}>{busy ? 'PLEASE WAIT…' : mode === 'signup' ? 'CREATE ACCOUNT' : 'SIGN IN'} <ArrowRight size={17} /></button>
          </form>
          <button className="auth-switch" type="button" onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setMessage(''); }}><ArrowLeft size={14} /> {mode === 'signup' ? 'ALREADY A MEMBER? SIGN IN' : 'NEW TO ENIGMA? CREATE AN ACCOUNT'}</button>
        </>}
      </div>
    </section>
  </div>;
}
