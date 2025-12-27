import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Zap, Shield, Github, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Навигация */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
          <Zap fill="currentColor" />
          <span>ReportGen AI</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2 text-slate-600 font-medium hover:text-blue-600 transition-colors"
        >
          Войти
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-4 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Специально для студентов ИУ7
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Отчеты по лабам <br /> 
          <span className="text-blue-600">за считанные секунды</span>
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-2xl">
          ИИ проанализирует твой код на GitHub, сформулирует цели, задачи и выводы, 
          построит графики и оформит всё в готовый DOCX по ГОСТу.
        </p>
        <button 
          onClick={() => navigate('/login')}
          className="group flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          Начать бесплатно
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 px-8 py-20 max-w-7xl mx-auto">
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-6">
            <Github size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Интеграция с GitHub</h3>
          <p className="text-slate-600">Просто вставь ссылку на репозиторий, остальное сделает скрипт.</p>
        </div>
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-6">
            <FileText size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">ГОСТ Оформление</h3>
          <p className="text-slate-600">Автоматическая генерация титульных листов и правильная структура.</p>
        </div>
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 mb-6">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">ИИ Аналитика</h3>
          <p className="text-slate-600">GPT-4o анализирует твою логику и пишет профессиональные выводы.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;