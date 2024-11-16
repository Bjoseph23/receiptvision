import React, { useState, useEffect } from "react";
import LineChartComponent from "../components/LineChartComponent";
import BarChartComponent from "../components/BarChartComponent";
import PieChartComponent from "../components/PieChartComponent";
import SpendingTips from "../components/SpendingTips";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "../contexts/AuthContext";
import supabase from "../components/supabaseClient";

const processMonthlyData = (data, dateField) => {
  const monthlyTotals = data.reduce((acc, item) => {
    const date = new Date(item[dateField]);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        total: 0
      };
    }
    
    acc[monthKey].total += Number(item.amount);
    return acc;
  }, {});

  return Object.values(monthlyTotals)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(item => ({
      month: new Date(item.month).toLocaleString('default', { month: 'short' }),
      amount: Number(item.total.toFixed(2))
    }));
};

const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    income: [],
    expenses: [],
    categories: [],
    totalIncome: 0,
    totalExpenses: 0,
    plannedBudgets: [],
    activeTips: [],
    spending: 0,
    transactions: [],
    averageMonthlyIncome: 0,
    averageMonthlyExpenses: 0,
  });

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

  const [currentDate, setCurrentDate] = useState({
    day: '',
    date: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Fetch income data
        const { data: incomeData, error: incomeError } = await supabase
          .from("income")
          .select(`
            id, amount, description, income_date, is_recurring, frequency,
            income_sources (name)
          `)
          .eq("user_id", user.id)
          .gte("income_date", sixMonthsAgo.toISOString())
          .order("income_date", { ascending: false });
        
          if (incomeError) throw incomeError;


        // Fetch expenses data
        const { data: expensesData, error: expensesError } = await supabase
          .from("expenses")
          .select(`
            id, category_id, amount, description, transaction_date,
            expense_categories (id, name)
          `)
          .eq("user_id", user.id)
          .gte("transaction_date", sixMonthsAgo.toISOString())
          .order("transaction_date", { ascending: false });

        if (expensesError) throw expensesError;


        // Fetch tips data
        const { data: tipsData } = await supabase
          .from("user_tips")
          .select(`
            *,
            tip_templates (title, description)
          `)
          .eq("user_id", user.id)
          .eq("is_relevant", true);

        // Process Income and category data

        const incomeByMonthAndWeek = structureDataByMonthAndWeek(incomeData, "income_date");
        const expensesByMonthAndWeek = structureDataByMonthAndWeek(expensesData, "transaction_date");

        const totalIncome = incomeData.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalExpenses = expensesData.reduce((sum, item) => sum + Number(item.amount), 0);
        
          
        // Process category totals and budgets
        const categoryTotals = expensesData.reduce((acc, expense) => {
          const categoryName = expense.expense_categories.name;
          const categoryId = expense.expense_categories.id;
          if (!acc[categoryId]) {
            acc[categoryId] = {
              name: categoryName,
              spent: 0,
              planned: 0,
              id: categoryId
            };
          }
          acc[categoryId].spent += Number(expense.amount);
          return acc;
        }, {});

        
        const plannedBudgets = Object.values(categoryTotals).map(category => ({
          ...category,
          remaining: category.planned - category.spent,
          percentage: category.planned > 0 ? (category.spent / category.planned) * 100 : 0
        }));

        setData({
          income:  incomeByMonthAndWeek,
          expenses: expensesByMonthAndWeek,
          categories: Object.values(categoryTotals),
          totalIncome,
          totalExpenses,
          plannedBudgets,
          averageMonthlyIncome: totalIncome / 6,
          averageMonthlyExpenses: totalExpenses / 6,
          activeTips: tipsData?.map(tip => ({
            title: tip.tip_templates.title,
            description: tip.tip_templates.description,
            isActedUpon: tip.is_acted_upon
          })) || [],
          spending: totalExpenses,
          transactions: expensesData
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set current date
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    const [day, ...dateParts] = formattedDate.split(" ");
    
    setCurrentDate({
      day,
      date: dateParts.join(" ")
    });
  }, [user]);

  const generateTips = (data) => {
    const tips = [];
    const spendingRatio = data.totalExpenses / data.totalIncome;

    tips.push("Plan your monthly budget before the month begins");
    tips.push("Set aside emergency funds first");
    
    if (spendingRatio > 0.8) {
      tips.push("Your expenses are high relative to income. Consider reviewing non-essential spending.");
    }
    if (data.categories.length > 0) {
      const highestCategory = [...data.categories].sort((a, b) => b.spent - a.spent)[0];
      tips.push(`Highest spending category is ${highestCategory.name}. Consider setting a lower budget for this category.`);
    }

    data.activeTips.forEach(tip => tips.push(tip.description));
    return tips;
  };

  const BudgetPlanningCard = ({ category }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{category.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={category.percentage} className="mb-2" />
        <div className="flex justify-between text-sm">
          <span>Planned: ${category.planned}</span>
          <span>Spent: ${category.spent}</span>
          <span>Remaining: ${category.remaining}</span>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="flex-1 pl-10 pt-10 p-6 bg-gray-100">Loading...</div>;
  }

  // Prepare chart data: Extracting months and amounts
  const incomeMonths = Array.isArray(data.income) ? data.income.map(item => item.month) : [];
  const incomeAmounts = Array.isArray(data.income) ? data.income.map(item => item.amount) : [];
  const expenseAmounts = Array.isArray(data.expenses) ? data.expenses.map(item => item.amount) : [];

  return (
    <div className="flex-1 pl-10 pt-10 p-6 bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-2">{currentDate.day}</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{currentDate.date}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Planning Section */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Budget Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.plannedBudgets.map((category) => (
                  <BudgetPlanningCard key={category.id} category={category} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <div className="lg:row-span-2">
          <SpendingTips 
            tips={generateTips(data)} 
            className="bg-white rounded-lg p-6 sticky top-0"
          />
        </div>
        
        {/* Charts Section */}
        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartComponent title="Monthly Earnings" data={data.income} className="bg-white rounded-lg mt-24 p-6" />
        <LineChartComponent title="Monthly Expenses" data={data.expenses} className="bg-white rounded-lg mt-24 p-6" />
          <BarChartComponent title="Income vs Expenses" data={{ labels: incomeMonths, incomeData: incomeAmounts, expenseData: expenseAmounts }} className="bg-white rounded-lg p-6" />
          <PieChartComponent title="Category Spending" data={data.categories.map(cat => ({ category: cat.name, amount: cat.spent }))} className="bg-white rounded-lg " />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
