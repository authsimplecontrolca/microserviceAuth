import { Temporal } from '@js-temporal/polyfill';

type Format = 'full' | 'date' | 'time';

export const getDateTime = (format: Format = 'full'): string => {
  const now = Temporal.Now.zonedDateTimeISO('America/Lima'); // Esto es correcto, da la hora en Lima

  switch (format) {
    case 'date':
      return now.toPlainDate().toString(); // '2025-03-14'
    case 'time':
      return now.toPlainTime().toString(); // '16:07:16'
    default:
      // Usa el formato completo para que sea compatible con MySQL
      return now.toString().replace('T', ' ').split('.')[0]; // '2025-03-14 16:07:16'
  }
};
