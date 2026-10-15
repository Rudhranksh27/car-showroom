import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

export default function AdminBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="mb-8 flex items-center gap-1.5 text-sm">
      <Link href="/admin" className="text-slate-500 hover:text-amber-400 transition-colors">
        Admin
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            {isLast || !item.href ? (
              <span className={isLast ? "font-semibold text-white" : "text-slate-400"}>{item.label}</span>
            ) : (
              <Link href={item.href} className="text-slate-400 hover:text-amber-400 transition-colors">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
