import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; 

const WizardContainer = () => {
  const [loading, setLoading] = useState(false);
  const [userPlan, setUserPlan] = useState("free");
  const [reportCount, setReportCount] = useState(0);
  
  const [formData, setFormData] = useState({
    fullName: "",
    group: "",
    workType: "Домашнее задание",
    workNumber: "1",
    variant: "",
    repoUrl: "",
    instruction: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Используем .maybeSingle(), чтобы не было ошибки, если профиля еще нет
      const { data, error } = await supabase
        .from("user_profiles")
        .select("plan, reports_generated")
        .eq("id", user.id)
        .maybeSingle();
      
      if (data) {
        setUserPlan(data.plan);
        setReportCount(data.reports_generated);
      } else if (error) {
        console.error("Ошибка Supabase:", error.message);
      }
    }
  } catch (err) {
    console.error("Ошибка загрузки профиля:", err);
  }
};

    const saved = localStorage.getItem("user_profile");
    if (saved) {
      try {
        const { fullName, group } = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, fullName, group }));
      } catch (e) {
        console.error("Ошибка парсинга localStorage", e);
      }
    }
    
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "fullName" || name === "group") {
        localStorage.setItem("user_profile", JSON.stringify({
          fullName: updated.fullName,
          group: updated.group,
        }));
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert("Пожалуйста, войдите в систему");

      const response = await fetch("http://localhost:8000/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId: user.id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Ошибка генерации");
      }

      const result = await response.json();
      if (result.downloadUrl) window.location.href = result.downloadUrl;
    } catch (err) {
      alert(err.message);
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
          <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="ФИО студента" className="border p-2 rounded w-full" required />
          <input name="group" value={formData.group} onChange={handleInputChange} placeholder="Группа (напр. ИУ5-14Б)" className="border p-2 rounded w-full" required />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <select name="workType" value={formData.workType} onChange={handleInputChange} className="border p-2 rounded w-full">
            <option>Домашнее задание</option>
            <option>Лабораторная работа</option>
            <option>Курсовая работа</option>
          </select>
          <input name="workNumber" value={formData.workNumber} onChange={handleInputChange} placeholder="№" className="border p-2 rounded w-full" />
          <input name="variant" value={formData.variant} onChange={handleInputChange} placeholder="Вариант" className="border p-2 rounded w-full" />
        </div>
        <input name="repoUrl" value={formData.repoUrl} onChange={handleInputChange} placeholder="GitHub URL" className="border p-2 rounded w-full" required />
        <textarea 
          name="instruction" 
          value={formData.instruction} 
          onChange={handleInputChange} 
          placeholder="Вставьте задание..." 
          className="border p-2 rounded w-full h-40" 
          required 
        />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
          {loading ? "Генерация..." : "СГЕНЕРИРОВАТЬ ОТЧЕТ"}
        </button>
      </form>
    </div>
  );
};

export default WizardContainer;