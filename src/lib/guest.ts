"use server";

import { cookies } from "next/headers";

export async function enterGuestMode() {
  (await cookies()).set("guest-mode", "true", { path: "/" });
}

export async function exitGuestMode() {
  (await cookies()).delete("guest-mode");
}

export async function isGuestMode() {
  return (await cookies()).get("guest-mode")?.value === "true";
}
