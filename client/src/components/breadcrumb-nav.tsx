import { Link } from "wouter";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

const BASE_URL = "https://abonnement.website";

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  const itemListElement = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": BASE_URL
    },
    ...items.map((item, index) => {
      const listItem: Record<string, any> = {
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
      };
      if (item.href) {
        listItem.item = `${BASE_URL}${item.href}`;
      }
      return listItem;
    })
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Breadcrumb className={className}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" data-testid="breadcrumb-home">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {items.map((item, index) => (
            <span key={item.label} className="contents">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === items.length - 1 || !item.href ? (
                  <BreadcrumbPage data-testid={`breadcrumb-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href} data-testid={`breadcrumb-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
