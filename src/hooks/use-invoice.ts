import { useMemo, useState } from "react";
import { InvoiceData, INITIAL_INVOICE, InvoiceItem } from "@/types/invoice";

export function useInvoice() {
  const [data, setData] = useState<InvoiceData>(INITIAL_INVOICE);

  const calculations = useMemo(() => {
    const subtotal = data.items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0,
    );
    const taxRate = 0.0825;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      subtotal,
      tax,
      total,
      taxRate,
    };
  }, [data.items]);

  const setClient = (field: keyof InvoiceData["client"], value: string) => {
    setData((prev) => ({
      ...prev,
      client: { ...prev.client, [field]: value },
    }));
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      }),
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: "",
      quantity: 1,
      price: 0,
    };
    setData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  return {
    data,
    setData,
    calculations,
    actions: useMemo(
      () => ({
        setClient,
        updateItem,
        addItem,
        removeItem,
        setInvoiceNumber: (num: string) =>
          setData((prev) => ({ ...prev, number: num })),
        setNotes: (notes: string) => setData((prev) => ({ ...prev, notes })),
        setDeposit: (amount: number) =>
          setData((prev) => {
            const newPayment = {
              date: new Date().toISOString(),
              amount,
              method: "Deposit",
            };
            // Replace or add the first payment as deposit
            const newPayments = prev.payments?.length
              ? [{ ...prev.payments[0], amount }, ...prev.payments.slice(1)]
              : [newPayment];
            return { ...prev, payments: newPayments };
          }),
        resetInvoice: () => setData(INITIAL_INVOICE),
      }),
      [],
    ),
  };
}
