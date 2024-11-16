import React, { useState, useEffect, useRef } from "react";
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from '@google/generative-ai';
import InvoiceDataHandler from "./InvoiceDataHandler";
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

const CameraCapture = ({ onClose }) => {
  const [hasCamera, setHasCamera] = useState(false);
  const [error, setError] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [processingError, setProcessingError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const checkCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCamera(true);
        videoRef.current.srcObject = stream;
        setError(false);
      } catch {
        setError(true);
        console.error("Camera not available on this device.");
      }
    };
    checkCamera();
  }, []);

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    setCapturedImage(canvas.toDataURL("image/png"));
    setResult(null);
    setProcessingError(null);
  };

  const processInvoice = async (base64Image) => {
    try {
      const chatSession = model.startChat({
        history: []
      });

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
          ... [other categories]
          'Taxes', 'Income Taxes, Sales Taxes, Property Taxes, Business Taxes, Import/Export Duties'],
          ('Savings & Investments', 'Savings Contributions, Investment Accounts, Stocks/Bonds, Retirement Funds, Real Estate Investments'),
          ('Subscriptions & Memberships', 'Club Memberships, Professional Associations, Streaming/Subscription Services (e.g., newspapers, entertainment, software)');`
        }
      ]);

      const responseText = result.response.text();
      const jsonStr = responseText.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(jsonStr);

    } catch (error) {
      throw new Error(`Failed to process invoice: ${error.message}`);
    }
  };

  const handleProcess = async () => {
    setProcessing(true);
    setProcessingError(null);

    try {
      const data = await processInvoice(capturedImage);
      setResult(data);
    } catch (err) {
      setProcessingError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg max-w-md mx-auto p-6 relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">×</button>
      <h2 className="text-xl font-bold mb-4">Scan Receipt with AI</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> Camera not available on this device.</span>
        </div>
      )}

      {!error && hasCamera && (
        <div className="mb-4">
          {!capturedImage ? (
            <>
              <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-lg" />
              <button onClick={capturePhoto} className="flex items-center gap-2 mt-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-800">
                <CameraEnhanceIcon fontSize="large"/>
                <span>Capture Receipt</span>
              </button>
            </>
          ) : (
            <>
              <img src={capturedImage} alt="Captured" className="w-full h-auto mt-4 rounded-lg" />
              <Button
                onClick={handleProcess}
                disabled={processing}
                className="w-full mt-4"
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
              <Button
                onClick={capturePhoto}
                disabled={processing}
                className="w-full mt-2"
              >
                Retake Picture
              </Button>
            </>
          )}
        </div>
      )}

      {processingError && (
        <Alert variant="destructive">
          <AlertDescription>{processingError}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Extracted Data:</h3>
          <InvoiceFormEditor
            extractedData={result}
            onSubmit={(updatedData) => {
              setResult(updatedData);
            }}
          />
          <div className="mt-4">
            <InvoiceDataHandler 
              invoiceData={result}
              onSuccess={() => {
                console.log("Invoice saved successfully.");
              }}
              onError={(error) => {
                console.error('Failed to save invoice:', error);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
