import { useEffect } from "react";

export interface PageMeta {
  title: string;
  description?: string;
}

function setMetaTag(attr: "name" | "property", key: string, content: string | undefined) {
  if (!content) return;
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

/**
 * Sets `document.title` and the `description`/`og:title`/`og:description`
 * meta tags for the active page. Replaces TanStack Router's per-route
 * `head()` option now that routing is client-only (no SSR head injection).
 */
export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    setMetaTag("name", "description", description);
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    return () => {
      document.title = previousTitle;
    };
  }, [title, description]);
}
