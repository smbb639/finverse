import { ReactNode } from "react";

export default function BlogsLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-3xl px-4 py-6">
        {children}
      </div>
    </section>
  );
}
