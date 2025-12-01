'use client';

import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { Revenue } from '@/app/lib/definitions';
import { useState, useEffect } from 'react';

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default function RevenueChart({
  revenue,
}: {
  revenue: Revenue[];
}) {
  const chartHeight = 350;
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Important (FR):
  // - Ce composant affiche un graphique en barres avec animations avancées au survol.
  // - Lors du survol, la barre monte avec un effet d'élévation et un gradient de couleur dynamique.
  // - Un tooltip affiche le montant de revenu avec animation fade-in et une flèche pointeur.
  // - Animations au chargement : barres qui montent progressivement avec un délai échelonné.
  // - Les labels des mois deviennent interactifs et changent de couleur au survol.

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {revenue.map((month, index) => {
            const isHovered = hoveredMonth === month.month;
            const barHeight = (chartHeight / topLabel) * month.revenue;
            const revenuePercentage = (month.revenue / topLabel) * 100;

            return (
              <div
                key={month.month}
                className="group relative flex flex-col items-center gap-2"
                onMouseEnter={() => setHoveredMonth(month.month)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {/* Tooltip avec animation avancée */}
                {isHovered && (
                  <div className="absolute bottom-full mb-3 transform -translate-x-1/2 left-1/2 z-20">
                    {/* Tooltip principal */}
                    <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-3 rounded-lg text-sm font-bold whitespace-nowrap shadow-2xl animate-fadeInScale border border-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💰</span>
                        <span>${(month.revenue / 100).toLocaleString('en-US')}</span>
                      </div>
                      {/* Flèche pointeur */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                    {/* Ligne de guidage */}
                    <div className="absolute bottom-full h-2 w-0.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-blue-400 to-transparent mb-1"></div>
                  </div>
                )}

                {/* Barre avec gradient et animation */}
                <div className="relative w-full flex flex-col items-center">
                  {/* Barre arrière-plan (glow effect) */}
                  {isHovered && (
                    <div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-md opacity-40 blur-xl transition-all duration-300"
                      style={{
                        width: '100%',
                        height: `${barHeight}px`,
                        background: `linear-gradient(180deg, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.2) 100%)`,
                      }}
                    ></div>
                  )}

                  {/* Barre principale avec gradient */}
                  <div
                    className={`relative w-full rounded-t-md transition-all duration-300 ease-out cursor-pointer overflow-hidden group`}
                    style={{
                      height: `${isLoaded ? barHeight : 0}px`,
                      background: isHovered
                        ? `linear-gradient(180deg, #3b82f6 0%, #1e40af 100%)`
                        : `linear-gradient(180deg, #93c5fd 0%, #3b82f6 100%)`,
                      transform: isHovered ? 'scaleY(1.08) translateY(-6px)' : 'scaleY(1) translateY(0)',
                      boxShadow: isHovered
                        ? '0 20px 40px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                        : '0 4px 12px rgba(59, 130, 246, 0.15)',
                      transitionDelay: isLoaded && !isHovered ? `${index * 100}ms` : '0ms',
                    }}
                  >
                    {/* Effet de brillance */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transition-all duration-500 ${
                        isHovered ? 'opacity-20 translate-x-full' : 'opacity-0'
                      }`}
                      style={{
                        animation: isHovered ? 'shimmer 2s infinite' : 'none',
                      }}
                    ></div>
                  </div>

                  {/* Indicateur de hauteur en pourcentage */}
                  {isHovered && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 animate-fadeIn">
                      {Math.round(revenuePercentage)}%
                    </div>
                  )}
                </div>

                {/* Label du mois avec animation */}
                <p
                  className={`-rotate-90 text-sm font-medium transition-all duration-200 sm:rotate-0 sm:mt-2 ${
                    isHovered
                      ? 'text-blue-600 font-bold scale-110 drop-shadow-lg'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  style={{
                    transitionDelay: isLoaded && !isHovered ? `${index * 100}ms` : '0ms',
                  }}
                >
                  {month.month}
                </p>

                {/* Point indicateur au-dessus de la barre au survol */}
                {isHovered && (
                  <div
                    className="absolute animate-pulse"
                    style={{
                      bottom: `${barHeight + 8}px`,
                      width: '8px',
                      height: '8px',
                      background: '#3b82f6',
                      borderRadius: '50%',
                      boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)',
                    }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>

      {/* Styles pour les animations avancées */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes slideUp {
          from {
            height: 0;
            opacity: 0;
          }
          to {
            height: 100%;
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
