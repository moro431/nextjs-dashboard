'use client';

import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { useState } from 'react';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

const colorMap = {
  collected: {
    bg: 'from-green-50 to-emerald-50',
    icon: 'text-green-600',
    badge: 'bg-green-100 text-green-700',
    accent: 'from-green-400 to-emerald-500',
  },
  pending: {
    bg: 'from-amber-50 to-orange-50',
    icon: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
    accent: 'from-amber-400 to-orange-500',
  },
  invoices: {
    bg: 'from-blue-50 to-cyan-50',
    icon: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
    accent: 'from-blue-400 to-cyan-500',
  },
  customers: {
    bg: 'from-purple-50 to-pink-50',
    icon: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-700',
    accent: 'from-purple-400 to-pink-500',
  },
};

export default function CardWrapper() {
  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      {/* <Card title="Collected" value={totalPaidInvoices} type="collected" />
      <Card title="Pending" value={totalPendingInvoices} type="pending" />
      <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
      <Card
        title="Total Customers"
        value={numberOfCustomers}
        type="customers"
      /> */}
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];
  const colors = colorMap[type];
  const [isHovered, setIsHovered] = useState(false);

  // Important (FR):
  // - Les cartes statistiques affichent les KPIs du tableau de bord.
  // - Au survol, la carte s'élève avec une ombre augmentée et une animation de couleur.
  // - L'icône s'agrandit et tourne légèrement pour un effet dynamique.
  // - Les valeurs sont formatées pour une meilleure lisibilité.

  return (
    <div
      className={`relative group rounded-xl shadow-md transition-all duration-300 ease-out cursor-pointer overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered
          ? `0 20px 40px rgba(0, 0, 0, 0.15), 0 0 60px rgba(0, 0, 0, 0.1)`
          : '0 4px 12px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Gradient de fond animé */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.bg} transition-all duration-300`}
        style={{
          opacity: isHovered ? 1 : 0.8,
        }}
      ></div>

      {/* Effet de brillance au survol */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-shimmerCard"></div>
      )}

      {/* Contenu de la carte */}
      <div className="relative z-10 flex flex-col h-full">
        {/* En-tête avec icône et titre */}
        <div className="flex items-center p-4 pb-0">
          {Icon ? (
            <div
              className={`${colors.icon} transition-all duration-300`}
              style={{
                transform: isHovered ? 'scale(1.2) rotate(10deg)' : 'scale(1) rotate(0deg)',
              }}
            >
              <Icon className="h-6 w-6" strokeWidth={1.5} />
            </div>
          ) : null}
          <h3
            className={`ml-3 text-sm font-semibold transition-all duration-300 ${
              isHovered ? 'text-gray-900' : 'text-gray-700'
            }`}
          >
            {title}
          </h3>
          {/* Badge d'état */}
          {isHovered && (
            <div
              className={`ml-auto px-2.5 py-0.5 rounded-full text-xs font-bold ${colors.badge} animate-fadeIn`}
            >
              Active
            </div>
          )}
        </div>

        {/* Valeur principale */}
        <div className="flex-1 flex items-center justify-center px-4 py-6">
          <p
            className={`${lusitana.className} text-center text-3xl md:text-4xl font-bold transition-all duration-300`}
            style={{
              color: isHovered
                ? colors.accent.split(' ')[1]
                : '#4b5563',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {value}
          </p>
        </div>

        {/* Barre d'accent au bas */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.accent} transition-all duration-300`}
          style={{
            transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
          }}
        ></div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes shimmerCard {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-shimmerCard {
          animation: shimmerCard 2s infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
