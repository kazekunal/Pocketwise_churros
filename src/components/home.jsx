'use client'
import React, { useState, useEffect } from 'react';
import { CreditCard, Building2, Shield, ArrowRight, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

function FeatureCard({ icon, title, description, delay, isVisible }) {
  return (
    <div className={`p-6 rounded-xl bg-slate-50 border hover:bg-slate-200 transition-all duration-1000 ease-out cursor-pointer ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`} style={{ transitionDelay: `${delay}ms` }}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    router.push('/signin');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className={`container mx-auto px-4 sm:px-6 py-6 flex justify-between items-center transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div className="flex items-center">
          <div className="text-2xl font-bold text-slate-900">moneyflow</div>
          <div className="hidden md:flex space-x-8 ml-12">
            <button className="text-slate-600 hover:text-slate-900 transition-colors">Products</button>
            <button className="text-slate-600 hover:text-slate-900 transition-colors">Customers</button>
            <button className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</button>
            <button className="text-slate-600 hover:text-slate-900 transition-colors">Learn</button>
          </div>
        </div>
        <div className="hidden md:flex space-x-4">
          <button 
            className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors" 
            onClick={handleLogin}
          >
            Login
          </button>
          <button 
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </div>
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-6 h-6 text-slate-900" />
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button className="block w-full text-left text-slate-600 hover:text-slate-900 py-2">Products</button>
            <button className="block w-full text-left text-slate-600 hover:text-slate-900 py-2">Customers</button>
            <button className="block w-full text-left text-slate-600 hover:text-slate-900 py-2">Pricing</button>
            <button className="block w-full text-left text-slate-600 hover:text-slate-900 py-2">Learn</button>
            <div className="pt-4 space-y-2">
              <button 
                className="block w-full py-2 text-slate-600 hover:text-slate-900 transition-colors"
                onClick={handleLogin}
              >
                Login
              </button>
              <button 
                className="block w-full py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                onClick={handleSignUp}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-24 py-20 lg:py-44">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h1 className={`text-4xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6 transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              Track, Save, and Thrive like a <br className="hidden sm:block"/> Gen Z pro!
            </h1>
            <p className={`text-lg text-slate-600 mb-8 transition-all duration-1000 delay-300 ease-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              Smart financial tools for students with simple expense tracking, automated savings, and powerful spending insights.
            </p>
            <div className={`flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 transition-all duration-1000 delay-500 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 w-full sm:w-80 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Mock Payment UI */}
          <div className={`bg-white p-6 rounded-2xl shadow-xl transform lg:rotate-2 transition-all duration-1000 delay-700 ease-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-teal-600 rounded-full" />
              <div>
                <div className="font-semibold text-slate-900">Student Account</div>
                <div className="text-sm text-slate-500">student@university.edu</div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg mb-4">
              <div className="text-sm text-slate-500">Balance</div>
              <div className="text-2xl font-bold text-slate-900">₹10,479</div>
            </div>
            <div className="space-y-3">
              <button className="w-full p-3 border border-slate-200 rounded-lg text-left flex items-center space-x-3 hover:bg-slate-50">
                <CreditCard className="w-5 h-5 text-teal-600" />
                <span>Credit Card</span>
              </button>
              <button className="w-full p-3 border border-slate-200 rounded-lg text-left flex items-center space-x-3 hover:bg-slate-50">
                <Building2 className="w-5 h-5 text-teal-600" />
                <span>Bank Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`text-sm font-semibold text-teal-600 mb-4 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            SMART FEATURES
          </div>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className={`text-3xl lg:text-4xl font-bold text-slate-900 mb-6 transition-all duration-1000 delay-300 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}>
                Experience that grows with your goals.
              </h2>
              <p className={`text-lg text-slate-600 transition-all duration-1000 delay-500 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}>
                Design a financial system that works for your student life with streamlined expense tracking and automated savings.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: <ArrowRight className="w-6 h-6 text-teal-600" />,
                title: "Smart transfers",
                description: "Create automated savings rules and schedule recurring transfers to reach your financial goals.",
                delay: 200
              },
              {
                icon: <Building2 className="w-6 h-6 text-teal-600" />,
                title: "Multiple accounts",
                description: "Manage different accounts for various purposes - savings, entertainment, education, and more.",
                delay: 200
              },
              {
                icon: <Shield className="w-6 h-6 text-teal-600" />,
                title: "Secure platform",
                description: "Bank-level security with two-factor authentication and advanced encryption.",
                delay: 200
              }
            ].map((feature, index) => (
              <FeatureCard key={index} {...feature} isVisible={isVisible} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}