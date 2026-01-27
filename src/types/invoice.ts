export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  number: string;
  date: Date;
  dueDate: Date;
  client: {
    name: string;
    address: string;
    email: string;
    taxId: string;
  };
  items: InvoiceItem[];
  notes: string;
  terms: string;
}

export const INITIAL_INVOICE: InvoiceData = {
  number: "INV-2026-001",
  date: new Date(),
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
