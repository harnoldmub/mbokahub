import {
  createEventAdmin,
  deleteEventAdmin,
  setEventPublication,
} from "@/lib/actions/admin";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const eventRows = await prisma.event
    .findMany({ orderBy: [{ startDate: "asc" }, { createdAt: "desc" }] })
    .catch(() => []);
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Événements</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajoute uniquement des événements confirmés par une source officielle.
          La publication reste manuelle.
        </p>
      </div>
      <form
        action={createEventAdmin}
        className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AdminInput
          label="Titre *"
          name="title"
          placeholder="Fally Ipupa à Londres"
        />
        <AdminInput label="Artiste *" name="artist" placeholder="Fally Ipupa" />
        <AdminInput
          label="Slug"
          name="slug"
          placeholder="généré automatiquement"
        />
        <AdminInput label="Ville *" name="city" placeholder="Londres" />
        <AdminInput label="Pays" name="country" placeholder="Royaume-Uni" />
        <AdminInput label="Salle *" name="venue" placeholder="The O2" />
        <AdminInput label="Début *" name="startDate" type="datetime-local" />
        <AdminInput label="Catégorie" name="category" placeholder="Concert" />
        <AdminInput
          label="Genres (virgules)"
          name="genres"
          placeholder="Rumba, Afro R&B"
        />
        <AdminInput
          label="Image *"
          name="image"
          placeholder="/images/events/...webp"
        />
        <AdminInput
          label="Billetterie officielle *"
          name="officialTicketUrl"
          placeholder="https://..."
        />
        <AdminInput
          label="Source officielle *"
          name="sourceUrl"
          placeholder="https://..."
        />
        <label className="grid gap-1 text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
          Description
          <textarea
            className="min-h-24 rounded-xl border border-white/10 bg-background px-3 py-2 text-foreground"
            name="description"
          />
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm text-foreground">
          <input name="featured" type="checkbox" /> Mettre à la une
        </label>
        <button
          className="min-h-11 rounded-xl bg-red-600 px-5 font-semibold text-white hover:bg-red-700"
          type="submit"
        >
          Créer le brouillon
        </button>
      </form>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-white/5 text-muted-foreground">
            <tr>
              <th className="p-4">Événement</th>
              <th className="p-4">Date</th>
              <th className="p-4">Ville</th>
              <th className="p-4">Statut</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {eventRows.map((event) => (
              <tr className="border-t border-white/10" key={event.id}>
                <td className="p-4">
                  <strong className="text-foreground">{event.artist}</strong>
                  <p className="text-muted-foreground">{event.venue}</p>
                </td>
                <td className="p-4 text-foreground">
                  {new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "medium",
                  }).format(event.startDate)}
                </td>
                <td className="p-4 text-foreground">{event.city}</td>
                <td className="p-4 text-muted-foreground">
                  {event.published ? "Publié" : "Brouillon"}
                </td>
                <td className="flex gap-2 p-4">
                  <form
                    action={setEventPublication.bind(
                      null,
                      event.id,
                      !event.published,
                    )}
                  >
                    <button
                      className="min-h-10 rounded-lg border border-white/15 px-3 text-foreground"
                      type="submit"
                    >
                      {event.published ? "Dépublier" : "Publier"}
                    </button>
                  </form>
                  <form action={deleteEventAdmin.bind(null, event.id)}>
                    <button
                      className="min-h-10 rounded-lg border border-red-500/30 px-3 text-red-500"
                      type="submit"
                    >
                      Supprimer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {eventRows.length === 0 ? (
          <p className="p-6 text-muted-foreground">
            Aucun événement géré en base pour le moment.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function AdminInput({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-1 text-sm text-muted-foreground">
      {label}
      <input
        className="h-11 rounded-xl border border-white/10 bg-background px-3 text-foreground"
        name={name}
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}
