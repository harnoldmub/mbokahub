import Link from "next/link";
import { ArrowRight, ExternalLink, Music } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";

type Track = {
  title: string;
  album: string;
  year: string;
  vibe: string;
  spotify: string;
  youtube: string;
  genius: string;
};

type Playlist = {
  slug: string;
  name: string;
  tagline: string;
  vibe: string;
  color: string;
  tracks: Track[];
};

const PLAYLISTS: Playlist[] = [
  {
    slug: "hits-stade",
    name: "Hits Stade",
    tagline: "Pour chauffer la voiture jusqu'à Saint-Denis",
    vibe: "Energy · sebene · BPM élevé",
    color: "from-blood/20",
    tracks: [
      {
        title: "Eloko Oyo",
        album: "Tokooos",
        year: "2017",
        vibe: "Le hit afro-pop qui ouvre les concerts depuis 2017",
        spotify: "https://open.spotify.com/search/Fally%20Ipupa%20Eloko%20Oyo",
        youtube: "https://www.youtube.com/results?search_query=Fally+Ipupa+Eloko+Oyo",
        genius: "https://genius.com/Fally-ipupa-eloko-oyo-lyrics",
      },
      {
        title: "Original",
        album: "Control",
        year: "2018",
        vibe: "Refrain mantra, gimmick instantanément reconnaissable",
        spotify: "https://open.spotify.com/search/Fally%20Ipupa%20Original",
        youtube: "https://www.youtube.com/results?search_query=Fally+Ipupa+Original",
        genius: "https://genius.com/Fally-ipupa-original-lyrics",
      },
      {
        title: "Mayday",
        album: "Formule 7",
        year: "2022",
        vibe: "Hymne CAN 2024 — chant d'union diaspora",
        spotify: "https://open.spotify.com/search/Fally%20Ipupa%20Mayday",
        youtube: "https://www.youtube.com/results?search_query=Fally+Ipupa+Mayday",
        genius: "https://genius.com/Fally-ipupa-mayday-lyrics",
      },
      {
        title: "Bloqué",
        album: "Control",
        year: "2018",
        vibe: "Refrain en boucle dans toute la diaspora francophone",
        spotify: "https://open.spotify.com/search/Fally%20Ipupa%20Bloque",
        youtube: "https://www.youtube.com/results?search_query=Fally+Ipupa+Bloque",
        genius: "https://genius.com/Fally-ipupa-bloque-lyrics",
      },
    ],
  },
  {
    slug: "rumba-classique",
    name: "Rumba Classique",
    tagline: "Les fondations — pour les puristes",
    vibe: "Soukous · sebene · guitares mi-solo",
    color: "from-gold/15",
    tracks: [
      {
        title: "Sexy Dance",
        album: "Arsenal de belles mélodies",
        year: "2009",
        vibe: "L'hymne panafricain de la fin des années 2000",
        spotify: "https://open.spotify.com/search/Fally%20Ipupa%20Sexy%20Dance",
        youtube: "https://www.youtube.com/results?search_query=Fally+Ipupa+Sexy+Dance",
        genius: "https://genius.com/Fally-ipupa-sexy-dance-annotated",
      },
      {
        title: "Associé",
        album: "Power Kosa Leka",
        year: "2013",
        vibe: "Sebene final qui dévaste tous les sound-systems",
        spotify: "https://open.spotify.com/search/Fally%20Ipupa%20Associe",
        youtube: "https://www.youtube.com/results?search_query=Fally+Ipupa+Associe",
        genius: "https://genius.com/Fally-ipupa-associe-lyrics",
      },
      {
        title: "Service",
        album: "Arsenal de belles mélodies",
        year: "2009",
        vibe: "Pour les vrais — ambiance veillée Bandal",
        spotify: "https://open.spotify.com/search/Fally%20Ipupa%20Service",
        youtube: "https://www.youtube.com/results?search_query=Fally+Ipupa+Service",
        genius: "https://genius.com/Fally-ipupa-service-lyrics",
      },
    ],
  },
  {
    slug: "love-vibes",
    name: "Love & Vibes",
    tagline: "Pour le retour de soirée à 4h du mat",
    vibe: "Slow · R&B · ballades",
    color: "from-rose-500/15",
    tracks: [
      {
        title: "Sweet Life (La vie est belle)",
        album: "Power Kosa Leka",
        year: "2013",
        vibe: "Le pont rumba/R&B international",
        spotify: "https://open.spotify.com/search/Fally%20Ipupa%20Sweet%20Life",
        youtube: "https://www.youtube.com/results?search_query=Fally+Ipupa+Sweet+Life",
        genius: "https://genius.com/Fally-ipupa-sweet-life-la-vie-est-belle-lyrics",
      },
      {
        title: "Bad Boy",
        album: "Control",
        year: "2018",
        vibe: "Crossover afro-pop francophone",
        spotify: "https://open.spotify.com/search/Fally%20Ipupa%20Bad%20Boy",
        youtube: "https://www.youtube.com/results?search_query=Fally+Ipupa+Bad+Boy",
        genius: "https://genius.com/Fally-ipupa-bad-boy-lyrics",
      },
      {
        title: "Likolo",
        album: "Formule 7",
        year: "2022",
        vibe: "Vibe afro moderne, signature Tokooos era",
        spotify: "https://open.spotify.com/search/Fally%20Ipupa%20Likolo",
        youtube: "https://www.youtube.com/results?search_query=Fally+Ipupa+Likolo",
        genius: "https://genius.com/Fally-ipupa-likolo-lyrics",
      },
    ],
  },
];

