import Link from "next/link";
import { ArrowLeft, Camera, Crown, Mail, PencilLine, User2 } from "lucide-react";

export default function SettingsProfilePage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux paramètres
          </Link>

          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
            Premium
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
              <User2 className="h-4 w-4" />
              Profil
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Gère ton identité publique
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
              Personnalise ton compte, ton image, ton nom affiché et les informations
              qui renforcent la crédibilité de ton produit.
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-[220px_1fr]">
              <div className="rounded-[1.75rem] border border-white/10 bg-black/40 p-5">
                <div className="flex h-40 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.03]">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                    <User2 className="h-8 w-8 text-white/70" />
                  </div>
                </div>

                <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white">
                  <Camera className="h-4 w-4" />
                  Changer l’image
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                  <label className="text-sm text-white/50">Nom affiché</label>
                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/90">
                    Jason
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                  <label className="text-sm text-white/50">Nom d’utilisateur</label>
                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/90">
                    @personaflux
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5 sm:col-span-2">
                  <label className="text-sm text-white/50">Email</label>
                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/90">
                    jason@example.com
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5 sm:col-span-2">
                  <label className="text-sm text-white/50">Bio / Positionnement</label>
                  <div className="mt-3 min-h-[140px] rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-white/70">
                    Décris ici ton identité, ton angle, ta proposition de valeur et la
                    manière dont ton produit doit être perçu.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.01]">
                <PencilLine className="h-4 w-4" />
                Enregistrer les modifications
              </button>

              <button className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/80 transition hover:bg-white/10">
                Annuler
              </button>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Image premium</div>
                  <div className="text-sm text-white/45">Perception et crédibilité</div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  "Photo propre et cohérente avec le produit",
                  "Nom affiché clair et mémorable",
                  "Bio orientée conversion et confiance",
                  "Positionnement aligné avec ton offre",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white/70"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Compte</div>
                  <div className="text-sm text-white/45">Informations principales</div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
                Les champs de cette page serviront ensuite à personnaliser le dashboard,
                la présence publique et certaines zones premium de ton produit.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}