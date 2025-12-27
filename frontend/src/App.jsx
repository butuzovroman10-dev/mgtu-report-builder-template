import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthProvider';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// Защищенный роут: если юзера нет, кидает на логин
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500">
      Загрузка сессии...
    </div>
  );
  
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Главная страница перенаправляет на логин */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Страница авторизации */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Личный кабинет (только для вошедших) */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
          
          {/* Редирект для несуществующих страниц */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;