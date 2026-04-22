import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-ink">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute right-[-10vw] top-[20vh] font-display text-[25vw] text-paper opacity-[0.02] select-none leading-none uppercase -rotate-90">
          CONTACT
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-32 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-20">
          {/* LEFT: INFO */}
          <div className="space-y-16">
            <SectionHeading
              number="00"
              eyebrow="Contact"
              title="On reste *en ligne*."
              description="Une question sur un trajet ? Un problème avec ton profil pro ? L'équipe Mboka Hub te répond."
            />

            <div className="space-y-8">
              <div className="group flex items-start gap-6">
                <div className="size-12 rounded-2xl bg-smoke flex items-center justify-center text-blood transition-transform group-hover:scale-110">
                  <Mail className="size-6" />
                </div>
                <div>
                  <p className="font-mono text-[10px] text-paper-mute uppercase tracking-widest mb-1">Email</p>
                  <p className="font-display text-xl text-paper">hello@mbokahub.fr</p>
                </div>
              </div>

              <div className="group flex items-start gap-6">
                <div className="size-12 rounded-2xl bg-smoke flex items-center justify-center text-blood transition-transform group-hover:scale-110">
                  <Phone className="size-6" />
                </div>
                <div>
                  <p className="font-mono text-[10px] text-paper-mute uppercase tracking-widest mb-1">WhatsApp Business</p>
                  <p className="font-display text-xl text-paper">+33 7 00 00 00 00</p>
                </div>
              </div>

              <div className="group flex items-start gap-6">
                <div className="size-12 rounded-2xl bg-smoke flex items-center justify-center text-blood transition-transform group-hover:scale-110">
                  <MapPin className="size-6" />
                </div>
                <div>
                  <p className="font-mono text-[10px] text-paper-mute uppercase tracking-widest mb-1">Bureau</p>
                  <p className="font-display text-xl text-paper">Paris XI / Saint-Denis</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="relative">
             <div className="absolute -inset-4 bg-blood/10 blur-[100px] rounded-full pointer-events-none" />
             
             <form className="relative bg-coal border border-white/10 p-10 rounded-[3rem] shadow-2xl space-y-10">
               <div className="grid sm:grid-cols-2 gap-8">
                 <FormField label="Nom complet">
                   <Input placeholder="Jean Dupont" className="h-12 bg-smoke border-none px-4" />
                 </FormField>
                 <FormField label="Email">
                   <Input type="email" placeholder="jean@mail.com" className="h-12 bg-smoke border-none px-4" />
                 </FormField>
               </div>

               <FormField label="Sujet" helperText="Pourquoi nous contactes-tu ?">
                 <Input placeholder="Covoiturage, Partenariat..." className="h-12 bg-smoke border-none px-4" />
               </FormField>

               <FormField label="Message">
                 <textarea 
                    className="w-full min-h-32 bg-smoke border-none px-4 py-4 rounded-2xl text-paper outline-none focus:ring-1 ring-blood/40 transition-all font-body text-sm"
                    placeholder="Dis-nous tout..."
                 />
               </FormField>

               <Button className="w-full h-16 text-lg shadow-glow-blood group" size="lg">
                 Envoyer le message <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-2" />
               </Button>
             </form>
          </div>
        </div>
      </div>
    </main>
  );
}
