import React, { useEffect, useState } from 'react';
import { supabase } from '../../api/supabase';
import { FileDown, ExternalLink, Calendar, FileText } from 'lucide-react';

const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Ошибка при загрузке отчетов:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-500 font-medium">Загружаем вашу историю...</span>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {reports.length === 0 ? (
        <div className="bg-white p-16 rounded-[2rem] border-2 border-dashed border-slate-100 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Отчетов пока нет</h3>
          <p className="text-slate-400 mt-1">Сгенерируйте свой первый отчет в конструкторе</p>
        </div>
      ) : (
        reports.map((report) => (
          <div 
            key={report.id} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileDown size={28} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{report.topic}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                    <Calendar size={14}/> 
                    {new Date(report.created_at).toLocaleDateString('ru-RU')}
                  </span>
                  {report.github_url && (
                    <a 
                      href={report.github_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                    >
                      <ExternalLink size={14}/> Исходный код
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <a 
              href={report.file_url} 
              target="_blank" 
              rel="noreferrer"
              className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
            >
              Скачать DOCX
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default ReportsList;