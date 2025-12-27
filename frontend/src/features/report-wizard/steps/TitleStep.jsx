import React from 'react';
import { User, Users, Hash, Bookmark } from 'lucide-react';

export const TitleStep = ({ data, onChange }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-slate-900">Параметры отчета</h2>
      <p className="text-slate-500">Эти данные пойдут на титульный лист.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">ФИО студента</label>
        <input 
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={data.fullName}
          placeholder="Иванов И.И."
          onChange={(e) => onChange({ fullName: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Группа</label>
        <input 
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={data.group}
          placeholder="ИУ7-31Б"
          onChange={(e) => onChange({ group: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">№ Работы</label>
        <input 
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={data.workNumber}
          placeholder="1"
          onChange={(e) => onChange({ workNumber: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Вариант</label>
        <input 
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={data.variant}
          placeholder="5"
          onChange={(e) => onChange({ variant: e.target.value })}
        />
      </div>
    </div>

    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">Тип работы</label>
      <select 
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
        value={data.workType}
        onChange={(e) => onChange({ workType: e.target.value })}
      >
        <option value="Лабораторная работа">Лабораторная работа</option>
        <option value="Семинар">Семинар</option>
        <option value="Домашнее задание">Домашнее задание</option>
      </select>
    </div>
  </div>
);