#!/usr/bin/env node
/**
 * Seed test data: 1 ProProfile per ProCategory, with services, team
 * members, and working hours. Idempotent — re-running updates the same
 * pros (matched on slug `test-<category-slug>`).
 *
 * Usage: node scripts/seed-test-pros.mjs
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  { id: "MAQUILLEUSE",         label: "Studio Make-up Kinshasa",   icon: "💄", city: "Saint-Denis",         services: [["Make-up soirée", 60, 7000], ["Make-up mariée", 120, 18000]] },
  { id: "ESTHETICIENNE",       label: "Glow by Naomie",            icon: "🧖", city: "Aulnay-sous-Bois",    services: [["Soin visage hydratant", 60, 6500], ["Épilation jambes complètes", 45, 4500]] },
  { id: "PROTHESISTE_ONGLES",  label: "Nail Bar Liputa",           icon: "💅", city: "Paris 18ᵉ",          services: [["Pose américaine", 75, 5500], ["Manucure semi-permanente", 45, 3500]] },
  { id: "TECHNICIENNE_CILS",   label: "Cils & Chill",              icon: "👁️", city: "Saint-Ouen",         services: [["Extension volume russe", 120, 8500], ["Rehaussement de cils", 60, 4500]] },
  { id: "COIFFEUR",            label: "Lokoss Hair Studio",        icon: "✂️", city: "Saint-Denis",         services: [["Tresses braids", 240, 9000], ["Brushing wig", 90, 6500], ["Pose de lace front", 180, 12000]] },
  { id: "BARBIER",             label: "Bantu Barber Shop",         icon: "🪒", city: "Paris 19ᵉ",           services: [["Coupe + barbe", 45, 3500], ["Dégradé US", 30, 2500]] },
  { id: "PHOTOGRAPHE",         label: "Eyes of Mboka",             icon: "📸", city: "Saint-Denis",         services: [["Shooting solo 1h", 60, 12000], ["Couverture event 3h", 180, 35000]] },
  { id: "VIDEASTE",            label: "Sape Productions",          icon: "🎥", city: "Paris 20ᵉ",           services: [["Aftermovie soirée", 240, 45000]] },
  { id: "CREATEUR_CONTENU",    label: "Reels by Princess",         icon: "🎬", city: "Bobigny",             services: [["Pack 5 reels", 0, 25000]] },
  { id: "VENDEUR_MERCH",       label: "Mboka Merch Stand",         icon: "👕", city: "Saint-Denis",         services: [] },
  { id: "ORGANISATEUR_AFTER",  label: "Pop-up Lokoss After",       icon: "🍾", city: "Paris 18ᵉ",           services: [["Réservation table VIP", 0, 25000]] },
  { id: "SECURITE",            label: "Mboka Security",            icon: "🛡️", city: "Saint-Denis",         services: [["Agent SSIAP nuit", 480, 22000]] },
  { id: "CHAUFFEUR_VTC",       label: "VTC Express Stade",         icon: "🚖", city: "Aulnay-sous-Bois",    services: [["Aller Stade depuis Paris", 60, 4500], ["Soirée privée 4h", 240, 18000]] },
  { id: "DJ",                  label: "DJ Sango Vibes",            icon: "🎧", city: "Paris 18ᵉ",           services: [["Set 4h after-party", 240, 35000]] },
  { id: "ANIMATEUR",           label: "Animateur Kongo Crew",      icon: "🎤", city: "Saint-Denis",         services: [["MC soirée privée 3h", 180, 25000]] },
  { id: "CUISINIER",           label: "Maman Lokoss Kitchen",      icon: "👩‍🍳", city: "Bobigny",            services: [["Repas pour 10 (poulet moambé)", 0, 12000]] },
  { id: "TRAITEUR",            label: "Saveurs du 242",            icon: "🍲", city: "Saint-Denis",         services: [["Buffet 30 personnes", 0, 65000]] },
  { id: "DECORATEUR",          label: "Lokoss Déco Events",        icon: "🎀", city: "Paris 19ᵉ",           services: [["Décoration anniversaire VIP", 240, 35000]] },
  { id: "COUTURIER",           label: "Atelier Lipopo",            icon: "🪡", city: "Paris 18ᵉ",           services: [["Sur-mesure liputa", 0, 18000]] },
  { id: "BIJOUTIER",           label: "Or de Mboka",               icon: "💎", city: "Paris 9ᵉ",            services: [["Création bracelet personnalisé", 0, 12000]] },
  { id: "BABYSITTER",          label: "Mama Sitter Stade",         icon: "🍼", city: "Saint-Denis",         services: [] },
  { id: "AUTRE",               label: "Service à la carte",        icon: "✨", city: "Saint-Denis",         services: [["Mission personnalisée", 60, 5000]] },
];

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const COUNTRY = "France";
const PHOTO_POOL = [
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
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

  const pro = await prisma.proProfile.upsert({
    where: { userId: user.id },
    update: {
      category: cat.id,
      displayName: cat.label,
      slug,
      city: cat.city,
      country: COUNTRY,
      whatsapp: `+3360000${String(idx).padStart(4, "0")}`,
      bio: `Compte de démo automatique — ${cat.label} (${cat.icon}). Données générées pour tester l'app.`,
      specialities: ["Démo", "Test"],
      photos: PHOTO_POOL.slice(0, 2 + (idx % 2)),
      priceRange: cat.services.length ? `dès ${(cat.services[0][2] / 100).toFixed(0)} €` : "sur devis",
      rating: 4 + (idx % 10) / 10,
      reviewsCount: 5 + idx,
      isPremium, premiumUntil: isPremium ? until : null,
      isBoosted, boostUntil: isBoosted ? until : null,
      isVerified, verifiedAt: isVerified ? new Date() : null,
    },
    create: {
      userId: user.id,
      category: cat.id,
      displayName: cat.label,
      slug,
      city: cat.city,
      country: COUNTRY,
      whatsapp: `+3360000${String(idx).padStart(4, "0")}`,
      bio: `Compte de démo automatique — ${cat.label} (${cat.icon}). Données générées pour tester l'app.`,
      specialities: ["Démo", "Test"],
      photos: PHOTO_POOL.slice(0, 2 + (idx % 2)),
      priceRange: cat.services.length ? `dès ${(cat.services[0][2] / 100).toFixed(0)} €` : "sur devis",
      rating: 4 + (idx % 10) / 10,
      reviewsCount: 5 + idx,
      isPremium, premiumUntil: isPremium ? until : null,
      isBoosted, boostUntil: isBoosted ? until : null,
      isVerified, verifiedAt: isVerified ? new Date() : null,
    },
  });

  // Wipe & re-create services + team for idempotence on this pro
  await prisma.service.deleteMany({ where: { proProfileId: pro.id } });
  await prisma.teamMember.deleteMany({ where: { proProfileId: pro.id } });

  for (let i = 0; i < cat.services.length; i++) {
    const [name, dur, priceCents] = cat.services[i];
    await prisma.service.create({
      data: {
        proProfileId: pro.id,
        name,
        durationMin: dur > 0 ? dur : 60,
        priceCents,
        isOnlineBookable: dur > 0,
        position: i,
      },
    });
  }

  // Add a team member with Mon–Sat 9h–19h working hours for bookable pros
  if (cat.services.some((s) => s[1] > 0)) {
    const member = await prisma.teamMember.create({
      data: {
        proProfileId: pro.id,
        displayName: idx % 2 === 0 ? "Naomie" : "Princess",
        position: 0,
      },
    });
    // Link all online-bookable services to this member
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

  return { slug, isPremium, isBoosted, isVerified, services: cat.services.length };
}

async function main() {
  console.log(`Seeding ${CATEGORIES.length} test pros…`);
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    const r = await seedOne(c, i);
    const tags = [
      r.isPremium && "premium",
      r.isBoosted && "boost",
      r.isVerified && "verifié",
    ].filter(Boolean).join(",") || "free";
    console.log(`  ✓ ${c.icon} ${c.id.padEnd(20)} /pro/${r.slug}  [${tags}] · ${r.services} prestation(s)`);
  }
  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
