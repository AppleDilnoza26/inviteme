"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { activateProDemo } from "@/actions/subscription";
import { useRouter } from "@/i18n/navigation";

const TEST_CARD = "4242424242424242";

function formatCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function CheckoutForm({ defaultName }: { defaultName: string }) {
  const t = useTranslations("checkout");
  const router = useRouter();
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Card fields are validated locally only and are never sent to the server.
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (card.replace(/\s/g, "") !== TEST_CARD) return setError(t("invalid"));
    setError(null);
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 900));
      const res = await activateProDemo();
      if (res.ok) {
        router.push("/checkout/success");
        router.refresh();
      } else setError(t("invalid"));
    });
  }

  return (
    <form onSubmit={onSubmit} className="paper flex flex-col gap-5 p-8">
      <div>
        <label className="label" htmlFor="cardName">
          {t("cardName")}
        </label>
        <input id="cardName" className="field" defaultValue={defaultName} autoComplete="off" />
      </div>
      <div>
        <label className="label" htmlFor="cardNumber">
          {t("cardNumber")}
        </label>
        <input
          id="cardNumber"
          className="field font-mono tracking-wider"
          inputMode="numeric"
          placeholder="4242 4242 4242 4242"
          autoComplete="off"
          value={card}
          onChange={(e) => setCard(formatCard(e.target.value))}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="expiry">
            {t("expiry")}
          </label>
          <input
            id="expiry"
            className="field font-mono"
            placeholder="12/30"
            autoComplete="off"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            required
            pattern="\d{2}/\d{2}"
          />
        </div>
        <div>
          <label className="label" htmlFor="cvc">
            {t("cvc")}
          </label>
          <input
            id="cvc"
            className="field font-mono"
            placeholder="123"
            autoComplete="off"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
            required
            minLength={3}
          />
        </div>
      </div>
      <p className="rounded-lg bg-cream px-4 py-3 text-xs text-ink-soft">{t("testHint")}</p>
      {error && <p className="rounded-lg bg-blush px-4 py-3 text-sm text-[#8a3f33]">{error}</p>}
      <button type="submit" className="btn btn-gold mt-2" disabled={pending}>
        {pending ? t("processing") : t("pay")}
      </button>
    </form>
  );
}
