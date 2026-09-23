import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toastMessage, toastType, showToast } = useContext(AuthContext);

  if (!toastMessage) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-800',
      iconColor: 'text-emerald-500',
      Icon: CheckCircle,
    },
    error: {
      bg: 'bg-rose-50 border-rose-200',
      text: 'text-rose-800',
      iconColor: 'text-rose-500',
      Icon: AlertCircle,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800',
      iconColor: 'text-amber-500',
      Icon: AlertTriangle,
    },
    info: {
      bg: 'bg-sky-50 border-sky-200',
      text: 'text-sky-800',
      iconColor: 'text-sky-500',
      Icon: Info,
    },
  };

  const { bg, text, iconColor, Icon } = typeConfig[toastType] || typeConfig.info;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-short max-w-sm w-full">
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${bg} ${text} shadow-xl backdrop-blur-md`}>
        <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0`} />
        <div className="flex-1 text-sm font-semibold">{toastMessage}</div>
      </div>
    </div>
  );
};

export default Toast;
