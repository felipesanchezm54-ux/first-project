/** Preferencias de cookies (Ley 1581 de 2012). Se guardan en una cookie de primera parte por 6 meses. */
export type Consent = { analytics: boolean; marketing: boolean; date: string };

export const CONSENT_COOKIE = "nexo_consent";
export const CONSENT_EVENT = "nexo:consent-change";
export const OPEN_SETTINGS_EVENT = "nexo:open-cookie-settings";

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split("=")[1])) as Consent;
  } catch {
    return null;
  }
}

export function saveConsent(value: Omit<Consent, "date">) {
  const consent: Consent = { ...value, date: new Date().toISOString() };
  const maxAge = 60 * 60 * 24 * 180;
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
  return consent;
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}
