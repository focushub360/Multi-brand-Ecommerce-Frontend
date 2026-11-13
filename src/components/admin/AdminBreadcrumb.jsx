import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function AdminBreadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-[#717973]">
      <Link 
        to="/admin/dashboard" 
        className="flex items-center gap-1 text-[#717973] hover:text-[#012D1D] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Admin</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-[#C1C8C2] shrink-0" />
            {isLast || !item.path ? (
              <span className="font-bold text-[#151D18] truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.path} 
                className="hover:text-[#012D1D] transition-colors truncate max-w-[150px] sm:max-w-none"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

