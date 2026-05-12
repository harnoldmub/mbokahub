"use client";

import { ChevronLeft, ChevronRight, Clock, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ProService = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number | null;
};

type DaySlots = {
  date: string;
  dayLabel: string;
  slots: string[];
};

type Props = {
  proProfileId: string;
  proName: string;
  services: ProService[];
};

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} h ${m}` : `${h} h`;
}

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function BookingModal({ proProfileId, proName, services }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"service" | "slot" | "details">("service");
  const [selectedService, setSelectedService] = useState<ProService | null>(
    services.length === 1 ? services[0] : null
  );
  const [weekStart, setWeekStart] = useState(todayIso);
  const [days, setDays] = useState<DaySlots[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: weekStart,
        days: "7",
        ...(selectedService ? { serviceId: selectedService.id } : {}),
      });
      const res = await fetch(`/api/pros/${proProfileId}/slots?${params}`);
      const data = await res.json();
      setDays(data.days ?? []);
    } finally {
      setLoading(false);
    }
  }, [proProfileId, weekStart, selectedService]);

  useEffect(() => {
    if (step === "slot") {
      fetchSlots();
    }
  }, [step, fetchSlots]);

  function handleOpen() {
    setOpen(true);
    setStep(services.length === 0 ? "slot" : "service");
    setSelectedSlot(null);
    setSubmitted(false);
    setFormError(null);
    setWeekStart(todayIso());
  }

  function handleServiceSelect(svc: ProService | null) {
    setSelectedService(svc);
    setStep("slot");
    setSelectedSlot(null);
  }

  function handleSlotSelect(date: string, time: string) {
    setSelectedSlot({ date, time });
    setStep("details");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    const fd = new FormData(e.currentTarget);
    // Build requestedAt in ISO (use UTC noon approximation; actual display is local)
    fd.set("proProfileId", proProfileId);
    fd.set("requestedAt", `${selectedSlot!.date}T${selectedSlot!.time}:00`);
    if (selectedService) fd.set("serviceId", selectedService.id);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setFormError(data.error ?? "Erreur. Réessaie.");
      }
    } catch {
      setFormError("Erreur réseau. Réessaie.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex h-12 items-center gap-2 rounded-full bg-blood px-6 text-sm font-medium text-white shadow-glow-blood hover:bg-blood-deep transition-colors"
      >
        <Clock className="size-4" />
        Réserver un créneau
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-4 pb-4 sm:pb-0"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ash px-6 py-4 shrink-0">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                  Réservation
                </p>
                <p className="font-display text-lg uppercase text-paper">{proName}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 hover:bg-smoke transition-colors"
              >
                <X className="size-5 text-paper-dim" />
              </button>
            </div>

            {/* Steps indicator */}
            <div className="flex gap-0 border-b border-ash shrink-0">
              {[
                { key: "service", label: "1. Prestation" },
                { key: "slot", label: "2. Créneau" },
                { key: "details", label: "3. Infos" },
              ].map((s) => (
                <div
                  key={s.key}
                  className={`flex-1 py-3 text-center text-xs font-medium transition-colors ${
                    step === s.key
                      ? "border-b-2 border-blood text-blood"
                      : "text-paper-mute"
                  }`}
                >
                  {s.label}
                </div>
              ))}
            </div>

            <div className="overflow-y-auto flex-1 p-5">

              {/* ── STEP 1: Service ── */}
              {step === "service" && (
                <div className="grid gap-3">
                  <p className="text-sm text-paper-dim">
                    Choisis la prestation souhaitée.
                  </p>
                  {services.map((svc) => (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => handleServiceSelect(svc)}
                      className="flex items-center justify-between rounded-2xl border border-ash bg-smoke px-5 py-4 text-left hover:border-blood/40 hover:bg-blood/5 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-paper">{svc.name}</p>
                        <p className="mt-0.5 text-xs text-paper-dim">
                          {formatDuration(svc.durationMinutes)}
                          {svc.price ? ` · ${svc.price.toFixed(0)} €` : ""}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-blood/10 px-3 py-1 text-xs font-mono text-blood">
                        <Clock className="size-3" />
                        {formatDuration(svc.durationMinutes)}
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleServiceSelect(null)}
                    className="rounded-2xl border border-dashed border-ash px-5 py-3 text-sm text-paper-mute hover:border-paper-dim hover:text-paper-dim transition-colors"
                  >
                    Autre / Sans préférence
                  </button>
                </div>
              )}

              {/* ── STEP 2: Slot picker ── */}
              {step === "slot" && (
                <div>
                  {selectedService && (
                    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-blood/20 bg-blood/5 px-4 py-3">
                      <Clock className="size-4 text-blood shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-paper">{selectedService.name}</p>
                        <p className="text-xs text-paper-dim">
                          {formatDuration(selectedService.durationMinutes)}
                          {selectedService.price ? ` · ${selectedService.price.toFixed(0)} €` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep("service")}
                        className="ml-auto text-xs text-blood hover:underline"
                      >
                        Changer
                      </button>
                    </div>
                  )}

                  {/* Week navigation */}
                  <div className="mb-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setWeekStart((w) => addDays(w, -7))}
                      disabled={weekStart <= todayIso()}
                      className="rounded-full p-1.5 hover:bg-smoke disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="size-5 text-paper" />
                    </button>
                    <span className="text-sm font-medium text-paper">
                      Semaine du {formatDateShort(weekStart)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setWeekStart((w) => addDays(w, 7))}
                      className="rounded-full p-1.5 hover:bg-smoke transition-colors"
                    >
                      <ChevronRight className="size-5 text-paper" />
                    </button>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="size-6 animate-spin text-blood" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {days.map((day) => (
                        <div key={day.date}>
                          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-paper-mute">
                            {day.dayLabel.split(" ")[0]}
                          </p>
                          <p className="mb-3 text-xs text-paper-dim">
                            {day.dayLabel.split(" ").slice(1).join(" ")}
                          </p>
                          <div className="flex flex-col gap-1">
                            {day.slots.length === 0 ? (
                              <span className="text-[10px] text-paper-mute">—</span>
                            ) : (
                              day.slots.map((time) => (
                                <button
                                  key={time}
                                  type="button"
                                  onClick={() => handleSlotSelect(day.date, time)}
                                  className="rounded-lg border border-ash bg-smoke px-1 py-1.5 text-[11px] font-mono text-paper hover:border-blood hover:bg-blood hover:text-white transition-colors"
                                >
                                  {time}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 3: Details form ── */}
              {step === "details" && !submitted && selectedSlot && (
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-blood/20 bg-blood/5 px-4 py-3">
                    <Clock className="size-4 text-blood shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-paper">
                        {formatDateLong(selectedSlot.date)} à {selectedSlot.time}
                      </p>
                      {selectedService && (
                        <p className="text-xs text-paper-dim">
                          {selectedService.name} · {formatDuration(selectedService.durationMinutes)}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep("slot")}
                      className="ml-auto text-xs text-blood hover:underline"
                    >
                      Changer
                    </button>
                  </div>

                  <input
                    name="clientName"
                    required
                    placeholder="Ton nom *"
                    className="h-11 rounded-xl border border-ash bg-smoke px-4 text-sm text-paper outline-none focus:border-blood/50"
                  />
                  <input
                    name="clientPhone"
                    required
                    placeholder="Téléphone / WhatsApp *"
                    className="h-11 rounded-xl border border-ash bg-smoke px-4 text-sm text-paper outline-none focus:border-blood/50"
                  />
                  <input
                    name="clientEmail"
                    type="email"
                    placeholder="Email (optionnel)"
                    className="h-11 rounded-xl border border-ash bg-smoke px-4 text-sm text-paper outline-none focus:border-blood/50"
                  />
                  <textarea
                    name="note"
                    rows={3}
                    placeholder="Message optionnel : précisions sur ta demande…"
                    className="rounded-xl border border-ash bg-smoke px-4 py-3 text-sm text-paper outline-none focus:border-blood/50"
                  />

                  <div className="rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-paper-dim">
                    <strong className="text-warning">Acomptes :</strong> Un prestataire peut demander un acompte max. 20€ via PayPal/Paylib.
                  </div>

                  {formError && (
                    <p className="rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-blood px-6 text-sm font-medium text-white hover:bg-blood-deep disabled:opacity-50 transition-colors"
                  >
                    {submitting ? (
                      <><Loader2 className="mr-2 size-4 animate-spin" /> Envoi…</>
                    ) : (
                      "Envoyer la demande"
                    )}
                  </button>
                </form>
              )}

              {submitted && (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-success/15 text-3xl">
                    ✓
                  </div>
                  <p className="font-display text-2xl uppercase text-paper">Demande envoyée !</p>
                  <p className="max-w-sm text-sm text-paper-dim">
                    Le prestataire recevra ta demande et pourra la confirmer depuis son espace Planning.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-2 rounded-full border border-ash px-6 py-2 text-sm text-paper hover:bg-smoke transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const FR_DAYS_LONG = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const FR_MONTHS_LONG = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function formatDateLong(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return `${FR_DAYS_LONG[d.getUTCDay()]} ${d.getUTCDate()} ${FR_MONTHS_LONG[d.getUTCMonth()]}`;
}

function formatDateShort(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return `${d.getUTCDate()} ${FR_MONTHS_LONG[d.getUTCMonth()]}`;
}
