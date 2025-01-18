'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Function to handle Google Sign In callback
  const handleGoogleSignIn = (response) => {
    if (response.credential) {
      // You can decode the credential to get user info if needed
      // const credential = jwt_decode(response.credential);
      console.log('Successfully signed in with Google');
      router.push('/survey');
    }
  };

  useEffect(() => {
    // Initialize Google Sign In
    const initializeGoogleSignIn = () => {
      if (typeof window !== 'undefined' && window.google) {
        google.accounts.id.initialize({
          client_id: '623233948485-slf000dhm47b5fecqjungq7tp25omsde.apps.googleusercontent.com',
          callback: handleGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        google.accounts.id.renderButton(
          document.getElementById('googleSignInDiv'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
          }
        );
      }
    };

    // Set callback in window scope
    window.handleGoogleSignIn = handleGoogleSignIn;
    
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initializeGoogleSignIn;
    script.async = true;
    script.id = 'google-client-script';
    document.querySelector('head')?.appendChild(script);

    return () => {
      // Cleanup
      const scriptTag = document.getElementById('google-client-script');
      if (scriptTag) {
        scriptTag.remove();
      }
    };
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempted with:', { email, password });
    router.push('/survey');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 to-cyan-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="text-slate-600 mt-2">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-600">
                Remember me
              </label>
            </div>
            <button type="button" className="text-sm text-teal-600 hover:text-teal-700">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition-colors"
          >
            Sign In
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* New Google Sign-In Button Container */}
          <div id="googleSignInDiv" className="mt-6 flex justify-center"></div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/signup')}
              className="text-teal-600 hover:text-teal-700"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}