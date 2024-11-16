import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import supabase from "../components/supabaseClient";
import { Plus, CheckCircle2, Timer, Target, Trash2, Edit2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

const GoalsAndTips = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: '',
    target_date: '',
    category: '',
    current_amount: '0'
  });

  // Goal categories
  const goalCategories = [
    "Emergency Fund",
    "Retirement",
    "Home Purchase",
    "Debt Repayment",
    "Vacation",
    "Education",
    "Car Purchase",
    "Investment",
    "Other"
  ];

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const goalData = {
        ...formData,
        user_id: user.id,
        current_amount: parseFloat(formData.current_amount) || 0,
        target_amount: parseFloat(formData.target_amount),
        created_at: new Date().toISOString(),
        status: 'active'
      };

      let response;
      if (editingGoal) {
        response = await supabase
          .from('financial_goals')
          .update(goalData)
          .eq('id', editingGoal.id);
      } else {
        response = await supabase
          .from('financial_goals')
          .insert([goalData]);
      }

      if (response.error) throw response.error;
      
      setOpen(false);
      setEditingGoal(null);
      setFormData({
        title: '',
        description: '',
        target_amount: '',
        target_date: '',
        category: '',
        current_amount: '0'
      });
      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      target_amount: goal.target_amount.toString(),
      target_date: goal.target_date,
      category: goal.category,
      current_amount: goal.current_amount.toString()
    });
    setOpen(true);
  };

  const handleDelete = async (goalId) => {
    try {
      const { error } = await supabase
        .from('financial_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const updateProgress = async (goalId, newAmount) => {
    try {
      const { error } = await supabase
        .from('financial_goals')
        .update({ current_amount: parseFloat(newAmount) })
        .eq('id', goalId);

      if (error) throw error;
      fetchGoals();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const generateTips = (goal) => {
    const tips = [];
    const progress = (goal.current_amount / goal.target_amount) * 100;
    const remainingAmount = goal.target_amount - goal.current_amount;
    const targetDate = new Date(goal.target_date);
    const today = new Date();
    const monthsRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24 * 30));
    const monthlyRequired = remainingAmount / monthsRemaining;

    tips.push(`To reach your goal, you need to save $${monthlyRequired.toFixed(2)} per month.`);

    switch (goal.category) {
      case "Emergency Fund":
        tips.push("Aim to have 3-6 months of living expenses saved.");
        tips.push("Keep this money in a high-yield savings account for easy access.");
        break;
      case "Retirement":
        tips.push("Consider maximizing your 401(k) contributions if available.");
        tips.push("Look into IRA options for additional tax advantages.");
        break;
      case "Debt Repayment":
        tips.push("Consider the snowball or avalanche method for debt repayment.");
        tips.push("Look into debt consolidation if you have high-interest debt.");
        break;
      default:
        tips.push("Set up automatic transfers to your savings account.");
        tips.push("Review and cut unnecessary expenses to reach your goal faster.");
    }

    if (progress < 25) {
      tips.push("You're just getting started! Stay motivated by tracking your progress regularly.");
    } else if (progress >= 75) {
      tips.push("You're almost there! Consider increasing your savings rate for the final push.");
    }

    return tips;
  };

  const GoalCard = ({ goal }) => {
    const progress = (goal.current_amount / goal.target_amount) * 100;
    const tips = generateTips(goal);

    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{goal.title}</CardTitle>
              <CardDescription>{goal.description}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(goal)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(goal.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label>Current Amount</Label>
                <Input
                  type="number"
                  value={goal.current_amount}
                  onChange={(e) => updateProgress(goal.id, e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Target Amount</Label>
                <div className="mt-1 py-2">${goal.target_amount.toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-4">
              <Label>Tips</Label>
              <div className="mt-2 space-y-2">
                {tips.map((tip, index) => (
                  <Alert key={index}>
                    <AlertDescription>{tip}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Financial Goals</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-gray-800 sm:max-w-[500px] border border-gray-200 dark:border-gray-700 shadow-lg">
            <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
                Set a new financial goal and track your progress
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 px-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Goal Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="Enter goal title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Description
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your goal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="w-full border border-gray-300 dark:border-gray-600 
                                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    {goalCategories.map((category) => (
                      <SelectItem 
                        key={category} 
                        value={category}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target_amount" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Target Amount
                  </Label>
                  <Input
                    id="target_amount"
                    type="number"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="$0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target_date" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Target Date
                  </Label>
                  <Input
                    id="target_date"
                    type="date"
                    value={formData.target_date}
                    onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md
                           transition duration-150 ease-in-out
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
};

export default GoalsAndTips;