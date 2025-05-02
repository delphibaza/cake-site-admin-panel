
export type PaymentMethod = 'card' | 'paypal' | 'bank' | 'cash' | 'voucher';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface PaymentDetails {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  bankAccount?: string;
  bankName?: string;
  voucherCode?: string;
}

export interface Payment {
  id: string;
  orderId: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  details: PaymentDetails;
  date: string;
  customerId?: string;
  transactionId?: string;
}

// Демонстрационные данные для платежей
export const samplePayments: Payment[] = [
  {
    id: 'pay_1001',
    orderId: 1001,
    amount: 2500,
    method: 'card',
    status: 'completed',
    details: {
      cardNumber: '•••• •••• •••• 1234',
      cardHolder: 'Елена Иванова',
      expiryDate: '05/26'
    },
    date: '2025-04-28',
    transactionId: 'txn_5e8f2a1b3c'
  },
  {
    id: 'pay_1002',
    orderId: 1002,
    amount: 3000,
    method: 'paypal',
    status: 'completed',
    details: {},
    date: '2025-04-27',
    transactionId: 'txn_7f9d3b2e1a'
  },
  {
    id: 'pay_1003',
    orderId: 1003,
    amount: 3700,
    method: 'card',
    status: 'completed',
    details: {
      cardNumber: '•••• •••• •••• 5678',
      cardHolder: 'Мария Сидорова',
      expiryDate: '09/27'
    },
    date: '2025-04-25',
    transactionId: 'txn_2c4d6e8f1a'
  },
  {
    id: 'pay_1004',
    orderId: 1004,
    amount: 2400,
    method: 'bank',
    status: 'refunded',
    details: {
      bankName: 'Сбербанк',
      bankAccount: '****5432'
    },
    date: '2025-04-22',
    transactionId: 'txn_1a3e5b7d9c'
  },
  {
    id: 'pay_1005',
    orderId: 1005,
    amount: 1850,
    method: 'card',
    status: 'failed',
    details: {
      cardNumber: '•••• •••• •••• 9012',
      cardHolder: 'Алексей Козлов',
      expiryDate: '03/25'
    },
    date: '2025-04-20',
    transactionId: 'txn_8a2c4e6g9b'
  }
];
