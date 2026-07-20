import Link from "next/link";
import Image from "next/image";
import { FOOTER_COLUMNS } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle" style={{ backgroundColor: "var(--bg-secondary)" }}>

      {/* Main Footer Grid */}
      <div className="container-editorial py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Brand Column */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
            >
              <div className="w-5 h-5 shrink-0 rounded-[3px] overflow-hidden">
                <Image
                  src="/icon.png"
                  alt="Athleia Logo"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-cover"
                />
              </div>
              <span className="text-mono text-text-primary font-medium tracking-wider text-sm">
                ATHLEIA.AI
              </span>
            </Link>
            <p className="text-body text-text-secondary leading-relaxed max-w-xs text-sm">
              Enterprise Industrial Intelligence Platform. Transforming engineering
              knowledge into verified, grounded AI reasoning.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--status-verified)" }} />
              <span className="text-mono text-text-tertiary">All systems operational</span>
            </div>
          </div>

          {/* Nav Columns */}
          <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-8">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading} className="flex flex-col gap-4">
                <span className="text-label text-text-tertiary">{col.heading}</span>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("/") ? (
                        <Link
                          href={link.href}
                          className="text-body text-text-secondary hover:text-text-primary transition-colors duration-200 text-sm"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="text-body text-text-secondary hover:text-text-primary transition-colors duration-200 text-sm"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t border-border-subtle">
        <div className="container-editorial py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-mono text-text-tertiary">
            © {year} Athleia Technologies, Inc. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Security Policy"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-mono text-text-tertiary hover:text-text-secondary transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
