'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

type AuthMode = 'login' | 'signup';

interface AuthModalContainerProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialMode?: AuthMode;
}

export function AuthModalContainer({
  isOpen: controlledIsOpen,
  onClose,
  initialMode = 'login',
}: AuthModalContainerProps) {
  const [internalMode, setInternalMode] = useState<AuthMode>(initialMode);
  const [isOpen, setIsOpen] = useState(false);

  const currentIsOpen = controlledIsOpen !== undefined ? controlledIsOpen : isOpen;
  const currentOnClose = onClose || (() => setIsOpen(false));

  const mode = controlledIsOpen !== undefined ? internalMode : internalMode;

  const setMode = (newMode: AuthMode) => {
    setInternalMode(newMode);
  };

  const openLogin = () => setMode('login');
  const openSignup = () => setMode('signup');

  const handleClose = () => {
    currentOnClose();
  };

  return (
    <>
      {!controlledIsOpen && (
        <div className="hidden lg:flex lg:items-center lg:gap-x-4">
          <button
            onClick={() => {
              openLogin();
              setIsOpen(true);
            }}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => {
              openSignup();
              setIsOpen(true);
            }}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Sign Up
          </button>
        </div>
      )}

      <Modal
        isOpen={currentIsOpen}
        onClose={handleClose}
        title={mode === 'login' ? 'Welcome Back' : 'Create Account'}
        size="md"
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {mode === 'signup' && (
            <Input
              label="Display Name"
              type="text"
              placeholder="Your name"
              required
              autoComplete="name"
            />
          )}
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          {mode === 'signup' && (
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
            />
          )}

          <div className="pt-2">
            <Button type="submit" className="w-full" size="lg">
              {mode === 'login' ? 'Log In' : 'Create Account'}
            </Button>
          </div>

          <div className="text-center text-sm">
            {mode === 'login' ? (
              <p className="text-slate-600">
                {"Don't have an account? "}
                <button
                  type="button"
                  onClick={openSignup}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-slate-600">
                {"Already have an account? "}
                <button
                  type="button"
                  onClick={openLogin}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
}
