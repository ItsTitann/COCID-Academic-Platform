import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  Loader2, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routes.config';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Field-level errors
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-x-hidden select-none">
      {/* Estilos de Animación Scoped para la Experiencia de IA */}
      <style>{`
        @keyframes aiCoreBreath {
          0%, 100% {
            transform: scale(0.96);
            filter: drop-shadow(0 0 25px rgba(37, 99, 235, 0.35)) drop-shadow(0 0 45px rgba(20, 184, 166, 0.25));
          }
          50% {
            transform: scale(1.04);
            filter: drop-shadow(0 0 40px rgba(37, 99, 235, 0.55)) drop-shadow(0 0 70px rgba(20, 184, 166, 0.4));
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
            transform: translateY(-9px) translateX(3px);
          }
        }

        @keyframes floatBadge2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(9px) translateX(-4px);
          }
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes particleDrift {
          0% { transform: translateY(0px) opacity(0.3); }
          50% { opacity: 0.8; }
          100% { transform: translateY(-24px) opacity(0.3); }
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
          animation: pulseDot 3s ease-in-out infinite;
        }
      `}</style>

      {/* ========================================================================= */}
      {/* COLUMNA IZQUIERDA: Acceso Institucional Limpio (Fondo Blanco)            */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[420px] xl:w-[460px] 2xl:w-[500px] flex flex-col justify-between p-8 sm:p-12 lg:p-14 bg-white shrink-0 z-10">
        <div className="my-auto w-full max-w-sm mx-auto">
          {/* Escudo Oficial COCID */}
          <div className="text-center mb-6">
            <img
              src="/assets/images/escudo cocid 26.png"
              alt="Escudo Institucional COCID"
              className="w-36 h-auto max-h-36 mx-auto object-contain drop-shadow-sm select-none"
            />
          </div>

          {/* Textos de Bienvenida */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-[#0B1F3A] tracking-tight">
              Bienvenido
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[280px] mx-auto">
              Inicia sesión para acceder a la plataforma de apoyo COCID.
            </p>
          </div>

          {/* Banner de Error del Servidor */}
          {serverError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{serverError}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Campo Correo Electrónico */}
            <div>
              <label 
                htmlFor="email-input" 
                className="block text-xs font-semibold text-[#1F2937] mb-1.5"
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
                className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#1F2937] placeholder-slate-400 focus:outline-none transition-all ${
                  errors.email
                    ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-slate-200 hover:border-slate-300 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label 
                htmlFor="password-input" 
                className="block text-xs font-semibold text-[#1F2937] mb-1.5"
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
                  placeholder="password"
                  className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white border text-sm text-[#1F2937] placeholder-slate-400 focus:outline-none transition-all ${
                    errors.password
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-slate-200 hover:border-slate-300 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Enlace Olvidaste tu contraseña */}
            <div className="pt-0.5">
              <button
                type="button"
                className="text-xs font-medium text-[#2563EB] hover:text-blue-700 hover:underline transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón Iniciar Sesión */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-[#2563EB] hover:bg-blue-600 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-[#2563EB]/25 flex items-center justify-center space-x-2"
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

          {/* Sello de Seguridad */}
          <div className="mt-8 flex items-center justify-center space-x-1.5 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6] shrink-0" />
            <span>Acceso seguro mediante encriptación académica</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COLUMNA DERECHA: Núcleo Vivo de Inteligencia Artificial Institucional    */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#0B1F3A] via-[#0D2447] to-[#07172B] relative p-12 xl:p-16 flex-col justify-between overflow-hidden">
        {/* Fondo con Luces Ambientales y Red Neuronal Sutil */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#2563EB]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-[#14B8A6]/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[70px] pointer-events-none" />

        {/* Constelación de Partículas y Conexiones Neuronales en SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
          {/* Partículas de fondo con resplandor */}
          <circle cx="12%" cy="20%" r="2" fill="#14B8A6" className="animate-pulse-dot" />
          <circle cx="28%" cy="12%" r="1.5" fill="#2563EB" opacity="0.6" />
          <circle cx="85%" cy="25%" r="2" fill="#D4AF37" className="animate-pulse-dot" />
          <circle cx="92%" cy="48%" r="1.5" fill="#14B8A6" opacity="0.7" />
          <circle cx="78%" cy="75%" r="2" fill="#2563EB" opacity="0.6" />
          <circle cx="18%" cy="80%" r="2" fill="#D4AF37" opacity="0.5" />
          <circle cx="60%" cy="15%" r="1.5" fill="#FFFFFF" opacity="0.4" />
          <circle cx="45%" cy="88%" r="1.5" fill="#14B8A6" opacity="0.5" />

          {/* Líneas sutiles de conexión neuronal */}
          <path d="M 100 160 Q 250 110 420 180 T 700 130" stroke="#14B8A6" strokeWidth="0.75" strokeDasharray="3 6" fill="none" opacity="0.25" />
          <path d="M 150 480 Q 380 400 620 520 T 900 460" stroke="#2563EB" strokeWidth="0.75" strokeDasharray="4 8" fill="none" opacity="0.2" />
          <path d="M 300 250 L 500 350" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="2 4" fill="none" opacity="0.2" />
        </svg>

        {/* NÚCLEO CENTRAL DE INTELIGENCIA ARTIFICIAL CON ÓRBITAS VIVAS */}
        <div className="relative flex-1 flex items-center justify-center my-auto min-h-[440px]">
          {/* ÓRBITA EXTERIOR (440px) - Rotación Lenta Horaria */}
          <div className="absolute w-[380px] h-[380px] xl:w-[440px] xl:h-[440px] rounded-full border border-slate-700/30 animate-orbit-cw-slow pointer-events-none">
            {/* Nodo satélite en la órbita */}
            <div className="absolute -top-1.5 left-1/2 w-3 h-3 rounded-full bg-[#14B8A6] shadow-lg shadow-[#14B8A6]/60 -translate-x-1/2 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <div className="absolute -bottom-1.5 left-1/4 w-2 h-2 rounded-full bg-[#2563EB] shadow-md shadow-[#2563EB]/50" />
          </div>

          {/* ÓRBITA INTERMEDIA (320px) - Rotación Media Antihoraria (Segmentada) */}
          <div className="absolute w-[280px] h-[280px] xl:w-[320px] xl:h-[320px] rounded-full border border-slate-600/40 border-dashed animate-orbit-ccw-mid pointer-events-none">
            {/* Nodo satélite dorado */}
            <div className="absolute top-1/3 -right-1.5 w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-md shadow-[#D4AF37]/50 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
          </div>

          {/* ÓRBITA INTERIOR (210px) - Rotación Rápida Horaria */}
          <div className="absolute w-[180px] h-[180px] xl:w-[210px] xl:h-[210px] rounded-full border border-[#2563EB]/30 animate-orbit-cw-fast pointer-events-none">
            {/* Nodo satélite turquesa */}
            <div className="absolute -bottom-1 left-1/3 w-2 h-2 rounded-full bg-[#14B8A6] shadow-sm shadow-[#14B8A6]/40" />
          </div>

          {/* NÚCLEO CENTRAL LUMINOSO CON EFECTO DE RESPIRACIÓN Y ENERGÍA */}
          <div className="relative z-10 flex items-center justify-center animate-core-breath">
            {/* Capa de Difusión y Gradiente de la Esfera */}
            <div className="w-24 h-24 xl:w-28 xl:h-28 rounded-full bg-gradient-to-tr from-[#0B1F3A] via-[#1E40AF]/60 to-[#14B8A6]/50 border border-[#2563EB]/60 flex items-center justify-center backdrop-blur-md relative overflow-hidden">
              {/* Reflejo Interno Dinámico */}
              <div className="absolute -top-3 -left-3 w-14 h-14 bg-white/25 rounded-full blur-sm" />
              
              {/* Núcleo Interno de Procesamiento */}
              <div className="w-12 h-12 rounded-full bg-[#0B1F3A]/80 border border-[#14B8A6]/50 flex items-center justify-center shadow-inner">
                <Sparkles className="w-6 h-6 text-[#14B8A6] animate-pulse" />
              </div>
            </div>
          </div>

          {/* TARJETA FLOTANTE 1: "ANÁLISIS 98.4% Precisión" (Flotación Suave 1) */}
          <div className="absolute top-[14%] left-[6%] xl:left-[12%] z-20 animate-float-badge-1">
            <div className="bg-[#0B1F3A]/85 backdrop-blur-md border border-slate-700/70 hover:border-[#14B8A6]/50 transition-colors rounded-2xl px-4 py-2.5 shadow-2xl shadow-black/40 flex items-center space-x-3">
              <div className="relative flex items-center justify-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[#14B8A6] shadow-md shadow-[#14B8A6]/60" />
                <span className="absolute w-5 h-5 rounded-full bg-[#14B8A6]/30 animate-ping" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  ANÁLISIS
                </p>
                <p className="text-xs font-bold text-white tracking-tight">
                  98.4% Precisión
                </p>
              </div>
            </div>
          </div>

          {/* TARJETA FLOTANTE 2: "MODELO IA Activo" (Flotación Suave 2 con desfase) */}
          <div className="absolute bottom-[16%] right-[6%] xl:right-[12%] z-20 animate-float-badge-2">
            <div className="bg-[#0B1F3A]/85 backdrop-blur-md border border-slate-700/70 hover:border-[#D4AF37]/50 transition-colors rounded-2xl px-4 py-2.5 shadow-2xl shadow-black/40 flex items-center space-x-3">
              <div className="relative flex items-center justify-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[#D4AF37] shadow-md shadow-[#D4AF37]/60" />
                <span className="absolute w-5 h-5 rounded-full bg-[#D4AF37]/30 animate-ping" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  MODELO IA
                </p>
                <p className="text-xs font-bold text-white tracking-tight">
                  Activo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TEXTO INFERIOR DERECHO */}
        <div className="relative z-10 max-w-xl">
          <h2 className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Plataforma Inteligente de Apoyo Académico
          </h2>

          {/* Línea Acento Oro Académico */}
          <div className="w-10 h-1 bg-[#D4AF37] rounded-full my-3.5" />

          <p className="text-xs xl:text-sm text-slate-300 leading-relaxed max-w-lg">
            Potenciando el aprendizaje a través del análisis de datos avanzados y modelos de inteligencia artificial personalizados del{' '}
            <span className="text-[#D4AF37] font-semibold">
              Colegio Universitario Científico de Datos
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
