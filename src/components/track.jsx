


'use client'
import React, { useState } from 'react';
import { PlusCircle, Trash2, DollarSign, PieChart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart as RechartsChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';


const BudgetTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'groceries' });
  const [budget, setBudget] = useState(2000);
  
  const categories = [
    'groceries',
    'utilities',
    'entertainment',
    'transportation',
    'healthcare',
    'other'
  ];

  const categoryColors = {
    groceries: '#4CAF50',
    utilities: '#2196F3',
    entertainment: '#FF9800',
    transportation: '#9C27B0',
    healthcare: '#F44336',
    other: '#607D8B'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;
    
    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      }
    ]);
    setNewExpense({ description: '', amount: '', category: 'groceries' });
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = budget - totalExpenses;

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budget.toFixed(2)}</div>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
              className="mt-2 w-full p-2 border rounded"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              ${totalExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
              ${remaining.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="p-2 border rounded"
              />
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="p-2 border rounded"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <PlusCircle className="w-5 h-5" />
              Add Expense
            </button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expenses.map(expense => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-sm text-gray-500">{expense.category}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">${expense.amount.toFixed(2)}</span>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={categoryColors[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetTracker;
