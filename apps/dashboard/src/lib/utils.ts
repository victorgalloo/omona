import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'ahora';
  if (diffMins < 60) return `${diffMins} min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) {
    const days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
    return days[date.getDay()];
  }
  return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

/**
 * Tiempo de lectura de un bloque, a 200 palabras por minuto.
 *
 * Se calcula y no se teclea por la misma razón por la que este sitio acabó de
 * retirar las cifras inventadas del corpus: un "2 min" escrito a mano se
 * desincroniza en la primera edición y se queda anunciando algo falso. Aquí el
 * número sale del texto que el visitante va a leer, así que no puede mentir.
 *
 * Bajo el minuto se redondea a decenas de segundo. Decir "37 s" finge una
 * precisión que la medida no tiene.
 */
export function tiempoDeLectura(...textos: string[]): string {
  const palabras = textos.join(' ').trim().split(/\s+/).filter(Boolean).length;
  const segundos = (palabras / 200) * 60;
  if (segundos < 60) return `${Math.max(10, Math.round(segundos / 10) * 10)} s`;
  return `${Math.round(segundos / 60)} min`;
}
