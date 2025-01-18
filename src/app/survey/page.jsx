'use client'
import React, { useState, useEffect } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import { auth, db } from '../../components/firebase';

const QuizForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    cuisine: "",
    musicgenre: "",
    moviegenre: "",
    hobby: "",
  });

  // Check authentication and existing survey
  useEffect(() => {
    const checkAuthAndSurvey = async () => {
      try {
        const user = auth.currentUser;
        
        if (!user) {
          toast.error("Please sign in first");
          router.push('/signin');
          return;
        }

        // Check if survey exists for this user
        const surveyDoc = await getDoc(doc(db, "survey", user.uid));
        
        if (surveyDoc.exists()) {
          toast.info("You have already completed the survey");
          router.push('/track');
          return;
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error checking survey:", error);
        toast.error("An error occurred while checking your survey status");
        setLoading(false);
      }
    };

    // Add an auth state listener to handle cases where auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkAuthAndSurvey();
      } else {
        toast.error("Please sign in first");
        router.push('/signin');
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const user = auth.currentUser;
      
      if (!user) {
        toast.error("Please sign in to submit the survey");
        router.push('/signin');
        return;
      }

      // Check again if survey exists before submitting
      const surveyDoc = await getDoc(doc(db, "survey", user.uid));
      
      if (surveyDoc.exists()) {
        toast.info("You have already completed the survey");
        router.push('/track');
        return;
      }

      // Add timestamp and userId to the survey data
      const surveyData = {
        ...formData,
        userId: user.uid,
        userEmail: user.email,
        submittedAt: new Date().toISOString()
      };

      // Save to Firestore
      await setDoc(doc(db, "survey", user.uid), surveyData);

      toast.success("Survey submitted successfully!");
      
      // Clear form
      setFormData({
        name: "",
        age: "",
        location: "",
        cuisine: "",
        musicgenre: "",
        moviegenre: "",
        hobby: "",
      });

      // Redirect to dashboard
      router.push('/track');

    } catch (error) {
      console.error("Error saving survey:", error);
      toast.error("Failed to submit survey. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-cyan-200">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-cyan-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-green-500 mb-4">
          Welcome to PocketWise!
        </h1>
        <p className="text-center italic mb-6">Let us get to know you better.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields remain the same... */}
          <div>
            <label htmlFor="name" className="block font-bold mb-2">
              What is your name?
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="age" className="block font-bold mb-2">
              How old are you?
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="location" className="block font-bold mb-2">
              Where are you located?
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, State"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="cuisine" className="block font-bold mb-2">
              What's your favorite cuisine?
            </label>
            <select
              id="cuisine"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="" disabled>Select an option</option>
              <option value="italian">Italian</option>
              <option value="indian">Indian</option>
              <option value="chinese">Chinese</option>
              <option value="mexican">Mexican</option>
              <option value="japanese">Japanese</option>
              <option value="thai">Thai</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="musicgenre" className="block font-bold mb-2">
              What is your favorite music genre?
            </label>
            <input
              type="text"
              id="musicgenre"
              name="musicgenre"
              value={formData.musicgenre}
              onChange={handleChange}
              placeholder="E.g., Pop, Metal"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="moviegenre" className="block font-bold mb-2">
              What is your favorite movie genre?
            </label>
            <input
              type="text"
              id="moviegenre"
              name="moviegenre"
              value={formData.moviegenre}
              onChange={handleChange}
              placeholder="E.g., Rom-Com, Crime"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="hobby" className="block font-bold mb-2">
              What's your favorite hobby?
            </label>
            <input
              type="text"
              id="hobby"
              name="hobby"
              value={formData.hobby}
              onChange={handleChange}
              placeholder="E.g., Reading, Painting"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;