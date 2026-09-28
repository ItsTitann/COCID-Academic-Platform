import React, { useState } from 'react';
import { 
  FaGlobe, 
  FaWhatsapp, 
  FaFacebook, 
  FaYoutube, 
  FaSpotify 
} from 'react-icons/fa';
import { ShieldCheck, Sparkles, ExternalLink, GraduationCap } from 'lucide-react';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'Sitio Web Institucional',
    url: 'https://cocid.mx/',
    icon: FaGlobe,
    color: '#14B8A6',
  },
  {
    name: 'WhatsApp Atención Directa',
    url: 'https://api.whatsapp.com/send?phone=527353392795',
    icon: FaWhatsapp,
    color: '#25D366',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/Colegio.Cientifico.de.Datos/?ref=bookmarks',
    icon: FaFacebook,
    color: '#1877F2',
  },
  {
    name: 'Canal de YouTube',
    url: 'https://www.youtube.com/channel/UCdjx8KJ00fOIKX2q0EYSr4A',
    icon: FaYoutube,
    color: '#FF0000',
  },
  {
    name: 'Spotify Podcast Institucional',
    url: 'https://open.spotify.com/show/5YprrEYBQlmgVsaVqbnmEY',
    icon: FaSpotify,
    color: '#1DB954',
  },
  {
    name: 'Convenios Institucionales',
    url: 'https://posgrados.cocid.edu.mx/convenios/',
    icon: FaGlobe,
    color: '#D4AF37',
  },
];

export const Footer: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <footer className="w-full bg-[#0B1F3A] text-slate-300 border-t border-[#1F2937] shrink-0 select-none shadow-2xl relative z-10">
      {/* Contenedor Principal */}
      <div className="max-w-7xl mx-auto px-6 py-6 lg:py-7">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          
          {/* =================================================================== */}
          {/* COLUMNA 1: IDENTIDAD INSTITUCIONAL                                  */}
          {/* =================================================================== */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/images/blanco lineal.png"
                alt="Logotipo COCID"
                className="h-9 w-auto object-contain drop-shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Centro de Inteligencia Académica COCID
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Plataforma institucional basada en inteligencia artificial para apoyo académico, investigación e inclusión educativa.
              </p>
            </div>

            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 text-blue-300 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Innovación Educativa & Inclusión</span>
            </div>
          </div>

          {/* =================================================================== */}
          {/* COLUMNA 2: CANALES OFICIALES (Lista Dinámica con Hover Oficial)     */}
          {/* =================================================================== */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-3.5 rounded-full bg-[#14B8A6]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Canales Oficiales
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {socialLinks.map((item, idx) => {
                const Icon = item.icon;
                const isHovered = hoveredIdx === idx;

                return (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="group flex items-center justify-between p-2 rounded-xl bg-[#08172C] border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:bg-[#0E2548]"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg bg-[#0B1F3A] border border-slate-700/60 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 shadow-sm"
                        style={{
                          borderColor: isHovered ? item.color : undefined,
                          boxShadow: isHovered ? `0 0 10px ${item.color}40` : undefined,
                        }}
                      >
                        <Icon
                          className="w-3.5 h-3.5 transition-colors duration-300"
                          style={{
                            color: isHovered ? item.color : '#94A3B8',
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-300 group-hover:text-white truncate font-medium">
                        {item.name}
                      </span>
                    </div>

                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300 shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* =================================================================== */}
          {/* COLUMNA 3: INFORMACIÓN INSTITUCIONAL                                */}
          {/* =================================================================== */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-3.5 rounded-full bg-[#D4AF37]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Información Institucional
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-[#08172C] border border-slate-800/80 space-y-2.5">
              <div className="flex items-start space-x-2.5">
                <div className="p-1.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] shrink-0 mt-0.5">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight">
                    Colegio Universitario Científico de Datos
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Plataforma Inteligente COCID
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center space-x-2 text-[11px] text-[#14B8A6] font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#14B8A6]" />
                <span>Infraestructura Segura de Inteligencia Artificial</span>
              </div>
            </div>
          </div>

        </div>

        {/* =================================================================== */}
        {/* PARTE INFERIOR: SEPARADOR Y DERECHOS                                */}
        {/* =================================================================== */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center space-x-1.5 text-center sm:text-left">
            <span>© {new Date().getFullYear()}</span>
            <span className="font-semibold text-slate-300">Colegio Universitario Científico de Datos</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Plataforma Inteligente COCID</span>
          </div>

          <div className="flex items-center space-x-2 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
            <span className="font-medium text-slate-300">
              Infraestructura Segura de Inteligencia Artificial
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
