import Link from "next/link";
import {
  ArrowLeft,
  KeyRound,
  Lock,
  Shield,
  Smartphone,
  TriangleAlert,
} from "lucide-react";

export default function SettingsSecurityPage() {
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

          <div className="rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-blue-300">
            Sécurité
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
              <Shield className="h-4 w-4" />
              Sécurité
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Protège ton compte et ton produit
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
              Gère l’accès, les connexions et les paramètres sensibles pour garder
              le contrôle de ton activité.
            </p>

            <div className="mt-10 space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Mot de passe</div>
                      <div className="text-sm text-white/45">
                        Mets à jour tes accès principaux
                      </div>
                    </div>
                  </div>

                  <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10">
                    Modifier
                  </button>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Authentification à deux facteurs</div>
                      <div className="text-sm text-white/45">
                        Ajoute une couche de protection supplémentaire
                      </div>
                    </div>
                  </div>

                  <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:scale-[1.01]">
                    Activer
                  </button>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <KeyRound className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Sessions actives</div>
                      <div className="text-sm text-white/45">
                        Vérifie les appareils connectés
                      </div>
                    </div>
                  </div>

                  <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10">
                    Voir
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/10 p-6 sm:p-8">
              <div className="flex items-center gap-3 text-amber-200">
                <TriangleAlert className="h-5 w-5" />
                <div className="font-semibold">Recommandation sécurité</div>
              </div>

              <p className="mt-4 text-sm leading-7 text-amber-100/80">
                Active l’authentification à deux facteurs avant de lancer ton produit
                en public ou de gérer des paiements en live.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="font-semibold">Bonnes pratiques</div>

              <div className="mt-6 space-y-3">
                {[
                  "Utiliser un mot de passe fort et unique",
                  "Vérifier les appareils connectés régulièrement",
                  "Activer une protection additionnelle",
                  "Éviter de partager les accès admin",
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
          </aside>
        </div>
      </div>
    </main>
  );
}