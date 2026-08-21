"use server";

import { cookies } from "next/headers";

export async function enterGuestMode() {
  (await cookies()).set("homefit_guest", "true", { path: "/" });
}

export async function exitGuestMode() {
  (await cookies()).delete("homefit_guest");
}

export async function isGuestMode() {
  return (await cookies()).get("homefit_guest")?.value === "true";
}
