import type { ReactNode } from "react";

import { Reveal } from "@/components/common/Reveal";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <Reveal className="border-b border-border">
      <div className="container-page flex flex-col gap-6 py-12 sm:py-16 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 max-w-2xl">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="display-lg mt-3 text-foreground">{title}</h1>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </Reveal>
  );
}
