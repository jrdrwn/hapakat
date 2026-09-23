"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminCookie, isAdmin } from "@/lib/admin";
import { removeFeedback, removeListenerStory } from "@/lib/db";

export async function deleteListenerStory(formData: FormData) {
  if (!(await isAdmin())) redirect("/kelola/masuk");
  const id = formData.get("id");
  if (typeof id === "string" && /^[\da-f-]{36}$/.test(id)) await removeListenerStory(id);
  revalidatePath("/cerita-pendengar");
  revalidatePath("/kelola");
}
export async function deleteFeedback(formData: FormData) {
  if (!(await isAdmin())) redirect("/kelola/masuk");
  const id = formData.get("id");
  if (typeof id === "string" && /^[\da-f-]{36}$/.test(id)) await removeFeedback(id);
  revalidatePath("/cerita-pendengar");
  revalidatePath("/kelola");
}
export async function logout() { await clearAdminCookie(); redirect("/kelola/masuk"); }
