import { notFound } from "next/navigation";
import Link from "next/link";
import { PRODUCT_SERVICES, ProductService } from "@/lib/enterprise-data";
import { Navbar } from "@/components/layouts/HeaderNav";
import { Footer } from "@/components/layouts/Footer";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Zap, Bot, Layers, Wrench, Search, Cpu } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = PRODUCT_SERVICES.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 bg-bg-primary text-text-primary">
        <div className="container-editorial">

          {/* Breadcrumb / Back Link */}
          <div className="mb-8">
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 text-xs font-mono text-text-tertiary hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Enterprise Products</span>
            </Link>
          </div>

          {/* Product Header Hero */}
          <div className="max-w-3xl space-y-4 mb-14">
            <span className="px-3 py-1 rounded text-xs font-mono font-semibold bg-accent/10 text-accent uppercase tracking-wider border border-accent/20 inline-block">
              {product.category}
            </span>
            <h1 className="text-display text-text-primary leading-tight">
              {product.name}
            </h1>
            <p className="text-body-lg text-text-secondary leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Business Impact Card */}
          <div className="p-8 rounded-sm border border-border-strong bg-bg-secondary shadow-xl mb-14 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <span className="text-xs font-mono text-accent font-semibold uppercase tracking-wider">
                Measurable Business Impact
              </span>
              <h2 className="text-heading-2 text-text-primary">
                {product.businessImpact}
              </h2>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1 border-t md:border-t-0 md:border-l border-border-subtle pt-4 md:pt-0 md:pl-6">
              {product.metrics.map((m, idx) => (
                <div key={idx} className="flex flex-col items-start md:items-end">
                  <span className="text-3xl font-bold font-mono text-text-primary">{m.value}</span>
                  <span className="text-xs text-text-tertiary">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Feature Matrix */}
          <div className="space-y-6 mb-16">
            <h3 className="text-heading-2 text-text-primary">
              Enterprise Product Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feature, fIdx) => (
                <div
                  key={fIdx}
                  className="p-5 rounded-sm border border-border-subtle bg-bg-secondary flex items-start gap-3"
                >
                  <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-text-primary block">{feature}</span>
                    <span className="text-[11px] text-text-tertiary leading-relaxed block">
                      Fully integrated with Athleia&apos;s zero-fabrication reasoning engine and audit telemetry logging.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="p-10 rounded-sm border border-border-subtle bg-bg-secondary text-center space-y-6 max-w-3xl mx-auto">
            <h3 className="text-heading-1 text-text-primary">
              Ready to Deploy {product.name}?
            </h3>
            <p className="text-xs text-text-secondary max-w-lg mx-auto">
              Schedule a technical demo with our enterprise architecture team to evaluate ingestion pipelines and VPC setup.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-sm bg-text-primary text-bg-primary text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <span>Book a Demo</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
