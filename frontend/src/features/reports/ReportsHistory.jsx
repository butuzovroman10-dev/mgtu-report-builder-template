import React, { useEffect, useState } from 'react';
import { supabase } from '../../api/supabase';
import { FileText, Download, ExternalLink, Clock } from 'lucide-react';

const ReportsHistory = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setReports(data);
    setLoading(false);
  };

  if (loading) return <div className="text-center py-10">Загрузка истории...</div>;

  return (
    <div className="grid gap-4">
      {reports.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
          <p className="text-slate-500">У вас пока нет созданных отчетов.</p>
        </div>
      ) : (
        reports.map((report) => (
          <div key={report.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{report.topic || 'Без темы'}</h3>
                <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> 
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>{report.work_type} №{report.work_number}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <a 
                href={report.github_url} 
                target="_blank" 
                className="p-2 text-slate-400 hover:text-slate-600"
                title="Открыть GitHub"
              >
                <ExternalLink size={20} />
              </a>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all text-sm font-medium">
                <Download size={16} />
                DOCX
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReportsHistory;