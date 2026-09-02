/**
 * Forma de un testimonio real. Vive aquí y no en el componente porque
 * `es.ts` lo necesita para tipar la lista vacía: sin esto TypeScript la
 * infiere como `never[]` y el día que se peguen citas reales no compilan.
 */
export type Testimonial = {
  quote: string;
  name: string;
  /** Negocio y ciudad: es lo que hace verificable la cita. */
  business: string;
  city: string;
  /** Una cifra concreta que el cliente pueda sostener si le preguntan. */
  metric: string;
};
