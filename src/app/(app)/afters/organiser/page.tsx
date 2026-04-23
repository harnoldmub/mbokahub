import { AfterRegistrationForm } from "@/components/afters/registration-form";
import { SectionHeading } from "@/components/marketing/section-heading";

export default function OrganiseAfterPage() {
  return (
    <main className="relative min-h-screen bg-ink">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute left-[-10vw] top-[20vh] font-display text-[25vw] text-blood opacity-[0.03] select-none leading-none uppercase -rotate-12">
          NIGHT
        </span>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-32 relative z-10">
        <SectionHeading
          number="03"
          eyebrow="Organisateurs"
          title="Lance ton *After*."
          description="Remplis les détails de ton événement pour qu'il apparaisse dans le radar de la communauté."
        />

        <div className="mt-20">
          <AfterRegistrationForm />
        </div>
      </div>
    </main>
  );
}
