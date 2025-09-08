export const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " años";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " meses";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " días";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " horas";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutos";
  }
  return Math.floor(seconds) + " segundos";
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    // Adjust for timezone offset to prevent off-by-one day errors
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const correctedDate = new Date(date.getTime() + userTimezoneOffset);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return correctedDate.toLocaleDateString('es-ES', options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original string if formatting fails
  }
};