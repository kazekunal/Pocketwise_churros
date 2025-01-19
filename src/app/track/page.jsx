'use client';

import React, { useState, useEffect } from 'react';
import Chatbot from '@/components/chatbot';
import Fetchevents from '../../components/FetchEvents'
import { db, auth } from '../../components/firebase';
import { serverTimestamp } from "firebase/firestore";
import PredictionGraph from '@/components/PredictionGraph';
import ImageUploader from '@/components/ImageUploader';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  orderBy
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { CreditCard,Pencil,Check,X, ChevronDown, Eye, Plus, Send, DollarSign, TrendingUp, PieChartIcon, Sun, Moon, Target, Plane, GraduationCap, Heart, Edit2, Trash2 } from 'lucide-react';

const categoryColors = {
  groceries: '#4CAF50',
  utilities: '#2196F3',
  entertainment: '#FF9800',
  transportation: '#9C27B0',
  healthcare: '#F44336',
  dining: '#FF5722',
  shopping: '#795548',
  education: '#009688',
  rent: '#3F51B5',
  other: '#607D8B'
};

const Dashboard = ({ userId }) => {
  const [selectedMonth, setSelectedMonth] = useState('Jan');
  const [monthlyData, setMonthlyData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goals, setGoals] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [monthlyExpenses, setMonthlyExpenses] = useState({});
  const [budget, setBudget] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('0');
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'other'
  });
  const [newGoal, setNewGoal] = useState({
    title: '',
    amount: '',
    timeframe: ''
  });

  const [editingExpense, setEditingExpense] = useState(null);
  const [recurrentExpenses, setRecurrentExpenses] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchUserData(user.uid);
      } else {
        setLoading(false);
      }
    });

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBudget = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const budgetValue = typeof data.budget === 'number' ? data.budget : 0;
          setBudget(budgetValue);
          setEditValue(budgetValue.toString());
        } else {
          // Initialize the document if it doesn't exist
          const initialBudget = 0;
          setBudget(initialBudget);
          setEditValue(initialBudget.toString());
        }
      } catch (error) {
        console.error('Error fetching budget:', error);
        // Set default values on error
        setBudget(0);
        setEditValue('0');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudget();
  }, [userId]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(budget.toString());
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(budget.toString());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setEditValue(value);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setBudget(userData.budget || 1000);
        setMonthlyData(userData.monthlyData || []);
        setGoals(userData.goals || []);
        
        const expensesRef = collection(db, 'users', userId, 'expenses');
        const expensesSnapshot = await getDocs(expensesRef);
        
        const expensesByMonth = {};
        expensesSnapshot.forEach((doc) => {
          const monthData = doc.data();
          expensesByMonth[doc.id] = monthData.expenses;
        });
        
        setMonthlyExpenses(expensesByMonth);
      } else {
        const defaultData = {
          budget: 1000,
          monthlyData: [],
          goals: []
        };

        await setDoc(userDocRef, defaultData);
        setBudget(defaultData.budget);
        setMonthlyData(defaultData.monthlyData);
        setGoals(defaultData.goals);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  
  const handleAddGoal = async () => {
    if (!currentUser || !newGoal.title || !newGoal.amount || !newGoal.timeframe) return;

    try {
      const newGoalData = {
        id: Date.now(),
        ...newGoal,
        icon: 'Target',
        amount: parseFloat(newGoal.amount)
      };

      const updatedGoals = [...goals, newGoalData];

      await updateDoc(doc(db, 'users', currentUser.uid), {
        goals: updatedGoals
      });

      setGoals(updatedGoals);
      setNewGoal({ title: '', amount: '', timeframe: '' });
      setIsAddingGoal(false);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleEditGoal = async () => {
    if (!currentUser || !selectedGoal) return;

    try {
      const updatedGoals = goals.map(goal => 
        goal.id === selectedGoal.id ? selectedGoal : goal
      );

      await updateDoc(doc(db, 'users', currentUser.uid), {
        goals: updatedGoals
      });

      setGoals(updatedGoals);
      setSelectedGoal(null);
      setIsEditingGoal(false);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!currentUser) return;

    try {
      const updatedGoals = goals.filter(goal => goal.id !== goalId);

      await updateDoc(doc(db, 'users', currentUser.uid), {
        goals: updatedGoals
      });

      setGoals(updatedGoals);
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getCategoryTotals = (expenses) => {
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
  };

  const [expenseFilters, setExpenseFilters] = useState({
    category: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
    searchTerm: ''
  });
  const handleAddExpense = async (expenseDetails = {}) => {
    // Ensure expenseDetails from image is properly parsed and handled
    const expenseToAdd = {
      description: expenseDetails.description || newExpense.description || '',
      amount: parseFloat(expenseDetails.amount) || parseFloat(newExpense.amount) || 0,  // Ensure amount is parsed as a number
      category: newExpense.category || expenseDetails.category || 'other',  // Default to 'other' if no category is provided
      isRecurrent: newExpense.isRecurrent || expenseDetails.isRecurrent || false,
      recurrenceInterval: newExpense.recurrenceInterval || expenseDetails.recurrenceInterval || null,
      tags: newExpense.tags || expenseDetails.tags || [],
      notes: newExpense.notes || expenseDetails.notes || '',
    };
  
    // Check if necessary fields are provided
    if (!currentUser || !expenseToAdd.description || isNaN(expenseToAdd.amount)) {
      console.error("Invalid data. Please check the expense details.");
      return;
    }
  
    try {
      // Reference to the expenses collection for the current user and selected month
      const expenseRef = collection(db, 'users', currentUser.uid, 'expenses');
      const monthDocRef = doc(expenseRef, selectedMonth);
  
      // Get current expenses for the selected month
      const monthDoc = await getDoc(monthDocRef);
      let currentExpenses = [];
      
      if (monthDoc.exists()) {
        currentExpenses = monthDoc.data().expenses || [];
      }
  
      // Create new expense object with parsed data
      const expenseData = {
        id: Date.now(),
        description: expenseToAdd.description,
        amount: expenseToAdd.amount,
        category: expenseToAdd.category,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().getTime(),
        isRecurrent: expenseToAdd.isRecurrent,
        recurrenceInterval: expenseToAdd.recurrenceInterval,
        tags: expenseToAdd.tags,
        notes: expenseToAdd.notes
      };
  
      // Add new expense to the current month's expenses
      const updatedExpenses = [...currentExpenses, expenseData];
  
      // Handle recurring expenses if applicable
      if (expenseData.isRecurrent) {
        const recurrentRef = doc(db, 'users', currentUser.uid, 'recurrent-expenses');
        const recurrentDoc = await getDoc(recurrentRef);
        const currentRecurrent = recurrentDoc.exists() ? recurrentDoc.data().expenses || [] : [];
        
        await setDoc(recurrentRef, {
          expenses: [...currentRecurrent, expenseData]
        });
      }
  
      // Update the expenses in Firebase for the current month
      await setDoc(monthDocRef, {
        expenses: updatedExpenses
      }, { merge: true });
  
      // Update local state
      setMonthlyExpenses(prevState => ({
        ...prevState,
        [selectedMonth]: updatedExpenses
      }));
  
      // Reset form
      setNewExpense({
        description: '',
        amount: '',
        category: 'other',
        isRecurrent: false,
        recurrenceInterval: '',
        tags: [],
        notes: ''
      });
      setIsAddingExpense(false);
  
      // Update monthly data for charts and summaries
      await updateMonthlyData();
  
    } catch (error) {
      console.error('Error adding expense:', error);
      // Optionally add error handling UI feedback here
    }
  };
  
  // Update the updateMonthlyData function to ensure proper synchronization
  const updateMonthlyData = async () => {
    if (!currentUser) return;
  
    try {
      const expenseRef = doc(db, 'users', currentUser.uid, 'expenses', selectedMonth);
      const expenseDoc = await getDoc(expenseRef);
      const currentMonthExpenses = expenseDoc.exists() ? expenseDoc.data().expenses || [] : [];
      
      const totalExpense = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
      // Create a copy of the current monthly data
      const updatedMonthlyData = [...monthlyData];
      const monthIndex = updatedMonthlyData.findIndex(data => data.name === selectedMonth);
  
      if (monthIndex !== -1) {
        updatedMonthlyData[monthIndex] = {
          ...updatedMonthlyData[monthIndex],
          expense: totalExpense
        };
      } else {
        updatedMonthlyData.push({
          name: selectedMonth,
          expense: totalExpense,
          income: budget // or however you determine income
        });
      }
  
      // Update monthly data in Firebase
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        monthlyData: updatedMonthlyData
      });
  
      // Update local state
      setMonthlyData(updatedMonthlyData);
  
    } catch (error) {
      console.error('Error updating monthly data:', error);
    }
  };
  
  // Add a function to fetch expenses for the selected month
  const fetchMonthlyExpenses = async (month) => {
    if (!currentUser) return;
  
    try {
      const expenseRef = doc(db, 'users', currentUser.uid, 'expenses', month);
      const expenseDoc = await getDoc(expenseRef);
      
      if (expenseDoc.exists()) {
        const expenses = expenseDoc.data().expenses || [];
        setMonthlyExpenses(prevState => ({
          ...prevState,
          [month]: expenses
        }));
      } else {
        setMonthlyExpenses(prevState => ({
          ...prevState,
          [month]: []
        }));
      }
    } catch (error) {
      console.error('Error fetching monthly expenses:', error);
    }
  };
  
  // Update the useEffect hook to fetch expenses when month changes
  useEffect(() => {
    if (currentUser && selectedMonth) {
      fetchMonthlyExpenses(selectedMonth);
    }
  }, [currentUser, selectedMonth]);
  const handleEditExpense = async (expenseId) => {
    if (!currentUser || !editingExpense) return;

    try {
      const expenseRef = doc(db, 'users', currentUser.uid, 'expenses', selectedMonth);
      const currentExpenses = monthlyExpenses[selectedMonth] || [];
      
      const updatedExpenses = currentExpenses.map(expense => 
        expense.id === expenseId ? {
          ...expense,
          ...editingExpense,
          amount: parseFloat(editingExpense.amount)
        } : expense
      );

      await setDoc(expenseRef, {
        expenses: updatedExpenses
      });

      setMonthlyExpenses({
        ...monthlyExpenses,
        [selectedMonth]: updatedExpenses
      });

      setEditingExpense(null);
      await updateMonthlyData();
    } catch (error) {
      console.error('Error editing expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!currentUser) return;

    try {
      const expenseRef = doc(db, 'users', currentUser.uid, 'expenses', selectedMonth);
      const currentExpenses = monthlyExpenses[selectedMonth] || [];
      
      const updatedExpenses = currentExpenses.filter(expense => expense.id !== expenseId);

      await setDoc(expenseRef, {
        expenses: updatedExpenses
      });

      setMonthlyExpenses({
        ...monthlyExpenses,
        [selectedMonth]: updatedExpenses
      });

      await updateMonthlyData();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleSave = async () => {

    console.log('userId:', currentUser.uid);
    // Add defensive checks
    if (!currentUser.uid || !db) {
      console.error('Missing required dependencies:', {uid, db: !!db });
      return;
    }
  
    try {
      const newBudget = parseFloat(editValue);
      if (isNaN(newBudget)) {
        console.error('Invalid budget value');
        setEditValue(budget);
        return;
      }
  
      // Create document reference with explicit path segments
      const usersCollection = 'users';  // Collection name
      const userDocRef = doc(db, usersCollection, currentUser.uid);
  
      // Get document snapshot
      const docSnap = await getDoc(userDocRef);
  
      const updateData = {
        budget: newBudget,
        updatedAt: serverTimestamp()
      };
  
      if (!docSnap.exists()) {
        // Create new document with setDoc
        await setDoc(userDocRef, {
          ...updateData,
          createdAt: serverTimestamp()
        });
      } else {
        // Update existing document
        await updateDoc(userDocRef, updateData);
      }
  
      // Update local state
      setBudget(newBudget);
      setIsEditing(false);
  
    } catch (error) {
      console.error('Error updating budget:', error);
      setEditValue(budget);
      setIsEditing(false);
    }
  };
  const getFilteredExpenses = () => {
    let filtered = [...(monthlyExpenses[selectedMonth] || [])];

    // Apply category filter
    if (expenseFilters.category !== 'all') {
      filtered = filtered.filter(expense => expense.category === expenseFilters.category);
    }

    // Apply search filter
    if (expenseFilters.searchTerm) {
      const searchLower = expenseFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(expense => 
        expense.description.toLowerCase().includes(searchLower) ||
        expense.category.toLowerCase().includes(searchLower) ||
        expense.notes?.toLowerCase().includes(searchLower) ||
        expense.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const order = expenseFilters.sortOrder === 'desc' ? -1 : 1;
      if (expenseFilters.sortBy === 'date') {
        return order * (new Date(b.date) - new Date(a.date));
      } else if (expenseFilters.sortBy === 'amount') {
        return order * (a.amount - b.amount);
      }
      return 0;
    });

    return filtered;
  };

  const getPieChartData = (expenses) => {
    const categoryTotals = getCategoryTotals(expenses);
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: amount,
      color: categoryColors[category]
    }));
  };

  const handleMonthClick = (data) => {
    if (data && data.activePayload && data.activePayload[0]) {
      setSelectedMonth(data.activePayload[0].payload.name);
    }
  };

  const calculateProgress = (goalAmount) => {
    const totalGoalsAmount = goals.reduce((sum, goal) => sum + Number(goal.amount), 0);
    const remainingBudget = budget || 0;
    const progressPercentage = Math.min((remainingBudget / goalAmount) * 100, 100);
    return progressPercentage;
  };

  if (isLoading) {
    return (
      <Card className="dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const currentExpenses = monthlyExpenses[selectedMonth] || [];
  const totalExpenses = currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = budget - totalExpenses;
  const pieChartData = getPieChartData(currentExpenses);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div>
        <div className="flex justify-between items-center">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6 text-yellow-500" />
            ) : (
              <Moon className="w-6 h-6 text-gray-600" />
            )}
          </button>
          {currentUser && (
  <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
    <DialogTrigger asChild>
      <Button className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black">
        Add Expense
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-black border border-gray-700 rounded-lg shadow-lg">
      <DialogHeader>
        <DialogTitle className="text-white text-lg font-semibold">Add New Expense</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4 px-4">
        <div className="grid gap-2">
          <label className="text-sm text-gray-300">Description</label>
          <Input
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            className="bg-gray-800 text-white border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-gray-300">Amount ($)</label>
          <Input
            type="number"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            className="bg-gray-800 text-white border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-gray-300">Category</label>
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-green-500"
          >
            {Object.keys(categoryColors).map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Button
          onClick={handleAddExpense}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Expense
        </Button>
      </div>
      <ImageUploader handleAddExpense={handleAddExpense} />
    </DialogContent>
  </Dialog>
)}

        </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between dark:text-white">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Budget
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Edit budget"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              ₹
              </span>
              <input
                type="text"
                value={editValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full pl-8 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                placeholder="Enter budget..."
                autoFocus
              />
            </div>
            <button
              onClick={() => {
                console.log('Button clicked');
                handleSave();
              }}
              className="p-2 text-white bg-emerald-500 hover:bg-emerald-600 rounded-md transition-colors"
              aria-label="Save budget"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-white bg-gray-500 hover:bg-gray-600 rounded-md transition-colors"
              aria-label="Cancel editing"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-2xl font-bold dark:text-white">
            ₹{(budget || 0).toFixed(2)}
          </div>
        )}
      </CardContent>
    </Card>
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <TrendingUp className="w-5 h-5" />
                Spent ({selectedMonth})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                ₹{totalExpenses.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <PieChartIcon className="w-5 h-5" />
                Remaining ({selectedMonth})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                ₹ {remaining.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Income vs Expenses (Click month to update)</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} onClick={handleMonthClick}>
                  <XAxis 
                    dataKey="name" 
                    stroke={isDarkMode ? "#ffffff" : "#888888"} 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke={isDarkMode ? "#ffffff" : "#888888"} 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                      borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                      color: isDarkMode ? '#ffffff' : '#000000'
                    }}
                  />
                  <Line type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={2} dot={true} />
                  <Line type="monotone" dataKey="expense" stroke="#fbbf24" strokeWidth={2} dot={true} />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Expense Breakdown - {selectedMonth}</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ₹${value}`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                      borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                      color: isDarkMode ? '#ffffff' : '#000000'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <PredictionGraph/>
        <Card className="dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="dark:text-white">Expenses - {selectedMonth}</CardTitle>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search expenses..."
              value={expenseFilters.searchTerm}
              onChange={(e) => setExpenseFilters({
                ...expenseFilters,
                searchTerm: e.target.value
              })}
              className="px-3 py-1 rounded-md dark:bg-gray-700 dark:text-white"
            />
            <select
              value={expenseFilters.category}
              onChange={(e) => setExpenseFilters({
                ...expenseFilters,
                category: e.target.value
              })}
              className="px-3 py-1 rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              {Object.keys(categoryColors).map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={expenseFilters.sortBy}
              onChange={(e) => setExpenseFilters({
                ...expenseFilters,
                sortBy: e.target.value
              })}
              className="px-3 py-1 rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
            <Button
              variant="outline"
              onClick={() => setExpenseFilters({
                ...expenseFilters,
                sortOrder: expenseFilters.sortOrder === 'desc' ? 'asc' : 'desc'
              })}
            >
              {expenseFilters.sortOrder === 'desc' ? '↓' : '↑'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getFilteredExpenses().map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" 
                       style={{ backgroundColor: `${categoryColors[expense.category]}25` }}>
                    <span style={{ color: categoryColors[expense.category] }}>
                      {expense.category[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">{expense.description}</p>
                    <div className="flex gap-2 items-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{expense.category}</p>
                      {expense.isRecurrent && (
                        <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                          Recurring
                        </span>
                      )}
                      {expense.tags?.map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium dark:text-white">-₹{expense.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{expense.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="w-full p-4 ">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.432079922997!2d77.57278807580788!3d28.52672977572278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ceb4eaaaaaaab%3A0x321412756718874c!2sShiv%20Nadar%20Institution%20of%20Eminence%20Deemed%20to%20be%20University!5e0!3m2!1sen!2sin!4v1737226722378!5m2!1sen!2sin" 
          className="w-full max-w-3xl h-[450px] rounded-lg border border-gray-800 shadow-lg bg-gray-900 filter contrast-75 opacity-90 mx-auto"
          loading="lazy" 
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <Fetchevents/>
      <Chatbot/>
      </div>
    </div>
  );
};

export default Dashboard;