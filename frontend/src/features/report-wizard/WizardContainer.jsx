import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Убедись, что путь верный

const WizardContainer = () => {
    const [loading, setLoading] = useState(false);
    const [userPlan, setUserPlan] = useState('free');
    const [reportCount, setReportCount] = useState(0);
    
    const [formData, setFormData] = useState({
        fullName: '',
        group: '',
        workType: 'Домашнее задание',
        workNumber: '1',
        variant: '',
        repoUrl: '',
        instruction: ''
    });

    // Загрузка сохраненных данных при старте
    useEffect(() => {
        const saved = localStorage.getItem('mgtu_user_data');
        if (saved) {
            const parsed = JSON.parse(saved);
            setFormData(prev => ({ ...prev, ...parsed }));
        }
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
            if (data) {
                setUserPlan(data.plan);
                setReportCount(data.reports_generated);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            // Сохраняем ФИО и Группу локально
            if (['fullName', 'group'].includes(name)) {
                localStorage.setItem('mgtu_user_data', JSON.stringify({
                    fullName: updated.fullName,
                    group: updated.group
                }));
            }
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Логика лимитов (не фейковая)
        if (userPlan === 'free' && reportCount >= 3) {
            alert('Лимит бесплатных отчетов (3) исчерпан. Перейдите на PRO!');
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const response = await fetch('http://localhost:8000/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, userId: user.id }),
            });

            const result = await response.json();
            if (result.status === 'success') {
                window.location.href = result.downloadUrl;
                fetchUserProfile(); // Обновляем счетчик
            } else {
                throw new Error(result.detail);
            }
        } catch (error) {
            alert("Ошибка: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
            <div className="mb-6 p-4 bg-blue-50 rounded-lg flex justify-between items-center">
                <span>Тариф: <b>{userPlan.toUpperCase()}</b></span>
                <span>Отчетов создано: <b>{reportCount}</b></span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="ФИО студента" className="border p-2 rounded" required />
                    <input name="group" value={formData.group} onChange={handleInputChange} placeholder="Группа (напр. ИУ5-14Б)" className="border p-2 rounded" required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <select name="workType" value={formData.workType} onChange={handleInputChange} className="border p-2 rounded">
                        <option>Домашнее задание</option>
                        <option>Лабораторная работа</option>
                        <option>Курсовая работа</option>
                    </select>
                    <input name="workNumber" value={formData.workNumber} onChange={handleInputChange} placeholder="№ работы" className="border p-2 rounded" />
                    <input name="variant" value={formData.variant} onChange={handleInputChange} placeholder="Вариант" className="border p-2 rounded" />
                </div>
                <input name="repoUrl" value={formData.repoUrl} onChange={handleInputChange} placeholder="Ссылка на GitHub репозиторий" className="border p-2 rounded w-full" required />
                <textarea 
                    name="instruction" 
                    value={formData.instruction} 
                    onChange={handleInputChange} 
                    placeholder="Вставьте задание целиком (Цель, Задачи, Тема...)" 
                    className="border p-2 rounded w-full h-40" 
                    required 
                />
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
                    {loading ? "Генерация и анализ репозитория..." : "СГЕНЕРИРОВАТЬ ОТЧЕТ"}
                </button>
            </form>
        </div>
    );
};

export default WizardContainer;