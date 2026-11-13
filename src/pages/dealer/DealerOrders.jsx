import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  RotateCcw, 
  Search, 
  Eye, 
  ChevronRight, 
  ChevronLeft, 
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  XCircle,
  CornerDownLeft
} from 'lucide-react';
import DealerLayout from '../../components/dealer/DealerLayout';
import { getDealerOrders, syncDealerDataFromApi } from '../../services/dealerService';
import { getActiveDealerId } from '../../utils/auth';

export default function DealerOrders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Orders');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadOrders = () => {
    const activeId = getActiveDealerId();
    setOrders(getDealerOrders(activeId));
  };

  useEffect(() => {
    document.title = 'Order Management | GROVE Dealer Portal';
    window.scrollTo(0, 0);
    loadOrders();
    const activeId = getActiveDealerId();
    syncDealerDataFromApi(activeId).then(() => {
      loadOrders();
    }).catch(() => {});
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    const activeId = getActiveDealerId();
    syncDealerDataFromApi(activeId).finally(() => {
      loadOrders();
      setIsRefreshing(false);
    });
  };

  const tabs = useMemo(() => [
    { name: 'All Orders', count: orders.length },
    { name: 'Placed', count: orders.filter(o => o.orderStatus === 'Placed').length, urgent: true },
    { name: 'Processing', count: orders.filter(o => o.orderStatus === 'Processing').length },
    { name: 'Packed', count: orders.filter(o => o.orderStatus === 'Packed').length },
    { name: 'Shipped', count: orders.filter(o => o.orderStatus === 'Shipped').length },
    { name: 'Delivered', count: orders.filter(o => o.orderStatus === 'Delivered').length },
    { name: 'Cancelled', count: orders.filter(o => o.orderStatus === 'Cancelled').length },
    { name: 'Returns', count: orders.filter(o => o.orderStatus === 'Returns').length },
  ], [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Tab filter
      if (activeTab !== 'All Orders' && order.orderStatus !== activeTab) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = (order.id || '').toLowerCase().includes(query) || (order.orderNumber || '').toLowerCase().includes(query);
        const matchesProduct = (order.product?.name || '').toLowerCase().includes(query) || (order.items || []).some(i => (i.name || '').toLowerCase().includes(query));
        const matchesCustomer = (order.customer?.name || '').toLowerCase().includes(query) || (order.customer?.city || '').toLowerCase().includes(query);
        if (!matchesId && !matchesProduct && !matchesCustomer) {
          return false;
        }
      }
      return true;
    });
  }, [orders, activeTab, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / rowsPerPage));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredOrders.slice(start, start + rowsPerPage);
  }, [filteredOrders, currentPage, rowsPerPage]);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <DealerLayout>
      <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto">
        {/* Page Header & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#717973]">
              <Link to="/dealer/dashboard" className="hover:text-[#012D1D] transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#151D18] font-bold">Orders</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#012D1D] tracking-tight">
                Orders
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#AEEECB] text-[#0E5138] font-mono text-xs font-bold">
                {orders.length} Orders
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#414844]">
              Manage, fulfill, and track high-value B2B orders across agricultural, automotive, and electronics channels.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <button
              onClick={handleRefresh}
              className="h-10 px-4 rounded-xl border border-[#C1C8C2]/60 bg-white hover:bg-[#EDF6ED] text-[#012D1D] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shadow-2xs cursor-pointer active:scale-95"
              type="button"
            >
              <RotateCcw className={`w-4 h-4 text-[#012D1D] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Operational Search Bar */}
        <div className="bg-white p-3 rounded-2xl shadow-2xs border border-[#C1C8C2]/40 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#717973] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Order ID (#GRV-...), product, or customer name..."
              className="w-full h-10 pl-10 pr-12 rounded-xl bg-[#F3FCF3] border border-[#C1C8C2]/40 text-[#151D18] text-xs sm:text-sm placeholder:text-[#717973] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#2C694E] focus:border-[#2C694E] transition-all"
            />
            <span className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#717973] bg-white px-1.5 py-0.5 rounded shadow-2xs border border-[#C1C8C2]/40 pointer-events-none">
              ⌘K
            </span>
          </div>

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-[#717973] hover:text-[#012D1D] px-2 py-1 cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Horizontal Status Tabs Ribbon */}
        <div className="bg-white rounded-2xl shadow-2xs border border-[#C1C8C2]/40 px-4 overflow-x-auto">
          <div className="flex items-center gap-6 min-w-max">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setCurrentPage(1);
                  }}
                  className={`relative py-3.5 text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'font-bold text-[#012D1D] border-b-2 border-[#012D1D]'
                      : 'font-medium text-[#717973] hover:text-[#151D18]'
                  }`}
                  type="button"
                >
                  {tab.urgent && tab.count > 0 && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BA1A1A] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#BA1A1A]"></span>
                    </span>
                  )}
                  <span>{tab.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-mono text-xs ${
                      tab.urgent && tab.count > 0
                        ? 'bg-[#FFDAD6] text-[#93000A] font-bold'
                        : isActive
                        ? 'bg-[#E7F0E8] text-[#151D18] font-semibold'
                        : 'bg-[#F3FCF3] text-[#717973]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Orders Data Table */}
        <div className="w-full flex flex-col bg-white rounded-2xl shadow-2xs overflow-hidden border border-[#C1C8C2]/40">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#EDF6ED]/70 border-b border-[#C1C8C2]/40 text-[#414844] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Order ID</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Product</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Amount</th>
                  <th className="py-3.5 px-4 sm:px-6 whitespace-nowrap">Payment Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C1C8C2]/30 text-xs sm:text-sm">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-[#717973]">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#F3FCF3] flex items-center justify-center text-[#717973]">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[#151D18]">No orders found</p>
                          <p className="text-xs text-[#717973] mt-0.5">No orders match the current filters or search terms.</p>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('All Orders');
                            setSearchQuery('');
                          }}
                          className="mt-1 text-xs font-bold text-[#2C694E] hover:underline cursor-pointer"
                        >
                          Reset all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => {
                    const isPaid = order.paymentStatus === 'Paid';
                    const isPending = order.paymentStatus === 'Pending';
                    const isRefunded = order.paymentStatus === 'Refunded';
                    const isFailed = order.paymentStatus === 'Failed';

                    return (
                      <tr 
                        key={order.id} 
                        className="hover:bg-[#F3FCF3]/80 transition-colors group"
                      >
                        {/* Order ID */}
                        <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                          <Link 
                            to={`/dealer/orders/${order.id}`}
                            className="font-mono text-xs sm:text-sm font-bold text-[#012D1D] hover:underline"
                          >
                            #{order.id}
                          </Link>
                          <span className="block text-[11px] text-[#717973] mt-0.5">
                            {order.placedAt || 'Recently placed'}
                          </span>
                        </td>

                        {/* Product info */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <img
                              className="w-10 h-10 rounded-xl object-cover bg-neutral-100 shrink-0 border border-[#C1C8C2]/40"
                              src={order.product?.image || '/images/prod-drip.png'}
                              alt={order.product?.name || 'Order Item'}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80';
                              }}
                            />
                            <div className="flex flex-col min-w-0 max-w-[280px]">
                              <span className="font-semibold text-xs sm:text-sm text-[#151D18] truncate group-hover:text-[#012D1D]">
                                {order.product?.name || 'Standard Catalog Item'}
                              </span>
                              <span className="text-[11px] text-[#717973] truncate">
                                {order.customer?.name} • {order.customer?.city || 'Direct Hub'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                          <span className="font-mono text-xs sm:text-sm font-bold text-[#151D18]">
                            {formatPrice(order.amount)}
                          </span>
                          <span className="block text-[11px] text-[#717973]">
                            Qty: {order.product?.quantity || 1}
                          </span>
                        </td>

                        {/* Payment Status Badge */}
                        <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[11px] font-bold ${
                              isPaid
                                ? 'bg-[#AEEECB]/50 text-[#0E5138] border border-[#AEEECB]'
                                : isPending
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : isRefunded
                                ? 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                                : isFailed
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : 'bg-[#E7F0E8] text-[#414844]'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isPaid ? 'bg-[#0E5138]' : isPending ? 'bg-amber-600' : 'bg-neutral-500'
                            }`} />
                            <span>{order.paymentStatus || 'Pending'}</span>
                          </span>
                        </td>

                        {/* Action View Details */}
                        <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                          <Link
                            to={`/dealer/orders/${order.id}`}
                            className="h-8 px-3 rounded-lg border border-[#C1C8C2]/60 hover:border-[#012D1D] hover:bg-[#EDF6ED] text-[#012D1D] text-xs font-semibold transition-colors inline-flex items-center gap-1.5 shadow-2xs active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="p-4 bg-[#EDF6ED]/40 border-t border-[#C1C8C2]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs sm:text-sm text-[#717973]">
              <span>
                Showing{' '}
                <strong className="text-[#151D18] font-semibold">
                  {filteredOrders.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, filteredOrders.length)}
                </strong>{' '}
                of <strong className="text-[#151D18] font-semibold">{filteredOrders.length}</strong> orders
              </span>

              <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-[#C1C8C2]/40">
                <span>Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white text-[#151D18] font-mono text-xs px-2.5 py-1 rounded-lg border border-[#C1C8C2]/60 focus:outline-none cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1 font-mono text-xs">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous Page"
                className="w-8 h-8 rounded-lg bg-white border border-[#C1C8C2]/60 text-[#717973] hover:text-[#151D18] disabled:opacity-40 disabled:hover:text-[#717973] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isSelected = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer font-bold ${
                      isSelected
                        ? 'bg-[#012D1D] text-white shadow-2xs'
                        : 'bg-white border border-[#C1C8C2]/60 text-[#151D18] hover:bg-[#EDF6ED]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
                className="w-8 h-8 rounded-lg bg-white border border-[#C1C8C2]/60 text-[#717973] hover:text-[#151D18] disabled:opacity-40 disabled:hover:text-[#717973] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DealerLayout>
  );
}
