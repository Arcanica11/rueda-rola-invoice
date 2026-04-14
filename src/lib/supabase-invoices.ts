import { createClient } from "@supabase/supabase-js";
import { InvoiceData } from "@/types/invoice";

// Dedicated invoice Supabase project
const SUPABASE_URL = process.env.SUPABASE_INVOICE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_INVOICE_SERVICE_KEY || "";

function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("Supabase: Missing SUPABASE_INVOICE_URL or SUPABASE_INVOICE_SERVICE_KEY.");
    return null;
  }
  return createClient(SUPABASE_URL, SUPABASE_KEY);
}

export async function saveInvoiceToSupabase(data: InvoiceData) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase client not configured.");

  const subtotal = data.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  const record = {
    invoice_number: data.number,
    due_at: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    client_name: data.client.name || "",
    client_company: data.client.company || "",
    client_email: data.client.email || "",
    client_phone: data.client.phone || "",
    client_address: data.client.address || "",
    client_tax_id: data.client.taxId || "",
    subtotal: parseFloat(subtotal.toFixed(2)),
    total_amount: parseFloat(total.toFixed(2)),
    status: data.status || "pending",
    items: data.items,
    payments: data.payments || [],
    notes: data.notes || "",
    terms: data.terms || "",
  };

  const { data: result, error } = await supabase
    .from("invoices")
    .insert([record])
    .select()
    .single();

  if (error) {
    console.error("Supabase INSERT error:", error.message);
    throw new Error(`Supabase: ${error.message}`);
  }

  return result;
}

export async function getHistoryFromSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Supabase SELECT error:", error.message);
    return [];
  }

  return data || [];
}

export async function getNextInvoiceNumberFromSupabase(): Promise<string> {
  const supabase = getSupabaseClient();
  const year = new Date().getFullYear();

  if (!supabase) return `INV-${year}-001`;

  const { count, error } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true });

  if (error || count === null) return `INV-${year}-001`;

  const next = count + 1;
  return `INV-${year}-${next.toString().padStart(3, "0")}`;
}
