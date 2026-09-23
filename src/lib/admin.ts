import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "hapakat_admin";
function configuredPassword() { return process.env.ADMIN_PASSWORD || ""; }
function sessionToken() { const password = configuredPassword(); return password ? createHmac("sha256", password).update("hapakat-admin-session-v1").digest("hex") : ""; }
function equal(a: string, b: string) { const left = Buffer.from(a); const right = Buffer.from(b); return left.length === right.length && timingSafeEqual(left, right); }
export function validPassword(input: string) { return configuredPassword().length >= 16 && equal(input, configuredPassword()); }
export async function isAdmin() { const value = (await cookies()).get(cookieName)?.value || ""; const expected = sessionToken(); return !!expected && equal(value, expected); }
export async function setAdminCookie() { (await cookies()).set(cookieName, sessionToken(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 }); }
export async function clearAdminCookie() { (await cookies()).delete(cookieName); }
