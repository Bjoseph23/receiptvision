import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { 

  ComposedChart,
  Bar, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { 
  Calendar as CalendarIcon,
  TrendingUp,
  AlertCircle,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';

const ExpenditurePage = ({ dashboardData }) => {
  const [selectedDateRange, setSelectedDateRange] = useState('month');
  const [categoryAnalysis, setCategoryAnalysis] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [topExpenses, setTopExpenses] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  
  useEffect(() => {
    if (dashboardData) {
      // Process category analysis
      const categoryData = dashboardData.categories.map(cat => ({
        name: cat.name,
        value: cat.value,
        percentage: (cat.value / dashboardData.totalExpenses) * 100
      }));
      setCategoryAnalysis(categoryData);

      // Process trend data
      const trends = Object.entries(dashboardData.expenses).map(([month, data]) => ({
        month,
        expenses: Object.values(data).reduce((sum, week) => sum + week.total, 0),
        income: Object.values(dashboardData.income[month] || {}).reduce((sum, week) => sum + week.total, 0)
      }));
      setTrendData(trends);

      // Calculate top expenses
      const sortedExpenses = [...categoryData].sort((a, b) => b.value - a.value);
      setTopExpenses(sortedExpenses.slice(0, 5));

      // Identify spending anomalies
      const avgMonthlyExpense = dashboardData.averageMonthlyExpenses;
      const anomalyThreshold = avgMonthlyExpense * 1.5;
      
      const spendingAnomalies = trends.filter(month => 
        month.expenses > anomalyThreshold
      ).map(month => ({
        month: month.month,
        amount: month.expenses,
        percentage: ((month.expenses - avgMonthlyExpense) / avgMonthlyExpense) * 100
      }));
      setAnomalies(spendingAnomalies);
    }
  }, [dashboardData]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expenditure Analysis</h1>
        <div className="flex items-center gap-4">
          <Tabs defaultValue="month" onValueChange={setSelectedDateRange}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                ${dashboardData.totalExpenses.toFixed(2)}
              </span>
              <span className={`flex items-center ${
                dashboardData.totalExpenses > dashboardData.totalIncome 
                  ? 'text-red-500' 
                  : 'text-green-500'
              }`}>
                {dashboardData.totalExpenses > dashboardData.totalIncome 
                  ? <ArrowUpRight className="h-4 w-4" />
                  : <ArrowDownRight className="h-4 w-4" />
                }
                {((Math.abs(dashboardData.totalExpenses - dashboardData.totalIncome) / dashboardData.totalIncome) * 100).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${dashboardData.averageMonthlyExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Largest Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.max(...categoryAnalysis.map(cat => cat.value)).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Expense Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="expenses" fill="#8884d8" name="Expenses" />
                <Line type="monotone" dataKey="income" stroke="#82ca9d" name="Income" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Top Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topExpenses.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" 
                         style={{ backgroundColor: `hsl(${index * 50}, 70%, 50%)` }} />
                    <span>{category.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {category.percentage.toFixed(1)}%
                    </span>
                    <span className="font-medium">
                      ${category.value.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Spending Anomalies */}
        <Card>
          <CardHeader>
            <CardTitle>Spending Anomalies</CardTitle>
          </CardHeader>
          <CardContent>
            {anomalies.length > 0 ? (
              <div className="space-y-4">
                {anomalies.map((anomaly, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span>{anomaly.month}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">+{anomaly.percentage.toFixed(1)}%</span>
                      <span className="font-medium">${anomaly.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No significant spending anomalies detected
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenditurePage;