
import { supabase } from "../lib/supabase";

export async function getHomepageContent(contentType) {
  const { data, error } = await supabase
    .from("homepage_content")
    .select("*")
    .eq("content_type", contentType)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(
      `Failed to load homepage ${contentType}:`,
      error.message
    );
    return [];
  }

  return data || [];
}
