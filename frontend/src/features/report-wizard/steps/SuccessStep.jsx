import React from 'react';
import { CheckCircle2, ArrowRight, FileText } from 'lucide-react';

export const SuccessStep = () => (
  <div className="py-10 text-center space-y-6 animate-in zoom-in-95 duration-300">
    <div className="flex justify-center">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-100">
        <CheckCircle2 size={48} />
      </div>
    </div>
    
    <div className="space-y-2">
      <h2 className="text-3xl font-bold text-slate-900">Отчет в очереди!</h2>
      <p className="text-slate-500 max-w-sm mx-auto">
        Наш ИИ начал анализировать ваш код. Это займет около 1-2 минут. 
        Вы сможете найти готовый документ в разделе «Мои отчеты».
      </p>
    </div>

    <button 
      onClick={() => window.location.reload()}
      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all"
    >
      Создать еще один
      <ArrowRight size={18} />
    </button>
  </div>
);