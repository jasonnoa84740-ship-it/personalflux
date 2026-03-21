import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Crown,
  MessageSquare,
  Plus,
  Settings2,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { db } from "@/lib/db";
import { getUserSubscription } from "@/lib/subscriptions";

function formatDate(date: Date | null | undefined) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatPlan(plan: string | null | undefined) {
  return plan || "FREE";
}

function formatStatus(status: string | null | undefined) {
  switch (status) {
    case "ACTIVE":
      return "Actif";
    case "TRIALING":
      return "Essai";
    case "PAST_DUE":
      return "Paiement en retard";
    case "CANCELED":
      return "Annulé";
    default:
      return "Inactif";
  }
}

function getStatusBadgeClass(status: string | null | undefined) {
  switch (status) {
    case "ACTIVE":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "TRIALING":
      return "border-blue-400/20 bg-blue-400/10 text-blue-300";
    case "PAST_DUE":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    case "CANCELED":
      return "border-red-400/20 bg-red-400/10 text-red-300";
    default:
      return "border-white/10 bg-white/5 text-white/65";
  }
}

export default async function DashboardPage() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    redirect("/login");
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/login");
  }

  const primaryEmail =
    clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    )?.emailAddress || null;

  const username =
    clerkUser.username ||
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    "Utilisateur";

  const appUser = await db.user.upsert({
    where: { clerkUserId },
    update: {
      email: primaryEmail,
      username,
      imageUrl: clerkUser.imageUrl,
    },
    create: {
      clerkUserId,
      email: primaryEmail,
      username,
      imageUrl: clerkUser.imageUrl,
    },
  });

  const clones = await db.clone.findMany({
    where: { userId: appUser.id },
    orderBy: { createdAt: "desc" },
  });

  const subscription = await getUserSubscription(appUser.id);

  const currentPlan = formatPlan(subscription?.plan);
  const currentStatus = formatStatus(subscription?.status);
  const cloneCount = clones.length;

  const isPremium =
    !!subscription &&
    ["ACTIVE", "TRIALING"].includes(subscription.status) &&
    ["STARTER", "PRO", "SCALE"].includes(subscription.plan);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[8%] top-[18rem] h-[18rem] w-[18rem] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute right-[8%] top-[10rem] h-[24rem] w-[24rem] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-1/2 top-[-10rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      </div>

      <header className="border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <div className="text-sm font-semibold tracking-wide">Dashboard</div>
            <div className="text-xs text-white/45">
              Gère tes clones, ton abonnement et ton activité
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              Retour au site
            </Link>

            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:scale-[1.02]"
            >
              Nouveau clone
              <Plus className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="px-6 pb-10 pt-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
                <Sparkles className="h-4 w-4" />
                Vue d’ensemble
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Ton espace de pilotage premium
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                Retrouve tes clones, ton plan actif, ton statut premium et les
                prochaines étapes pour faire grandir ton produit.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/billing"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                Gérer l’abonnement
              </Link>

              <Link
                href="/examples"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                Voir les exemples
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Bot className="h-5 w-5" />
              </div>
              <div className="mt-5 text-3xl font-semibold">{cloneCount}</div>
              <div className="mt-2 text-sm text-white/50">Clones créés</div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Crown className="h-5 w-5" />
              </div>
              <div className="mt-5 text-3xl font-semibold">{currentPlan}</div>
              <div className="mt-2 text-sm text-white/50">Plan actuel</div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Wallet className="h-5 w-5" />
              </div>
              <div className="mt-5 text-3xl font-semibold">
                {isPremium ? "Oui" : "Non"}
              </div>
              <div className="mt-2 text-sm text-white/50">Accès premium</div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="mt-5 text-3xl font-semibold">0</div>
              <div className="mt-2 text-sm text-white/50">
                Conversations ce mois
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white/45">Tes clones</div>
                <h2 className="mt-1 text-2xl font-semibold">
                  Produits actifs et brouillons
                </h2>
              </div>

              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                Ajouter
                <Plus className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 space-y-4">
              {clones.length === 0 ? (
                <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-6 text-white/60">
                  Aucun clone pour le moment. Crée ton premier clone pour commencer.
                </div>
              ) : (
                clones.map((clone: { id: string }) => (
                  <div
                    key={clone.id}
                    className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="text-xl font-semibold">{clone.name}</div>
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
                            {clone.status}
                          </span>
                        </div>

                        <div className="mt-2 text-sm text-white/45">
                          {clone.category || "Sans catégorie"}
                        </div>

                        {clone.shortDescription && (
                          <div className="mt-2 text-sm text-white/55">
                            {clone.shortDescription}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm text-white/60">
                        <div>{clone.visibility}</div>
                        <div>{clone.responseStyle || "Style non défini"}</div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={`/chat/${clone.id}`}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
                      >
                        Ouvrir
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/create?cloneId=${clone.id}`}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75"
                      >
                        Modifier
                      </Link>

                      <Link
                        href={`/chat/${clone.id}`}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75"
                      >
                        Tester
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Abonnement</div>
                  <div className="text-sm text-white/45">
                    État réel depuis la base
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-black/50 p-5">
                  <div className="text-sm text-white/45">Plan</div>
                  <div className="mt-2 text-3xl font-semibold">{currentPlan}</div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/50 p-5">
                  <div className="text-sm text-white/45">Statut</div>
                  <div className="mt-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-sm ${getStatusBadgeClass(
                        subscription?.status
                      )}`}
                    >
                      {currentStatus}
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/50 p-5">
                  <div className="text-sm text-white/45">Fin de période</div>
                  <div className="mt-2 text-xl font-semibold">
                    {formatDate(subscription?.currentPeriodEnd)}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Accès produit</div>
                  <div className="text-sm text-white/45">État du compte</div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white/70">
                  Création de clones : {isPremium ? "autorisée" : "limitée / à protéger"}
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white/70">
                  Plan détecté : {currentPlan}
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white/70">
                  Statut Stripe en base : {currentStatus}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Settings2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Raccourcis utiles</div>
                  <div className="text-sm text-white/45">Accès rapide</div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  href="/create"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                >
                  Créer un nouveau clone
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/billing"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                >
                  Gérer l’abonnement
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                >
                  Paramètres du compte
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 pt-10 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-white text-black shadow-[0_0_90px_rgba(255,255,255,0.08)]">
          <div className="grid gap-8 px-8 py-12 sm:px-10 lg:grid-cols-[1fr_auto] lg:items-center lg:px-14 lg:py-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-black/60">
                Étape suivante
              </div>
              <h3 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Ton dashboard lit maintenant le vrai premium
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-8 text-black/65 sm:text-lg">
                La suite logique, c’est de protéger les pages premium et
                d’arrêter d’utiliser des données de test pour passer à une vraie
                logique de production.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/billing"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white"
              >
                Voir mon abonnement
                <Crown className="h-4 w-4" />
              </Link>

              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3.5 text-sm font-medium text-black"
              >
                Créer un clone
                <Plus className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}