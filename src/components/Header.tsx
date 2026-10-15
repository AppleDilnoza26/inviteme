import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/session";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";
import { PlanBadge } from "./PlanBadge";
import { SignOutButton } from "./SignOutButton";

export async function Header() {
  const t = await getTranslations("common");
  const user = await getCurrentUser();

  const links = (
    <>
      <Link href="/templates" className="hover:text-gold-deep transition-colors">
        {t("nav.templates")}
      </Link>
      <Link href="/pricing" className="hover:text-gold-deep transition-colors">
        {t("nav.pricing")}
      </Link>
      {user && (
        <Link href="/dashboard" className="hover:text-gold-deep transition-colors">
          {t("nav.dashboard")}
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ivory/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:h-20">
        <Link href="/" aria-label="InviteMe">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">{links}</nav>

        <div className="flex items-center gap-3">
          <Suspense>
            <LocaleSwitcher />
          </Suspense>
          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <PlanBadge plan={user.plan} />
              <SignOutButton label={t("nav.logout")} />
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login" className="btn btn-ghost !py-2">
                {t("nav.login")}
              </Link>
              <Link href="/register" className="btn btn-primary !py-2">
                {t("nav.register")}
              </Link>
            </div>
          )}

          <details className="group relative md:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-line [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Menu</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <div className="paper absolute right-0 mt-3 flex w-60 flex-col gap-4 p-5 text-sm font-medium">
              {links}
              <div className="gold-rule" />
              {user ? (
                <div className="flex items-center justify-between">
                  <PlanBadge plan={user.plan} />
                  <SignOutButton label={t("nav.logout")} />
                </div>
              ) : (
                <>
                  <Link href="/login">{t("nav.login")}</Link>
                  <Link href="/register" className="btn btn-primary">
                    {t("nav.register")}
                  </Link>
                </>
              )}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
