
import { supabase } from "./supabase";

const COOKIE_NAME = "bcl_visitor_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getOrCreateVisitorId() {
  const existingCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`));

  if (existingCookie) {
    return existingCookie.split("=").slice(1).join("=");
  }

  const visitorId = crypto.randomUUID();
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie =
    `${COOKIE_NAME}=${visitorId}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;

  return visitorId;
}

export async function registerVisitorAndGetCount() {
  const visitorId = getOrCreateVisitorId();

  const { error: registerError } = await supabase.rpc(
    "register_bcl_visitor",
    { p_visitor_id: visitorId }
  );

  if (registerError) {
    throw registerError;
  }

  const { data, error: countError } = await supabase.rpc(
    "get_bcl_visitor_count"
  );

  if (countError) {
    throw countError;
  }

  return Number(data);
}