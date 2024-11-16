import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import AverageSpending from "../components/AverageSpending";
import SpendingTips from "../components/SpendingTips";
import LineChartComponent from "../components/LineChartComponent";
import BarChartComponent from "../components/BarChartComponent";
import PieChartComponent from "../components/PieChartComponent";
import RecentTransactions from "../components/RecentTransactions";
import supabase from "../components/supabaseClient";

const Dashboard = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({ name: "" });
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    income: {},
    expenses: {},
    categories: [],
    recentTransactions: [],
    totalIncome: 0,
    totalExpenses: 0,
    averageMonthlyIncome: 0,
    averageMonthlyExpenses: 0,
  });
  const [categoryMap, setCategoryMap] = useState({});

  // Utility function to structure data by month and week
  const structureDataByMonthAndWeek = (data, dateField) => {
    const structuredData = {};

    data.forEach((item) => {
      const date = new Date(item[dateField]);
      const month = date.toLocaleString("default", { month: "long" });
      const week = `Week ${Math.ceil(date.getDate() / 7)}`;
      if (!structuredData[month]) structuredData[month] = {};
      if (!structuredData[month][week]) structuredData[month][week] = { total: 0 };
      structuredData[month][week].total += Number(item.amount);
    });

    return structuredData;
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("name, id")
            .eq("id", user.id)
            .maybeSingle();

          if (error) throw error;
          if (data) {
            setUserInfo({ name: data.name });
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };
    fetchUserInfo();
  }, [user]);

  useEffect(() => {
    const fetchExpenseCategories = async () => {
      try {
        const { data: categories, error } = await supabase
          .from("expense_categories")
          .select("id, name");

        if (error) throw error;

        const categoryMapping = {};
        categories.forEach((category) => {
          categoryMapping[category.id] = category.name;
        });

        setCategoryMap(categoryMapping);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchExpenseCategories();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
  
      setLoading(true);
      try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
        // Fetch income data
        const { data: incomeData, error: incomeError } = await supabase
          .from("income")
          .select("amount, income_date, income_sources (name)")
          .eq("user_id", user.id)
          .gte("income_date", sixMonthsAgo.toISOString())
          .order("income_date", { ascending: false });
  
        if (incomeError) throw incomeError;
  
        // Fetch expenses data
        const { data: expensesData, error: expensesError } = await supabase
          .from("expenses")
          .select("amount, category_id, transaction_date, description, expense_categories (name)")
          .eq("user_id", user.id)
          .gte("transaction_date", sixMonthsAgo.toISOString())
          .order("transaction_date", { ascending: false });
  
        if (expensesError) throw expensesError;
  
        // Process data
        const incomeByMonthAndWeek = structureDataByMonthAndWeek(incomeData, "income_date");
        const expensesByMonthAndWeek = structureDataByMonthAndWeek(expensesData, "transaction_date");
  
        const totalIncome = incomeData.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalExpenses = expensesData.reduce((sum, item) => sum + Number(item.amount), 0);
  
        const categoryTotals = expensesData.reduce((acc, expense) => {
          const categoryName = expense.expense_categories.name;
          acc[categoryName] = (acc[categoryName] || 0) + Number(expense.amount);
          return acc;
        }, {});
  
        const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
          name,
          value,
        }));
  
        // Combine incomes and expenses for recent transactions
        const combinedTransactions = [
          ...incomeData.map((income) => ({
            ...income,
            type: "Income",
            date: new Date(income.income_date),
            category_name: income.income_sources.name || "Unknown Source",
          })),
          ...expensesData.map((expense) => ({
            ...expense,
            type: "Expense",
            date: new Date(expense.transaction_date),
            category_name: categoryMap[expense.category_id] || "Unknown Category",
          })),
        ];
  
        // Sort combined transactions by date (descending)
        combinedTransactions.sort((a, b) => b.date - a.date);
  
        // Select the 5 most recent transactions
        const recentTransactions = combinedTransactions.slice(0, 5);
  
        setDashboardData({
          income: incomeByMonthAndWeek,
          expenses: expensesByMonthAndWeek,
          categories: categoryData,
          recentTransactions,
          totalIncome,
          totalExpenses,
          averageMonthlyIncome: totalIncome / 6,
          averageMonthlyExpenses: totalExpenses / 6,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, [user, categoryMap]);
  

  // Define the missing `generateTips` function here
  const generateTips = (data) => {
    const tips = [];
    const spendingRatio = data.totalExpenses / data.totalIncome;

    if (spendingRatio > 0.8) {
      tips.push("Your expenses are high relative to income. Consider reviewing non-essential spending.");
    }
    if (data.categories.length > 0) {
      const highestCategory = [...data.categories].sort((a, b) => b.value - a.value)[0];
      tips.push(`Highest spending category is ${highestCategory.name}. Consider setting a budget for this category.`);
    }
    if (data.averageMonthlyExpenses > data.averageMonthlyIncome) {
      tips.push("Monthly expenses exceed income. Consider creating a savings plan.");
    }

    return tips;
  };

  if (loading) {
    return <div className="flex-1 pl-10 pt-10 p-6 bg-gray-100">Loading...</div>;
  }

  return (
    <div className="flex-1 pl-10 pt-10 p-6 bg-gray-100 overflow-auto">
      <h1 className="text-4xl font-bold text-blue-600 mb-2">
        <span className="text-blue-600">Welcome Back, </span>
        <span className="text-black">{userInfo.name || "User Name"}</span>
      </h1>
      <h2 className="text-xl font-semibold mt-7 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:col-span-2">
          <AverageSpending
            spending={dashboardData.averageMonthlyExpenses}
            income={dashboardData.averageMonthlyIncome}
            expenses={dashboardData.totalExpenses}
            className="bg-white rounded-lg p-6"
          />
          <SpendingTips tips={generateTips(dashboardData)} className="bg-white rounded-lg p-6" showMoreLink={true} />
        </div>

        <div className="bg-white rounded-lg lg:row-span-2 lg:col-span-1 flex flex-col space-y-6">
          <PieChartComponent
            title="Spending Breakdown"
            data={dashboardData.categories.map(cat => ({ category: cat.name, amount: cat.value }))}
            className="bg-white"
            showMoreLink={true}
          />
          <RecentTransactions transactions={dashboardData.recentTransactions} showMoreLink={true} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
          <LineChartComponent title="Monthly Earnings" data={dashboardData.income} className="bg-white rounded-lg  " showMoreLink={true} />
          <LineChartComponent title="Monthly Expenses" data={dashboardData.expenses} className="bg-white rounded-lg  p-6" showMoreLink={true} />
        </div>

        <div className="bg-white rounded-lg p-6 lg:col-span-3">
          <BarChartComponent title="Income Against Expenses" data={{ income: dashboardData.income, expenses: dashboardData.expenses }} showMoreLink={true} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
