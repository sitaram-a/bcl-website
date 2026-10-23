
import { supabase } from "../lib/supabase";

export async function getHomePosters() {
  const { data, error } = await supabase
    .from("site_content")
    .select("id, title, image_url, category, sort_order")
    .eq("section", "home_posters")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map((poster) => ({
    id: poster.id,
    title: poster.title,
    src: poster.image_url,
    category: poster.category,
  }));
}
