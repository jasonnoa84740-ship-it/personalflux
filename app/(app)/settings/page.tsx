import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Settings2,
  Shield,
  SlidersHorizontal,
  User,
  Wallet,
} from "lucide-react";

const settingCards = [
  {
    icon: User,
    title: "Profil",
    text: "Nom, image, informations du compte",
    href: "/account",
  },
  {
    icon: Wallet,
    title: "Abonnement",
    text: "Plan actuel, facturation et accès premium",
    href: "/billing",
  },
  {
    icon: Shield,
    title: "Sécurité",
    text: "Connexion, protection et accès au compte",
    href: "/account/security",
  },
  {
    icon: SlidersHorizontal,
    title: "Préférences",
    text: "Réglages généraux de la plateforme",
    href: "/settings/preferences",
  },
];

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
            <Settings2 className="h-4 w-4" />
            Paramètres
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            Gère ton espace
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            Accède à ton profil, ta sécurité, ton abonnement et tes préférences.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {settingCards.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-[1.5rem] border border-white/10 bg-black/40 p-5 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 transition group-hover:bg-white/15">
                      <Icon className="h-5 w-5" />
                    </div>

                    <ArrowRight className="h-5 w-5 text-white/35 transition group-hover:translate-x-1 group-hover:text-white/70" />
                  </div>

                  <h2 className="mt-5 text-2xl font-semibold text-white">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-white/60">
                    {item.text}
                  </p>

                  <div className="mt-5 text-sm font-medium text-white/75 transition group-hover:text-white">
                    Ouvrir
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}