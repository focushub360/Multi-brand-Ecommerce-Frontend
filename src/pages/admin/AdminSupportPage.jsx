import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import {
  getAdminSupportTickets,
  updateTicketStatus,
  addAdminReplyToTicket,
  syncAdminDataFromApi
} from '../../services/adminService';
import {
  Search,
  Eye,
  CheckCircle2,
  Send,
  Lock,
  X
} from 'lucide-react';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Customer Complaints', 'Dealer Tickets', 'Escalated', 'Resolved'
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Selected Ticket Drawer
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Reply state
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = () => {
    setTickets(getAdminSupportTickets());
  };

  useEffect(() => {
    document.title = 'Support & Complaints | GROVE Admin';
    window.scrollTo(0, 0);
    loadData();
    syncAdminDataFromApi().then(() => {
      loadData();
    }).catch(() => {});
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.requesterName.toLowerCase().includes(q) ||
        t.concernedDealer.toLowerCase().includes(q);

      let matchTab = true;
      if (activeTab === 'Customer Complaints') matchTab = t.ticketType === 'customer';
      else if (activeTab === 'Dealer Tickets') matchTab = t.ticketType === 'dealer';
      else if (activeTab === 'Escalated') matchTab = t.status === 'Escalated';
      else if (activeTab === 'Resolved') matchTab = t.status === 'Resolved';

      const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;

      return matchSearch && matchTab && matchPriority;
    });
  }, [tickets, searchQuery, activeTab, priorityFilter]);

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setReplyText('');
    setIsInternalNote(false);
    setIsDetailOpen(true);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const updated = addAdminReplyToTicket(selectedTicket.id, replyText.trim(), isInternalNote);
    loadData();
    setSelectedTicket(updated);
    setReplyText('');
    showToast(isInternalNote ? 'Internal private note saved.' : 'Admin response transmitted to ticket thread.');
  };

  const handleStatusChange = (status) => {
    if (!selectedTicket) return;
    const updated = updateTicketStatus(selectedTicket.id, status);
    loadData();
    setSelectedTicket(updated);
    showToast(`Ticket #${selectedTicket.id} status changed to ${status}.`);
  };

  const handlePriorityChange = (priority) => {
    if (!selectedTicket) return;
    const updated = updateTicketStatus(selectedTicket.id, selectedTicket.status, priority);
    loadData();
    setSelectedTicket(updated);
    showToast(`Ticket priority changed to ${priority}.`);
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'Urgent':
        return 'bg-rose-100 text-rose-900 border-rose-300 font-black';
      case 'High':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'Normal':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Escalated':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'In Progress':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Open':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
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
        title="Support & Customer Complaints"
        subtitle="3-way dispute governance intervening between farm buyers, authorized dealers, and platform operations."
        badge={`${tickets.length} Active Tickets`}
        breadcrumbs={[{ label: 'Support' }]}
      />

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[#C1C8C2]/40">
        {['All', 'Customer Complaints', 'Dealer Tickets', 'Escalated', 'Resolved'].map((tab) => {
          const count = tab === 'All'
            ? tickets.length
            : tab === 'Customer Complaints'
            ? tickets.filter((t) => t.ticketType === 'customer').length
            : tab === 'Dealer Tickets'
            ? tickets.filter((t) => t.ticketType === 'dealer').length
            : tab === 'Escalated'
            ? tickets.filter((t) => t.status === 'Escalated').length
            : tickets.filter((t) => t.status === 'Resolved').length;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#012D1D] text-white shadow-2xs'
                  : 'bg-white text-[#3F4943] hover:bg-[#F3FCF3]'
              }`}
            >
              <span>{tab}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeTab === tab ? 'bg-[#AEEECB] text-[#012D1D]' : 'bg-[#E3EBE4] text-[#717973]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#717973] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ticket #, subject, buyer, or dealer..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-medium text-[#151D18] focus:outline-none focus:border-[#012D1D]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-[#F8FAF8] border border-[#C1C8C2]/60 text-xs font-semibold text-[#151D18]"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#C1C8C2]/50 bg-[#F8FAF8] text-[#717973] font-mono uppercase text-[10px]">
                <th className="py-3 px-4 font-bold">Ticket ID &amp; Source</th>
                <th className="py-3 px-4 font-bold">Subject</th>
                <th className="py-3 px-4 font-bold">Requester</th>
                <th className="py-3 px-4 font-bold">Concerned Dealer</th>
                <th className="py-3 px-3 font-bold text-center">Priority</th>
                <th className="py-3 px-3 font-bold text-center">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C1C8C2]/30">
              {filteredTickets.map((tck) => (
                <tr
                  key={tck.id}
                  onClick={() => handleOpenTicket(tck)}
                  className="hover:bg-[#F8FAF8] transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-[#012D1D] block">#{tck.id}</span>
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                      tck.ticketType === 'customer' ? 'bg-purple-100 text-purple-900' : 'bg-blue-100 text-blue-900'
                    }`}>
                      {tck.source}
                    </span>
                  </td>

                  <td className="py-3 px-4 max-w-sm">
                    <span className="font-bold text-[#151D18] block truncate">{tck.subject}</span>
                    <span className="text-[10px] font-mono text-[#717973]">{tck.category} • {tck.createdAt}</span>
                  </td>

                  <td className="py-3 px-4 text-[#3F4943]">
                    <span className="font-semibold block">{tck.requesterName}</span>
                    <span className="text-[10px] font-mono text-[#717973]">{tck.requesterRole}</span>
                  </td>

                  <td className="py-3 px-4 text-[#3F4943] font-medium">
                    {tck.concernedDealer}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getPriorityBadge(tck.priority)}`}>
                      {tck.priority}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getStatusBadge(tck.status)}`}>
                      {tck.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenTicket(tck)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#C1C8C2]/60 text-xs font-bold text-[#012D1D] hover:bg-[#F3FCF3]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Respond</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details & Resolution Drawer */}
      {isDetailOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="fixed inset-0 bg-[#012D1D]/50 backdrop-blur-xs" onClick={() => setIsDetailOpen(false)} />
          <div className="relative w-full max-w-xl h-full bg-white shadow-2xl p-6 z-10 flex flex-col space-y-4 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#C1C8C2]/40 shrink-0">
              <div>
                <span className="text-[10px] font-mono text-[#717973] uppercase font-bold">Dispute File #{selectedTicket.id}</span>
                <h3 className="font-extrabold text-base text-[#012D1D] leading-tight">{selectedTicket.subject}</h3>
              </div>
              <button type="button" onClick={() => setIsDetailOpen(false)} className="p-1 rounded-xl text-[#717973]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Requester & Dealer Context */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAF8] border border-[#C1C8C2]/40 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#717973] block">Raised By</span>
                  <span className="font-bold text-[#151D18]">{selectedTicket.requesterName}</span>
                  <span className="text-[10px] text-[#717973] block">{selectedTicket.requesterRole} ({selectedTicket.requesterEmail})</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#717973] block">Concerned Dealer</span>
                  <span className="font-bold text-[#151D18]">{selectedTicket.concernedDealer}</span>
                  <span className="text-[10px] text-[#717973] block">Category: {selectedTicket.category}</span>
                </div>
              </div>

              {/* Status & Priority Controls */}
              <div className="pt-2 border-t border-[#C1C8C2]/30 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#717973]">Status:</span>
                  {['Open', 'In Progress', 'Escalated', 'Resolved'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                        selectedTicket.status === st
                          ? 'bg-[#012D1D] text-white shadow-2xs'
                          : 'bg-white text-[#3F4943] border border-[#C1C8C2]/50 hover:bg-[#F3FCF3]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#717973]">Priority:</span>
                  {['Urgent', 'High', 'Normal'].map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => handlePriorityChange(pr)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        selectedTicket.priority === pr
                          ? 'bg-amber-600 text-white'
                          : 'bg-white text-[#717973] border border-[#C1C8C2]/50'
                      }`}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversation Messages Thread */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              <span className="text-[10px] font-mono uppercase font-bold text-[#717973] block">
                Dispute Communications Audit Thread
              </span>

              {selectedTicket.messages?.map((msg) => {
                const isAdmin = msg.senderRole === 'admin';
                return (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-2xl text-xs space-y-1 ${
                      isAdmin
                        ? 'bg-[#F3FCF3] border border-[#AEEECB]/70 ml-4'
                        : 'bg-white border border-[#C1C8C2]/50 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="font-bold text-[#012D1D]">{msg.sender}</span>
                      <span className="text-[#717973]">{msg.timestamp}</span>
                    </div>
                    <p className="text-[#151D18] leading-relaxed">{msg.text}</p>
                  </div>
                );
              })}

              {/* Internal Notes Strip */}
              {selectedTicket.internalNotes && selectedTicket.internalNotes.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-900 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-700" />
                    <span>Confidential Admin Internal Notes (Not Visible to Dealer/Buyer)</span>
                  </span>
                  {selectedTicket.internalNotes.map((note, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs">
                      {note}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reply & Internal Note Form */}
            <form onSubmit={handleSendReply} className="pt-3 border-t border-[#C1C8C2]/40 space-y-2.5 text-xs shrink-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#151D18]">Transmit Administrative Message</span>
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-amber-900 text-[11px]">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-0"
                  />
                  <span>Save as Private Internal Note</span>
                </label>
              </div>

              <textarea
                rows="3"
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={
                  isInternalNote
                    ? 'Enter internal audit note (e.g. Carrier contacted, surveyor appointed)...'
                    : 'Compose official response to buyer and dealer...'
                }
                className={`w-full p-3 rounded-2xl border text-xs focus:outline-none ${
                  isInternalNote ? 'bg-amber-50/50 border-amber-300' : 'bg-[#F8FAF8] border-[#C1C8C2]/60 focus:border-[#012D1D]'
                }`}
              />

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isInternalNote ? 'Log Private Note' : 'Send Admin Reply'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

