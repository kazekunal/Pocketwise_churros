'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { CreditCard, ChevronDown, Eye, Plus, Send, DollarSign, TrendingUp, PieChartIcon, Sun, Moon, Target, Plane, GraduationCap, Heart, Edit2, Trash2 } from 'lucide-react';

// Sample API data with monthly expenses
const initialData = {
  budget: 1000,
  monthlyExpenses: {
    Jan: [
      { id: 1, description: 'Groceries', amount: 400, category: 'groceries', date: '2024-01-15' },
      { id: 2, description: 'Electricity', amount: 150, category: 'utilities', date: '2024-01-16' },
      { id: 3, description: 'Netflix', amount: 15, category: 'entertainment', date: '2024-01-17' },
      { id: 4, description: 'Gas', amount: 45, category: 'transportation', date: '2024-01-18' }
    ],
    Feb: [
      { id: 5, description: 'Groceries', amount: 380, category: 'groceries', date: '2024-02-15' },
      { id: 6, description: 'Water Bill', amount: 80, category: 'utilities', date: '2024-02-16' },
      { id: 7, description: 'Movie Tickets', amount: 30, category: 'entertainment', date: '2024-02-17' },
      { id: 8, description: 'Bus Pass', amount: 60, category: 'transportation', date: '2024-02-18' }
    ],
    Mar: [
      { id: 9, description: 'Groceries', amount: 420, category: 'groceries', date: '2024-03-15' },
      { id: 10, description: 'Internet', amount: 70, category: 'utilities', date: '2024-03-16' },
      { id: 11, description: 'Spotify', amount: 10, category: 'entertainment', date: '2024-03-17' },
      { id: 12, description: 'Uber', amount: 35, category: 'transportation', date: '2024-03-18' }
    ],
    Apr: [
      { id: 13, description: 'Groceries', amount: 390, category: 'groceries', date: '2024-04-15' },
      { id: 14, description: 'Gas Bill', amount: 90, category: 'utilities', date: '2024-04-16' },
      { id: 15, description: 'Gaming', amount: 50, category: 'entertainment', date: '2024-04-17' },
      { id: 16, description: 'Fuel', amount: 55, category: 'transportation', date: '2024-04-18' }
    ],
    May: [
      { id: 17, description: 'Groceries', amount: 410, category: 'groceries', date: '2024-05-15' },
      { id: 18, description: 'Electricity', amount: 140, category: 'utilities', date: '2024-05-16' },
      { id: 19, description: 'Cinema', amount: 25, category: 'entertainment', date: '2024-05-17' },
      { id: 20, description: 'Train Ticket', amount: 40, category: 'transportation', date: '2024-05-18' }
    ],
    Jun: [
      { id: 21, description: 'Groceries', amount: 430, category: 'groceries', date: '2024-06-15' },
      { id: 22, description: 'Water Bill', amount: 85, category: 'utilities', date: '2024-06-16' },
      { id: 23, description: 'Netflix', amount: 15, category: 'entertainment', date: '2024-06-17' },
      { id: 24, description: 'Gas', amount: 50, category: 'transportation', date: '2024-06-18' }
    ]
  },
  monthlyData: [
    { name: 'Jan', income: 50000, expense: 32000 },
    { name: 'Feb', income: 52000, expense: 35000 },
    { name: 'Mar', income: 51000, expense: 33000 },
    { name: 'Apr', income: 49000, expense: 31000 },
    { name: 'May', income: 50000, expense: 32000 },
    { name: 'Jun', income: 48000, expense: 30000 }
  ],
  categoryColors: {
    groceries: '#4CAF50',
    utilities: '#2196F3',
    entertainment: '#FF9800',
    transportation: '#9C27B0',
    healthcare: '#F44336',
    other: '#607D8B'
  }
};

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [monthlyData] = useState(initialData.monthlyData);
  const [budget] = useState(initialData.budget);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Travel',
      amount: 63000,
      timeframe: '2 months',
      icon: <Plane className="w-5 h-5" />
    },
    {
      id: 2,
      title: 'Married',
      amount: 52000,
      timeframe: '6 months',
      icon: <Heart className="w-5 h-5" />
    },
    {
      id: 3,
      title: 'College',
      amount: 42000,
      timeframe: '9 months',
      icon: <GraduationCap className="w-5 h-5" />
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    amount: '',
    timeframe: ''
  });

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const currentExpenses = initialData.monthlyExpenses[selectedMonth];
  const totalExpenses = currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = budget - totalExpenses;

  const getCategoryTotals = (expenses) => {
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
  };

  const getPieChartData = (expenses) => {
    const categoryTotals = getCategoryTotals(expenses);
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: amount,
      color: initialData.categoryColors[category]
    }));
  };

  const pieChartData = getPieChartData(currentExpenses);

  const handleMonthClick = (data) => {
    if (data && data.activePayload && data.activePayload[0]) {
      setSelectedMonth(data.activePayload[0].payload.name);
    }
  };

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.amount && newGoal.timeframe) {
      setGoals([...goals, {
        id: goals.length + 1,
        ...newGoal,
        icon: <Target className="w-5 h-5" />,
        amount: parseFloat(newGoal.amount)
      }]);
      setNewGoal({ title: '', amount: '', timeframe: '' });
      setIsAddingGoal(false);
    }
  };

  const handleEditGoal = () => {
    if (selectedGoal) {
      setGoals(goals.map(goal => 
        goal.id === selectedGoal.id ? selectedGoal : goal
      ));
      setSelectedGoal(null);
      setIsEditingGoal(false);
    }
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const calculateProgress = (goalAmount) => {
    const totalGoalsAmount = goals.reduce((sum, goal) => sum + Number(goal.amount), 0);
    const remainingBudget = budget || 0;
    const progressPercentage = Math.min((remainingBudget / goalAmount) * 100, 100);
    return progressPercentage;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-end">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <DollarSign className="w-5 h-5" />
                Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">${budget.toFixed(2)}</div>
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
                ${totalExpenses.toFixed(2)}
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
                ${remaining.toFixed(2)}
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
                    label={({ name, value }) => `${name}: $${value}`}
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

        <Card className="dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="dark:text-white">Expenses - {selectedMonth}</CardTitle>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              Show all
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                <button className="text-sm text-gray-600 dark:text-gray-300">
                    Category <ChevronDown className="inline h-4 w-4" />
                  </button>
                  <button className="text-sm text-gray-600 dark:text-gray-300">
                    Date <ChevronDown className="inline h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Amount</p>
              </div>
              <div className="space-y-4">
                {currentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" 
                           style={{ backgroundColor: `${initialData.categoryColors[expense.category]}25` }}>
                        <span style={{ color: initialData.categoryColors[expense.category] }}>
                          {expense.category[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium dark:text-white">{expense.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{expense.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium dark:text-white">-${expense.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{expense.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="dark:text-white">Savings Goals</CardTitle>
            <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] dark:bg-gray-800">
                <DialogHeader>
                  <DialogTitle className="dark:text-white">Add New Savings Goal</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm dark:text-white">Goal Title</label>
                    <Input
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      className="dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm dark:text-white">Target Amount ($)</label>
                    <Input
                      type="number"
                      value={newGoal.amount}
                      onChange={(e) => setNewGoal({ ...newGoal, amount: Number(e.target.value) })}
                      className="dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm dark:text-white">Timeframe</label>
                    <Input
                      value={newGoal.timeframe}
                      onChange={(e) => setNewGoal({ ...newGoal, timeframe: e.target.value })}
                      placeholder="e.g., 6 months"
                      className="dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddGoal} className="dark:bg-blue-600 dark:text-white">
                    Add Goal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                      {goal.icon}
                    </div>
                    <div>
                      <h3 className="font-medium dark:text-white">{goal.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Target: {goal.timeframe}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium dark:text-white">
                        ${Number(goal.amount).toLocaleString()}
                      </p>
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-2">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(goal.amount)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={isEditingGoal} onOpenChange={setIsEditingGoal}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setSelectedGoal(goal)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] dark:bg-gray-800">
                          <DialogHeader>
                            <DialogTitle className="dark:text-white">Edit Savings Goal</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <label className="text-sm dark:text-white">Goal Title</label>
                              <Input
                                value={selectedGoal?.title || ""}
                                onChange={(e) => setSelectedGoal({ 
                                  ...selectedGoal, 
                                  title: e.target.value 
                                })}
                                className="dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm dark:text-white">Target Amount ($)</label>
                              <Input
                                type="number"
                                value={selectedGoal?.amount || ""}
                                onChange={(e) => setSelectedGoal({ 
                                  ...selectedGoal, 
                                  amount: Number(e.target.value) 
                                })}
                                className="dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm dark:text-white">Timeframe</label>
                              <Input
                                value={selectedGoal?.timeframe || ""}
                                onChange={(e) => setSelectedGoal({ 
                                  ...selectedGoal, 
                                  timeframe: e.target.value 
                                })}
                                className="dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button onClick={handleEditGoal} className="dark:bg-blue-600 dark:text-white">
                              Save Changes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteGoal(goal.id)}
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
      </div>
    </div>
  );
};

export default Dashboard;