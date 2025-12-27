import React, { useState } from 'react';
import { supabase } from '../../api/supabase';
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
    instruction: '' 
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
        setStep(2); // Показываем экран успеха
        
        // АВТОМАТИЧЕСКОЕ СКАЧИВАНИЕ
        if (result.downloadUrl) {
          const link = document.createElement('a');
          link.href = result.downloadUrl;
          link.setAttribute('download', ''); 
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        alert("Ошибка сервера: " + result.detail);
      }
    } catch (e) {
      alert("Не удалось связаться с бэкендом. Проверь, запущен ли Python сервер.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
      <Stepper currentStep={step} />
      
      <div className="p-12">
        {step === 0 && <RepoStep value={formData.repoUrl} onChange={(v) => setFormData({...formData, repoUrl: v})} />}
        {step === 1 && <TitleStep data={formData} onChange={(d) => setFormData({...formData, ...d})} />}
        {step === 2 && <SuccessStep />}

        <div className="mt-12 flex justify-between pt-8 border-t border-slate-50">
          {step < 2 && (
            <>
              <button onClick={() => setStep(step - 1)} disabled={step === 0} className="text-slate-400 font-bold px-4 disabled:opacity-0">Назад</button>
              <button 
                onClick={step === 1 ? handleFinish : () => setStep(step + 1)}
                disabled={loading}
                className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:scale-105 transition-all"
              >
                {loading ? 'СОЗДАЕМ...' : (step === 1 ? 'ГЕНЕРИРОВАТЬ' : 'ДАЛЕЕ')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WizardContainer;