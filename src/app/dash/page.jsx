'use client'
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ArrowUpRight, Send, Plus, ChevronDown, Eye } from 'lucide-react';

// Sample data
const monthlyData = [
  { name: 'Jan', income: 50000, expense: 32000 },
  { name: 'Feb', income: 52000, expense: 35000 },
  { name: 'Mar', income: 51000, expense: 33000 },
  { name: 'Apr', income: 49000, expense: 31000 },
  { name: 'May', income: 50000, expense: 32000 },
  { name: 'Jun', income: 48000, expense: 30000 },
  { name: 'Jul', income: 47000, expense: 29000 },
  { name: 'Aug', income: 49000, expense: 31000 },
  { name: 'Sep', income: 46000, expense: 28000 },
  { name: 'Oct', income: 48000, expense: 33000 },
  { name: 'Nov', income: 47000, expense: 30000 },
  { name: 'Dec', income: 50000, expense: 32000 },
];

const transactions = [
  { name: 'Stripe', date: '15 Mar 2024', amount: 132.00, type: 'credit', icon: '💳' },
  { name: 'Shopify', date: '15 Mar 2024', amount: -5.00, type: 'debit', icon: '🛍' },
  { name: 'Paypal', date: '16 Mar 2024', amount: 148.00, type: 'credit', icon: '💰' },
  { name: 'Youtube', date: '16 Mar 2024', amount: -10.99, type: 'debit', icon: '📺' },
  { name: 'Notion', date: '17 Mar 2024', amount: -15.00, type: 'debit', icon: '📝' },
  { name: 'Figma', date: '18 Mar 2024', amount: -45.00, type: 'debit', icon: '🎨' },
];

const pieData = [
  { name: 'Salary', value: 91000, color: '#1e40af' },
  { name: 'Freelance', value: 29400, color: '#fbbf24' },
  { name: 'Bonus', value: 19600, color: '#3b82f6' },
];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cashflow Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Cashflow</CardTitle>
            <div className="flex items-center text-sm text-gray-500">
              This year <ChevronDown className="ml-1 h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Total Balance</p>
                <div className="flex items-center">
                  <h2 className="text-3xl font-bold">$48,029.00</h2>
                  <span className="ml-2 text-green-500 text-sm">↑ 5%</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Line type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="expense" stroke="#fbbf24" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Virtual Card */}
        <Card className="bg-blue-700 text-white">
          <CardContent className="pt-6">
            <div className="space-y-8">
              <div className="flex justify-between">
                <p>Virtual card</p>
                <div className="h-8 w-12 rounded-md bg-white/20" />
              </div>
              <div>
                <p className="text-sm opacity-75">Total Balance</p>
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold">$48,029.00</h2>
                  <Eye className="ml-2 h-4 w-4 opacity-75" />
                </div>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-lg">2148 3214 9812 2687</p>
                <img src="/api/placeholder/48/32" alt="VISA" className="opacity-75" />
              </div>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                  <Plus className="h-4 w-4" /> Request
                </button>
                <button className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                  <Send className="h-4 w-4" /> Send
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics and Recent Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <div>
                <span className="text-sm text-gray-500">Income</span>
                <p className="font-bold">$140,000</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Expense</span>
                <p className="font-bold">$63,564</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <button className="text-sm text-blue-600">Show all</button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.name + transaction.date}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{transaction.icon}</span>
                        {transaction.name}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className={`text-right ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'} ${Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;