const SPOTIFY_PLAYLIST = "https://open.spotify.com/playlist/1gYERmVgRIly3kef2tvTIi";
const YOUTUBE_CHANNEL = "https://www.youtube.com/channel/UCBFYkrVI8OfHm9PzbAGFqlA";

export const metadata = {
  title: "Playlists Fally Ipupa — Les meilleurs sons & paroles | Mboka Hub",
  description:
    "3 playlists curated des hits de Fally Ipupa, avec liens directs vers Spotify, YouTube et Genius pour les paroles complètes.",
};

export default function PlaylistsPage() {
  return (
    <main className="relative min-h-screen bg-ink">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute right-[-5vw] top-[15vh] font-display text-[28vw] text-blood opacity-[0.03] select-none leading-none uppercase">
          PLAYLISTS
        </span>
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-32 space-y-12">
        <SectionHeading
          number="05"
          eyebrow="Playlists"
          title="*Hype* ta route vers le stade."
          description="Trois playlists curated avec liens directs vers Spotify, YouTube et Genius pour les paroles complètes."
        />

        <div className="flex flex-wrap gap-4">
          <Button asChild variant="outline" size="lg">
            <a href={SPOTIFY_PLAYLIST} target="_blank" rel="noopener noreferrer">
              Playlist Spotify de Fally <ExternalLink className="ml-2 size-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer">
              Chaîne YouTube officielle <ExternalLink className="ml-2 size-4" />
            </a>
          </Button>
        </div>

        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-5 text-sm text-yellow-200">
          ⚠️ Mboka Hub n'héberge ni les chansons ni les paroles. On te renvoie vers Spotify,
          YouTube et Genius — les sources officielles.
        </div>
      </section>

      {PLAYLISTS.map((playlist, idx) => (
        <section
          key={playlist.slug}
          id={playlist.slug}
          className="relative z-10 mx-auto max-w-7xl px-6 pb-16"
        >
          <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${playlist.color} via-coal to-coal p-8 sm:p-12 space-y-8`}>
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
                  Playlist 0{idx + 1}
                </p>
                <h2 className="mt-2 font-display text-3xl uppercase text-paper sm:text-5xl">
                  {playlist.name}
                </h2>
                <p className="mt-2 text-paper-dim">{playlist.tagline}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                  {playlist.vibe}
                </p>
              </div>
              <Music className="size-10 shrink-0 text-blood opacity-50" />
            </div>

            <div className="grid gap-4">
              {playlist.tracks.map((t, i) => (
                <div
                  key={t.title}
                  className="group rounded-2xl border border-white/5 bg-coal/60 p-6 transition-colors hover:border-blood/30"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="font-mono text-2xl text-blood/40 shrink-0 w-8">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-baseline gap-3">
                          <h3 className="font-display text-xl uppercase text-paper">
                            {t.title}
                          </h3>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                            {t.album} · {t.year}
                          </span>
                        </div>
                        <p className="text-xs text-paper-mute">{t.vibe}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0 lg:flex-nowrap">
                      <a
                        href={t.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-emerald-500/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald-300 transition-colors hover:bg-emerald-500/25"
                      >
                        Spotify
                      </a>
                      <a
                        href={t.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-red-500/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-red-300 transition-colors hover:bg-red-500/25"
                      >
                        YouTube
                      </a>
                      <a
                        href={t.genius}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-yellow-500/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-yellow-300 transition-colors hover:bg-yellow-500/25"
                      >
                        Paroles ↗
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-32">
        <div className="rounded-3xl border border-blood/30 bg-blood/5 p-10 text-center sm:p-16">
          <h2 className="font-display text-3xl uppercase text-paper sm:text-4xl">
            Prêt pour le 2 mai ?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-paper-dim">
            Maintenant que tu connais le répertoire — bookmark le quiz pour tester ton
            niveau et trouve un trajet.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="shadow-glow-blood">
              <Link href="/quiz">
                Lancer le quiz <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/trajets">Trouver un trajet</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
