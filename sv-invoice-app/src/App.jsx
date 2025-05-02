import React, { useEffect, useState } from 'react';
import InvoiceForm from './components/InvoiceForm';

const App = () => {
  const [invoiceData, setInvoiceData] = useState(() => {
    const saved = localStorage.getItem('sv-invoice-data');
    return saved ? JSON.parse(saved) : {
      customer: { name: '', address: '', gstin: '' },
      items: [],
      invoiceDetails: { number: '', date: '' },
      bankDetails: {
        name: 'INDIAN BANK',
        branch: '',
        account: '38247983274',
        ifsc: 'IDBI9879879'
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('sv-invoice-data', JSON.stringify(invoiceData));
  }, [invoiceData]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 text-black dark:text-white">
      <InvoiceForm invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
    </div>
  );
};

export default App;
