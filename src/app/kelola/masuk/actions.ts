"use server";

import { redirect } from "next/navigation";
import { setAdminCookie, validPassword } from "@/lib/admin";

export async function login(formData: FormData) {
  const password = formData.get("password");
  if (typeof password !== "string" || !validPassword(password)) redirect("/kelola/masuk?error=1");
  await setAdminCookie();
  redirect("/kelola");
}
