import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Headset, 
  MessageSquare, 
  PhoneCall, 
  Mail, 
  Send, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import DealerLayout from '../../components/dealer/DealerLayout';
import { getDealerSupportData } from '../../services/dealerService';
import { getActiveDealerId } from '../../utils/auth';

export default function DealerHelpSupport() {
  const [openFaq, setOpenFaq] = useState(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Logistics & Courier Dispatch');
  const [ticketOrderId, setTicketOrderId] = useState('');
  const [ticketPriority, setTicketPriority] = useState('Normal');
  const [ticketMessage, setTicketMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [supportData, setSupportData] = useState(() => getDealerSupportData(getActiveDealerId()));

  useEffect(() => {
    document.title = 'Dealer Help & Support | GROVE B2B Portal';
    window.scrollTo(0, 0);
    setSupportData(getDealerSupportData(getActiveDealerId()));
  }, []);

  const contactChannels = [
    {
      title: 'Dedicated Account Manager',
      subtitle: `${supportData?.accountManager?.name || 'Nikhil Varma'} • ${supportData?.accountManager?.role || 'Senior B2B Success'}`,
      info: supportData?.accountManager?.phone || '+91 91234 56780',
      action: 'Call Direct',
      icon: Headset,
      highlight: true
    },
    {
      title: 'WhatsApp Dispatch Desk',
      subtitle: 'Instant logistics & manifest queries',
      info: supportData?.whatsappDesk || '+91 98201 00921',
      action: 'Chat on WhatsApp',
      icon: MessageSquare,
      highlight: false
    },
    {
      title: 'Toll-Free Dealer Helpline',
      subtitle: 'Mon - Sat (08:00 AM - 08:00 PM)',
      info: supportData?.helpline || '1800-419-GROVE (47683)',
      action: 'Call Helpline',
      icon: PhoneCall,
      highlight: false
    },
    {
      title: 'Escalations & Claims Email',
      subtitle: 'Response SLA under 2 business hours',
      info: supportData?.supportEmail || 'dealersupport@grove.com',
      action: 'Send Email',
      icon: Mail,
      highlight: false
    }
  ];

  const faqs = supportData?.faqs || [];

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage(`Support ticket #${Math.floor(100000 + Math.random() * 900000)} generated. Our team will contact you shortly.`);
      setTicketSubject('');
      setTicketOrderId('');
      setTicketMessage('');
      setTimeout(() => setToastMessage(''), 4000);
    }, 500);
  };

  return (
    <DealerLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#012D1D] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs sm:text-sm font-semibold animate-fade-in border border-[#AEEECB]/30">
            <CheckCircle2 className="w-4 h-4 text-[#AEEECB]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#717973]">
            <Link to="/dealer/dashboard" className="hover:text-[#012D1D] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#151D18] font-bold">Help & Support</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#012D1D] tracking-tight">
              Dealer Help & Support
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#AEEECB] text-[#0E5138] text-xs font-bold">
              24/7 Priority Desk
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#414844]">
            Connect with your dedicated merchant relationship manager, review operating guidelines, or lodge an operational dispute.
          </p>
        </div>

        {/* Priority Contact Channels (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactChannels.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className={`rounded-2xl p-5 sm:p-6 shadow-2xs border flex flex-col justify-between transition-all ${
                  c.highlight
                    ? 'bg-white border-[#012D1D]/30 ring-1 ring-[#012D1D]/20'
                    : 'bg-white border-[#C1C8C2]/40 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#F3FCF3] flex items-center justify-center text-[#012D1D] mb-3">
                    <Icon className="w-5 h-5 text-[#012D1D]" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[#151D18]">{c.title}</h3>
                  <p className="text-xs text-[#717973] mt-1 leading-snug">{c.subtitle}</p>
                  <div className="mt-3 font-mono text-xs sm:text-sm font-bold text-[#012D1D]">{c.info}</div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#C1C8C2]/30">
                  <span className="text-[#2C694E] text-xs font-bold hover:underline inline-flex items-center gap-1 cursor-pointer">
                    <span>{c.action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2-Column Split: Submit Ticket (Left 7 cols) & FAQ Accordion (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Submit Support Ticket (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 shadow-2xs border border-[#C1C8C2]/40 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#C1C8C2]/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2C694E]"></span>
                <h2 className="text-base sm:text-lg font-bold text-[#151D18]">
                  Create Support Ticket
                </h2>
              </div>
              <span className="text-xs font-semibold text-[#717973]">Priority Queue</span>
            </div>

            <form onSubmit={handleSubmitTicket} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                    Issue Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all cursor-pointer"
                  >
                    <option value="Logistics & Courier Dispatch">Logistics & Courier Dispatch</option>
                    <option value="Payout & Bank Settlement">Payout & Bank Settlement</option>
                    <option value="Catalog & Specification Approval">Catalog & Specification Approval</option>
                    <option value="Damage / Transit Cargo Claim">Damage / Transit Cargo Claim</option>
                    <option value="Account & Compliance">Account & Compliance</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                    Order ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={ticketOrderId}
                    onChange={(e) => setTicketOrderId(e.target.value)}
                    placeholder="e.g. GRV-9824"
                    className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                    Ticket Priority
                  </label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all cursor-pointer"
                  >
                    <option value="Normal">Normal (Response within 4 hrs)</option>
                    <option value="High">High (Response within 2 hrs)</option>
                    <option value="Urgent">Urgent (Truck at Bay / Escalated)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                    Brief Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Delay in Delhivery Cargo pickup"
                    className="w-full h-11 px-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#151D18]">
                  Detailed Description & Context
                </label>
                <textarea
                  required
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Provide consignment numbers, driver details, or invoice reference..."
                  className="w-full p-3.5 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-[#2C694E] resize-y transition-colors leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-6 rounded-xl bg-[#1B4332] text-white text-xs sm:text-sm font-bold hover:bg-[#012D1D] active:scale-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Send className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Ticket'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* FAQs Accordion (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 shadow-2xs border border-[#C1C8C2]/40 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#C1C8C2]/30">
              <h2 className="text-base sm:text-lg font-bold text-[#151D18]">
                Dealer FAQs
              </h2>
              <span className="text-xs font-semibold text-[#717973]">Merchant Help</span>
            </div>

            <div className="flex flex-col divide-y divide-[#C1C8C2]/30">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="py-3">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      className="w-full flex items-center justify-between gap-2 text-left text-xs sm:text-sm font-bold text-[#151D18] hover:text-[#012D1D] transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-[#717973] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="pt-2 text-xs sm:text-sm text-[#414844] leading-relaxed animate-fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DealerLayout>
  );
}
