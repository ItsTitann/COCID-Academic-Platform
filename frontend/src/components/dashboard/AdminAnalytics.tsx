import React from 'react';
import { 
  TrendingUp, 
  Server, 
  FileCheck, 
  Video, 
  Award, 
  Cpu 
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Resumen de Actividad y Rendimiento Académico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfica / Métricas de Actividad Semanal */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-blue-50 text-[#2563EB] rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0B1F3A]">Actividad de Inferencia Institucional</h3>
                  <p className="text-xs text-slate-400">Solicitudes procesadas en los últimos 7 días</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                Esta Semana
              </span>
            </div>

            {/* Barras de actividad académica */}
            <div className="mt-6 grid grid-cols-7 gap-2 items-end h-36 pt-4 px-2">
              {[
                { day: 'Lun', val: '65%', height: 'h-[65%]', count: 142 },
                { day: 'Mar', val: '80%', height: 'h-[80%]', count: 198 },
                { day: 'Mié', val: '95%', height: 'h-[95%]', count: 245 },
                { day: 'Jue', val: '75%', height: 'h-[75%]', count: 180 },
                { day: 'Vie', val: '90%', height: 'h-[90%]', count: 215 },
                { day: 'Sáb', val: '40%', height: 'h-[40%]', count: 85 },
                { day: 'Dom', val: '25%', height: 'h-[25%]', count: 48 },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-end h-full group">
                  <span className="text-[10px] font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {item.count}
                  </span>
                  <div className="w-full max-w-[36px] bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                    <div
                      className={`w-full ${item.height} rounded-t-lg transition-all duration-500 ${
                        idx === 2
                          ? 'bg-[#2563EB]'
                          : idx === 4
                          ? 'bg-[#14B8A6]'
                          : 'bg-slate-300 group-hover:bg-[#2563EB]/70'
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 mt-2">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="flex items-center justify-center space-x-2">
              <FileCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="text-slate-600 font-medium">Textos: <strong>512</strong></span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Video className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span className="text-slate-600 font-medium">Señas: <strong>328</strong></span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-slate-600 font-medium">Matches: <strong>184</strong></span>
            </div>
          </div>
        </div>

        {/* Estado y Métricas de Modelos */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
              <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0B1F3A]">Métricas de Modelos</h3>
                <p className="text-xs text-slate-400">Rendimiento en tiempo real</p>
              </div>
            </div>

            <div className="mt-4 space-y-3.5">
              {/* Modelo 1 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Similitud NLP</span>
                  <span className="font-bold text-[#2563EB]">98.4% Precisión</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-[#2563EB] h-1.5 rounded-full w-[98%]" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Latencia media: 120ms</span>
              </div>

              {/* Modelo 2 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Visión Artificial (LSM)</span>
                  <span className="font-bold text-[#14B8A6]">60 FPS</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-[#14B8A6] h-1.5 rounded-full w-[92%]" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">MediaPipe Hand Landmarks</span>
              </div>

              {/* Modelo 3 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Recomendador de Becas</span>
                  <span className="font-bold text-[#D4AF37]">Activo</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-[#D4AF37] h-1.5 rounded-full w-[100%]" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Filtrado Colaborativo & TF-IDF</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner de Arquitectura Institucional */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex items-start space-x-4 border-l-4 border-l-[#2563EB]">
        <div className="p-2.5 bg-blue-50 text-[#2563EB] rounded-xl shrink-0 mt-0.5">
          <Cpu className="w-5 h-5" />
        </div>
        <div className="text-sm">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-bold text-[#0B1F3A] text-sm">Arquitectura Modular Institucional Activa</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Operativo
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Los microservicios de procesamiento en Python (FastAPI) y la capa de gestión en Node.js (Express + Prisma) operan de manera sincronizada para el análisis de lenguaje natural, visión por computadora y algoritmos de coincidencia académica.
          </p>
        </div>
      </div>
    </div>
  );
};
