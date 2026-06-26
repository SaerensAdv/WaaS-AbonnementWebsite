import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Info,
  Lightbulb,
  Warning,
  Quotes,
  CheckCircle,
  ArrowRight,
} from "@phosphor-icons/react";
import type { ContentBlock, InlineNode } from "@shared/blog";

const ICON_WEIGHT = "duotone" as const;

const MONTHS_NL = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

export function formatDateNL(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS_NL[d.getMonth()]} ${d.getFullYear()}`;
}

function isInternalRoute(href: string): boolean {
  return href.startsWith("/") && !href.includes("#");
}

const LINK_CLASS =
  "font-medium text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary transition-colors";

function InlineNodes({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, i) => {
        if (typeof node === "string") {
          return node;
        }
        if (node.href === "#") {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {node.text}
            </strong>
          );
        }
        if (isInternalRoute(node.href)) {
          return (
            <Link key={i} href={node.href} className={LINK_CLASS}>
              {node.text}
            </Link>
          );
        }
        return (
          <a key={i} href={node.href} className={LINK_CLASS}>
            {node.text}
          </a>
        );
      })}
    </>
  );
}

const calloutConfig = {
  tip: {
    icon: Lightbulb,
    classes: "border-primary/20 bg-primary/5",
    iconColor: "text-primary",
  },
  info: {
    icon: Info,
    classes: "border-blue-500/20 bg-blue-500/5",
    iconColor: "text-blue-500",
  },
  warning: {
    icon: Warning,
    classes: "border-amber-500/20 bg-amber-500/5",
    iconColor: "text-amber-500",
  },
} as const;

export function ArticleRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-6" data-testid="article-body">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading": {
            if (block.level === 2) {
              return (
                <h2
                  key={i}
                  className="scroll-mt-28 pt-4 font-display text-2xl tracking-tight sm:text-3xl"
                >
                  {block.text}
                </h2>
              );
            }
            return (
              <h3
                key={i}
                className="scroll-mt-28 pt-2 font-display text-xl tracking-tight sm:text-2xl"
              >
                {block.text}
              </h3>
            );
          }
          case "paragraph":
            return (
              <p
                key={i}
                className="text-base leading-relaxed text-foreground/80 sm:text-lg"
              >
                <InlineNodes nodes={block.content} />
              </p>
            );
          case "list": {
            if (block.ordered) {
              return (
                <ol
                  key={i}
                  className="list-decimal space-y-2.5 pl-6 marker:font-semibold marker:text-primary"
                >
                  {block.items.map((item, j) => (
                    <li
                      key={j}
                      className="pl-1 text-base leading-relaxed text-foreground/80 sm:text-lg"
                    >
                      <InlineNodes nodes={item} />
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <ul key={i} className="space-y-2.5">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-base leading-relaxed text-foreground/80 sm:text-lg"
                  >
                    <CheckCircle
                      size={20}
                      weight={ICON_WEIGHT}
                      className="mt-1 shrink-0 text-primary"
                    />
                    <span>
                      <InlineNodes nodes={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          }
          case "callout": {
            const cfg = calloutConfig[block.variant ?? "tip"];
            const Icon = cfg.icon;
            return (
              <div
                key={i}
                className={`rounded-2xl border p-5 sm:p-6 ${cfg.classes}`}
              >
                <div className="flex items-start gap-3">
                  <Icon
                    size={24}
                    weight={ICON_WEIGHT}
                    className={`mt-0.5 shrink-0 ${cfg.iconColor}`}
                  />
                  <div className="space-y-1">
                    {block.title && (
                      <p className="font-semibold text-foreground">
                        {block.title}
                      </p>
                    )}
                    <p className="text-base leading-relaxed text-foreground/80">
                      <InlineNodes nodes={block.content} />
                    </p>
                  </div>
                </div>
              </div>
            );
          }
          case "quote":
            return (
              <blockquote
                key={i}
                className="relative rounded-2xl border border-border bg-muted/30 p-6 pl-12"
              >
                <Quotes
                  size={28}
                  weight="fill"
                  className="absolute left-4 top-5 text-primary/30"
                />
                <p className="text-lg italic leading-relaxed text-foreground/90">
                  {block.text}
                </p>
                {block.cite && (
                  <footer className="mt-2 text-sm text-muted-foreground">
                    — {block.cite}
                  </footer>
                )}
              </blockquote>
            );
          case "table":
            return (
              <figure key={i} className="my-2">
                <div className="overflow-x-auto rounded-2xl border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        {block.headers.map((h, j) => (
                          <th
                            key={j}
                            className="whitespace-nowrap px-4 py-3 font-semibold text-foreground"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {block.rows.map((row, r) => (
                        <tr key={r} className="hover:bg-muted/20">
                          {row.map((cell, c) => (
                            <td
                              key={c}
                              className={`px-4 py-3 align-top ${
                                c === 0
                                  ? "font-medium text-foreground"
                                  : "text-foreground/80"
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.caption && (
                  <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "cta":
            return (
              <div
                key={i}
                className="my-2 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-center sm:p-8"
              >
                <h3 className="font-display text-2xl tracking-tight">
                  {block.title}
                </h3>
                {block.text && (
                  <p className="mx-auto mt-2 max-w-xl leading-relaxed text-muted-foreground">
                    {block.text}
                  </p>
                )}
                <div className="mt-5">
                  {isInternalRoute(block.href) ? (
                    <Link href={block.href}>
                      <Button
                        size="lg"
                        className="gap-2 rounded-full"
                        data-testid="button-article-cta"
                      >
                        {block.buttonLabel}
                        <ArrowRight size={16} weight={ICON_WEIGHT} />
                      </Button>
                    </Link>
                  ) : (
                    <a href={block.href}>
                      <Button
                        size="lg"
                        className="gap-2 rounded-full"
                        data-testid="button-article-cta"
                      >
                        {block.buttonLabel}
                        <ArrowRight size={16} weight={ICON_WEIGHT} />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
