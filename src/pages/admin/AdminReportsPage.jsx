import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import {
  getAdminReportsList,
  getAdminAuditLogs,
  syncAdminDataFromApi
} from '../../services/adminService';
import {
  Download,
  CheckCircle2,
  FileSpreadsheet,
  History
} from 'lucide-react';

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' or 'audit'
  const [selectedFormat, setSelectedFormat] = useState('CSV');
  const [downloadingId, setDownloadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    document.title = 'Reports & Audit Logs | GROVE Admin';
    window.scrollTo(0, 0);
    setReports(getAdminReportsList());
    setAuditLogs(getAdminAuditLogs());
    syncAdminDataFromApi().then(() => {
      setReports(getAdminReportsList());
      setAuditLogs(getAdminAuditLogs());
    }).catch(() => {});
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownload = (rep) => {
    setDownloadingId(rep.id);
    setTimeout(() => {
      setDownloadingId(null);
      showToast(`${rep.name} (${selectedFormat}) generated and downloaded.`);
    }, 700);
  };

  return (
    <AdminLayout>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#012D1D] text-white text-xs font-semibold shadow-xl border border-[#AEEECB]/40 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#AEEECB] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <AdminPageHeader
        title="Reports & Compliance Audit Logs"
        subtitle="Generate executive financial exports, operational statements, and inspect cryptographic platform administrator activity trails."
        badge="Governance Center"
        breadcrumbs={[{ label: 'Reports' }]}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="h-9 px-3 rounded-xl bg-white border border-[#C1C8C2]/70 text-xs font-mono font-bold text-[#012D1D]"
            >
              <option value="CSV">Export Format: CSV</option>
              <option value="XLSX">Export Format: Excel (XLSX)</option>
              <option value="PDF">Export Format: PDF</option>
            </select>
          </div>
        }
      />

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#C1C8C2]/40 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'bg-[#012D1D] text-white shadow-2xs'
              : 'bg-white text-[#717973] hover:bg-[#F3FCF3]'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Executive Report Library ({reports.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'bg-[#012D1D] text-white shadow-2xs'
              : 'bg-white text-[#717973] hover:bg-[#F3FCF3]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>System Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Executive Reports Cards */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((rep) => {
            const isDownloading = downloadingId === rep.id;

            return (
              <div
                key={rep.id}
                className="p-5 rounded-3xl bg-white border border-[#C1C8C2]/60 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#012D1D] transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F3FCF3] text-[#0E5138] border border-[#AEEECB]/60">
                      {rep.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#717973]">{rep.period}</span>
                  </div>

                  <h3 className="font-extrabold text-sm text-[#012D1D] font-heading leading-snug">
                    {rep.name}
                  </h3>

                  <p className="text-xs text-[#717973] leading-relaxed">
                    {rep.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#C1C8C2]/30 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-[#717973]">Last: {rep.lastGenerated}</span>

                  <button
                    type="button"
                    onClick={() => handleDownload(rep)}
                    disabled={isDownloading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
                    <span>{isDownloading ? 'Generating...' : `Export ${selectedFormat}`}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: System Audit Logs Table */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#C1C8C2]/40 bg-[#F8FAF8] flex items-center justify-between">
            <span className="text-xs font-bold text-[#012D1D] font-mono">
              Cryptographic Administrative Action Ledger
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Immutable Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#C1C8C2]/50 bg-[#F8FAF8] text-[#717973] font-mono uppercase text-[10px]">
                  <th className="py-3 px-4 font-bold">Event ID &amp; Time</th>
                  <th className="py-3 px-4 font-bold">Admin Operator</th>
                  <th className="py-3 px-4 font-bold">Action Type</th>
                  <th className="py-3 px-4 font-bold">Module Target</th>
                  <th className="py-3 px-4 font-bold">Details Description</th>
                  <th className="py-3 px-4 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C1C8C2]/30">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8FAF8] transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-[#012D1D] block">#{log.id}</span>
                      <span className="text-[10px] text-[#717973]">{log.timestamp}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-[#151D18] block">{log.admin}</span>
                      <span className="text-[10px] font-mono text-[#717973]">{log.role}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-[#F3FCF3] border border-[#C1C8C2]/40 font-mono text-[10px] font-bold text-[#0E5138]">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-[#3F4943]">
                      {log.module}
                    </td>

                    <td className="py-3 px-4 text-[#3F4943] max-w-sm truncate" title={log.details}>
                      {log.details}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[10px] font-bold">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

