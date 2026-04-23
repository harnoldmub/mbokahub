import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { getLocaleFromSearchParams, nls, type SearchParams } from "@/lib/nls";

type ContactPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const locale = getLocaleFromSearchParams(await searchParams);
  const copy = nls[locale].contact;

  return (
    <main className="relative min-h-screen bg-ink">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute right-[-10vw] top-[20vh] font-display text-[25vw] text-paper opacity-[0.02] select-none leading-none uppercase -rotate-90">
          CONTACT
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32">
        <div className="grid gap-20 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-16">
            <SectionHeading
              description={copy.description}
              eyebrow={copy.eyebrow}
              number="00"
              title={copy.title}
            />

            <div className="space-y-8">
              <div className="group flex items-start gap-6">
                <div className="size-12 rounded-2xl bg-smoke flex items-center justify-center text-blood transition-transform group-hover:scale-110">
                  <Mail className="size-6" />
                </div>
                <div>
                  <p className="mb-1 font-mono text-[10px] text-paper-mute uppercase tracking-widest">
                    {copy.email}
                  </p>
                  <p className="font-display text-xl text-paper">
                    hello@mbokahub.fr
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-6">
                <div className="size-12 rounded-2xl bg-smoke flex items-center justify-center text-blood transition-transform group-hover:scale-110">
                  <Phone className="size-6" />
                </div>
                <div>
                  <p className="mb-1 font-mono text-[10px] text-paper-mute uppercase tracking-widest">
                    {copy.whatsapp}
                  </p>
                  <p className="font-display text-xl text-paper">
                    +33 7 00 00 00 00
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-6">
                <div className="size-12 rounded-2xl bg-smoke flex items-center justify-center text-blood transition-transform group-hover:scale-110">
                  <MapPin className="size-6" />
                </div>
                <div>
                  <p className="mb-1 font-mono text-[10px] text-paper-mute uppercase tracking-widest">
                    {copy.office}
                  </p>
                  <p className="font-display text-xl text-paper">
                    Paris XI / Saint-Denis
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-blood/10 blur-[100px] rounded-full pointer-events-none" />

            <form className="relative space-y-10 rounded-[3rem] border border-white/10 bg-coal p-10 shadow-2xl">
              <div className="grid gap-8 sm:grid-cols-2">
                <FormField label={copy.fullName}>
                  <Input
                    className="h-12 bg-smoke border-none px-4"
                    placeholder={copy.fullNamePlaceholder}
                  />
                </FormField>
                <FormField label={copy.email}>
                  <Input
                    className="h-12 bg-smoke border-none px-4"
                    placeholder="hello@mail.com"
                    type="email"
                  />
                </FormField>
              </div>

              <FormField label={copy.subject} helperText={copy.subjectHelp}>
                <Input
                  className="h-12 bg-smoke border-none px-4"
                  placeholder={copy.subjectPlaceholder}
                />
              </FormField>

              <FormField label={copy.message}>
                <textarea
                  className="w-full min-h-32 bg-smoke border-none px-4 py-4 rounded-2xl text-paper outline-none focus:ring-1 ring-blood/40 transition-all font-body text-sm"
                  placeholder={copy.messagePlaceholder}
                />
              </FormField>

              <Button
                className="h-16 w-full text-lg shadow-glow-blood group"
                size="lg"
              >
                {copy.send}
                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
