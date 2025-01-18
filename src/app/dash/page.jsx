'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDIjVP6gAqeV4mLabZPIm8E3FN5oDq2cUI",
  authDomain: "pocketwise-7f278.firebaseapp.com",
  projectId: "pocketwise-7f278",
  storageBucket: "pocketwise-7f278.firebasestorage.app",
  messagingSenderId: "707354446767",
  appId: "1:707354446767:web:4cc5686f459439f2e27d5a",
  measurementId: "G-DN504JWFH8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ExpenseTracker = ({ isDarkMode }) => {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  );
  
  const categoryColors = {
    food: '#FF6B6B',
    transport: '#4ECDC4',
    entertainment: '#45B7D1',
    shopping: '#96CEB4',
    utilities: '#FFEEAD',
    other: '#D4A5A5'
  };

  // Add expense to Firebase
  const addExpense = async (expenseData) => {
    try {
      const docRef = await addDoc(collection(db, 'expenses'), {
        ...expenseData,
        timestamp: new Date(),
        userId: 'user123' // Replace with actual user ID from auth
      });
      console.log('Expense added with ID: ', docRef.id);
      fetchExpenses(); // Refresh the list
    } catch (error) {
      console.error('Error adding expense: ', error);
    }
  };

  // Fetch expenses from Firebase
  const fetchExpenses = async () => {
    try {
      const [month, year] = selectedMonth.split(' ');
      const startDate = new Date(`${month} 1, ${year}`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const q = query(
        collection(db, 'expenses'),
        where('userId', '==', 'user123'),
        where('timestamp', '>=', startDate),
        where('timestamp', '<', endDate),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const expensesList = [];
      querySnapshot.forEach((doc) => {
        expensesList.push({ id: doc.id, ...doc.data() });
      });
      setExpenses(expensesList);
    } catch (error) {
      console.error('Error fetching expenses: ', error);
    }
  };

  // Calculate data for pie chart
  const calculatePieChartData = () => {
    const categoryTotals = {};
    expenses.forEach((expense) => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name.toLowerCase()] || categoryColors.other
    }));
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedMonth]);

  return (
    <div className="grid gap-4">
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">
            Expense Breakdown - {selectedMonth}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={calculatePieChartData()}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: $${value}`}
              >
                {calculatePieChartData().map((entry, index) => (
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

      <Card className="dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="dark:text-white">Expenses - {selectedMonth}</CardTitle>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            Show all
          </button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: `${categoryColors[expense.category.toLowerCase()]}25`
                    }}
                  >
                    <span style={{ color: categoryColors[expense.category.toLowerCase()] }}>
                      {expense.category[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">{expense.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {expense.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium dark:text-white">
                    -${expense.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(expense.timestamp.seconds * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTracker;