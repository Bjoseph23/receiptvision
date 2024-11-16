import React from 'react';
import { useAuth } from "../contexts/AuthContext"; 
// Make sure this path matches your project structure
import supabase from './supabaseClient';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const InvoiceDataHandler = ({ invoiceData, onSuccess, onError }) => {
  const { user } = useAuth();
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [modalContent, setModalContent] = React.useState({ 
    type: '',
    title: '',
    message: '' 
  });

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalContent.type === 'success') {
      onSuccess?.();
    }
  };

  const showFeedbackModal = (type, title, message) => {
    setModalContent({ type, title, message });
    setShowModal(true);
  };

  const processInvoiceToSupabase = async () => {
    if (!user) {
      showFeedbackModal(
        'error',
        'Authentication Error',
        'You must be logged in to save invoice data.'
      );
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // First, check/create income source
      const { data: sourceData, error: sourceError } = await supabase
        .from('income_sources')
        .select('id')
        .eq('name', invoiceData.company)
        .eq('user_id', user.id)  // Add user_id filter
        .single();

      let sourceId;
      
      if (sourceError || !sourceData) {
        // Create new income source if it doesn't exist
        const { data: newSource, error: newSourceError } = await supabase
          .from('income_sources')
          .insert([
            {
              name: invoiceData.company,
              description: `Income from ${invoiceData.company}`,
              user_id: user.id  // Add user_id
            }
          ])
          .select()
          .single();

        if (newSourceError) throw newSourceError;
        sourceId = newSource.id;
      } else {
        sourceId = sourceData.id;
      }

      // Create income record
      const { data: incomeData, error: incomeError } = await supabase
        .from('income')
        .insert([
          {
            source_id: sourceId,
            user_id: user.id,  // Add user_id
            amount: invoiceData.total,
            description: `Invoice #${invoiceData.invoice_number} from ${invoiceData.company} - Customer: ${invoiceData.customer}`,
            is_recurring: false,
            frequency: 'one-time',
            income_date: invoiceData.date,
          }
        ])
        .select();

      if (incomeError) throw incomeError;

      showFeedbackModal(
        'success',
        'Invoice Saved Successfully',
        'Your invoice data has been saved to the database.'
      );
      
    } catch (err) {
      console.error('Error processing invoice:', err);
      showFeedbackModal(
        'error',
        'Error Saving Invoice',
        `Failed to save invoice: ${err.message}`
      );
      onError?.(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={processInvoiceToSupabase}
          disabled={processing}
          className="w-full bg-blue-300 rounded-xl hover:bg-blue-900 hover:text-white"
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving to Database...
            </>
          ) : (
            'Save Invoice Data'
          )}
        </Button>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {modalContent.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              {modalContent.title}
            </DialogTitle>
            <DialogDescription>
              {modalContent.message}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button 
              onClick={handleCloseModal}
              className={modalContent.type === 'success' ? 
                "bg-green-500 hover:bg-green-600" : 
                "bg-blue-500 hover:bg-blue-600"
              }
            >
              {modalContent.type === 'success' ? 'Done' : 'Close'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvoiceDataHandler;