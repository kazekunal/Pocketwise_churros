'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const router = useRouter();
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter your last name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter your specific address" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Enter your city" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="Example: NY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" placeholder="Example: 11101" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" placeholder="YYYY-MM-DD" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ssn">SSN</Label>
                  <Input id="ssn" placeholder="Example: 1234" type="password" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" />
              </div>
              
              <Button className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition-colors">
                Sign Up
              </Button>
              
              <p className="text-center text-sm text-gray-600">
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
            {/* Main Card */}
            <div className="absolute w-full h-64 bg-blue-500 rounded-2xl transform rotate-6 shadow-xl"></div>
            {/* Top Card */}
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