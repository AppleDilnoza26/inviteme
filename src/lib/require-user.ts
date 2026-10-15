import "server-only";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser, type CurrentUser } from "./session";

export async function requireUser(locale: string, nextPath: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect({ href: { pathname: "/login", query: { next: `/${locale}${nextPath}` } }, locale });
  }
  return user!;
}
