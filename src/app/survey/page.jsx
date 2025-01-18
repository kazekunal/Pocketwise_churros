'use client'
import React, { useState } from "react";

const QuizForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    cuisine: "",
    musicgenre: "",
    moviegenre: "",
    hobby: "",
  });

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
      const response = await fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Your preferences have been saved!");
        setFormData({
          name: "",
          age: "",
          location: "",
          cuisine: "",
          musicgenre: "",
          moviegenre: "",
          hobby: "",
        });
      } else {
        alert("Failed to save your preferences. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-cyan-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-green-500 mb-4">
          Welcome to PocketWise!
        </h1>
        <p className="text-center italic mb-6">Let us get to know you better.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              Who is your favorite music genre?
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
              Who is your favorite movie genre?
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