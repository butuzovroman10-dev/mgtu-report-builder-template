import React, { useState } from 'react';
import { Check, Ticket, Loader2 } from 'lucide-react';

const PricingModal = ({ onClose }) => {
  const [promo, setPromo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    if (!promo) return;
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/activate-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promo })
      });

      if (response.ok) {
        alert("Поздравляем! Вам открыт Pro доступ.");
        window.location.reload(); // Обновляем страницу, чтобы применились права
      } else {
        alert("Неверный код");
      }
    } catch (e) {
      alert("Ошибка связи с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative border border-slate-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl">✕</button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Ticket size={32} />
          </div>
          <h2 className="text-2xl font-bold">Активация доступа</h2>
          <p className="text-slate-500 mt-2">Введите промокод для разблокировки всех функций</p>
        </div>

        <div className="space-y-4">
          <input 
            type="text"
            placeholder="Введите ваш код..."
            className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all text-center font-mono text-lg"
            value={promo}
            onChange={(e) => setPromo(e.target.value.toUpperCase())}
          />
          
          <button 
            onClick={handleActivate}
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Активировать Pro'}
          </button>
        </div>

        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-700">
          <strong>Как получить код?</strong> Оплатите подписку переводом по СБП на номер +7(xxx)xxx-xx-xx и отправьте скриншот в Telegram администратору.
        </div>
      </div>
    </div>
  );
};

export default PricingModal;