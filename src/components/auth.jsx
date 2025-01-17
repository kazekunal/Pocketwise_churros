'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex">
      <div className="flex-1 p-8 flex items-center justify-center">
        {children}
      </div>
      <div className="hidden lg:flex flex-1 bg-blue-50">
        <img
          src="/api/placeholder/800/900"
          alt="Authentication cover"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export function SignUp() {
    const router = useRouter();
  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4">
            <img src="/api/placeholder/40/40" alt="Horizon logo" className="h-10" />
          </div>
          <CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
          <p className="text-gray-500">Please enter your details</p>
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
          
          <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
            Sign Up
          </Button>
          
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export function SignIn() {
    const router = useRouter();
  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4">
            <img src="/api/placeholder/40/40" alt="Horizon logo" className="h-10" />
          </div>
          <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
          <p className="text-gray-500">Please enter your details</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signin-email">Email</Label>
            <Input id="signin-email" type="email" placeholder="Enter your email" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="signin-password">Password</Label>
            <Input id="signin-password" type="password" placeholder="Enter your password" />
          </div>
          
          <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
            Submit
          </Button>
          
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default { SignIn, SignUp };