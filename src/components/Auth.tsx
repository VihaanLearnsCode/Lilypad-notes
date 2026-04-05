import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Auth: React.FC = () => {
  const { user, signIn, signOut } = useAuth();

  if (user) {
    return (
      <div className="auth-container">
        <div className="user-info">
          <img 
            src={user.photoURL || ''} 
            alt="User avatar" 
            className="user-avatar"
          />
          <span className="user-name">{user.displayName}</span>
          <button onClick={signOut} className="sign-out-btn">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div className="relative z-10">
        <div className="auth-prompt">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-xl">
              <span className="text-3xl">🌿</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Welcome to Lilypad Notes</h2>
            <p className="text-white/90 text-center mb-8 text-lg">Your beautiful digital garden for notes</p>
          </div>
          <button 
            onClick={signIn} 
            className="sign-in-btn group"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25-.07a8.46 8.46 0 00-5.91-5.91 8.46 8.46 0 00-8.34 2.56L6.3 18.75l5.9 5.9c.83.83 1.96 1.96 3.15 1.96 1.2 0 2.34-.4 3.15-1.15l3.62-3.62c.75-.75 1.15-1.95 1.15-3.15 0-2.34-1.96-4.2-5.91L12.25 2.25a8.46 8.46 0 00-5.91 5.91 8.46 8.46 0 008.34 2.56l-5.9 5.9c-.83.83-1.96 1.96-3.15 1.96-1.2 0-2.34-.4-3.15-1.15l-3.62-3.62c-.75-.75-1.15-1.95-1.15-3.15 0-2.34 1.96-4.2 5.91l5.9 5.9c.83.83 1.96 1.96 3.15 1.96 1.2 0 2.34-.4 3.15-1.15l3.62-3.62c.75-.75 1.15-1.95 1.15-3.15 0-2.34-1.96-4.2-5.91z"/>
                <path fill="#34A853" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              <span>Sign in with Google</span>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:bg-white/20 transition-all duration-300"></div>
          </button>
          <p className="text-white/70 text-sm text-center mt-6">
            🌸 Your notes will bloom beautifully
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
