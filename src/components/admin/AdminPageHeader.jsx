import React from 'react';
import AdminBreadcrumb from './AdminBreadcrumb';

export default function AdminPageHeader({
  title,
  subtitle,
  badge,
  actions,
  breadcrumbs = []
}) {
  return (
    <div className="flex flex-col gap-2 pb-2">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <AdminBreadcrumb items={breadcrumbs} />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#012D1D] tracking-tight font-heading">
              {title}
            </h1>
            {badge && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#AEEECB] text-[#0E5138] text-[11px] font-mono font-bold tracking-wide">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#717973] font-medium leading-relaxed max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

