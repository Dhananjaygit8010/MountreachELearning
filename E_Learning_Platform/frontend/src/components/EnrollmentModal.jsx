import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X, CreditCard, ShieldCheck, CheckCircle, Loader } from 'lucide-react';

const EnrollmentModal = ({ course, isOpen, onClose, onEnrollSuccess }) => {
  const { enrollInCourse } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});

  if (!isOpen || !course) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Enter a valid 16-digit card number';
    }
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
      newErrors.expiry = 'Enter expiry date (MM/YY)';
    }
    if (!cvv || cvv.length < 3) {
      newErrors.cvv = 'Enter 3-digit CVV';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProcessing(true);
    // Simulate network delay for verification
    setTimeout(async () => {
      const result = await enrollInCourse(course._id);
      setProcessing(false);
      if (result.success) {
        setPaymentSuccess(true);
        // Show success screen briefly, then close
        setTimeout(() => {
          setPaymentSuccess(false);
          onEnrollSuccess();
          onClose();
        }, 2000);
      }
    }, 2000);
  };

  // Card number input formatter
  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted.substring(0, 19));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative transform transition-all duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={processing}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {paymentSuccess ? (
          /* Success Screen */
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
            <div className="bg-emerald-50 text-emerald-500 p-4 rounded-full border border-emerald-100 animate-bounce-short">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Payment Authorized!</h3>
            <p className="text-slate-500 font-semibold">
              Thank you! Your enrollment has been verified.
            </p>
            <div className="text-xs text-brand font-bold bg-brand-accent px-4 py-1.5 rounded-full uppercase tracking-wider">
              Enrolling in Portal Database...
            </div>
          </div>
        ) : (
          /* Payment Form Screen */
          <form onSubmit={handlePaymentSubmit} className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-extrabold text-brand uppercase tracking-wider bg-brand-accent px-3 py-1 rounded-full">
                Checkout Details
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Authorize Enrollment
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Course: <strong className="text-slate-700">{course.title}</strong>
              </p>
            </div>

            {/* Bill Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5">
              <div className="flex justify-between text-sm text-slate-600 font-medium">
                <span>Program Fees</span>
                <span>₹{course.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 font-medium">
                <span>Certification type</span>
                <span className="text-brand font-semibold">Paid Course Certification</span>
              </div>
              <div className="h-px bg-slate-200 my-1" />
              <div className="flex justify-between text-slate-950 font-extrabold">
                <span>Total Amount Due</span>
                <span>₹{course.price.toLocaleString()}</span>
              </div>
            </div>

            {/* Simulated Payment Inputs */}
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-slate-400 font-bold text-xs uppercase tracking-wider">
                <CreditCard className="h-4 w-4" />
                Simulated Payment Gateway
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="4111 2222 3333 4444"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  disabled={processing}
                  className={`w-full p-3 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                    errors.cardNumber ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200'
                  }`}
                />
                {errors.cardNumber && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.cardNumber}</p>}
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    disabled={processing}
                    className={`w-full p-3 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                      errors.expiry ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200'
                    }`}
                  />
                  {errors.expiry && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.expiry}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    CVV Security Code
                  </label>
                  <input
                    type="password"
                    placeholder="123"
                    maxLength="3"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    disabled={processing}
                    className={`w-full p-3 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                      errors.cvv ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200'
                    }`}
                  />
                  {errors.cvv && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.cvv}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 items-start">
              <ShieldCheck className="h-5 w-5 text-brand flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                This is a secure checkout simulation. Clicking "Authorize Payment" will write your enrollment record directly to the Mountreach course registry database.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={processing}
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl text-sm transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="flex-1 bg-brand hover:bg-brand-dark disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-1.5"
              >
                {processing ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Authorize Payment'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EnrollmentModal;
