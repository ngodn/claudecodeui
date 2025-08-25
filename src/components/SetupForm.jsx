import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ClaudeLogo from './ClaudeLogo';
import { BackgroundBoxes } from './ui/BackgroundBoxes';
import CometCard from './ui/CometCard';
import { PlaceholdersAndVanishInput } from './ui/PlaceholdersAndVanishInput';

const SetupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentField, setCurrentField] = useState('username');
  
  const { register } = useAuth();

  const validateAndProceed = (fieldType, value) => {
    setError('');
    
    if (fieldType === 'username') {
      if (value.length < 3) {
        setError('Username must be at least 3 characters long');
        return false;
      }
      setCurrentField('password');
    } else if (fieldType === 'password') {
      if (value.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      setCurrentField('confirmPassword');
    } else if (fieldType === 'confirmPassword') {
      if (value !== password) {
        setError('Passwords do not match');
        return false;
      }
      handleFinalSubmit();
    }
    return true;
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    
    const result = await register(username, password);
    
    if (!result.success) {
      setError(result.error);
      setCurrentField('username'); // Reset to first field on error
    }
    
    setIsLoading(false);
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && !isLoading) {
      validateAndProceed('username', username);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.trim() && !isLoading) {
      validateAndProceed('password', password);
    }
  };

  const handleConfirmPasswordSubmit = (e) => {
    e.preventDefault();
    if (confirmPassword.trim() && !isLoading) {
      validateAndProceed('confirmPassword', confirmPassword);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundBoxes />
      <div className="w-full max-w-2xl relative z-10">
        <CometCard className="w-full">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg shadow-lg border border-border p-8 space-y-8">
            {/* Logo and Title */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-foreground">The Canvas of Clea</h1>
              <p className="text-muted-foreground text-lg">
                Set up your account to get started
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center justify-center space-x-4">
              <div className={`w-3 h-3 rounded-full transition-colors ${
                currentField === 'username' ? 'bg-blue-500' : 
                ['password', 'confirmPassword'].includes(currentField) ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <div className={`w-3 h-3 rounded-full transition-colors ${
                currentField === 'password' ? 'bg-blue-500' : 
                currentField === 'confirmPassword' ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              <div className={`w-3 h-3 rounded-full transition-colors ${
                currentField === 'confirmPassword' ? 'bg-blue-500' : 'bg-gray-300'
              }`} />
            </div>

            {/* Setup Form */}
            <div className="space-y-6">
              {currentField === 'username' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground text-center">Choose your username</h2>
                  <PlaceholdersAndVanishInput
                    placeholders={[
                      "Enter your username...",
                      "Choose a unique identifier...",
                      "What should we call you?",
                      "Pick your username..."
                    ]}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onSubmit={handleUsernameSubmit}
                    disabled={isLoading}
                    className="max-w-none"
                  />
                </div>
              )}

              {currentField === 'password' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground text-center">Create a secure password</h2>
                  <PlaceholdersAndVanishInput
                    placeholders={[
                      "Enter your password...",
                      "Make it secure and memorable...",
                      "At least 6 characters...",
                      "Choose a strong password..."
                    ]}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onSubmit={handlePasswordSubmit}
                    type="password"
                    disabled={isLoading}
                    className="max-w-none"
                  />
                  <button
                    onClick={() => setCurrentField('username')}
                    className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                    disabled={isLoading}
                  >
                    ← Back to username
                  </button>
                </div>
              )}

              {currentField === 'confirmPassword' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground text-center">Confirm your password</h2>
                  <PlaceholdersAndVanishInput
                    placeholders={[
                      "Confirm your password...",
                      "Type your password again...",
                      "Make sure they match...",
                      "Verify your password..."
                    ]}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onSubmit={handleConfirmPasswordSubmit}
                    type="password"
                    disabled={isLoading}
                    className="max-w-none"
                  />
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setCurrentField('password')}
                      className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                      disabled={isLoading}
                    >
                      ← Back to password
                    </button>
                    {isLoading && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <span>Setting up account...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-400 text-center">{error}</p>
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                This is a single-user system. Only one account can be created.
              </p>
            </div>
          </div>
        </CometCard>
      </div>
    </div>
  );
};

export default SetupForm;