import React from 'react';
import { Github, Link as LinkIcon } from 'lucide-react';

export const RepoStep = ({ value, onChange }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-slate-900">Данные репозитория</h2>
      <p className="text-slate-500">Укажите ссылку на ваш GitHub, где лежит код.</p>
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 ml-1">GitHub Repo URL</label>
      <div className="relative">
        <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="url"
          placeholder="https://github.com/username/repo"
          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-lg"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <p className="text-xs text-slate-400 ml-1 italic">
        * Убедитесь, что репозиторий публичный или у приложения есть доступ.
      </p>
    </div>
  </div>
);