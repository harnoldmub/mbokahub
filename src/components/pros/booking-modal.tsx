"use client";

import { CalendarCheck, ChevronLeft, ChevronRight, Clock, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type ProService = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number | null;
  description?: string | null;
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
  initialServiceId?: string;
  triggerLabel?: string;
  triggerClassName?: string;
};

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m}` : `${h} h`;
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

const FR_DAYS_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const FR_MONTHS = ["jan.", "fév.", "mar.", "avr.", "mai", "juin", "juil.", "août", "sep.", "oct.", "nov.", "déc."];
const FR_DAYS_LONG = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const FR_MONTHS_LONG = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function parseDayLabel(iso: string) {
  const d = new Date(iso + "T00:00:00Z");
  return {
    day: FR_DAYS_SHORT[d.getUTCDay()],
    date: d.getUTCDate(),
    month: FR_MONTHS[d.getUTCMonth()],
  };
}

function formatDateLong(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return `${FR_DAYS_LONG[d.getUTCDay()]} ${d.getUTCDate()} ${FR_MONTHS_LONG[d.getUTCMonth()]}`;
}

function formatWeekRange(start: string): string {
  const s = new Date(start + "T00:00:00Z");
  const e = new Date(start + "T00:00:00Z");
  e.setUTCDate(e.getUTCDate() + 6);
  if (s.getUTCMonth() === e.getUTCMonth()) {
    return `${s.getUTCDate()}–${e.getUTCDate()} ${FR_MONTHS_LONG[s.getUTCMonth()]}`;
  }
  return `${s.getUTCDate()} ${FR_MONTHS[s.getUTCMonth()]} – ${e.getUTCDate()} ${FR_MONTHS[e.getUTCMonth()]}`;
}

export function BookingModal({
  proProfileId,
  proName,
  services,
  initialServiceId,
  triggerLabel = "Réserver un créneau",
  triggerClassName,
}: Props) {
  const initialService = initialServiceId
    ? (services.find((s) => s.id === initialServiceId) ?? null)
    : services.length === 1
    ? services[0]
    : null;

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"service" | "slot" | "details">("service");
  const [selectedService, setSelectedService] = useState<ProService | null>(initialService);
  const [weekStart, setWeekStart] = useState(todayIso);
  const [days, setDays] = useState<DaySlots[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMoreSlots, setHasMoreSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const totalSlots = days.reduce((acc, d) => acc + d.slots.length, 0);

  const fetchSlots = useCallback(async (start: string, svc: ProService | null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: start,
        days: "7",
        ...(svc ? { serviceId: svc.id } : {}),
      });
      const res = await fetch(`/api/pros/${proProfileId}/slots?${params}`);
      const data = await res.json();
      const fetched: DaySlots[] = data.days ?? [];
      setDays(fetched);
      const total = fetched.reduce((a, d) => a + d.slots.length, 0);
      setHasMoreSlots(total === 0);
    } finally {
      setLoading(false);
    }
  }, [proProfileId]);

  useEffect(() => {
    if (step === "slot") {
      fetchSlots(weekStart, selectedService);
    }
  }, [step, weekStart, selectedService, fetchSlots]);

  function openModal(preService?: ProService) {
    const svc = preService ?? initialService;
    setSelectedService(svc);
    // Pros without bookable services (DJ, MC, VTC, traiteur…) → go straight
    // to a free-form quote form (date + time + contact fields), no slot grid.
    if (services.length === 0) {
      setStep("details");
    } else {
      setStep(svc ? "slot" : "service");
    }
    setSelectedSlot(null);
    setSubmitted(false);
    setFormError(null);
    setWeekStart(todayIso());
    setDays([]);
    setOpen(true);
  }

  function handleServiceSelect(svc: ProService | null) {
    setSelectedService(svc);
    setWeekStart(todayIso());
    setDays([]);
    setStep("slot");
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
    fd.set("proProfileId", proProfileId);
    let requestedAt: string;
    if (selectedSlot) {
      requestedAt = `${selectedSlot.date}T${selectedSlot.time}:00`;
    } else {
      const date = String(fd.get("freeformDate") ?? "");
      const time = String(fd.get("freeformTime") ?? "");
      if (!date || !time) {
        setFormError("Choisis une date et une heure.");
        setSubmitting(false);
        return;
      }
      requestedAt = `${date}T${time}:00`;
      fd.delete("freeformDate");
      fd.delete("freeformTime");
    }
    fd.set("requestedAt", requestedAt);
    if (selectedService) fd.set("serviceId", selectedService.id);
    try {
      const res = await fetch("/api/bookings", { method: "POST", body: fd });
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

  const stepIndex = { service: 0, slot: 1, details: 2 }[step];

  return (
    <>
      <button
        type="button"
        onClick={() => openModal()}
        className={
          triggerClassName ??
          "inline-flex h-12 items-center gap-2 rounded-full bg-blood px-6 text-sm font-medium text-white shadow-glow-blood hover:bg-blood-deep transition-colors"
        }
      >
        <CalendarCheck className="size-4" />
        {triggerLabel}
      </button>

      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4"
          onClick={(e) => e.target === overlayRef.current && setOpen(false)}
        >
          <div className="relative w-full max-w-2xl rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl max-h-[92vh] flex flex-col">

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-ash shrink-0">
              <div className="flex items-center gap-3">
                {stepIndex > 0 && !submitted && services.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(step === "details" ? "slot" : "service")}
                    className="rounded-full p-1 hover:bg-smoke transition-colors"
                    aria-label="Retour"
                  >
                    <ChevronLeft className="size-5 text-paper-dim" />
                  </button>
                )}
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute leading-none">
                    Réservation
                  </p>
                  <p className="font-display text-base uppercase text-paper leading-tight mt-0.5">
                    {proName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 hover:bg-smoke transition-colors"
              >
                <X className="size-4 text-paper-dim" />
              </button>
            </div>

            {/* ── Step progress ── */}
            {!submitted && (
              <div className="flex shrink-0 border-b border-ash">
                {(services.length > 0
                  ? [
                      { i: 0, label: "Prestation" },
                      { i: 1, label: "Créneau" },
                      { i: 2, label: "Mes infos" },
                    ]
                  : [{ i: 2, label: "Demande de devis" }]
                ).map(({ i, label }) => (
                  <div
                    key={i}
                    className={`flex-1 py-2.5 text-center text-[11px] font-medium transition-colors border-b-2 ${
                      stepIndex === i
                        ? "border-blood text-blood"
                        : stepIndex > i
                        ? "border-transparent text-success"
                        : "border-transparent text-paper-mute"
                    }`}
                  >
                    {stepIndex > i ? "✓ " : ""}{label}
                  </div>
                ))}
              </div>
            )}

            <div className="overflow-y-auto flex-1 p-5">

              {/* ── STEP 1: Service ── */}
              {step === "service" && (
                <div className="grid gap-2">
                  <p className="mb-2 text-sm text-paper-dim">
                    Quelle prestation souhaites-tu réserver ?
                  </p>
                  {services.map((svc) => (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => handleServiceSelect(svc)}
                      className="group flex items-center justify-between rounded-2xl border border-ash bg-smoke px-5 py-4 text-left hover:border-blood/40 hover:bg-blood/5 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-paper truncate">{svc.name}</p>
                        {svc.description && (
                          <p className="mt-0.5 text-xs text-paper-dim truncate">{svc.description}</p>
                        )}
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-paper-dim">
                          <Clock className="size-3 shrink-0" />
                          {formatDuration(svc.durationMinutes)}
                          {svc.price ? (
                            <span className="ml-1 font-medium text-paper">{svc.price.toFixed(0)} €</span>
                          ) : null}
                        </p>
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-paper-mute group-hover:text-blood transition-colors ml-3" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleServiceSelect(null)}
                    className="rounded-2xl border border-dashed border-ash px-5 py-3 text-sm text-paper-mute hover:border-paper-dim hover:text-paper-dim transition-colors text-left"
                  >
                    Autre / Sans préférence de prestation
                  </button>
                </div>
              )}

              {/* ── STEP 2: Slot picker ── */}
              {step === "slot" && (
                <div>
                  {/* Selected service recap */}
                  {selectedService && (
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-blood/20 bg-blood/5 px-4 py-2.5">
                      <Clock className="size-4 text-blood shrink-0" />
                      <p className="text-sm font-medium text-paper flex-1 truncate">
                        {selectedService.name}
                        <span className="ml-2 font-normal text-paper-dim">
                          {formatDuration(selectedService.durationMinutes)}
                          {selectedService.price ? ` · ${selectedService.price.toFixed(0)} €` : ""}
                        </span>
                      </p>
                      {services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setStep("service")}
                          className="shrink-0 text-xs text-blood hover:underline"
                        >
                          Changer
                        </button>
                      )}
                    </div>
                  )}

                  {/* Week nav */}
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setWeekStart((w) => addDays(w, -7))}
                      disabled={weekStart <= todayIso()}
                      className="rounded-full border border-ash p-1.5 hover:bg-smoke disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="size-4 text-paper" />
                    </button>
                    <span className="text-sm font-medium text-paper">
                      {formatWeekRange(weekStart)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setWeekStart((w) => addDays(w, 7))}
                      className="rounded-full border border-ash p-1.5 hover:bg-smoke transition-colors"
                    >
                      <ChevronRight className="size-4 text-paper" />
                    </button>
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <Loader2 className="size-6 animate-spin text-blood" />
                      <p className="text-xs text-paper-mute">Chargement des créneaux…</p>
                    </div>
                  ) : totalSlots === 0 ? (
                    <div className="flex flex-col items-center py-12 gap-4 text-center">
                      <div className="flex size-14 items-center justify-center rounded-full bg-ash/60 text-2xl">
                        📅
                      </div>
                      <div>
                        <p className="font-medium text-paper">Aucun créneau cette semaine</p>
                        <p className="mt-1 text-sm text-paper-dim">
                          Le prestataire n&apos;a pas de disponibilité sur cette période.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setWeekStart((w) => addDays(w, 7))}
                        className="inline-flex items-center gap-1.5 rounded-full bg-blood px-5 py-2 text-sm font-medium text-white hover:bg-blood-deep transition-colors"
                      >
                        Voir la semaine suivante <ChevronRight className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-7 gap-1">
                      {days.map((day) => {
                        const { day: dayName, date, month } = parseDayLabel(day.date);
                        return (
                          <div key={day.date} className="flex flex-col items-center gap-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-paper-mute">
                              {dayName}
                            </p>
                            <p className="text-xs font-medium text-paper mb-1">
                              {date}
                              <span className="hidden sm:inline text-paper-mute"> {month}</span>
                            </p>
                            {day.slots.length === 0 ? (
                              <div className="h-8 w-full flex items-center justify-center">
                                <span className="text-[10px] text-paper-mute">—</span>
                              </div>
                            ) : (
                              day.slots.map((time) => (
                                <button
                                  key={time}
                                  type="button"
                                  onClick={() => handleSlotSelect(day.date, time)}
                                  className="w-full rounded-lg border border-ash bg-smoke py-1.5 text-[11px] font-mono text-paper hover:border-blood hover:bg-blood hover:text-white transition-colors"
                                >
                                  {time}
                                </button>
                              ))
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {!loading && totalSlots > 0 && hasMoreSlots && (
                    <p className="mt-4 text-center text-xs text-paper-mute">
                      D&apos;autres créneaux sont disponibles la semaine suivante.
                    </p>
                  )}
                </div>
              )}

              {/* ── STEP 3: Details ── */}
              {step === "details" && !submitted && (
                <form onSubmit={handleSubmit} className="grid gap-3">
                  {/* Booking summary or free-form date/time inputs */}
                  {selectedSlot ? (
                    <div className="rounded-2xl border border-blood/20 bg-blood/5 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blood/10 text-blood">
                          <CalendarCheck className="size-5" />
                        </div>
                        <div>
                          <p className="font-medium text-paper">
                            {formatDateLong(selectedSlot.date)} à {selectedSlot.time}
                          </p>
                          {selectedService ? (
                            <p className="mt-0.5 text-sm text-paper-dim">
                              {selectedService.name} · {formatDuration(selectedService.durationMinutes)}
                              {selectedService.price ? ` · ${selectedService.price.toFixed(0)} €` : ""}
                            </p>
                          ) : (
                            <p className="mt-0.5 text-sm text-paper-dim">Sans préférence de prestation</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-paper-dim">
                        Indique la date et l&apos;heure souhaitées. Le prestataire reviendra vers toi avec un devis personnalisé.
                      </p>
                      <div className="grid grid-cols-2 gap-2.5">
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-paper-mute">
                            Date *
                          </span>
                          <input
                            name="freeformDate"
                            type="date"
                            required
                            min={todayIso()}
                            defaultValue={addDays(todayIso(), 1)}
                            className="h-11 rounded-xl border border-ash bg-smoke px-3 text-sm text-paper outline-none focus:border-blood/50 focus:bg-white transition-colors"
                          />
                        </label>
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-paper-mute">
                            Heure *
                          </span>
                          <input
                            name="freeformTime"
                            type="time"
                            required
                            step={900}
                            defaultValue="20:00"
                            className="h-11 rounded-xl border border-ash bg-smoke px-3 text-sm text-paper outline-none focus:border-blood/50 focus:bg-white transition-colors"
                          />
                        </label>
                      </div>
                    </>
                  )}

                  <div className="grid gap-2.5">
                    <input
                      name="clientName"
                      required
                      placeholder="Ton nom *"
                      autoComplete="name"
                      className="h-11 rounded-xl border border-ash bg-smoke px-4 text-sm text-paper placeholder:text-paper-mute outline-none focus:border-blood/50 focus:bg-white transition-colors"
                    />
                    <input
                      name="clientPhone"
                      required
                      placeholder="Téléphone / WhatsApp *"
                      autoComplete="tel"
                      className="h-11 rounded-xl border border-ash bg-smoke px-4 text-sm text-paper placeholder:text-paper-mute outline-none focus:border-blood/50 focus:bg-white transition-colors"
                    />
                    <input
                      name="clientEmail"
                      type="email"
                      placeholder="Email (optionnel)"
                      autoComplete="email"
                      className="h-11 rounded-xl border border-ash bg-smoke px-4 text-sm text-paper placeholder:text-paper-mute outline-none focus:border-blood/50 focus:bg-white transition-colors"
                    />
                    <textarea
                      name="note"
                      rows={3}
                      placeholder="Message optionnel : précisions sur ta demande…"
                      className="rounded-xl border border-ash bg-smoke px-4 py-3 text-sm text-paper placeholder:text-paper-mute outline-none focus:border-blood/50 focus:bg-white transition-colors resize-none"
                    />
                  </div>

                  <p className="rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-paper-dim">
                    <strong className="text-warning">Acompte :</strong> Le prestataire peut demander un acompte ne dépassant pas 20 €. Le paiement se règle directement avec lui hors plateforme (PayPal, Paylib, virement…).
                  </p>

                  {formError && (
                    <p className="rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="h-12 rounded-full bg-blood text-sm font-medium text-white hover:bg-blood-deep disabled:opacity-50 transition-colors"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="size-4 animate-spin" /> Envoi…
                      </span>
                    ) : (
                      "Envoyer la demande de réservation"
                    )}
                  </button>
                </form>
              )}

              {/* ── Success ── */}
              {submitted && (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-success/15 text-4xl">
                    ✓
                  </div>
                  <div>
                    <p className="font-display text-2xl uppercase text-paper">Demande envoyée !</p>
                    <p className="mt-2 max-w-xs text-sm text-paper-dim">
                      {proName} recevra ta demande et pourra la confirmer depuis son espace Planning.
                    </p>
                  </div>
                  {selectedSlot && (
                    <div className="rounded-xl border border-success/30 bg-success/10 px-5 py-3 text-sm text-paper">
                      📅 {formatDateLong(selectedSlot.date)} à {selectedSlot.time}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-1 rounded-full border border-ash px-6 py-2.5 text-sm text-paper hover:bg-smoke transition-colors"
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
