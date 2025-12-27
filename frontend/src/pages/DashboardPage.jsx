import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import WizardContainer from '../features/report-wizard/WizardContainer';
import ReportsList from '../features/reports-history/ReportsList'; // Создадим ниже
import { LogOut, Layout, FileText, Settings, User } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('wizard'); // 'wizard', 'reports', 'settings'

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
        <div className="p-6">
          <div className="flex items-center gap-3 text-blue-600 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
            <span className="font-bold text-xl tracking-tight text-slate-900">ReportGen</span>
          </div>
          
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('wizard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'wizard' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Layout size={20} /> Конструктор
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'reports' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <FileText size={20} /> Мои отчеты
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Settings size={20} /> Настройки
            </button>
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut size={20} /> Выйти
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {activeTab === 'wizard' && "Создание отчета"}
              {activeTab === 'reports' && "История отчетов"}
              {activeTab === 'settings' && "Настройки профиля"}
            </h1>
            <p className="text-slate-500 mt-1">
              {activeTab === 'wizard' && "Заполните данные для генерации документа по ГОСТ"}
              {activeTab === 'reports' && "Список всех ваших сгенерированных документов"}
              {activeTab === 'settings' && "Управление вашим аккаунтом"}
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-full shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User size={20} />
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">Бутузов Р.А.</p>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Pro Plan</p>
            </div>
          </div>
        </header>

        {/* Контент меняется в зависимости от активной вкладки */}
        <div className="animate-in fade-in duration-500">
          {activeTab === 'wizard' && <WizardContainer />}
          {activeTab === 'reports' && <ReportsList />}
          {activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center text-slate-400">
              Настройки временно находятся в разработке
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;