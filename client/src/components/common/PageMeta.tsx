import { useEffect } from "react";

interface PageMetaProps {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
}

function setMetaTag(selector: string, attribute: string, name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attribute, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Sets document.title and the description/og meta tags per page.
 * Replaces the `head: () => ({ meta: [...] })` option each TanStack Start
 * route used to export. Since this is a client-side-only SPA now, these
 * tags update after the initial paint rather than being present in the
 * server-rendered HTML — see the migration changelog for details on what
 * that means for crawlers/social previews.
 */
export function PageMeta({ title, description, ogTitle, ogDescription }: PageMetaProps) {
  useEffect(() => {
    document.title = title;
    if (description) {
      setMetaTag('meta[name="description"]', "name", "description", description);
    }
    setMetaTag('meta[property="og:title"]', "property", "og:title", ogTitle ?? title);
    if (ogDescription) {
      setMetaTag('meta[property="og:description"]', "property", "og:description", ogDescription);
    }
  }, [title, description, ogTitle, ogDescription]);

  return null;
}
