import Link from "next/link";
import { ArrowLeft, Settings2, Shield, User, Wallet } from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
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
            Cette page servira à gérer ton profil, ton abonnement, ta sécurité et
            les préférences de ton compte.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: User,
                title: "Profil",
                text: "Nom, image, informations du compte",
              },
              {
                icon: Wallet,
                title: "Abonnement",
                text: "Plan actuel, facturation et accès premium",
              },
              {
                icon: Shield,
                title: "Sécurité",
                text: "Connexion, protection et accès au compte",
              },
              {
                icon: Settings2,
                title: "Préférences",
                text: "Réglages généraux de la plateforme",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-white/60">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}