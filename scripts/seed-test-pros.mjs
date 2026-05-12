#!/usr/bin/env node
/**
 * Seed test data for Nevent.
 *
 * - 1 ProProfile per ProCategory (slug `test-<cat>`), with bio, photos,
 *   ratings, and a coherent business model:
 *     • SLOT_BOOKABLE categories (beauty) get Service[] (online-bookable),
 *       a TeamMember with profile photo, working hours Mon–Sat 9h–19h.
 *     • QUOTE_ONLY categories (DJ, MC, traiteur, VTC, sécurité…) get
 *       Service[] with isOnlineBookable=false (free-form contact form),
 *       no team. The slot-booking flow falls back to the WhatsApp/note form.
 *     • CONTACT_ONLY categories (Vendeur merch, Babysitter) get nothing.
 * - A handful of ProBookings and Trajets attached to arnold@mubuanga.com
 *   so an existing user can see end-to-end data ("Mes RDV", trajets…).
 *
 * Idempotent — re-running updates the same rows.
 *
 * Usage: node scripts/seed-test-pros.mjs
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mode of operation per category:
//   slot   = online slot booking (team + working hours required)
//   quote  = client sends a request via the free-form date/time form
//   none   = direct contact only (WhatsApp, no booking flow at all)
const CATEGORIES = [
  { id: "MAQUILLEUSE",        mode: "slot",  label: "Studio Make-up Kinshasa", icon: "💄", city: "Saint-Denis",      services: [["Make-up soirée", 60, 7000], ["Make-up mariée", 120, 18000]],     teamName: "Naomie",  teamPhoto: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400" },
  { id: "ESTHETICIENNE",      mode: "slot",  label: "Glow by Naomie",          icon: "🧖", city: "Aulnay-sous-Bois", services: [["Soin visage hydratant", 60, 6500], ["Épilation jambes", 45, 4500]], teamName: "Sandra",  teamPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400" },
  { id: "PROTHESISTE_ONGLES", mode: "slot",  label: "Nail Bar Liputa",         icon: "💅", city: "Paris 18ᵉ",        services: [["Pose américaine", 75, 5500], ["Manucure semi-permanente", 45, 3500]], teamName: "Grâce",   teamPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400" },
  { id: "TECHNICIENNE_CILS",  mode: "slot",  label: "Cils & Chill",            icon: "👁️", city: "Saint-Ouen",       services: [["Volume russe", 120, 8500], ["Rehaussement de cils", 60, 4500]],   teamName: "Princess",teamPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" },
  { id: "COIFFEUR",           mode: "slot",  label: "Lokoss Hair Studio",      icon: "✂️", city: "Saint-Denis",      services: [["Tresses braids", 240, 9000], ["Brushing wig", 90, 6500], ["Lace front", 180, 12000]], teamName: "Diane",   teamPhoto: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400" },
  { id: "BARBIER",            mode: "slot",  label: "Bantu Barber Shop",       icon: "🪒", city: "Paris 19ᵉ",        services: [["Coupe + barbe", 45, 3500], ["Dégradé US", 30, 2500]],                teamName: "Joël",    teamPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },

  { id: "PHOTOGRAPHE",        mode: "quote", label: "Eyes of Mboka",           icon: "📸", city: "Saint-Denis",      services: [["Shooting solo 1h", 60, 12000], ["Couverture event 3h", 180, 35000]] },
  { id: "VIDEASTE",           mode: "quote", label: "Sape Productions",        icon: "🎥", city: "Paris 20ᵉ",        services: [["Aftermovie soirée", 240, 45000]] },
  { id: "CREATEUR_CONTENU",   mode: "quote", label: "Reels by Princess",       icon: "🎬", city: "Bobigny",          services: [["Pack 5 reels", 0, 25000]] },
  { id: "ORGANISATEUR_AFTER", mode: "quote", label: "Pop-up Lokoss After",     icon: "🍾", city: "Paris 18ᵉ",        services: [["Réservation table VIP", 0, 25000]] },
  { id: "SECURITE",           mode: "quote", label: "Mboka Security",          icon: "🛡️", city: "Saint-Denis",      services: [["Agent SSIAP nuit", 480, 22000]] },
  { id: "CHAUFFEUR_VTC",      mode: "quote", label: "VTC Express Stade",       icon: "🚖", city: "Aulnay-sous-Bois", services: [["Aller Stade depuis Paris", 60, 4500], ["Soirée privée 4h", 240, 18000]] },
  { id: "DJ",                 mode: "quote", label: "DJ Sango Vibes",          icon: "🎧", city: "Paris 18ᵉ",        services: [["Set 4h after-party", 240, 35000]] },
  { id: "ANIMATEUR",          mode: "quote", label: "Animateur Kongo Crew",    icon: "🎤", city: "Saint-Denis",      services: [["MC soirée privée 3h", 180, 25000]] },
  { id: "CUISINIER",          mode: "quote", label: "Maman Lokoss Kitchen",    icon: "👩‍🍳", city: "Bobigny",         services: [["Repas 10 pers (poulet moambé)", 0, 12000]] },
  { id: "TRAITEUR",           mode: "quote", label: "Saveurs du 242",          icon: "🍲", city: "Saint-Denis",      services: [["Buffet 30 personnes", 0, 65000]] },
  { id: "DECORATEUR",         mode: "quote", label: "Lokoss Déco Events",      icon: "🎀", city: "Paris 19ᵉ",        services: [["Décoration anniv VIP", 240, 35000]] },
  { id: "COUTURIER",          mode: "quote", label: "Atelier Lipopo",          icon: "🪡", city: "Paris 18ᵉ",        services: [["Sur-mesure liputa", 0, 18000]] },
  { id: "BIJOUTIER",          mode: "quote", label: "Or de Mboka",             icon: "💎", city: "Paris 9ᵉ",         services: [["Bracelet personnalisé", 0, 12000]] },

  { id: "VENDEUR_MERCH",      mode: "none",  label: "Mboka Merch Stand",       icon: "👕", city: "Saint-Denis",      services: [] },
  { id: "BABYSITTER",         mode: "none",  label: "Mama Sitter Stade",       icon: "🍼", city: "Saint-Denis",      services: [] },

  { id: "AUTRE",              mode: "quote", label: "Service à la carte",      icon: "✨", city: "Saint-Denis",      services: [["Mission personnalisée", 60, 5000]] },
];

function slugify(s) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const COUNTRY = "France";
const COVER_POOL = [
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200",
];

async function ensureUser(category, label) {
  const email = `test-${slugify(category)}@nevent.test`;
  const clerkId = `test_clerk_${slugify(category)}`;
  return prisma.user.upsert({
    where: { email },
    update: { name: label },
    create: { email, clerkId, name: label, role: "PRO" },
  });
}

async function seedOne(cat, idx) {
  const user = await ensureUser(cat.id, cat.label);
  const slug = `test-${slugify(cat.id)}`;
  const isPremium = idx % 3 === 0;
  const isBoosted = idx % 4 === 0;
  const isVerified = idx % 2 === 0;
  const until = new Date("2026-05-31T23:59:59Z");

  const baseData = {
    category: cat.id,
    displayName: cat.label,
    slug,
    city: cat.city,
    country: COUNTRY,
    whatsapp: `+3360000${String(idx).padStart(4, "0")}`,
    bio: `Compte de démo automatique — ${cat.label} (${cat.icon}). ${cat.mode === "slot" ? "Réservation en ligne possible via le calendrier." : cat.mode === "quote" ? "Demande de devis via le formulaire de contact." : "Contact direct WhatsApp."}`,
    specialities: ["Démo", "Test"],
    photos: [COVER_POOL[idx % COVER_POOL.length], COVER_POOL[(idx + 1) % COVER_POOL.length]],
    priceRange: cat.services.length ? `dès ${(cat.services[0][2] / 100).toFixed(0)} €` : "sur devis",
    rating: 4 + (idx % 10) / 10,
    reviewsCount: 5 + idx,
    isPremium, premiumUntil: isPremium ? until : null,
    isBoosted, boostUntil: isBoosted ? until : null,
    isVerified, verifiedAt: isVerified ? new Date() : null,
  };

  const pro = await prisma.proProfile.upsert({
    where: { userId: user.id },
    update: baseData,
    create: { userId: user.id, ...baseData },
  });

  // Wipe & re-create services + team for idempotence on this pro
  await prisma.service.deleteMany({ where: { proProfileId: pro.id } });
  await prisma.teamMember.deleteMany({ where: { proProfileId: pro.id } });

  const isBookable = cat.mode === "slot";

  for (let i = 0; i < cat.services.length; i++) {
    const [name, dur, priceCents] = cat.services[i];
    await prisma.service.create({
      data: {
        proProfileId: pro.id,
        name,
        durationMin: dur > 0 ? dur : 60,
        priceCents,
        isOnlineBookable: isBookable && dur > 0,
        position: i,
      },
    });
  }

  if (isBookable) {
    const member = await prisma.teamMember.create({
      data: {
        proProfileId: pro.id,
        displayName: cat.teamName ?? "Membre",
        photoUrl: cat.teamPhoto ?? null,
        position: 0,
      },
    });
    const services = await prisma.service.findMany({
      where: { proProfileId: pro.id, isOnlineBookable: true },
      select: { id: true },
    });
    for (const s of services) {
      await prisma.serviceMember.create({
        data: { serviceId: s.id, teamMemberId: member.id },
      });
    }
    for (let dow = 1; dow <= 6; dow++) {
      await prisma.workingHours.create({
        data: {
          teamMemberId: member.id,
          dayOfWeek: dow,
          openMinute: 9 * 60,
          closeMinute: 19 * 60,
        },
      });
    }
  }

  return { pro, isBookable };
}

async function seedArnoldBookings(seeded) {
  const arnold = await prisma.user.findUnique({ where: { email: "arnold@mubuanga.com" } });
  if (!arnold) {
    console.log("  · arnold@mubuanga.com introuvable, skip bookings/trajets");
    return;
  }

  // Wipe arnold's previous SEED data only (matched on the [seed] marker
  // in `note`). Real bookings/trajets are left untouched.
  await prisma.proBooking.deleteMany({
    where: { clientEmail: arnold.email, note: { contains: "[seed]" } },
  });
  await prisma.trajet.deleteMany({
    where: { userId: arnold.id, note: { contains: "[seed]" } },
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);
  dayAfter.setHours(14, 30, 0, 0);

  // Find 2 bookable pros (with a service + team member) for arnold's RDV
  const bookable = seeded.filter((s) => s.isBookable).slice(0, 2);
  for (let i = 0; i < bookable.length; i++) {
    const { pro } = bookable[i];
    const service = await prisma.service.findFirst({
      where: { proProfileId: pro.id, isOnlineBookable: true },
      orderBy: { position: "asc" },
    });
    const member = await prisma.teamMember.findFirst({
      where: { proProfileId: pro.id },
    });
    if (!service || !member) continue;
    await prisma.proBooking.create({
      data: {
        proProfileId: pro.id,
        serviceId: service.id,
        teamMemberId: member.id,
        durationMin: service.durationMin,
        clientName: arnold.name ?? "Arnold M.",
        clientEmail: arnold.email,
        clientPhone: "+33611223344",
        requestedAt: i === 0 ? tomorrow : dayAfter,
        note: i === 0
          ? "[seed] RDV avant le concert 🎤"
          : "[seed] Préparation Stade de France",
        status: i === 0 ? "PENDING" : "CONFIRMED",
      },
    });
  }

  // Trajets — Bruxelles → Paris (Stade de France)
  const concertEve = new Date("2026-05-29T18:00:00.000Z");
  const concertReturn = new Date("2026-06-01T08:00:00.000Z");
  await prisma.trajet.createMany({
    data: [
      {
        userId: arnold.id,
        villeDepart: "Bruxelles", paysDepart: "Belgique",
        villeArrivee: "Paris", date: concertEve, heureDepart: "18:00",
        placesDispo: 3, placesTotal: 4, prix: 35,
        vehicule: "Berline", vehiculeModel: "Peugeot 508", vehiculeColor: "Noir",
        whatsapp: "+32470000000",
        note: "[seed] Aller Bruxelles → Paris pour le concert Fally 🎶",
        isBoosted: true, boostUntil: new Date("2026-05-31T23:59:59Z"),
        isApproved: true, approvedAt: new Date(),
      },
      {
        userId: arnold.id,
        villeDepart: "Lyon", paysDepart: "France",
        villeArrivee: "Paris", date: concertEve, heureDepart: "14:00",
        placesDispo: 2, placesTotal: 4, prix: 45,
        vehicule: "SUV", vehiculeModel: "Renault Kadjar", vehiculeColor: "Gris",
        whatsapp: "+33612345678",
        note: "[seed] Aller Lyon → Paris vendredi avant le concert.",
        isApproved: true, approvedAt: new Date(),
      },
      {
        userId: arnold.id,
        villeDepart: "Paris", paysDepart: "France",
        villeArrivee: "Bruxelles", date: concertReturn, heureDepart: "08:00",
        placesDispo: 4, placesTotal: 4, prix: 30,
        vehicule: "Berline", vehiculeModel: "Peugeot 508", vehiculeColor: "Noir",
        whatsapp: "+32470000000",
        note: "[seed] Retour Paris → Bruxelles le lundi matin.",
        isApproved: true, approvedAt: new Date(),
      },
    ],
  });

  console.log(`  · ${bookable.length} RDV + 3 trajets créés pour ${arnold.email}`);
}

async function main() {
  console.log(`Seeding ${CATEGORIES.length} test pros…`);
  const seeded = [];
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    const r = await seedOne(c, i);
    seeded.push(r);
    const tag = c.mode === "slot" ? "slot+team" : c.mode === "quote" ? "devis" : "contact";
    console.log(`  ✓ ${c.icon} ${c.id.padEnd(20)} /pro/test-${slugify(c.id).padEnd(22)} [${tag}]`);
  }
  console.log("Seeding arnold's bookings + trajets…");
  await seedArnoldBookings(seeded);
  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
