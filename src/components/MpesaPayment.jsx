import React, { useState } from 'react';
import PaymentsIcon from '@mui/icons-material/Payments';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const MpesaPayment = ({ isOpen: navIsOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const generateAccessToken = async () => {
    const consumerKey = process.env.REACT_APP_CONSUMER_KEY;
    const consumerSecret = process.env.REACT_APP_CONSUMER_SECRET;
    
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
        {
          method: 'GET',
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );
      
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      throw new Error('Failed to generate access token');
    }
  };

  const initiatePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const accessToken = await generateAccessToken();
      
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const shortcode = '600990';
      
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/mpesa/stkpush/v1/processrequest`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            BusinessShortCode: shortcode,
            Password: btoa(`${shortcode}${process.env.REACT_APP_PASSKEY}${timestamp}`),
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phone,
            PartyB: shortcode,
            PhoneNumber: phone,
            CallBackURL: 'https://your-callback-url.com/callback',
            AccountReference: 'ReceiptVision',
            TransactionDesc: 'Payment for ReceiptVision Services', 
          }),
        }
      );

      const data = await response.json();
      
      if (data.ResponseCode === '0') {
        setSuccess(true);
        setTimeout(() => setIsOpen(false), 3000);
      } else {
        setError('Payment initiation failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center justify-start w-full gap-x-4 p-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all duration-300 mt-2"
      >
        <PaymentsIcon fontSize="large" />
        {navIsOpen && <span className="font-bold">M-Pesa Payment</span>}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <PaymentsIcon /> M-Pesa Payment
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-4">
              <form onSubmit={initiatePayment} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="254XXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      pattern="254[0-9]{9}"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (KES)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="1"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-center gap-2">
                    <ErrorOutlineIcon className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md">
                    <p className="font-medium">Success</p>
                    <p className="text-sm">Please check your phone to complete the payment.</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} className="text-white" />
                      <span>Processing</span>
                    </>
                  ) : (
                    'Pay Now'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MpesaPayment;