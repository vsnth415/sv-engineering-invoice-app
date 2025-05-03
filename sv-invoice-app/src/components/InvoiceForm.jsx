import React, { useState, useEffect } from "react";
import logo from "../assets/SVLogo.png";
import "./InvoiceForm.css";

// Number to Words (with Paise)
export const numberToWords = (amount) => {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (isNaN(amount)) return "Invalid amount";

  const number = parseFloat(amount).toFixed(2);
  const [rupeesPart, paisePartRaw] = number.split(".");
  const rupees = parseInt(rupeesPart, 10);
  const paise = parseInt(paisePartRaw.padEnd(2, "0").slice(0, 2), 10);

  const convert = (num) => {
    if (num === 0) return "Zero";

    const n = ("000000000" + num)
      .slice(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);

    if (!n) return "";

    let str = "";

    const getWords = (val) => {
      if (val === 0) return "";
      if (val < 20) return a[val];
      return (
        b[Math.floor(val / 10)] + (val % 10 !== 0 ? " " + a[val % 10] : "")
      );
    };

    if (Number(n[1]) > 0) str += getWords(Number(n[1])) + " Crore ";
    if (Number(n[2]) > 0) str += getWords(Number(n[2])) + " Lakh ";
    if (Number(n[3]) > 0) str += getWords(Number(n[3])) + " Thousand ";
    if (Number(n[4]) > 0) str += getWords(Number(n[4])) + " Hundred ";
    if (Number(n[5]) > 0)
      str += (str ? "and " : "") + getWords(Number(n[5])) + " ";

    return str.trim();
  };

  let result = "";
  if (rupees > 0) result += convert(rupees) + " Rupees";
  if (paise > 0) result += (result ? " and " : "") + convert(paise) + " Paise";
  if (!result) result = " Zero Rupees";

  return result + " Only";
};

// Default Invoice Data
const defaultInvoice = {
  customer: {
    name: "",
    address: "",
    post: "",
    mail: "",
    dcNo: "",
    poNo: "",
    gst: "",
  },
  invoiceDetails: { number: "", date: "", dcDate: "", poDate: "" },
  items: [{ description: "", hsn: "", qty: "", rate: "0", ps: "0", amount: 0 }],
  bankDetails: {
    accountName: "S V Engineering",
    accountNumber: "38247983274",
    ifsc: "IDBI9879879",
    bankName: "INDIAN BANK",
  },
  companyGST: "",
  cgstRate: 6,
  sgstRate: 6,
};

