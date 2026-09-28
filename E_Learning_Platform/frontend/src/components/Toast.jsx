import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toastMessage, toastType, showToast } = useContext(AuthContext);

  if (!toastMessage) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800/80',
      text: 'text-emerald-800 dark:text-emerald-200',
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      Icon: CheckCircle,
    },
    error: {
      bg: 'bg-rose-50 dark:bg-rose-950/90 border-rose-200 dark:border-rose-800/80',
      text: 'text-rose-800 dark:text-rose-200',
      iconColor: 'text-rose-500 dark:text-rose-400',
      Icon: AlertCircle,
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/90 border-amber-200 dark:border-amber-800/80',
      text: 'text-amber-800 dark:text-amber-200',
      iconColor: 'text-amber-500 dark:text-amber-400',
      Icon: AlertTriangle,
    },
    info: {
      bg: 'bg-sky-50 dark:bg-sky-950/90 border-sky-200 dark:border-sky-800/80',
      text: 'text-sky-800 dark:text-sky-200',
      iconColor: 'text-sky-500 dark:text-sky-400',
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
