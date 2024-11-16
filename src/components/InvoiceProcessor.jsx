import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2 } from "lucide-react";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { GoogleGenerativeAI } from '@google/generative-ai';
import InvoiceDataHandler from "./InvoiceDataHandler"
import InvoiceFormEditor from './invoiceformEditor';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  }
});

const InvoiceProcessor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processInvoice = async (base64Image) => {
    try {
      const chatSession = model.startChat({
        history: []
      });

      // Remove data URL prefix if present
      const imageData = base64Image.split(',')[1] || base64Image;

      const result = await chatSession.sendMessage([
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData
          }
        },
        {
          text: `Extract the following information from this invoice image and return it as a JSON object with this exact structure:
          {
            "invoice_number": string,
            "date": string,
            "company": string,
            "customer": string,
            "items": [
              {
                "description": string,
                "quantity": number,
                "price": number,
                "total": number,
                "category": string
              }
            ],
            "total": number,
            "payment_details": {
              "bank_code": string,
              "bank_name": string
            },
            "category": string
          }
          If any field is not found, use null. for the category, look through the name of the cateory in the image. If the item name corresponds to the the desctiption pair as listed below, assign the value of category respectively (name of the categoty of the items, items that they fall under the category):
          ('Housing and Utilities', 'Rent/Mortgage, Property Taxes, Home Maintenance/Repairs, Furniture & Appliances, Home Improvement Supplies, Cleaning Supplies, Utility Bills, Security Systems'),
('Groceries & Food', 'Groceries, Beverages, Dining Out/Restaurant Bills, Snacks & Confectionery, Meal Delivery Services, Alcohol & Spirits'),
('Transportation', 'Fuel/Gasoline, Car Payment/Lease, Car Maintenance/Repairs, Public Transportation, Vehicle Insurance, Parking Fees/Tolls, Ride-sharing services'),
('Healthcare & Personal Care', 'Medical Expenses, Health Insurance, Medications/Pharmacy, Dental Care, Vision Care, Personal Hygiene Products, Beauty Products, Gym Memberships, Mental Health'),
('Insurance', 'Health Insurance, Home Insurance, Car Insurance, Business Insurance, Life Insurance, Disability Insurance'),
('Entertainment & Leisure', 'Streaming Services, Movies/Concert Tickets, Books/Magazines, Video Games, Sports Equipment/Activities, Hobbies & Crafts, Toys/Games, Event Tickets'),
('Education', 'Tuition Fees, Books & School Supplies, Online Courses & Training, Seminars/Workshops, Student Loan Payments, Professional Development Programs'),
('Clothing & Accessories', 'Apparel, Footwear, Jewelry & Watches, Handbags & Accessories, Workwear/Uniforms, Sportswear/Activewear'),
('Technology & Electronics', 'Computers & Laptops, Smartphones & Tablets, Software & Apps, Printers/Office Equipment, Wearables, Cameras & Photography Equipment, Video/Audio Equipment, Gadgets & Accessories, Subscriptions to Software Services (e.g., Adobe)'),
('Office Supplies & Stationery', 'Paper Products, Pens, Notebooks, and Folders, Office Furniture, Printer Ink/Cartridges, Mailing Supplies'),
('Business Expenses', 'Advertising & Marketing, Office Space Rent, Employee Salaries, Business Meals & Entertainment, Travel Expenses, Utilities (business-specific), Inventory & Supplies, Software & Licensing Fees, Client Gifts, Professional Services'),
('Travel & Accommodation', 'Flights, Hotels/Accommodation, Car Rentals, Travel Insurance, Meals/Per Diems, Tourism & Activities'),
('Pets & Pet Care', 'Pet Food, Veterinary Bills, Pet Supplies, Pet Grooming, Pet Insurance'),
('Miscellaneous', 'Gifts, Charitable Donations, Subscriptions, Legal Fees, Childcare Expenses, Laundry Services, Household Items'),
('Taxes', 'Income Taxes, Sales Taxes, Property Taxes, Business Taxes, Import/Export Duties'),
('Savings & Investments', 'Savings Contributions, Investment Accounts, Stocks/Bonds, Retirement Funds, Real Estate Investments'),
('Subscriptions & Memberships', 'Club Memberships, Professional Associations, Streaming/Subscription Services (e.g., newspapers, entertainment, software)'); `
        }
      ]);

      const responseText = result.response.text();
      // Clean up the response and parse JSON
      const jsonStr = responseText.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(jsonStr);

    } catch (error) {
      throw new Error(`Failed to process invoice: ${error.message}`);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    setProcessing(true);
    setError(null);

    try {
      // Read file as base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);

      reader.onloadend = async () => {
        try {
          const base64Image = reader.result;
          const data = await processInvoice(base64Image);
          setResult(data);
        } catch (err) {
          setError(err.message);
          setResult(null);
        } finally {
          setProcessing(false);
        }
      };

    } catch (err) {
      setError(err.message);
      setResult(null);
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Invoice Processor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Selected invoice"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}

            <Button
              onClick={handleProcess}
              disabled={!selectedFile || processing}
              className="w-full"
            >
              <AutoAwesomeIcon fontSize="large" style={{ color: "linear-gradient(45deg, #8a3ffc, #00c6ff)" }} />
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Process Invoice'
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-4">
          {result && (
           <div className="space-y-4">
             <h3 className="text-lg font-semibold mb-2">Extracted Data:</h3>
             <InvoiceFormEditor
               extractedData={result}
               onSubmit={(updatedData) => {
                 // Update the result with the new data
                 setResult(updatedData);
               }}
               onCancel={() => {
                 // Optional: Handle cancel action
               }}
             />
             
             <div className="mt-4">
               <InvoiceDataHandler 
                 invoiceData={result}
                 onSuccess={() => {
                   // Handle success
                 }}
                 onError={(error) => {
                   console.error('Failed to save invoice:', error);
                 }}
               />
             </div>
           </div>
         )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceProcessor;