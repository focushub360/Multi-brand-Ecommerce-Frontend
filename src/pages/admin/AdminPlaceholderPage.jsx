import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import {
  Store,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  MapPin,
  Layers,
  BarChart3,
  CreditCard,
  Headphones,
  FileText,
  Settings,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

const MODULE_META = {
  '/admin/dealers': {
    title: 'Dealer Management',
    subtitle: 'Verify, onboard, monitor, and regulate verified agricultural equipment and fertilizer dealers.',
    badge: 'Phase 2 Module',
    icon: Store,
    breadcrumbs: [{ label: 'Dealers' }],
    plannedFeatures: [
      'Dealer KYC & GSTIN verification approval queue',
      'Commission rates and tier configuration (Gold, Platinum, Verified)',
      'Warehouse allocation & regional assignment',
      'Dealer payout settlement status & hold toggles'
    ]
  },
  '/admin/products': {
    title: 'Product Management',
    subtitle: 'Audit, approve, catalogue, and moderate all equipment, seed, and chemical listings across dealers.',
    badge: 'Phase 2 Module',
    icon: Package,
    breadcrumbs: [{ label: 'Products' }],
    plannedFeatures: [
      'Global catalog review and publication approvals',
      'Price gouging detection & MSRP compliance monitoring',
      'Batch category & specification re-assignment',
      'Featured homepage product curation'
    ]
  },
  '/admin/inventory': {
    title: 'Inventory Management',
    subtitle: 'Cross-dealer stock monitoring, warehouse capacity tracking, and low-inventory platform warnings.',
    badge: 'Phase 2 Module',
    icon: Boxes,
    breadcrumbs: [{ label: 'Inventory' }],
    plannedFeatures: [
      'Unified warehouse stock surveillance',
      'Dealer reorder threshold alerts & restock logs',
      'Serial number and lot tracking for heavy machinery',
      'Transit stock reconciliation'
    ]
  },
  '/admin/orders': {
    title: 'Order Management',
    subtitle: 'Track platform-wide retail, bulk B2B, and escrow orders across all participating dealers.',
    badge: 'Phase 2 Module',
    icon: ShoppingCart,
    breadcrumbs: [{ label: 'Orders' }],
    plannedFeatures: [
      'Central order lifecycle pipeline (Placed → Shipped → Delivered)',
      'Escrow fund release & milestone approvals',
      'Split shipment coordination between multi-dealer checkouts',
      'Order dispute intervention and cancellation overrides'
    ]
  },
  '/admin/users': {
    title: 'User Management',
    subtitle: 'Customer accounts, verified farm buyers, enterprise institutional clients, and role assignments.',
    badge: 'Phase 2 Module',
    icon: Users,
    breadcrumbs: [{ label: 'Users' }],
    plannedFeatures: [
      'Customer profile lookup and verification history',
      'Institutional buyer credit lines & tax exemptions',
      'Account suspension and access permission control',
      'Customer lifetime value (LTV) and engagement metrics'
    ]
  },
  '/admin/locations': {
    title: 'Dealer Locations',
    subtitle: 'Geographical coverage, regional delivery clusters, hub radius, and service jurisdiction management.',
    badge: 'Phase 2 Module',
    icon: MapPin,
    breadcrumbs: [{ label: 'Locations' }],
    plannedFeatures: [
      'Interactive regional coverage map (Maharashtra, Punjab, MP, etc.)',
      'Hub assignment and pin code serviceability rules',
      'Freight corridor distance calculator',
      'Depot capacity and delivery partner routing'
    ]
  },
  '/admin/categories': {
    title: 'Category Management',
    subtitle: 'Agricultural classification, taxonomy hierarchy, attributes schema, and commission rates.',
    badge: 'Phase 2 Module',
    icon: Layers,
    breadcrumbs: [{ label: 'Categories' }],
    plannedFeatures: [
      'Nested taxonomy tree (Tractors, Implements, Irrigation, Seeds)',
      'Mandatory technical specification template builder',
      'Category-level platform commission overrides',
      'SEO metadata and slug configuration'
    ]
  },
  '/admin/analytics': {
    title: 'Sales & Analytics',
    subtitle: 'Deep business intelligence, GMV trends, cohort analysis, conversion funnels, and dealer comparisons.',
    badge: 'Phase 2 Module',
    icon: BarChart3,
    breadcrumbs: [{ label: 'Analytics' }],
    plannedFeatures: [
      'Cross-quarter GMV and Net Revenue decomposition',
      'Dealer cohort retention and order frequency graphs',
      'Seasonal demand heatmaps for agricultural implements',
      'CSV / PDF executive summary export engine'
    ]
  },
  '/admin/payments': {
    title: 'Payments & Settlements',
    subtitle: 'Payment gateway reconciliation, escrow ledger, dealer payouts, and commission accounting.',
    badge: 'Phase 2 Module',
    icon: CreditCard,
    breadcrumbs: [{ label: 'Payments' }],
    plannedFeatures: [
      'Automated Razorpay / NEFT / RTGS payout batch generation',
      'Escrow clearance ledger for high-value machinery',
      'TDS & GST tax invoice reconciliation',
      'Refund and chargeback dispute resolution log'
    ]
  },
  '/admin/support': {
    title: 'Support & Complaints',
    subtitle: 'Escalated tickets, warranty claims, dealer disputes, and buyer customer satisfaction tracking.',
    badge: 'Phase 2 Module',
    icon: Headphones,
    breadcrumbs: [{ label: 'Support' }],
    plannedFeatures: [
      'Priority ticket dispatch with SLA countdown timers',
      'Three-way dispute resolution (Buyer - Dealer - Platform Admin)',
      'Damage in transit insurance claim processing',
      'Support agent performance and response time metrics'
    ]
  },
  '/admin/reports': {
    title: 'Reports & Audit Logs',
    subtitle: 'System activity logs, regulatory compliance reports, inventory audits, and export archives.',
    badge: 'Phase 2 Module',
    icon: FileText,
    breadcrumbs: [{ label: 'Reports' }],
    plannedFeatures: [
      'Cryptographic platform audit trail (who changed what, and when)',
      'Monthly state-wise GST output reports',
      'Dealer performance compliance scorecards',
      'Scheduled automated email digests to management'
    ]
  },
  '/admin/settings': {
    title: 'Platform Settings',
    subtitle: 'Global parameters, fee structures, notifications, API keys, and maintenance controls.',
    badge: 'Phase 2 Module',
    icon: Settings,
    breadcrumbs: [{ label: 'Settings' }],
    plannedFeatures: [
      'Default platform commission fee percentage',
      'Payment gateway credentials and webhook endpoints',
      'SMS / Email notification trigger rules',
      'Maintenance mode toggle with scheduled downtime alerts'
    ]
  }
};

export default function AdminPlaceholderPage(props) {
  const location = useLocation();
  const currentPath = location.pathname;

  const meta = props.title 
    ? props 
    : MODULE_META[currentPath] || {
        title: 'Admin Module',
        subtitle: 'Enterprise administration module.',
        badge: 'Phase 2 Module',
        icon: Sparkles,
        breadcrumbs: [{ label: 'Module' }],
        plannedFeatures: ['Enterprise CRUD workflows', 'Real-time telemetry and auditing', 'Role-based access permissions']
      };

  const Icon = meta.icon || Sparkles;

  useEffect(() => {
    document.title = `${meta.title} | GROVE Admin`;
    window.scrollTo(0, 0);
  }, [meta.title]);

  return (
    <AdminLayout>
      <AdminPageHeader
        title={meta.title}
        subtitle={meta.subtitle}
        badge={meta.badge || 'Phase 2 Scope'}
        breadcrumbs={meta.breadcrumbs}
        actions={
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#C1C8C2]/70 text-xs font-bold text-[#012D1D] hover:bg-[#F3FCF3] transition-colors shadow-2xs"
          >
            <span>Back to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      />

      {/* Main Placeholder Container */}
      <div className="bg-white rounded-3xl border border-[#C1C8C2]/60 shadow-xs p-6 sm:p-10 space-y-8">
        {/* Banner with icon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-[#F3FCF3] border border-[#AEEECB]/60">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#012D1D] text-[#AEEECB] flex items-center justify-center shrink-0 shadow-md">
              <Icon className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold text-[#012D1D] font-heading">
                  {meta.title} Console
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0E5138] text-[10px] font-mono font-bold">
                  <Clock className="w-3 h-3" />
                  Scheduled for Phase 2
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#717973] font-medium max-w-xl">
                The architecture, route guarding, navigation registry, and data schemas for this module are configured in the Phase 1 Foundation. Full CRUD operations will be integrated in Phase 2.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 rounded-xl bg-[#012D1D] hover:bg-[#1B4332] text-white text-xs font-bold transition-all shadow-xs"
            >
              Explore Overview KPIs
            </Link>
          </div>
        </div>

        {/* Planned Architecture / Features Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#717973] font-mono">
              Planned Capabilities in Phase 2
            </h2>
            <span className="text-[11px] font-mono text-[#0E5138] bg-[#F3FCF3] px-2 py-0.5 rounded border border-[#C1C8C2]/40">
              4 Capabilities Target
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meta.plannedFeatures && meta.plannedFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-2xl bg-[#F8FAF8] border border-[#C1C8C2]/40 hover:border-[#2C694E]/40 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-[#AEEECB] text-[#0E5138] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-semibold text-[#151D18]">
                    {feat}
                  </p>
                  <p className="text-[11px] text-[#717973] font-mono">
                    Schema verified • Linked to Admin Service Layer
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Isolation Callout */}
        <div className="p-4 rounded-2xl bg-white border border-[#C1C8C2]/50 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-[#3F4943]">
            <ShieldCheck className="w-4 h-4 text-[#2C694E]" />
            <span className="font-medium">
              Access Restricted: This view is secured by <code className="font-mono text-[11px] bg-[#F3FCF3] px-1.5 py-0.5 rounded text-[#012D1D]">AdminProtectedRoute</code>.
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#717973] hidden sm:inline-block">
            Route: {currentPath}
          </span>
        </div>
      </div>
    </AdminLayout>
  );
}

