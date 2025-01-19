'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../components/firebase";
import { toast } from "react-toastify";
import { getDoc, doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Check if user exists in Firestore
      const usersRef = doc(db, "users", formData.email);
      const userDoc = await getDoc(usersRef);
      
      if (!userDoc.exists()) {
        toast.error("No account found. Please sign up first.");
        router.push('/signup');
        return;
      }

      // Attempt to sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // Successful sign in
      toast.success("Successfully signed in!", {
        position: "top-center",
      });
      router.push('/track');

    } catch (error) {
      console.error("Sign in error:", error);
      let errorMessage = "Failed to sign in";
      
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = "Incorrect password. Please try again.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address.";
          break;
        case 'auth/user-disabled':
          errorMessage = "This account has been disabled.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        default:
          errorMessage = "Error signing in. Please try again.";
      }
      
      toast.error(errorMessage, {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // User exists in Firestore, proceed with login
        toast.success("Successfully signed in!", {
          position: "top-center",
        });
        router.push('/track');
      } else {
        // User authenticated with Google but not in Firestore
        toast.info("Please complete your profile setup", {
          position: "top-center",
        });
        router.push('/signup');
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Failed to sign in with Google", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implement password reset functionality
    router.push('/forgot-password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 to-cyan-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-slate-900 mb-4">PocketWise</div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="text-slate-600 mt-2">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
              />
              <Label htmlFor="remember" className="ml-2 text-sm text-slate-600">
                Remember me
              </Label>
            </div>
            <Button 
              type="button" 
              variant="ghost"
              onClick={handleForgotPassword}
              className="text-sm text-teal-600 hover:text-teal-700"
            >
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-3 rounded-md hover:bg-slate-50 transition-colors"
            disabled={isLoading}
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-teal-600 hover:text-teal-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}