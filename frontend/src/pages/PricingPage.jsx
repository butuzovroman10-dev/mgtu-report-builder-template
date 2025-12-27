import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const PricingPage = () => {
    const [showQR, setShowQR] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSBPClick = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        // Создаем заявку на бэкенде
        await fetch('http://localhost:8000/create-sbp-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, amount: 299 }),
        });

        setShowQR(true);
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-10 text-center">
            <h1 className="text-3xl font-black mb-6">Активация PRO через СБП</h1>
            
            {!showQR ? (
                <div className="border-4 border-blue-600 p-8 rounded-3xl shadow-xl">
                    <h2 className="text-2xl font-bold mb-4">Тариф PRO — 299₽</h2>
                    <ul className="text-left mb-8 space-y-2">
                        <li>✅ Безлимитные отчеты</li>
                        <li>✅ Парсинг графиков из GitHub</li>
                        <li>✅ ГОСТ-оформление Бауманки</li>
                    </ul>
                    <button 
                        onClick={handleSBPClick}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition"
                    >
                        {loading ? "Загрузка..." : "Оплатить через СБП"}
                    </button>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-3xl border shadow-2xl animate-fade-in">
                    <h2 className="text-xl font-bold mb-4">Сканируйте для оплаты</h2>
                    
                    {/* ТУТ ТВОЙ QR-КОД (можно сгенерировать в приложении банка) */}
                    <div className="bg-gray-100 w-64 h-64 mx-auto mb-6 flex items-center justify-center border-2 border-dashed">
                        <img src="/my-sbp-qr.png" alt="QR СБП" className="w-full h-full" />
                    </div>

                    <div className="text-left bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-sm">
                        <p className="font-bold text-yellow-800">Важно:</p>
                        <p>1. Переведите 299₽ через СБП.</p>
                        <p>2. В комментарии к платежу укажите вашу почту.</p>
                        <p>3. PRO активируется в течение 15 минут после проверки.</p>
                    </div>

                    <button 
                        onClick={() => window.location.href = '/'}
                        className="mt-6 text-blue-600 font-bold"
                    >
                        Я оплатил, вернуться на главную
                    </button>
                </div>
            )}
        </div>
    );
};

export default PricingPage;