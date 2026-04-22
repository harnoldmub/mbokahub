"use client";

import { SectionHeading } from "@/components/marketing/section-heading";
import { ProRegistrationForm } from "@/components/pro/registration-form";

export default function ProRegisterPage() {
  return (
    <main className="relative min-h-screen bg-ink">
      {/* Background watermark */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute left-[-5vw] top-[30vh] font-display text-[25vw] text-gold opacity-[0.02] select-none leading-none uppercase -rotate-12">
          BUSINESS
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 relative z-10">
        <div className="max-w-4xl mb-20">
          <SectionHeading
            number="PRO"
            eyebrow="Business"
            title="Deviens un Pro *Mboka Hub*."
            description="Expose ton talent à des milliers de fans. Valide ton profil, booste ta visibilité et connecte-toi avec la diaspora."
          />
        </div>

        <div className="max-w-5xl mx-auto">
          <ProRegistrationForm />
        </div>
      </div>
    </main>
  );
}
