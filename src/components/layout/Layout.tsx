import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calculator, FileText, ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              {!isHome && (
                <ArrowLeft className="w-5 h-5 text-slate-500" />
              )}
              <Home className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-lg text-slate-900">
                내집마련 계산기
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                to="/"
                className={`text-sm font-medium ${
                  isHome ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                홈
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-slate-500">
            <p>
              본 계산기는 참고용이며, 실제 세금 및 대출 조건은 다를 수 있습니다.
            </p>
            <p className="mt-1">
              정확한 정보는 세무사, 금융기관에 문의하세요.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
