import React, { useState } from 'react';
import { supabase } from '../../api/supabase';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-2xl rounded-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Вход в систему</h2>
        <div className="space-y-4">
          <input 
            type="email" placeholder="Email" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Пароль" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;