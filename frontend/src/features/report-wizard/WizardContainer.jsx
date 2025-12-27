import React, { useState } from 'react';
import { supabase } from '../../api/supabase';
// Предположим, что эти компоненты лежат в той же папке или в /steps
import { RepoStep } from './steps/RepoStep'; 
import { TitleStep } from './steps/TitleStep';
import { SuccessStep } from './steps/SuccessStep';
import { Stepper } from './Stepper';

const WizardContainer = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    repoUrl: '',
    fullName: '',
    group: '',
    workType: 'Лабораторная работа',
    workNumber: '',
    variant: '',
    instruction: '' // Текст задания из методички
  });

  const handleFinish = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const response = await fetch('http://localhost:8000/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user.id })
      });

      const result = await response.json();

      if (response.ok) {
        setStep(2);
        // Сразу скачиваем файл из Supabase Storage
        if (result.downloadUrl) {
          window.open(result.downloadUrl, '_blank');
        }
      } else {
        alert(result.detail || "Ошибка при генерации");
      }
    } catch (e) {
      console.error(e);
      alert("Ошибка соединения с бэкендом. Проверьте, запущен ли Python сервер.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      <Stepper currentStep={step} />
      
      <div className="p-8 md:p-12">
        {step === 0 && (
          <RepoStep 
            value={formData.repoUrl} 
            onChange={(val) => setFormData({...formData, repoUrl: val})} 
          />
        )}
        
        {step === 1 && (
          <TitleStep 
            data={formData} 
            onChange={(newData) => setFormData({...formData, ...newData})} 
          />
        )}

        {step === 2 && <SuccessStep />}

        <div className="mt-12 flex justify-between items-center border-t border-slate-100 pt-8">
          {step < 2 && (
            <>
              <button 
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 text-slate-400 font-semibold disabled:opacity-0 hover:text-slate-600 transition-colors"
              >
                Назад
              </button>
              
              <button 
                onClick={step === 1 ? handleFinish : () => setStep(step + 1)}
                disabled={loading}
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:bg-slate-300"
              >
                {loading ? 'Создаем документ...' : (step === 1 ? 'Сгенерировать отчет' : 'Далее')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WizardContainer; // Важно: добавляем default export