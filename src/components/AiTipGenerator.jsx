import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 1024,
  }
});

const AiTipsGenerator = ({ userData, className }) => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generatePersonalizedTips = async (data) => {
    try {
      const chatSession = model.startChat({
        history: []
      });

      const prompt = `As a personal finance advisor, analyze this user's financial data and provide 3-4 specific, actionable tips. Focus on areas of improvement and practical advice.
      
      User's Financial Data:
      - Monthly Average Income: $${data.averageMonthlyIncome.toFixed(2)}
      - Monthly Average Expenses: $${data.averageMonthlyExpenses.toFixed(2)}
      - Total Income (Last 6 months): $${data.totalIncome.toFixed(2)}
      - Total Expenses (Last 6 months): $${data.totalExpenses.toFixed(2)}
      - Spending Categories: ${JSON.stringify(data.categories)}
      
      Consider:
      1. Income to expense ratio
      2. Spending patterns in different categories
      3. Potential savings opportunities
      4. Budget allocation suggestions
      
      Return the response as a JSON array of strings, where each string is a specific tip. Example format:
      ["tip1", "tip2", "tip3"]`;

      const result = await chatSession.sendMessage(prompt);
      const response = result.response.text();
      
      // Parse the response and extract tips
      const parsedTips = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim());
      return parsedTips;

    } catch (error) {
      throw new Error(`Failed to generate tips: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchTips = async () => {
      if (!userData) return;
      
      setLoading(true);
      try {
        const personalizedTips = await generatePersonalizedTips(userData);
        setTips(personalizedTips);
        setError(null);
      } catch (err) {
        setError('Failed to generate personalized tips');
        console.error('Error generating tips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [userData]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Personalized Tips</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <ul className="space-y-3">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-500 font-medium">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default AiTipsGenerator;