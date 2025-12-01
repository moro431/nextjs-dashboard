'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { LatestInvoice } from '@/app/lib/definitions';
import { useState } from 'react';

// Important (FR):
// - Ce composant affiche la liste des dernières factures avec animations interactives.
// - Au survol, la ligne se suréélève avec une ombre et les éléments changent de couleur.
// - L'avatar s'agrandit légèrement et un badge de montant apparaît avec animation.
// - Les animations incluent des transitions fluides et des effets de profondeur.

export default function LatestInvoices({
  latestInvoices,
}: {
  latestInvoices: LatestInvoice[];
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Invoices
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6 rounded-lg overflow-hidden">
          {latestInvoices.map((invoice, i) => {
            const isHovered = hoveredId === invoice.id;

            return (
              <div
                key={invoice.id}
                className={clsx(
                  'relative flex flex-row items-center justify-between py-4 transition-all duration-300 ease-out cursor-pointer group',
                  {
                    'border-t': i !== 0,
                  }
                )}
                onMouseEnter={() => setHoveredId(invoice.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  backgroundColor: isHovered ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                  transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
                  borderLeft: isHovered ? '4px solid #3b82f6' : '4px solid transparent',
                  paddingLeft: isHovered ? '16px' : '20px',
                }}
              >
                {/* Effet arrière-plan au survol */}
                {isHovered && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-50 rounded-r-lg"></div>
                )}

                <div className="flex items-center gap-3 relative z-10 flex-1">
                  {/* Avatar avec animation */}
                  <div
                    className={`relative transition-all duration-300 ${
                      isHovered ? 'scale-110' : 'scale-100'
                    }`}
                    style={{
                      filter: isHovered ? 'drop-shadow(0 8px 16px rgba(59, 130, 246, 0.4))' : 'drop-shadow(none)',
                    }}
                  >
                    <Image
                      src={invoice.image_url}
                      alt={`${invoice.name}'s profile picture`}
                      className={`rounded-full transition-all duration-300 ${
                        isHovered ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                      }`}
                      width={32}
                      height={32}
                    />
                    {/* Badge indicateur */}
                    {isHovered && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border border-white"></div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Nom avec animation */}
                    <p
                      className={`truncate font-semibold transition-all duration-300 ${
                        isHovered
                          ? 'text-blue-600 text-base md:text-lg'
                          : 'text-sm md:text-base text-gray-900'
                      }`}
                    >
                      {invoice.name}
                    </p>
                    {/* Email avec animation */}
                    <p
                      className={`hidden text-sm transition-all duration-300 sm:block ${
                        isHovered ? 'text-blue-500 font-medium' : 'text-gray-500'
                      }`}
                    >
                      {invoice.email}
                    </p>
                  </div>
                </div>

                {/* Montant avec badge au survol */}
                <div className="relative z-10 flex items-center gap-2">
                  {/* Montant animé */}
                  <p
                    className={`${lusitana.className} truncate font-medium transition-all duration-300 ${
                      isHovered
                        ? 'text-green-600 text-base md:text-lg font-bold'
                        : 'text-sm md:text-base text-gray-900'
                    }`}
                  >
                    {invoice.amount}
                  </p>

                  {/* Badge avec icône au survol */}
                  {isHovered && (
                    <div className="ml-2 px-3 py-1 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs font-bold rounded-full animate-slideIn shadow-lg">
                      Paid
                    </div>
                  )}
                </div>

                {/* Ligne de séparation animée */}
                {i !== latestInvoices.length - 1 && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent transition-all duration-300"
                    style={{
                      opacity: isHovered ? 0.5 : 0.2,
                    }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer avec animation */}
        <div
          className="flex items-center pb-2 pt-6 transition-all duration-300 hover:text-gray-700"
          style={{
            color: hoveredId ? '#3b82f6' : '#9ca3af',
          }}
        >
          <ArrowPathIcon
            className={`h-5 w-5 transition-all duration-500 ${
              hoveredId ? 'rotate-180' : ''
            }`}
            style={{
              animation: hoveredId ? 'spin 1s linear infinite' : 'none',
            }}
          />
          <h3 className="ml-2 text-sm font-medium">Updated just now</h3>
        </div>
      </div>

      {/* Styles pour animations avancées */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-8px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
