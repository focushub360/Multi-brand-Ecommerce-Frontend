import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Check, 
  Copy, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Home, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  AlertCircle,
  ShieldCheck,
  Building2
} from 'lucide-react';
import DealerLayout from '../../components/dealer/DealerLayout';
import { getDealerOrderById, fetchDealerOrderById, updateDealerOrderStatus } from '../../services/dealerService';
import { getActiveDealerId } from '../../utils/auth';

export default function DealerOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [copiedTxn, setCopiedTxn] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    const activeId = getActiveDealerId();
    const found = getDealerOrderById(activeId, id);
    if (found) {
      setOrder(found);
      setNotFound(false);
    }

    fetchDealerOrderById(id, activeId).then((live) => {
      if (!isMounted) return;
      if (live) {
        setOrder(live);
        setNotFound(false);
      } else if (!found) {
        setNotFound(true);
      }
    }).catch(() => {
      if (!isMounted) return;
      if (!found) setNotFound(true);
    });

    return () => { isMounted = false; };
  }, [id]);

  if (notFound) {
    return (
      <DealerLayout>
        <div className="max-w-xl mx-auto py-16 text-center">
          <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#151D18]">Order Not Found</h2>
          <p className="text-xs text-[#717973] mt-1 mb-6">
            The requested order ({id}) could not be located in your dealer account.
          </p>
          <Link
            to="/dealer/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#012D1D] text-white text-xs font-bold rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Orders</span>
          </Link>
        </div>
      </DealerLayout>
    );
  }

  if (!order) {
    return (
      <DealerLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <Clock className="w-8 h-8 text-[#717973] animate-spin" />
          <p className="text-sm font-semibold text-[#717973]">Loading order information...</p>
        </div>
      </DealerLayout>
    );
  }

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val || 0);
  };

  const handleCopyTxn = () => {
    if (order.transactionId) {
      navigator.clipboard?.writeText(order.transactionId);
      setCopiedTxn(true);
      setTimeout(() => setCopiedTxn(false), 2000);
    }
  };

  const handleStatusChange = (newStatus) => {
    const activeId = getActiveDealerId();
    const updated = updateDealerOrderStatus(order.id, newStatus, activeId);
    if (updated) {
      setOrder({ ...updated });
      showToast(`Order status updated to ${newStatus}`);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDownloadInvoice = () => {
    showToast('Invoice generated. Preparing print/PDF format...');
    window.print();
  };

  // Determine delivery step states
  const isCancelled = order.orderStatus === 'Cancelled';
  const getStepState = (stepName) => {
    const status = order.orderStatus;
    if (isCancelled) return 'cancelled';

    if (stepName === 'Ordered') {
      return 'completed';
    }
    if (stepName === 'Shipped') {
      if (['Shipped', 'Delivered'].includes(status)) return 'completed';
      if (['Processing', 'Packed', 'Placed'].includes(status)) return 'current';
      return 'upcoming';
    }
    if (stepName === 'Out for Delivery') {
      if (status === 'Delivered') return 'completed';
      if (status === 'Shipped') return 'current';
      return 'upcoming';
    }
    if (stepName === 'Delivered') {
      if (status === 'Delivered') return 'completed';
      return 'upcoming';
    }
    return 'upcoming';
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

        {/* Page Header with Back Action */}
        <div className="flex flex-col gap-2">
          <Link
            to="/dealer/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#717973] hover:text-[#012D1D] group transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Orders</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#151D18] tracking-tight">
                Order Details
              </h1>
              <span className="font-mono text-base sm:text-lg font-bold text-[#2C694E]">
                #{order.id}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                order.orderStatus === 'Delivered'
                  ? 'bg-[#AEEECB] text-[#0E5138]'
                  : order.orderStatus === 'Cancelled'
                  ? 'bg-[#FFDAD6] text-[#93000A]'
                  : 'bg-[#AEEECB]/60 text-[#0E5138]'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  order.orderStatus === 'Cancelled' ? 'bg-[#BA1A1A]' : 'bg-[#2C694E]'
                }`} />
                <span>{order.orderStatus} {order.orderStatus === 'Placed' && '(Confirmed)'}</span>
              </span>
              <span className="text-xs text-[#717973] sm:border-l sm:border-[#C1C8C2]/60 sm:pl-3">
                Placed on {order.placedAt || 'Recently'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              {/* Quick Status Updater */}
              <select
                value={order.orderStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="h-10 px-3 rounded-xl border border-[#C1C8C2]/60 bg-white text-[#151D18] text-xs font-semibold focus:outline-none focus:border-[#2C694E] cursor-pointer shadow-2xs"
                title="Update Order Status"
              >
                <option value="Placed">Status: Placed</option>
                <option value="Processing">Status: Processing</option>
                <option value="Packed">Status: Packed</option>
                <option value="Shipped">Status: Shipped</option>
                <option value="Delivered">Status: Delivered</option>
                <option value="Cancelled">Status: Cancelled</option>
              </select>

              <button
                type="button"
                onClick={handleDownloadInvoice}
                className="h-10 inline-flex items-center gap-2 px-4 rounded-xl bg-white border border-[#C1C8C2]/60 text-[#012D1D] text-xs sm:text-sm font-semibold hover:bg-[#EDF6ED] transition-colors shadow-2xs cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4 text-[#717973]" />
                <span className="hidden sm:inline">Download Invoice</span>
                <span className="sm:hidden">Invoice</span>
              </button>
            </div>
          </div>
        </div>

        {/* Delivery Status Card with Progress Tracker */}
        <div className="bg-white rounded-2xl border border-[#C1C8C2]/40 p-5 sm:p-6 shadow-2xs flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#C1C8C2]/30">
            <span className="text-base font-bold text-[#151D18]">Delivery Status</span>
            <span className="text-xs font-semibold text-[#2C694E] bg-[#EDF6ED] px-3 py-1 rounded-full w-fit">
              Estimated Delivery: {order.estimatedDelivery || order.estDeliveryDateFormatted || '3 - 5 Business Days'}
            </span>
          </div>

          {!isCancelled ? (
            <div className="py-2 px-2 sm:px-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 relative">
                {/* Horizontal Progress connecting bar (hidden on small screens) */}
                <div className="hidden sm:block absolute left-8 right-8 top-5 h-1 bg-[#E7F0E8] -z-0">
                  <div 
                    className="h-full bg-[#2C694E] transition-all duration-500"
                    style={{
                      width: 
                        order.orderStatus === 'Delivered' ? '100%' :
                        order.orderStatus === 'Shipped' ? '66%' :
                        order.orderStatus === 'Packed' || order.orderStatus === 'Processing' ? '33%' : '15%'
                    }}
                  />
                </div>

                {/* Step 1: Ordered */}
                <div className="flex flex-col items-center text-center gap-2 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-[#2C694E] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#151D18] block">Ordered</span>
                    <span className="text-[11px] font-mono text-[#717973]">
                      {order.orderedDateFormatted || (order.placedAt ? order.placedAt.split(',')[0] : 'Confirmed')}
                    </span>
                  </div>
                </div>

                {/* Step 2: Shipped */}
                <div className="flex flex-col items-center text-center gap-2 relative z-10">
                  {getStepState('Shipped') === 'completed' ? (
                    <div className="w-10 h-10 rounded-full bg-[#2C694E] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  ) : getStepState('Shipped') === 'current' ? (
                    <div className="w-10 h-10 rounded-full bg-[#012D1D] ring-4 ring-[#AEEECB] text-white flex items-center justify-center shadow-xs">
                      <Package className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#F3FCF3] border-2 border-[#C1C8C2] text-[#717973] flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <span className={`text-xs sm:text-sm font-bold block ${
                      getStepState('Shipped') === 'completed' || getStepState('Shipped') === 'current'
                        ? 'text-[#151D18]'
                        : 'text-[#717973]'
                    }`}>
                      Shipped
                    </span>
                    <span className="text-[11px] font-mono text-[#2C694E] font-medium">
                      {order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered'
                        ? (order.shippedDateFormatted ? `Shipped ${order.shippedDateFormatted}` : 'Dispatched')
                        : (order.shippedDateFormatted ? `Est. ${order.shippedDateFormatted}` : 'In Prep')}
                    </span>
                  </div>
                </div>

                {/* Step 3: Out for Delivery */}
                <div className="flex flex-col items-center text-center gap-2 relative z-10">
                  {getStepState('Out for Delivery') === 'completed' ? (
                    <div className="w-10 h-10 rounded-full bg-[#2C694E] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  ) : getStepState('Out for Delivery') === 'current' ? (
                    <div className="w-10 h-10 rounded-full bg-[#012D1D] ring-4 ring-[#AEEECB] text-white flex items-center justify-center shadow-xs">
                      <Truck className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#F3FCF3] border-2 border-[#C1C8C2] text-[#717973] flex items-center justify-center">
                      <Truck className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <span className={`text-xs sm:text-sm font-bold block ${
                      getStepState('Out for Delivery') === 'completed' || getStepState('Out for Delivery') === 'current'
                        ? 'text-[#151D18]'
                        : 'text-[#717973]'
                    }`}>
                      Out for Delivery
                    </span>
                    <span className="text-[11px] font-mono text-[#717973]">
                      {order.orderStatus === 'Delivered' ? 'Completed' : order.orderStatus === 'Shipped' ? 'In Transit' : 'Upcoming'}
                    </span>
                  </div>
                </div>

                {/* Step 4: Delivered */}
                <div className="flex flex-col items-center text-center gap-2 relative z-10">
                  {getStepState('Delivered') === 'completed' ? (
                    <div className="w-10 h-10 rounded-full bg-[#2C694E] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#F3FCF3] border-2 border-[#C1C8C2] text-[#717973] flex items-center justify-center">
                      <Home className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <span className={`text-xs sm:text-sm font-bold block ${
                      getStepState('Delivered') === 'completed' ? 'text-[#0E5138]' : 'text-[#717973]'
                    }`}>
                      Delivered
                    </span>
                    <span className="text-[11px] font-mono text-[#717973]">
                      {order.orderStatus === 'Delivered'
                        ? 'Delivered'
                        : (order.estDeliveryDateFormatted ? `Expected ${order.estDeliveryDateFormatted}` : '3 - 5 Days')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-red-50 text-red-800 border border-red-200 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">Order Cancelled</p>
                <p className="text-xs text-red-700 mt-0.5">This B2B order was cancelled and payment reversed via auto-refund.</p>
              </div>
            </div>
          )}
        </div>

        {/* 2-Column Split: Left (Items + Address, 8 cols) | Right (Summary + Payment, 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Items in this Order Card */}
            <div className="bg-white rounded-2xl border border-[#C1C8C2]/40 shadow-2xs overflow-hidden flex flex-col">
              <div className="p-4 border-b border-[#C1C8C2]/40 flex items-center justify-between bg-[#EDF6ED]/40">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#151D18]">Items in this Order</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E7F0E8] text-[#151D18] font-mono text-xs font-semibold">
                    {order.items?.length || 1} {order.items?.length === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#2C694E]">
                  Fulfillment: {order.fulfillmentPartner || 'Delhivery Cargo Express'}
                </span>
              </div>

              <div className="divide-y divide-[#C1C8C2]/30">
                {(order.items && order.items.length > 0 ? order.items : [order.product]).map((item, idx) => (
                  <div key={item.sku || idx} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <img
                        src={item.image || '/images/prod-drip.png'}
                        alt={item.name || 'Product'}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 bg-neutral-100 border border-[#C1C8C2]/40"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-base sm:text-lg font-bold text-[#151D18] leading-tight">
                          {item.name}
                        </span>
                        <span className="text-xs text-[#717973] mt-1 font-mono">
                          {item.sku ? `SKU: ${item.sku}` : ''}{item.category ? ` • ${item.category}` : ''}
                        </span>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xs font-medium text-[#151D18] bg-[#EDF6ED] px-2.5 py-1 rounded-lg">
                            Qty: {item.quantity || 1}
                          </span>
                          <span className="text-xs font-semibold text-[#0E5138] bg-[#AEEECB]/40 px-2.5 py-1 rounded-lg">
                            {item.grade || 'Commercial Grade'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#C1C8C2]/30">
                      <span className="text-xl sm:text-2xl font-bold text-[#151D18] font-mono">
                        {formatPrice(item.subtotal || item.price * (item.quantity || 1))}
                      </span>
                      <span className="text-[11px] text-[#717973]">
                        Inclusive of all taxes
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="bg-white rounded-2xl border border-[#C1C8C2]/40 p-5 sm:p-6 shadow-2xs flex flex-col gap-3">
              <div className="flex items-center gap-2 pb-3 border-b border-[#C1C8C2]/30">
                <MapPin className="w-5 h-5 text-[#2C694E]" />
                <span className="font-bold text-sm sm:text-base text-[#151D18]">Delivery Address</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-sm sm:text-base text-[#151D18]">
                  {order.customer?.name || 'Valued Customer'}
                </span>
                <p className="text-xs sm:text-sm text-[#414844] leading-relaxed mt-0.5">
                  {order.customer?.address || 'Direct Dispatch Address'}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-[#C1C8C2]/30 text-xs sm:text-sm text-[#414844]">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#717973]" />
                    <span className="font-medium text-[#151D18]">Phone: {order.customer?.phone || '—'}</span>
                  </div>
                  {order.customer?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#717973]" />
                      <span className="font-medium text-[#151D18]">Email: {order.customer.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl border border-[#C1C8C2]/40 p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
              <span className="font-bold text-base text-[#151D18] pb-3 border-b border-[#C1C8C2]/30">
                Order Summary
              </span>
              <div className="flex flex-col gap-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-[#414844]">
                  <span>Items Subtotal</span>
                  <span className="font-mono font-semibold text-[#151D18]">
                    {formatPrice(order.subtotal || order.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#414844]">
                  <span>Delivery Charges</span>
                  <span className="font-mono font-bold text-[#0E5138]">FREE</span>
                </div>
                <div className="border-t border-[#C1C8C2]/40 my-1"></div>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-sm sm:text-base text-[#151D18]">Total Amount</span>
                  <span className="text-2xl font-extrabold text-[#012D1D] font-mono">
                    {formatPrice(order.amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information Card */}
            <div className="bg-white rounded-2xl border border-[#C1C8C2]/40 p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#C1C8C2]/30">
                <span className="font-bold text-base text-[#151D18]">Payment Information</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#AEEECB] text-[#0E5138] font-bold text-xs font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{order.paymentStatus || 'Paid'}</span>
                </span>
              </div>

              <div className="flex flex-col gap-3 text-xs sm:text-sm">
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider">
                    Payment Method
                  </span>
                  <span className="text-sm font-semibold text-[#151D18] mt-1">
                    {order.paymentMethod || 'Razorpay UPI / Net Banking'}
                  </span>
                </div>

                <div className="flex flex-col pt-2 border-t border-[#C1C8C2]/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#717973] uppercase tracking-wider">
                      Transaction ID
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyTxn}
                      className="text-xs font-bold text-[#2C694E] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {copiedTxn ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#2C694E]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <span className="font-mono text-xs text-[#151D18] font-semibold mt-1 bg-[#F3FCF3] border border-[#C1C8C2]/40 px-2.5 py-1.5 rounded-lg select-all">
                    {order.transactionId || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DealerLayout>
  );
}
