import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  Loader2, 
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routes.config';
import { socialLinks } from '../../config/socialLinks';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Field-level errors
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Mini Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const sliderTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'El correo institucional es obligatorio';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Ingrese un formato de correo válido (ej. usuario@institucion.edu)';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await login({ email: email.trim(), password });
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ||
        'Error al iniciar sesión. Verifique sus credenciales institucionales.';
      setServerError(message);
    }
  };

  // Rotación automática del Mini Slider
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % socialLinks.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + socialLinks.length) % socialLinks.length);
  }, []);

  useEffect(() => {
    if (isSliderPaused) return;

    sliderTimerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (sliderTimerRef.current) clearInterval(sliderTimerRef.current);
    };
  }, [isSliderPaused, nextSlide]);

  const activeSlide = socialLinks[currentSlide] || socialLinks[0];
  const ActiveSlideIcon = activeSlide.icon;

  return (
    <div className="min-h-screen lg:min-h-dvh w-full bg-gradient-to-br from-[#07172B] via-[#0B1F3A] to-[#0D2447] text-slate-100 flex flex-col justify-between relative overflow-x-hidden select-none">
      {/* ========================================================================= */}
      {/* ESTILOS DE ANIMACIÓN SCOPED Y REGLAS RESPONSIVE POR ALTURA DE VIEWPORT    */}
      {/* ========================================================================= */}
      <style>{`
        @keyframes aiCoreBreath {
          0%, 100% {
            transform: scale(0.96);
            filter: drop-shadow(0 0 22px rgba(37, 99, 235, 0.45)) drop-shadow(0 0 40px rgba(20, 184, 166, 0.35));
          }
          50% {
            transform: scale(1.04);
            filter: drop-shadow(0 0 38px rgba(37, 99, 235, 0.7)) drop-shadow(0 0 65px rgba(20, 184, 166, 0.55));
          }
        }

        @keyframes orbitRotateCW {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbitRotateCCW {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes floatBadge1 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-6px) translateX(2px);
          }
        }

        @keyframes floatBadge2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(6px) translateX(-3px);
          }
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }

        @keyframes slowDriftA {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-8px) translateX(4px);
          }
        }

        @keyframes slowDriftB {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(7px) translateX(-5px);
          }
        }

        @keyframes logoHaloPulse {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        .animate-core-breath {
          animation: aiCoreBreath 5s ease-in-out infinite;
        }

        .animate-orbit-cw-slow {
          animation: orbitRotateCW 48s linear infinite;
        }

        .animate-orbit-ccw-mid {
          animation: orbitRotateCCW 32s linear infinite;
        }

        .animate-orbit-cw-fast {
          animation: orbitRotateCW 20s linear infinite;
        }

        .animate-float-badge-1 {
          animation: floatBadge1 6s ease-in-out infinite;
        }

        .animate-float-badge-2 {
          animation: floatBadge2 7s ease-in-out 1s infinite;
        }

        .animate-pulse-dot {
          animation: pulseDot 4s ease-in-out infinite;
        }

        .animate-drift-a {
          animation: slowDriftA 18s ease-in-out infinite;
        }

        .animate-drift-b {
          animation: slowDriftB 22s ease-in-out infinite;
        }

        .animate-logo-halo {
          animation: logoHaloPulse 6s ease-in-out infinite;
        }

        /* ========================================================================= */
        /* REGLAS RESPONSIVE POR ALTURA (OPTIMIZACIÓN PARA LAPTOPS 768px, 864px, 900px) */
        /* ========================================================================= */
        @media (max-height: 880px) {
          .login-main-wrapper {
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
          }
          .login-left-stack {
            gap: 0.875rem !important;
          }
          .login-crest-img {
            max-height: 10.5rem !important;
            width: auto !important;
          }
          .login-card-body {
            padding: 1.25rem 1.5rem !important;
            gap: 0.875rem !important;
          }
          .login-ai-stage {
            min-height: 260px !important;
          }
          .login-ring-outer {
            width: 270px !important;
            height: 270px !important;
          }
          .login-ring-mid {
            width: 205px !important;
            height: 205px !important;
          }
          .login-ring-inner {
            width: 140px !important;
            height: 140px !important;
          }
          .login-right-stack {
            gap: 1rem !important;
          }
        }

        @media (max-height: 760px) {
          .login-main-wrapper {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
          .login-left-stack {
            gap: 0.625rem !important;
          }
          .login-crest-img {
            max-height: 8.5rem !important;
            width: auto !important;
          }
          .login-card-body {
            padding: 1rem 1.25rem !important;
            gap: 0.75rem !important;
          }
          .login-ai-stage {
            min-height: 220px !important;
          }
          .login-ring-outer {
            width: 230px !important;
            height: 230px !important;
          }
          .login-ring-mid {
            width: 175px !important;
            height: 175px !important;
          }
          .login-ring-inner {
            width: 120px !important;
            height: 120px !important;
          }
          .login-footer-bar {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-core-breath,
          .animate-orbit-cw-slow,
          .animate-orbit-ccw-mid,
          .animate-orbit-cw-fast,
          .animate-float-badge-1,
          .animate-float-badge-2,
          .animate-pulse-dot,
          .animate-drift-a,
          .animate-drift-b,
          .animate-logo-halo {
            animation: none !important;
          }
        }
      `}</style>

      {/* ========================================================================= */}
      {/* CAPA DE AMBIENTACIÓN VISUAL: RED NEURONAL AMBIENTAL & PARTÍCULAS VIVAS     */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Halos de luz ambiental */}
        <div className="absolute top-8 left-1/4 w-[520px] h-[520px] bg-[#2563EB]/12 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 right-1/4 w-[480px] h-[480px] bg-[#14B8A6]/14 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-12 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-[110px]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-[100px]" />

        {/* RED NEURONAL Y CONSTELACIÓN DE PARTÍCULAS EN SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-45" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="blueCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="cyanGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="blueGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* LÍNEAS DE CONEXIÓN NEURONAL SUTILES */}
          <line x1="6%" y1="14%" x2="15%" y2="24%" stroke="url(#blueCyanGrad)" strokeWidth="0.6" strokeDasharray="3 5" />
          <line x1="15%" y1="24%" x2="24%" y2="16%" stroke="url(#blueCyanGrad)" strokeWidth="0.6" strokeDasharray="2 4" />
          <line x1="24%" y1="16%" x2="33%" y2="26%" stroke="#14B8A6" strokeWidth="0.5" opacity="0.2" />

          <line x1="33%" y1="26%" x2="42%" y2="18%" stroke="url(#blueGoldGrad)" strokeWidth="0.5" strokeDasharray="3 6" />
          <line x1="42%" y1="18%" x2="52%" y2="28%" stroke="url(#cyanGoldGrad)" strokeWidth="0.6" />
          <line x1="38%" y1="46%" x2="46%" y2="58%" stroke="#2563EB" strokeWidth="0.6" strokeDasharray="4 6" opacity="0.25" />
          <line x1="46%" y1="58%" x2="39%" y2="72%" stroke="#14B8A6" strokeWidth="0.5" opacity="0.2" />
          <line x1="46%" y1="58%" x2="54%" y2="66%" stroke="url(#blueCyanGrad)" strokeWidth="0.6" strokeDasharray="3 5" />

          <line x1="68%" y1="12%" x2="78%" y2="20%" stroke="url(#cyanGoldGrad)" strokeWidth="0.6" strokeDasharray="3 6" />
          <line x1="78%" y1="20%" x2="88%" y2="15%" stroke="#14B8A6" strokeWidth="0.5" opacity="0.25" />
          <line x1="88%" y1="15%" x2="94%" y2="28%" stroke="#2563EB" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.2" />
          <line x1="78%" y1="20%" x2="84%" y2="34%" stroke="url(#blueCyanGrad)" strokeWidth="0.6" strokeDasharray="4 6" />
          <line x1="84%" y1="34%" x2="95%" y2="44%" stroke="#D4AF37" strokeWidth="0.5" opacity="0.2" />

          <line x1="65%" y1="68%" x2="74%" y2="78%" stroke="url(#cyanGoldGrad)" strokeWidth="0.6" strokeDasharray="3 5" />
          <line x1="74%" y1="78%" x2="86%" y2="72%" stroke="url(#blueCyanGrad)" strokeWidth="0.6" strokeDasharray="4 6" />
          <line x1="86%" y1="72%" x2="94%" y2="84%" stroke="#2563EB" strokeWidth="0.5" opacity="0.2" />
          <line x1="74%" y1="78%" x2="78%" y2="90%" stroke="#14B8A6" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.25" />
          <line x1="86%" y1="72%" x2="82%" y2="88%" stroke="#D4AF37" strokeWidth="0.5" opacity="0.2" />

          <line x1="8%" y1="74%" x2="16%" y2="84%" stroke="url(#blueCyanGrad)" strokeWidth="0.6" strokeDasharray="3 6" />
          <line x1="16%" y1="84%" x2="26%" y2="78%" stroke="#2563EB" strokeWidth="0.5" opacity="0.2" />
          <line x1="16%" y1="84%" x2="22%" y2="94%" stroke="#14B8A6" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.2" />

          <path d="M 60 140 Q 220 80 400 160 T 680 110" stroke="#14B8A6" strokeWidth="0.6" strokeDasharray="3 6" fill="none" opacity="0.2" />
          <path d="M 100 540 Q 320 440 560 560 T 880 500" stroke="#2563EB" strokeWidth="0.6" strokeDasharray="4 8" fill="none" opacity="0.2" />
          <path d="M 520 220 Q 700 160 860 260" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="2 5" fill="none" opacity="0.18" />
          <path d="M 620 620 Q 760 540 920 660" stroke="#14B8A6" strokeWidth="0.5" strokeDasharray="3 6" fill="none" opacity="0.18" />

          {/* NODOS Y PARTÍCULAS */}
          <circle cx="6%" cy="14%" r="2" fill="#14B8A6" className="animate-pulse-dot" />
          <circle cx="24%" cy="16%" r="2" fill="#D4AF37" className="animate-pulse-dot" />
          <circle cx="52%" cy="28%" r="2.2" fill="#14B8A6" className="animate-pulse-dot" />
          <circle cx="88%" cy="15%" r="2" fill="#2563EB" className="animate-pulse-dot" />
          <circle cx="94%" cy="44%" r="2.2" fill="#14B8A6" className="animate-pulse-dot" />
          <circle cx="74%" cy="78%" r="2" fill="#D4AF37" className="animate-pulse-dot" />
          <circle cx="16%" cy="84%" r="2" fill="#2563EB" className="animate-pulse-dot" />
          <circle cx="86%" cy="72%" r="2.2" fill="#14B8A6" className="animate-pulse-dot" />

          <g className="animate-drift-a">
            <circle cx="15%" cy="24%" r="1.5" fill="#2563EB" opacity="0.6" />
            <circle cx="33%" cy="26%" r="1.8" fill="#14B8A6" opacity="0.65" />
            <circle cx="46%" cy="58%" r="2" fill="#2563EB" opacity="0.55" />
            <circle cx="78%" cy="20%" r="1.8" fill="#D4AF37" opacity="0.6" />
            <circle cx="84%" cy="34%" r="1.5" fill="#14B8A6" opacity="0.5" />
            <circle cx="65%" cy="68%" r="1.8" fill="#2563EB" opacity="0.55" />
            <circle cx="94%" cy="84%" r="1.8" fill="#D4AF37" opacity="0.6" />
            <circle cx="26%" cy="78%" r="1.5" fill="#E2E8F0" opacity="0.45" />
          </g>

          <g className="animate-drift-b">
            <circle cx="42%" cy="18%" r="1.5" fill="#E2E8F0" opacity="0.5" />
            <circle cx="38%" cy="46%" r="1.8" fill="#14B8A6" opacity="0.5" />
            <circle cx="39%" cy="72%" r="1.5" fill="#D4AF37" opacity="0.45" />
            <circle cx="54%" cy="66%" r="1.8" fill="#2563EB" opacity="0.6" />
            <circle cx="68%" cy="12%" r="1.5" fill="#2563EB" opacity="0.5" />
            <circle cx="94%" cy="28%" r="1.5" fill="#E2E8F0" opacity="0.4" />
            <circle cx="78%" cy="90%" r="1.5" fill="#14B8A6" opacity="0.5" />
            <circle cx="82%" cy="88%" r="1.8" fill="#2563EB" opacity="0.5" />
            <circle cx="8%" cy="74%" r="1.5" fill="#D4AF37" opacity="0.4" />
            <circle cx="22%" cy="94%" r="1.5" fill="#E2E8F0" opacity="0.35" />
          </g>

          <circle cx="11%" cy="38%" r="1.2" fill="#2563EB" opacity="0.35" />
          <circle cx="18%" cy="8%" r="1.2" fill="#14B8A6" opacity="0.3" />
          <circle cx="28%" cy="42%" r="1" fill="#E2E8F0" opacity="0.25" />
          <circle cx="48%" cy="36%" r="1.2" fill="#D4AF37" opacity="0.3" />
          <circle cx="58%" cy="16%" r="1.2" fill="#2563EB" opacity="0.35" />
          <circle cx="62%" cy="48%" r="1" fill="#14B8A6" opacity="0.25" />
          <circle cx="72%" cy="38%" r="1.2" fill="#E2E8F0" opacity="0.3" />
          <circle cx="86%" cy="56%" r="1.2" fill="#2563EB" opacity="0.35" />
          <circle cx="92%" cy="66%" r="1" fill="#14B8A6" opacity="0.3" />
          <circle cx="60%" cy="86%" r="1.2" fill="#D4AF37" opacity="0.3" />
          <circle cx="70%" cy="94%" r="1" fill="#2563EB" opacity="0.25" />
          <circle cx="4%" cy="88%" r="1.2" fill="#14B8A6" opacity="0.3" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* CONTENEDOR PRINCIPAL INTEGRADOR (DESKTOP: 2 COLUMNAS / MÓVIL: FLUIDO)     */}
      {/* ========================================================================= */}
      <main className="login-main-wrapper relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 xl:py-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-14 items-center">
          
          {/* ===================================================================== */}
          {/* COLUMNA IZQUIERDA: LOGOTIPO OFICIAL + FORMULARIO INTEGRADO (5 COLS)   */}
          {/* ===================================================================== */}
          <div className="login-left-stack lg:col-span-5 w-full max-w-md mx-auto flex flex-col justify-center space-y-3.5 sm:space-y-4 xl:space-y-5">
            
            {/* Logotipo Oficial COCID Agrandado con Halo Luminoso */}
            <div className="text-center relative flex flex-col items-center justify-center shrink-0">
              {/* Halo sutil de retroiluminación */}
              <div className="absolute w-44 h-44 sm:w-52 sm:h-52 xl:w-60 xl:h-60 rounded-full bg-radial from-[#2563EB]/35 via-[#14B8A6]/15 to-transparent blur-2xl pointer-events-none animate-logo-halo" />
              
              <img
                src="/assets/images/escudo cocid 26.png"
                alt="Escudo Institucional COCID"
                className="login-crest-img relative z-10 w-40 sm:w-44 lg:w-44 xl:w-56 2xl:w-60 h-auto max-h-40 sm:max-h-44 lg:max-h-44 xl:max-h-56 2xl:max-h-60 object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>

            {/* Tarjeta de Formulario de Inicio de Sesión */}
            <div className="login-card-body bg-[#08172C]/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-5 sm:p-6 xl:p-7 shadow-2xl shadow-black/60 relative overflow-hidden flex flex-col space-y-3.5 sm:space-y-4">
              
              {/* Resplandor superior de la tarjeta */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2563EB]/70 to-transparent" />

              {/* Encabezado del Formulario */}
              <div className="text-center space-y-0.5">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Bienvenido
                </h1>
                <p className="text-xs text-slate-300 leading-relaxed max-w-[280px] mx-auto">
                  Inicia sesión para acceder a la plataforma de apoyo COCID.
                </p>
              </div>

              {/* Alerta de Error del Servidor */}
              {serverError && (
                <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start space-x-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{serverError}</span>
                </div>
              )}

              {/* Formulario */}
              <form onSubmit={handleSubmit} noValidate className="space-y-3 sm:space-y-3.5">
                {/* Campo: Correo Electrónico */}
                <div className="space-y-1">
                  <label 
                    htmlFor="email-input" 
                    className="block text-xs font-semibold text-slate-200 tracking-wide"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="nombre@institucion.edu"
                    className={`w-full px-3.5 py-2 sm:py-2.5 xl:py-2.5 rounded-2xl bg-[#07172B]/90 border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                      errors.email
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                        : 'border-slate-700/80 hover:border-slate-600 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/40'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-rose-400 font-medium pt-0.5">{errors.email}</p>
                  )}
                </div>

                {/* Campo: Contraseña */}
                <div className="space-y-1">
                  <label 
                    htmlFor="password-input" 
                    className="block text-xs font-semibold text-slate-200 tracking-wide"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password-input"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      placeholder="••••••••••••"
                      className={`w-full pl-3.5 pr-10 py-2 sm:py-2.5 xl:py-2.5 rounded-2xl bg-[#07172B]/90 border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                        errors.password
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                          : 'border-slate-700/80 hover:border-slate-600 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/40'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-rose-400 font-medium pt-0.5">{errors.password}</p>
                  )}
                </div>

                {/* Enlace: Recuperar Contraseña */}
                <div className="flex justify-end pt-0">
                  <button
                    type="button"
                    className="text-xs font-medium text-[#14B8A6] hover:text-[#2dd4bf] hover:underline transition-colors cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Botón: Iniciar Sesión */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-1 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-blue-500 hover:to-blue-600 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-md shadow-[#2563EB]/30 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Iniciando sesión...</span>
                    </>
                  ) : (
                    <>
                      <span>Iniciar sesión</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Sello Institucional de Seguridad */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center space-x-1.5 text-[10px] sm:text-[11px] text-slate-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6] shrink-0" />
                <span>Acceso seguro mediante encriptación académica</span>
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* COLUMNA DERECHA: NÚCLEO IA VIVO + TÍTULO + MINI SLIDER SIN CAJA       */}
          {/* ===================================================================== */}
          <div className="login-right-stack lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-5 xl:space-y-6 lg:pl-2 xl:pl-6">
            
            {/* NÚCLEO CENTRAL DE INTELIGENCIA ARTIFICIAL CON ÓRBITAS VIVAS */}
            <div className="login-ai-stage relative flex items-center justify-center min-h-[250px] sm:min-h-[280px] lg:min-h-[280px] xl:min-h-[330px] 2xl:min-h-[370px]">
              
              {/* ÓRBITA EXTERIOR (Rotación Lenta Horaria) */}
              <div className="login-ring-outer absolute w-[250px] h-[250px] sm:w-[280px] sm:h-[280px] lg:w-[280px] lg:h-[280px] xl:w-[330px] xl:h-[330px] 2xl:w-[370px] 2xl:h-[370px] rounded-full border border-slate-700/40 animate-orbit-cw-slow pointer-events-none">
                <div className="absolute -top-1.5 left-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#14B8A6] shadow-lg shadow-[#14B8A6]/60 -translate-x-1/2 flex items-center justify-center">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white" />
                </div>
                <div className="absolute -bottom-1.5 left-1/4 w-2 h-2 rounded-full bg-[#2563EB] shadow-md shadow-[#2563EB]/50" />
              </div>

              {/* ÓRBITA INTERMEDIA (Rotación Media Antihoraria Segmentada) */}
              <div className="login-ring-mid absolute w-[190px] h-[190px] sm:w-[215px] sm:h-[215px] lg:w-[215px] lg:h-[215px] xl:w-[250px] xl:h-[250px] 2xl:w-[280px] 2xl:h-[280px] rounded-full border border-slate-600/40 border-dashed animate-orbit-ccw-mid pointer-events-none">
                <div className="absolute top-1/3 -right-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#D4AF37] shadow-md shadow-[#D4AF37]/50 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white" />
                </div>
              </div>

              {/* ÓRBITA INTERIOR (Rotación Rápida Horaria) */}
              <div className="login-ring-inner absolute w-[125px] h-[125px] sm:w-[140px] sm:h-[140px] lg:w-[140px] lg:h-[140px] xl:w-[165px] xl:h-[165px] 2xl:w-[185px] 2xl:h-[185px] rounded-full border border-[#2563EB]/30 animate-orbit-cw-fast pointer-events-none">
                <div className="absolute -bottom-1 left-1/3 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#14B8A6] shadow-sm shadow-[#14B8A6]/40" />
              </div>

              {/* NÚCLEO CENTRAL LUMINOSO */}
              <div className="relative z-10 flex items-center justify-center animate-core-breath">
                <div className="w-20 h-20 sm:w-22 sm:h-22 xl:w-24 xl:h-24 2xl:w-26 2xl:h-26 rounded-full bg-gradient-to-tr from-[#0B1F3A] via-[#1E40AF]/70 to-[#14B8A6]/50 border border-[#2563EB]/60 flex items-center justify-center backdrop-blur-md relative overflow-hidden">
                  <div className="absolute -top-2 -left-2 w-10 h-10 sm:w-12 sm:h-12 bg-white/25 rounded-full blur-sm" />
                  <div className="w-10 h-10 sm:w-11 sm:h-11 xl:w-12 xl:h-12 rounded-full bg-[#0B1F3A]/90 border border-[#14B8A6]/50 flex items-center justify-center shadow-inner">
                    <Sparkles className="w-5 h-5 sm:w-5 sm:h-5 xl:w-6 xl:h-6 text-[#14B8A6] animate-pulse" />
                  </div>
                </div>
              </div>

              {/* TARJETA FLOTANTE 1: ANÁLISIS */}
              <div className="absolute top-[4%] left-[1%] sm:left-[4%] xl:left-[6%] z-20 animate-float-badge-1">
                <div className="bg-[#08172C]/85 backdrop-blur-md border border-slate-700/80 hover:border-[#14B8A6]/60 transition-colors rounded-2xl px-3 py-1.5 sm:px-3.5 sm:py-2 shadow-xl shadow-black/50 flex items-center space-x-2 sm:space-x-2.5">
                  <div className="relative flex items-center justify-center">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#14B8A6] shadow-md shadow-[#14B8A6]/60" />
                    <span className="absolute w-4 h-4 rounded-full bg-[#14B8A6]/30 animate-ping" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                      ANÁLISIS
                    </p>
                    <p className="text-xs sm:text-xs font-bold text-white tracking-tight">
                      98.4% Precisión
                    </p>
                  </div>
                </div>
              </div>

              {/* TARJETA FLOTANTE 2: MODELO IA */}
              <div className="absolute bottom-[4%] right-[1%] sm:right-[4%] xl:right-[6%] z-20 animate-float-badge-2">
                <div className="bg-[#08172C]/85 backdrop-blur-md border border-slate-700/80 hover:border-[#D4AF37]/60 transition-colors rounded-2xl px-3 py-1.5 sm:px-3.5 sm:py-2 shadow-xl shadow-black/50 flex items-center space-x-2 sm:space-x-2.5">
                  <div className="relative flex items-center justify-center">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#D4AF37] shadow-md shadow-[#D4AF37]/60" />
                    <span className="absolute w-4 h-4 rounded-full bg-[#D4AF37]/30 animate-ping" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                      MODELO IA
                    </p>
                    <p className="text-xs sm:text-xs font-bold text-white tracking-tight">
                      Activo
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN INFORMATIVA INSTITUCIONAL: TÍTULO + MINI SLIDER SIN CAJA */}
            <div className="space-y-3 sm:space-y-3.5 max-w-xl">
              
              {/* Título Principal y Línea Acento Oro */}
              <div>
                <h2 className="text-xl sm:text-2xl xl:text-3xl font-black text-white tracking-tight leading-snug">
                  Plataforma Inteligente de Apoyo Académico
                </h2>
                
                {/* Línea Acento Oro Institucional */}
                <div className="w-10 sm:w-12 h-0.5 sm:h-1 bg-[#D4AF37] rounded-full mt-2 mb-1.5 sm:mt-2.5 sm:mb-2" />
              </div>

              {/* =================================================================== */}
              {/* MINI SLIDER INSTITUCIONAL SIN CAJA (TOTALMENTE INTEGRADO AL FONDO)   */}
              {/* =================================================================== */}
              <div 
                className="relative select-none pt-0.5"
                onMouseEnter={() => setIsSliderPaused(true)}
                onMouseLeave={() => setIsSliderPaused(false)}
              >
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  
                  {/* Tarjeta Enlace del Slide Activo (Sin caja ni bordes rectangulares) */}
                  <a
                    href={activeSlide.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-3 sm:space-x-3.5 flex-1 min-w-0 transition-transform duration-200 hover:translate-x-1 cursor-pointer"
                  >
                    {/* Icono con Halo Dinámico Oficial */}
                    <div 
                      className="w-10 h-10 sm:w-10 sm:h-10 xl:w-11 xl:h-11 rounded-xl sm:rounded-2xl bg-[#08172C]/80 border border-slate-700/70 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 shadow-md"
                      style={{
                        borderColor: activeSlide.color,
                        boxShadow: `0 0 14px ${activeSlide.color}35`,
                      }}
                    >
                      <ActiveSlideIcon 
                        className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300"
                        style={{ color: activeSlide.color }}
                      />
                    </div>

                    {/* Textos del Canal / Slide */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span 
                          className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-md border"
                          style={{
                            color: activeSlide.color,
                            backgroundColor: `${activeSlide.color}15`,
                            borderColor: `${activeSlide.color}30`,
                          }}
                        >
                          {activeSlide.name}
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                      </div>
                      <p className="text-xs sm:text-sm xl:text-base font-bold text-white group-hover:text-[#14B8A6] transition-colors truncate">
                        {activeSlide.title || activeSlide.name}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                        {activeSlide.subtitle || 'Visitar enlace oficial'}
                      </p>
                    </div>
                  </a>

                  {/* Flechas de Control Discretas */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Canal anterior"
                      className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Canal siguiente"
                      className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                {/* Indicadores de Puntos Discretos */}
                <div className="flex items-center space-x-1.5 mt-2 sm:mt-2.5 pt-0.5">
                  {socialLinks.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Ver canal ${item.name}`}
                      className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        currentSlide === idx 
                          ? 'w-5 sm:w-6 bg-[#14B8A6]' 
                          : 'w-1.5 sm:w-2 bg-slate-700/80 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* PIE DE PÁGINA INFERIOR DISCRETO (DERECHOS INSTITUCIONALES)                */}
      {/* ========================================================================= */}
      <footer className="login-footer-bar relative z-10 w-full py-2.5 sm:py-3 xl:py-3.5 border-t border-slate-800/60 px-4 sm:px-8 text-center text-[10px] sm:text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-1.5 max-w-7xl mx-auto shrink-0">
        <div className="flex items-center space-x-1.5">
          <span>© {new Date().getFullYear()}</span>
          <span className="font-semibold text-slate-300">Colegio Universitario Científico de Datos</span>
          <span className="text-slate-600">•</span>
          <span>Plataforma Inteligente COCID</span>
        </div>

        <div className="flex items-center space-x-2 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
          <span className="font-medium text-slate-300">
            Infraestructura Segura de Inteligencia Artificial
          </span>
        </div>
      </footer>
    </div>
  );
};
