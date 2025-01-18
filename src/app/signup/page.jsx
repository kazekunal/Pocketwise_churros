'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../components/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const checkUserExists = async (email) => {
    const usersRef = doc(db, "users", email);
    const docSnap = await getDoc(usersRef);
    return docSnap.exists();
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Check if user already exists
      const userExists = await checkUserExists(formData.email);
      
      if (userExists) {
        toast.info("Account already exists. Redirecting to sign in...");
        router.push('/signin');
        return;
      }

      // Create auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Save to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        createdAt: new Date().toISOString()
      });

      toast.success("Registration successful!");
      router.push('/survey');

    } catch (error) {
      console.error("SignUp error:", error);
      toast.error(error.message || "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists
      const userExists = await checkUserExists(user.email);
      
      if (userExists) {
        toast.info("Account already exists. Redirecting to sign in...");
        router.push('/signin');
        return;
      }

      // Save to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        photo: user.photoURL,
        createdAt: new Date().toISOString()
      });
      
      toast.success("Registration successful!");
      router.push('/survey');

    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error.message || "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 to-cyan-200 flex items-center justify-center p-4">
      <div className="container mx-auto flex items-center justify-between gap-8">
        {/* Signup Form */}
        <div className="w-1/2">
          <Card className="w-full">
            <CardHeader>
              <div className="mb-4">
                <div className="text-2xl font-bold text-slate-900">moneyflow</div>
              </div>
              <CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
              <p className="text-gray-500">Please enter your details to sign up</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleEmailSignUp}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-teal-600 text-white py-3 mt-6 rounded-md hover:bg-teal-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing up...' : 'Sign Up'}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300"></span>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button 
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <img 
                    src="/google.svg" 
                    alt="Google" 
                    className="w-5 h-5"
                  />
                  {isLoading ? 'Signing up...' : 'Sign up with Google'}
                </Button>
              </form>
              
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <Link href="/signin" className="text-teal-600 hover:text-teal-700">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Credit Card Display */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="relative w-96">
            <div className="absolute w-full h-64 bg-blue-500 rounded-2xl transform rotate-6 shadow-xl"></div>
            <div className="relative w-full h-64 bg-blue-600 rounded-2xl shadow-2xl p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white text-xl font-semibold">Adrian | JSM</p>
                  <p className="text-white text-2xl font-bold mt-1">$110.00</p>
                </div>
                <div className="text-white text-2xl">))</div>
              </div>
              <div className="space-y-2">
                <p className="text-white opacity-80 text-lg">•••• •••• •••• 0000</p>
                <div className="flex justify-between items-center">
                  <p className="text-white opacity-80">Adrian | JSM</p>
                  <img src="/mastercard-logo.png" alt="Mastercard" className="h-8 w-12 object-contain"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}