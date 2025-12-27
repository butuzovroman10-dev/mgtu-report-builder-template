import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AdminPanel = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const { data } = await supabase.from('payment_requests').select('*').eq('status', 'pending');
        setRequests(data || []);
    };

    const confirmPayment = async (paymentId) => {
        const response = await fetch(`http://localhost:8000/admin/confirm-payment/${paymentId}`, {
            method: 'POST'
        });
        if (response.ok) {
            alert("Пользователь переведен на PRO!");
            fetchRequests();
        }
    };

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-6">Заявки на активацию PRO</h1>
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">User ID</th>
                        <th className="border p-2">Сумма</th>
                        <th className="border p-2">Действие</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id}>
                            <td className="border p-2 text-xs">{req.user_id}</td>
                            <td className="border p-2">{req.amount}₽</td>
                            <td className="border p-2">
                                <button 
                                    onClick={() => confirmPayment(req.id)}
                                    className="bg-green-500 text-white px-4 py-1 rounded"
                                >
                                    Подтвердить оплату
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;