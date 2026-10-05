import type { ComponentType, CSSProperties } from 'react';
import { 
  FaGlobe, 
  FaWhatsapp, 
  FaFacebook, 
  FaYoutube, 
  FaSpotify 
} from 'react-icons/fa';

export interface SocialLink {
  name: string;
  url: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  color: string;
  title?: string;
  subtitle?: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: 'Sitio Web Institucional',
    url: 'https://cocid.mx/',
    icon: FaGlobe,
    color: '#14B8A6',
    title: 'Conoce más sobre COCID',
    subtitle: 'Revisa nuestro portal web institucional',
  },
  {
    name: 'WhatsApp Atención Directa',
    url: 'https://api.whatsapp.com/send?phone=527353392795',
    icon: FaWhatsapp,
    color: '#25D366',
    title: 'Atención y Asesoría Académica',
    subtitle: 'Comunícate directamente por WhatsApp',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/Colegio.Cientifico.de.Datos/?ref=bookmarks',
    icon: FaFacebook,
    color: '#1877F2',
    title: 'Comunidad Científica de Datos',
    subtitle: 'Síguenos en nuestra página de Facebook',
  },
  {
    name: 'Canal de YouTube',
    url: 'https://www.youtube.com/channel/UCdjx8KJ00fOIKX2q0EYSr4A',
    icon: FaYoutube,
    color: '#FF0000',
    title: 'Aprende y Descubre con Nosotros',
    subtitle: 'Visita y suscríbete a nuestro canal de YouTube',
  },
  {
    name: 'Spotify Podcast Institucional',
    url: 'https://open.spotify.com/show/5YprrEYBQlmgVsaVqbnmEY',
    icon: FaSpotify,
    color: '#1DB954',
    title: 'Podcast de Ciencia y Tecnología',
    subtitle: 'Escucha nuestros episodios en Spotify',
  },
  {
    name: 'Convenios Institucionales',
    url: 'https://posgrados.cocid.edu.mx/convenios/',
    icon: FaGlobe,
    color: '#D4AF37',
    title: 'Alianzas y Convenios Académicos',
    subtitle: 'Explora nuestros convenios de posgrado',
  },
];
