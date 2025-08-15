// Payments module exports
export { default as PaymentsListScreen } from './components/PaymentsListScreen';

// Types
export interface Payment {
  id: number;
  trip_id: number;
  user_id: string;
  tripCode: string;
  destination: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  currency: string;
  status: 'completed' | 'partial' | 'pending';
  dueDate?: string;
  installments: PaymentInstallment[];
  year: string;
}

export interface PaymentInstallment {
  number: number;
  amount: number;
  status: 'paid' | 'pending';
  dueDate: string;
  paidDate?: string;
}

export interface PaymentSummary {
  totalYear: number;
  totalPaid: number;
  totalPending: number;
  currency: string;
}