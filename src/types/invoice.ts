export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Payment {
  id?: string;
  invoiceId?: string;
  date: string;
  amount: number;
  method: string;
  notes?: string;
}

export interface InvoiceData {
  number: string;
  date: Date;
  dueDate: Date;
  status:
    | "draft"
    | "pending"
    | "partially_paid"
    | "paid"
    | "overdue"
    | "cancelled";
  client: {
    name: string;
    address: string;
    email: string;
    taxId: string;
  };
  items: InvoiceItem[];
  payments?: Payment[]; // Renamed from 'abonos' to 'payments' for consistency with DB
  abonos?: {
    // Kept for backward compatibility if needed, but marked deprecated
    fecha: string;
    monto: number;
    metodo: string;
  }[];
  notes: string;
  terms: string;
}

export const INITIAL_INVOICE: InvoiceData = {
  number: "INV-2026-001",
  date: new Date(),
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  status: "draft",
  client: {
    name: "",
    address: "",
    email: "",
    taxId: "",
  },
  items: [
    {
      id: "1",
      description: "Design Strategy Session",
      quantity: 1,
      price: 1500,
    },
    {
      id: "2",
      description: "UX/UI Implementation Phase 1",
      quantity: 1,
      price: 4500,
    },
  ],
  notes: "Thank you for your business. Your art comes to life.",
  terms: "Payment due within 7 days.",
};
