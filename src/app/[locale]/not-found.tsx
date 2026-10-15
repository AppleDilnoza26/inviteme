import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="mx-auto max-w-md px-5 py-28 text-center">
      <p className="font-display text-8xl text-gold">404</p>
      <h1 className="mt-4 text-4xl">{t("title")}</h1>
      <Link href="/" className="btn btn-primary mt-8">
        {t("back")}
      </Link>
    </div>
  );
}
