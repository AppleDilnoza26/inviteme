"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const next = searchParams.get("next");
  const target = next && next.startsWith("/") && !next.startsWith("//") ? next : null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const { error } =
      mode === "login"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name: String(form.get("name")) });

    if (error) {
      setError(mode === "login" ? t("error") : t("registerError"));
      setPending(false);
      return;
    }
    // Full navigation so server components pick up the new session cookie.
    window.location.href = target ?? `/${document.documentElement.lang}/dashboard`;
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-16 md:py-24">
      <div className="paper p-8 md:p-10">
        <p className="eyebrow text-center">InviteMe</p>
        <h1 className="mt-3 text-center text-4xl">{mode === "login" ? t("loginTitle") : t("registerTitle")}</h1>
        <p className="mt-2 text-center text-sm text-ink-soft">
          {mode === "login" ? t("loginSubtitle") : t("registerSubtitle")}
        </p>
        <div className="gold-rule my-8" />

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {mode === "register" && (
            <div>
              <label className="label" htmlFor="name">
                {t("name")}
              </label>
              <input id="name" name="name" className="field" required maxLength={60} autoComplete="name" />
            </div>
          )}
          <div>
            <label className="label" htmlFor="email">
              {t("email")}
            </label>
            <input id="email" name="email" type="email" className="field" required autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor="password">
              {t("password")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="field"
              required
              minLength={8}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
            {mode === "register" && <p className="mt-1.5 text-xs text-ink-soft">{t("passwordHint")}</p>}
          </div>

          {error && <p className="rounded-lg bg-blush px-4 py-3 text-sm text-[#8a3f33]">{error}</p>}

          <button type="submit" className="btn btn-primary mt-2" disabled={pending}>
            {pending ? "…" : mode === "login" ? t("submitLogin") : t("submitRegister")}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-ink-soft">
          {mode === "login" ? t("noAccount") : t("haveAccount")}{" "}
          <Link
            href={{ pathname: mode === "login" ? "/register" : "/login", query: target ? { next: target } : {} }}
            className="font-semibold text-gold-deep underline-offset-4 hover:underline"
          >
            {mode === "login" ? t("registerLink") : t("loginLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
