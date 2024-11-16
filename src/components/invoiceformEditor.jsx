import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const InvoiceFormEditor = ({ extractedData, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState({
    total: extractedData?.total || 0,
    description: `Invoice #${extractedData?.invoice_number || ''} from ${extractedData?.company || ''} - Customer: ${extractedData?.customer || ''}`,
    is_recurring: extractedData?.is_recurring === true || false,
    frequency: extractedData?.frequency ||'' ,
    date: extractedData?.date ? new Date(extractedData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    invoice_number: extractedData?.invoice_number || '',
    company: extractedData?.company || '',
    customer: extractedData?.customer || ''
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleFrequencyChange = (value) => {
    setFormData(prev => ({
      ...prev,
      frequency: value,
      is_recurring: value !== 'one-time'
    }));
  };

  const handleRecurringChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      is_recurring: checked,
      frequency: checked ? (prev.frequency === 'one-time' ? 'monthly' : prev.frequency) : 'one-time'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const finalData = {
        invoice_number: formData.invoice_number,
        company: formData.company,
        customer: formData.customer,
        total: parseFloat(formData.total),
        date: formData.date,
        is_recurring: Boolean(formData.is_recurring),
        frequency: formData.is_recurring ? formData.frequency : null,
        description: formData.description
      };

      await onSubmit(finalData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit Invoice Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="total">Amount</Label>
            <Input
              id="total"
              name="total"
              type="number"
              step="0.01"
              value={formData.total}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_recurring"
              checked={formData.is_recurring}
              onCheckedChange={handleRecurringChange}
            />
            <Label htmlFor="is_recurring">Recurring Income</Label>
          </div>

          <div className={`space-y-2 transition-all ${!formData.is_recurring ? 'opacity-50 pointer-events-none' : ''}`}>
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={formData.frequency}
              onValueChange={handleFrequencyChange}
              disabled={!formData.is_recurring}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white min-w-[120px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvoiceFormEditor;