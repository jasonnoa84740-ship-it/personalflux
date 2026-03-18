import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Globe,
  Palette,
  Settings2,
  Sparkles,
} from "lucide-react";

export default function SettingsPreferencesPage() {
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

          <div className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-fuchsia-300">
            Préférences
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
              <Settings2 className="h-4 w-4" />
              Préférences
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Personnalise ton expérience
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
              Ajuste l’interface, les notifications et les préférences produit pour
              garder un espace de travail premium et efficace.
            </p>

            <div className="mt-10 space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Notifications</div>
                      <div className="text-sm text-white/45">
                        Choisis les alertes importantes
                      </div>
                    </div>
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
                    Activées
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Langue et région</div>
                      <div className="text-sm text-white/45">
                        Définis le contexte principal de ton espace
                      </div>
                    </div>
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
                    Français
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Palette className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Apparence</div>
                      <div className="text-sm text-white/45">
                        Interface premium noire et contrastée
                      </div>
                    </div>
                  </div>

                  <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
                    Dark
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.01]">
                <Sparkles className="h-4 w-4" />
                Sauvegarder les préférences
              </button>

              <button className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/80 transition hover:bg-white/10">
                Réinitialiser
              </button>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="font-semibold">Expérience premium</div>

              <div className="mt-6 space-y-3">
                {[
                  "Interface noire cohérente avec le branding",
                  "Réglages pensés pour le travail quotidien",
                  "Préférences prêtes à être branchées au backend",
                  "Base solide pour un vrai produit live",
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
              <div className="font-semibold">À connecter ensuite</div>

              <p className="mt-4 text-sm leading-7 text-white/60">
                Cette page est déjà designée comme une vraie interface premium.
                On pourra ensuite brancher les vraies préférences utilisateur en base.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}