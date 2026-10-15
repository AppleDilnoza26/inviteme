import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/session";

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (await getCurrentUser()) redirect({ href: "/dashboard", locale });
  return (
    <Suspense>
      <AuthForm mode="register" />
    </Suspense>
  );
}
