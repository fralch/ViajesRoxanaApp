// Shared utility functions
import AsyncStorage from '@react-native-async-storage/async-storage';

// Date formatting utilities
export const formatDate = (date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('es-PE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    case 'long':
      return dateObj.toLocaleDateString('es-PE', { 
        weekday: 'long',
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    case 'time':
      return dateObj.toLocaleTimeString('es-PE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    default:
      return dateObj.toLocaleDateString('es-PE');
  }
};

// Date range formatting (Spanish)
export const formatDateRange = (start: string | Date, end: string | Date): string => {
  const s = typeof start === 'string' ? new Date(start) : start;
  const e = typeof end === 'string' ? new Date(end) : end;

  if (isNaN(s.getTime()) || isNaN(e.getTime())) return '';

  const fmtDay = new Intl.DateTimeFormat('es-PE', { day: 'numeric' });
  const fmtMonth = new Intl.DateTimeFormat('es-PE', { month: 'long' });
  const fmtMonthYear = new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' });
  const fmtFull = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });

  const sameYear = s.getFullYear() === e.getFullYear();
  const sameMonth = sameYear && s.getMonth() === e.getMonth();

  if (sameMonth) {
    const dayStart = fmtDay.format(s);
    const dayEnd = fmtDay.format(e);
    const monthYear = fmtMonthYear.format(e); // e.g., "septiembre de 2025"
    return `Del ${dayStart} al ${dayEnd} de ${monthYear}`;
  }

  if (sameYear) {
    const startPart = `${fmtDay.format(s)} de ${fmtMonth.format(s)}`;
    const endPart = `${fmtDay.format(e)} de ${fmtMonth.format(e)} de ${e.getFullYear()}`;
    return `Del ${startPart} al ${endPart}`;
  }

  const startFull = fmtFull.format(s);
  const endFull = fmtFull.format(e);
  return `Del ${startFull} al ${endFull}`;
};

// Currency formatting
export const formatCurrency = (amount: number, currency: string = 'S/'): string => {
  return `${currency} ${amount.toFixed(2)}`;
};

// Phone number formatting
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a Peruvian number
  if (cleaned.startsWith('51') && cleaned.length === 11) {
    return `+51 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  } else if (cleaned.length === 9) {
    return `+51 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  return phone;
};

// Text truncation
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?51\s?9\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateDNI = (dni: string): boolean => {
  const dniRegex = /^\d{8}$/;
  return dniRegex.test(dni);
};

// Distance calculation
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

// Time difference calculation
export const getTimeDifference = (date1: string | Date, date2: string | Date = new Date()): string => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  const diff = Math.abs(d2.getTime() - d1.getTime());
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 0) return `${days} día${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} min`;
  return 'Ahora';
};

// Object utilities
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const isEmpty = (value: any): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// Array utilities
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const group = String(item[key]);
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Error handling
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Ha ocurrido un error inesperado';
};

// Local storage utilities
export const storage = {
  set: async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },
  
  get: async (key: string): Promise<any> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },
  
  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }
};

export * from './time';
