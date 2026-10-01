import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck, FileText, Building2 } from 'lucide-react';

const InvoiceModal = ({ invoice, user, isOpen, onClose }) => {
  if (!isOpen || !invoice) return null;

  const baseAmount = Math.round(invoice.amount / 1.18);
  const gstAmount = invoice.amount - baseAmount;
  const halfGst = Math.round(gstAmount / 2);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10 relative overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors print:hidden"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Printable Invoice Container */}
        <div className="space-y-6">
          
          {/* Letterhead & Invoice Title */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand text-white flex items-center justify-center font-black text-xs">
                  MR
                </div>
                <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                  MOUNTREACH SOLUTION PVT. LTD.
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                ISO 9001:2015 Certified Industrial Training Provider<br />
                Campus: Sector 62, Noida, Uttar Pradesh, 201301 • GSTIN: 07AAECM1234F1Z5
              </p>
            </div>
            
            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                Tax Invoice (Paid)
              </span>
              <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 mt-1.5">
                {invoice.invoiceNumber || 'INV-2026-89102'}
              </p>
              <p className="text-[11px] text-slate-400">
                Date: {new Date(invoice.date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Billed To / Billed By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="font-extrabold uppercase text-[10px] text-slate-400 block tracking-wider">
                Billed Student
              </span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{user?.name || 'Student Candidate'}</p>
              <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
              <p className="text-slate-500 dark:text-slate-400">{user?.college} • {user?.branch}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="font-extrabold uppercase text-[10px] text-slate-400 block tracking-wider">
                Payment Particulars
              </span>
              <p className="font-mono text-slate-700 dark:text-slate-300">
                TXN Ref: <strong className="text-slate-900 dark:text-white">{invoice.transactionId}</strong>
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Gateway: {invoice.paymentMethod || 'UPI / Card'}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                HSN/SAC: 999293 (Vocational Technical Education)
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-extrabold text-slate-400">
                  <th className="pb-2.5">Item Description</th>
                  <th className="pb-2.5 text-center">HSN</th>
                  <th className="pb-2.5 text-right">Taxable Amt</th>
                  <th className="pb-2.5 text-right">CGST (9%)</th>
                  <th className="pb-2.5 text-right">SGST (9%)</th>
                  <th className="pb-2.5 text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">
                    {invoice.courseTitle || 'Industrial Certification Program'}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      Full term access, live mentoring, and ISO verified certification stamp
                    </span>
                  </td>
                  <td className="py-3 text-center font-mono">999293</td>
                  <td className="py-3 text-right">₹{baseAmount.toLocaleString()}</td>
                  <td className="py-3 text-right">₹{halfGst.toLocaleString()}</td>
                  <td className="py-3 text-right">₹{halfGst.toLocaleString()}</td>
                  <td className="py-3 text-right font-black text-slate-900 dark:text-white">
                    ₹{Number(invoice.amount).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Grand Total Summary */}
          <div className="flex justify-end pt-3">
            <div className="w-full sm:w-64 space-y-2 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal (Net):</span>
                <span>₹{baseAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Integrated GST (18%):</span>
                <span>₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
              <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white">
                <span>Total Paid:</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹{Number(invoice.amount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Authorized Signature & QR Stamp */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0" />
              <span>Electronically generated tax invoice under Rule 48 of CGST Rules, 2017.</span>
            </div>

            <div className="text-center sm:text-right">
              <div className="font-serif italic text-slate-800 dark:text-slate-200 font-bold border-b border-slate-300 dark:border-slate-700 pb-1">
                Dhananjay S.
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mt-1">
                Authorized Signatory, Mountreach
              </span>
            </div>
          </div>

        </div>

        {/* Modal Buttons */}
        <div className="flex justify-center gap-3 pt-6 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all"
          >
            <Printer className="h-4 w-4" />
            Print / Save PDF Receipt
          </button>
          <button
            onClick={onClose}
            className="border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold px-6 py-2.5 rounded-xl text-xs transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default InvoiceModal;
