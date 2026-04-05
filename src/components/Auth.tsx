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
    <div className="auth-container">
      <div className="auth-prompt">
        <h2>Welcome to Lilypad Notes</h2>
        <p>Please sign in to start taking notes</p>
        <button onClick={signIn} className="sign-in-btn">
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Auth;
