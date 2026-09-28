"use client";

import { Button } from "@/components/ui/button";
import { openCookieSettings } from "@/lib/consent";

export function CookieSettingsButton() {
  return (
    <Button type="button" onClick={openCookieSettings}>
      Cambiar mis preferencias de cookies
    </Button>
  );
}