// Main Invoice Form
const InvoiceForm = () => {
  const [invoiceData, setInvoiceData] = useState(() => {
    const saved = localStorage.getItem("invoiceData");
    return saved ? JSON.parse(saved) : defaultInvoice;
  });

  // Add new row
  const addRow = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        { description: "", hsn: "", qty: "", rate: "0", ps: "0", amount: 0 },
      ],
    });
  };

  // Save to Local Storage
  useEffect(() => {
    localStorage.setItem("invoiceData", JSON.stringify(invoiceData));
  }, [invoiceData]);

  // Handle Item Change (Qty, Rate, Ps)
  const handleItemChange = (index, field, value) => {
    const items = [...invoiceData.items];
    const item = { ...items[index], [field]: value };

    const rate = parseFloat(item.rate) || 0;
    const paise = (parseFloat(item.ps) || 0) / 100;
    const fullRate = rate + paise;

    item.amount = (parseFloat(item.qty) || 0) * fullRate;
    items[index] = item;
    setInvoiceData({ ...invoiceData, items });
  };

  const handleTaxRateChange = (field, value) =>
    setInvoiceData((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));

  // Remove item row
  const removeItem = (index) => {
    const items = invoiceData.items.filter((_, idx) => idx !== index);
    setInvoiceData({ ...invoiceData, items });
  };

  // Handle Customer Details
  const handleCustomerChange = (field, value) =>
    setInvoiceData((prev) => ({
      ...prev,
      customer: { ...prev.customer, [field]: value },
    }));

  // Handle Invoice Details
  const handleInvoiceChange = (field, value) =>
    setInvoiceData((prev) => ({
      ...prev,
      invoiceDetails: { ...prev.invoiceDetails, [field]: value },
    }));

  // Handle Bank Details
  const handleBankChange = (field, value) =>
    setInvoiceData((prev) => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [field]: value },
    }));

  // Calculate Totals
  const { subtotal, cgst, sgst, total } = (() => {
    const subtotal = invoiceData.items.reduce((sum, item) => {
      const rate = parseFloat(item.rate) || 0;
      const paise = (parseFloat(item.ps) || 0) / 100;
      const fullRate = rate + paise;
      return sum + (parseFloat(item.qty) || 0) * fullRate;
    }, 0);
    const cgst = subtotal * (invoiceData.cgstRate / 100);
    const sgst = subtotal * (invoiceData.sgstRate / 100);
    return { subtotal, cgst, sgst, total: subtotal + cgst + sgst };
  })();

  // Print Invoice
  const printInvoice = () => window.print();

  // Reset Form
  const resetForm = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the form? All data will be lost."
      )
    ) {
      localStorage.removeItem("invoiceData");
      setInvoiceData(defaultInvoice);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden print:shadow-none print:rounded-none invoice-container mx-auto max-w-4xl">
      {/* Header Controls - Not printed */}
      <div className="bg-primary text-white p-4 flex justify-between items-center no-print">
        <h1 className="text-xl font-bold">
          S.V. Engineering Invoice Generator
        </h1>
        <div className="space-x-2">
          <button
            onClick={printInvoice}
            className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
          >
            Print Invoice
          </button>
          <button
            onClick={resetForm}
            className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700"
          >
            Reset Form
          </button>
        </div>
      </div>

      {/* Page number for printing */}
      <div className="page-number print-only"></div>

      {/* Invoice Document */}
      <div className="border border-black print:border-black">
        {/* TAX INVOICE Title */}
        <div className="border-b border-black text-center py-2 font-bold invoice-title">
          TAX INVOICE
        </div>

        {/* Company Header */}
        <div className="flex border-b border-black">
          <div className="w-1/5 border-r border-black p-3 flex items-center justify-center">
            {/* Logo */}
            <div className="h-20 w-20 rounded-full overflow-hidden flex items-center justify-center bg-white">
              <img
                src={logo}
                alt="Logo"
                className="h-20 object-contain mx-auto"
              />
            </div>
          </div>

          {/* Company Name and Address */}
          <div className="w-4/5 p-3 flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-bold tracking-wide company-name">
              S.V.ENGINEERING
            </h1>

            {/* Address Section */}
            <div className="mt-1 company-address">
              <p className="font-medium mb-0.5">
                <span className="print-only">
                  #47 3rd cross shaneshwara nagar Kariobanahalli Veshwaneedam
                  post
                </span>
                <textarea
                  rows={1}
                  className="w-full text-center border-none no-print resize-none text-sm"
                  placeholder="Company Address Line 1"
                  defaultValue="#47 3rd cross shaneshwara nagar Kariobanahalli Veshwaneedam post"
                />
              </p>
              <p className="font-medium mb-0.5">
                <span className="print-only">
                  Bangalore -560091 mob: 9786876878
                </span>
                <textarea
                  rows={1}
                  className="w-full text-center border-none no-print resize-none text-sm"
                  placeholder="Company Address Line 2"
                  defaultValue="Bangalore -560091 mob: 9786876878"
                />
              </p>
              <p className="font-medium mb-0">
                <span className="print-only">Mail ID: sve214@gmail.com</span>
                <input
                  type="text"
                  className="text-center border-none no-print text-sm"
                  placeholder="Company Email"
                  defaultValue="Mail ID: svengi214@gmail.com"
                />
              </p>
            </div>
          </div>
        </div>

        {/* Invoice as Table Layout */}
        <table className="w-full border-collapse table-fixed">
          <tbody className="customer-details">
            {/* Customer Details Row */}
            <tr>
              <td
                colSpan={4}
                className="border-b border-black p-1 font-semibold text-left"
              >
                Customer details
              </td>
            </tr>

            {/* Customer Name Row */}
            <tr>
              <td colSpan={2} className="border-b border-r border-black p-1">
                <input
                  type="text"
                  className="w-full"
                  placeholder="Customer Name"
                  value={invoiceData.customer.name}
                  onChange={(e) => handleCustomerChange("name", e.target.value)}
                />
              </td>
              <td className="border-b border-r border-black p-1 font-semibold text-left">
                Invoice No.
              </td>
              <td className="border-b border-black p-1">
                <div className="flex items-center">
                  <input
                    type="text"
                    className="w-14"
                    value={invoiceData.invoiceDetails.number}
                    onChange={(e) =>
                      handleInvoiceChange("number", e.target.value)
                    }
                  />
                  <span className="font-semibold px-1 whitespace-nowrap">
                    Date:
                  </span>

                  <input
                    type="text"
                    className="w-20 text-sm placeholder:print:opacity-0"
                    placeholder="DD-MM-YYYY"
                    value={invoiceData.invoiceDetails.date}
                    onChange={(e) =>
                      handleInvoiceChange("date", e.target.value)
                    }
                  />
                </div>
              </td>
            </tr>

            {/* Address Line 1 */}
            <tr>
              <td
                colSpan={2}
                className="border-b border-r border-black p-1 text-wrap"
              >
                <input
                  type="text"
                  className="w-full"
                  placeholder="Address Line 1"
                  value={invoiceData.customer.address}
                  onChange={(e) =>
                    handleCustomerChange("address", e.target.value)
                  }
                />
              </td>
              <td className="border-b border-r border-black p-1 font-semibold text-left">
                DC No.
              </td>
              <td className="border-b border-black p-1">
                <div className="flex items-center">
                  <input
                    type="text"
                    className="w-14"
                    value={invoiceData.customer.dcNo}
                    onChange={(e) =>
                      handleCustomerChange("dcNo", e.target.value)
                    }
                  />
                  <span className="font-semibold px-1 whitespace-nowrap">
                    Date:
                  </span>

                  <input
                    type="text"
                    className="w-20 text-sm placeholder:print:opacity-0"
                    placeholder="DD-MM-YYYY"
                    value={invoiceData.invoiceDetails.dcDate}
                    onChange={(e) =>
                      handleInvoiceChange("dcDate", e.target.value)
                    }
                  />
                </div>
              </td>
            </tr>

            {/* Address Line 2 */}
            <tr>
              <td colSpan={2} className="border-b border-r border-black p-1">
                <input
                  type="text"
                  className="w-full"
                  placeholder="Address Line 2"
                  value={invoiceData.customer.post}
                  onChange={(e) => handleCustomerChange("post", e.target.value)}
                />
              </td>
              <td className="border-b border-r border-black p-1 font-semibold text-left">
                PO No.
              </td>
              <td className="border-b border-black p-1">
                <div className="flex items-center">
                  <input
                    type="text"
                    className="w-14"
                    value={invoiceData.customer.poNo}
                    onChange={(e) =>
                      handleCustomerChange("poNo", e.target.value)
                    }
                  />
                  <span className="font-semibold px-1 whitespace-nowrap">
                    Date:
                  </span>
                  <input
                    type="text"
                    className="w-20 text-sm placeholder:print:opacity-0"
                    placeholder="DD-MM-YYYY"
                    value={invoiceData.invoiceDetails.poDate}
                    onChange={(e) =>
                      handleInvoiceChange("poDate", e.target.value)
                    }
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* GST Information */}
        <div className="flex border-b border-black gst-line">
          <div className="w-1/2 border-r border-black p-1">
            <span className="font-semibold">Customer GST No : </span>
            <input
              type="text"
              className="w-1/2"
              value={invoiceData.customer.gst}
              onChange={(e) => handleCustomerChange("gst", e.target.value)}
            />
          </div>
          <div className="w-1/2 p-1">
            <span className="font-semibold">Our GST No.: </span>
            <input
              type="text"
              className="w-1/2"
              value={invoiceData.companyGST}
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, companyGST: e.target.value })
              }
            />
          </div>
        </div>

        {/* Invoice Items Table */}
        <table className="w-full border-collapse   invoice-table">
          <thead>
            <tr className="bg-gray-50 border-black text-center">
              <th
                className="border border-black p-2 w-16 text-center"
                rowSpan="2"
              >
                SL NO.
              </th>
              <th className="border border-black p-2" rowSpan="2">
                DESCRIPTION
              </th>
              <th className="border border-black p-2" rowSpan="2">
                HSN/SAC Code
              </th>
              <th className="border border-black p-2" rowSpan="2">
                QTY
              </th>
              <th className="border border-black p-2" colSpan="2">
                UNIT RATE
              </th>
              <th className="border border-black p-2" rowSpan="2">
                AMOUNT
                <br />
                Rs.
              </th>
              <th
                className="border border-black p-2 print:hidden no-print"
                rowSpan="2"
              >
                Action
              </th>
            </tr>
            <tr className="bg-gray-50 text-center">
              <th className="border border-black p-1">Rs.</th>
              <th className="border border-black p-1">Ps.</th>
            </tr>
          </thead>

          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index} className="item-row">
                <td className="border border-black p-1 text-center">
                  {index + 1}
                </td>
                <td className="border border-black p-1">
                  <textarea
                    rows={2}
                    className="w-full resize-y overflow-hidden text-sm whitespace-pre-wrap break-words"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                  />
                </td>
                <td className="border border-black p-1 text-center">
                  <input
                    type="text"
                    className="w-full text-center item-hsn"
                    value={item.hsn}
                    onChange={(e) =>
                      handleItemChange(index, "hsn", e.target.value)
                    }
                  />
                </td>
                <td className="border border-black p-1 text-center">
                  <input
                    type="number"
                    className="w-full text-center item-qty"
                    value={item.qty}
                    min="0"
                    onChange={(e) =>
                      handleItemChange(index, "qty", e.target.value)
                    }
                  />
                </td>
                <td className="border border-black p-1 text-right">
                  <input
                    type="number"
                    className="w-full text-right item-rate-rs"
                    value={parseFloat(item.rate).toFixed(0)}
                    min="0"
                    onChange={(e) =>
                      handleItemChange(index, "rate", e.target.value)
                    }
                  />
                </td>
                <td className="border border-black p-1 text-right">
                  <input
                    type="number"
                    className="w-full text-right item-rate-rs"
                    value={parseFloat(item.ps).toFixed(0)}
                    min="0"
                    onChange={(e) =>
                      handleItemChange(index, "ps", e.target.value)
                    }
                  />
                </td>
                <td className="border border-black p-1 text-right">
                  <input
                    type="text"
                    className="w-full text-right item-amount"
                    value={item.amount.toFixed(2)}
                    readOnly
                  />
                </td>
                <td className="border border-black p-1 text-center no-print">
                  <button
                    onClick={() => removeItem(index)}
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-700"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
            {/* Add Row Button */}
            <tr className="no-print">
              <td colSpan={8} className="p-2 text-center">
                <button
                  onClick={addRow}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Item
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Summary Table */}
        <table className="w-full border-collapse invoice-table">
          <tbody>
            {/* Bill No Row - Empty by default */}
            <tr className="totals-row">
              <td colSpan={6} className="border border-black p-1">
                <span className="font-semibold">Bill No.: </span>
                <input type="text" className="w-1/2 item-bill-no" />
              </td>
              <td className="border border-black p-1 text-right font-semibold">
                SUB TOTAL
              </td>
              <td className="border border-black p-1 text-right amount-column">
                {subtotal.toFixed(2)}
              </td>
            </tr>
            {/* Amount in Words */}
            <tr className="totals-row">
              <td colSpan={6} className="border border-black p-1">
                <span className="font-semibold">Amount in Words: </span>
                {numberToWords(total.toFixed(2)).toUpperCase()}
              </td>
              <td className="border border-black p-1 text-right font-semibold">
                <span className="print:hidden">
                  CGST-
                  <input
                    type="number"
                    value={invoiceData.cgstRate}
                    onChange={(e) =>
                      handleTaxRateChange("cgstRate", e.target.value)
                    }
                    className="w-10 text-center border-b border-black inline-block mx-1"
                    style={{ width: "2.5rem" }}
                  />
                  %
                </span>

                <span className="hidden print:inline">
                  CGST- {invoiceData.cgstRate} %
                </span>
              </td>

              <td className="border border-black p-1 text-right amount-column">
                <div className="flex justify-end">
                  <span>{cgst.toFixed(2)}</span>
                </div>
              </td>
            </tr>
            {/* Bank Details */}
            <tr className="totals-row">
              <td
                colSpan={6}
                className="border border-black p-1 text-center font-semibold"
              >
                Bank Details
              </td>

              <td className="border border-black p-1 text-right font-semibold">
                <span className="print:hidden">
                  SGST-
                  <input
                    type="number"
                    defaultValue="6"
                    value={invoiceData.sgstRate}
                    onChange={(e) =>
                      handleTaxRateChange("sgstRate", e.target.value)
                    }
                    className="w-10 text-center border-b border-black inline-block mx-1"
                    style={{ width: "2.5rem" }}
                  />
                  %
                </span>
                <span className="hidden print:inline">
                  SGST- {invoiceData.sgstRate} %
                </span>
              </td>

              <td className="border border-black p-1 text-right amount-column">
                <div className="flex justify-end">
                  <span>{sgst.toFixed(2)}</span>
                </div>
              </td>
            </tr>
            <tr className="totals-row">
              <td className="border border-black p-1 font-semibold">
                Bank Name
              </td>
              <td colSpan={5} className="border border-black p-1">
                <input
                  type="text"
                  className="w-full bank-name"
                  value={invoiceData.bankDetails.bankName}
                  onChange={(e) => handleBankChange("bankName", e.target.value)}
                />
              </td>
              <td className="border border-black p-1 text-right font-semibold">
                TOTAL TAX
              </td>
              <td className="border border-black p-1 text-right amount-column">
                {(cgst + sgst).toFixed(2)}
              </td>
            </tr>
            <tr className="totals-row">
              <td className="border border-black p-1 font-semibold">
                Account No.
              </td>
              <td colSpan={5} className="border border-black p-1">
                <input
                  type="text"
                  className="w-full account-number"
                  value={invoiceData.bankDetails.accountNumber}
                  onChange={(e) =>
                    handleBankChange("accountNumber", e.target.value)
                  }
                />
              </td>
              <td className="border border-black p-1 text-right font-semibold">
                TOTAL AMOUNT
              </td>
              <td className="border border-black p-1 text-right amount-column">
                {total.toFixed(2)}
              </td>
            </tr>
            <tr className="totals-row">
              <td className="border border-black p-1 font-semibold">
                IFSC Code.
              </td>
              <td colSpan={5} className="border border-black p-1">
                <input
                  type="text"
                  className="w-full ifsc-code"
                  value={invoiceData.bankDetails.ifsc}
                  onChange={(e) => handleBankChange("ifsc", e.target.value)}
                />
              </td>
              <td
                colSpan={2}
                className="border border-black p-1 text-center"
              ></td>
            </tr>
            <tr>
              <td colSpan={6} className="border border-black p-2">
                <div className="flex flex-col justify-between h-24">
                  <div className="text-sm text-center font-semibold">
                    Received the above materials in good condition
                  </div>
                  <div className="mt-auto text-center font-semibold">
                    Receiver's Name with Signature &amp; Seal
                  </div>
                </div>
              </td>
              <td colSpan={2} className="border border-black p-2">
                <div className="flex flex-col justify-between h-24">
                  <div className="text-center text-sm font-semibold">
                    For: S.V. ENGINEERING
                  </div>
                  <div className="mt-auto text-center font-semibold">
                    Authorised Signatory
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceForm;
