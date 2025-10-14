"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export type SupabaseTask = {
  id: number;
  title: string;
  completed: boolean;
  notes?: string | null;
};

let client: SupabaseClient | null = null;

function createSupabaseClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.debug("Failed to create Supabase client", err);
    return null;
  }
}

export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  if (typeof window === "undefined") return null; // avoid server instantiation
  client = createSupabaseClient();
  return client;
}

export async function fetchTasks(): Promise<SupabaseTask[]> {
  const supa = getSupabase();
  if (!supa) return [];
  try {
    const { data, error } = await supa.from("tasks").select("*");
    if (error) throw error;
    return (data as any) ?? [];
  } catch (err) {
    console.debug("Supabase fetch tasks error", err);
    return [];
  }
}

export async function insertTask(task: SupabaseTask) {
  const supa = getSupabase();
  if (!supa) {
    console.debug("Supabase not configured or running on server; skipping insert.");
    return;
  }
  try {
    const { error } = await supa.from("tasks").insert([task]);
    if (error) throw error;
  } catch (err) {
    console.debug("Supabase insert error", err);
  }
}

export async function updateTask(id: number, patch: Partial<SupabaseTask>) {
  const supa = getSupabase();
  if (!supa) {
    console.debug("Supabase not configured or running on server; skipping update.");
    return;
  }
  try {
    const { error } = await supa.from("tasks").update(patch).eq("id", id);
    if (error) throw error;
  } catch (err) {
    console.debug("Supabase update error", err);
  }
}

export async function deleteTask(id: number) {
  const supa = getSupabase();
  if (!supa) {
    console.debug("Supabase not configured or running on server; skipping delete.");
    return;
  }
  try {
    const { error } = await supa.from("tasks").delete().eq("id", id);
    if (error) throw error;
  } catch (err) {
    console.debug("Supabase delete error", err);
  }
}
