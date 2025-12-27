import React from 'react'; // Добавь эту строку, если её нет

export const Input = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />}
      <input 
        {...props} 
        className={`w-full ${Icon ? 'pl-10' : 'px-4'} py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm`}
      />
    </div>
  </div>
);