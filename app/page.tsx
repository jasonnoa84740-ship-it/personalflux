"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Brain,
  Check,
  ChevronRight,
  Crown,
  MessageSquare,
  Play,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  UserCircle2,
  Wallet,
  Zap,
} from "lucide-react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

const stats = [
  { label: "Clones IA créés", value: "12k+" },
  { label: "Conversations générées", value: "1.8M+" },
  { label: "Rétention moyenne", value: "82%" },
  { label: "Revenus créateurs", value: "94k€+" },
];

const logos = [
  "CRÉATEURS",
  "COACHS",
  "FONDATEURS",
  "AGENCES",
  "MARQUES PERSONNELLES",
  "COMMUNAUTÉS",
];

const features = [
  {
    icon: UserCircle2,
    title: "Identité visuelle crédible",
    description:
      "Crée une version digitale premium de toi-même avec une image, un nom, un ton et un positionnement immédiatement compréhensible.",
  },
  {
    icon: Brain,
    title: "Personnalité ultra personnalisable",
    description:
      "Contrôle la manière dont ton clone parle, rassure, vend, explique, enseigne ou guide avec ton propre style.",
  },
  {
    icon: MessageSquare,
    title: "Expérience de chat premium",
    description:
      "Des conversations plus propres, plus immersives et plus convaincantes qu’un chatbot générique.",
  },
  {
    icon: Crown,
    title: "Produit monétisable",
    description:
      "Transforme ton clone en véritable produit premium avec accès réservé, abonnements et pages membres.",
  },
  {
    icon: Shield,
    title: "Accès privé et contrôle",
    description:
      "Choisis qui peut accéder au clone, quel contenu est visible et comment ton audience interagit avec lui.",
  },
  {
    icon: TrendingUp,
    title: "Pensé pour le business",
    description:
      "Landing page, pricing, abonnement, dashboard : l’expérience est conçue pour un vrai produit live.",
  },
];

const steps = [
  {
    number: "01",
    title: "Crée ton identité",
    text: "Ajoute une image, un nom, un ton et les bases de personnalité de ton clone.",
  },
  {
    number: "02",
    title: "Structure son comportement",
    text: "Définis sa façon de répondre, son attitude, son rôle et la manière dont il représente ta marque.",
  },
  {
    number: "03",
    title: "Lance et monétise",
    text: "Publie ton clone, partage-le, ajoute des abonnements et transforme-le en produit.",
  },
];

const useCases = [
  "Expériences fan pour créateurs",
  "Produits compagnon IA privés",
  "Clones coach ou mentor",
  "Avatars vente et lead gen",
  "Pages premium de marque personnelle",
  "Assistants digitaux réservés aux membres",
];

const pricing = [
  {
    name: "Starter",
    price: "19€",
    description: "Pour lancer un premier clone propre et crédible.",
    cta: "Commencer avec Starter",
    href: "/billing",
    featured: false,
    features: [
      "1 clone IA",
      "Éditeur de personnalité basique",
      "Page de chat privée",
      "Jusqu’à 1 000 messages / mois",
      "Analytics de base",
    ],
  },
  {
    name: "Pro",
    price: "49€",
    description: "Pour les créateurs et fondateurs prêts à monétiser.",
    cta: "Passer sur Pro",
    href: "/billing",
    featured: true,
    features: [
      "3 clones IA",
      "Contrôles avancés de personnalité",
      "Pages visuelles premium",
      "Accès par abonnement",
      "Jusqu’à 20 000 messages / mois",
      "Support prioritaire",
    ],
  },
  {
    name: "Scale",
    price: "149€",
    description: "Pour agences, équipes et marques.",
    cta: "Parler aux ventes",
    href: "/billing",
    featured: false,
    features: [
      "Clones illimités",
      "Accès équipe",
      "Dashboard admin avancé",
      "Branding personnalisé",
      "Volume élevé de messages",
      "Onboarding dédié",
    ],
  },
];

const faqs = [
  {
    question: "Qu’est-ce qu’un clone IA visuel ?",
    answer:
      "C’est une identité digitale avec une image, un nom, une personnalité et une expérience conversationnelle en ligne.",
  },
  {
    question: "Puis-je rendre l’accès privé ou payant ?",
    answer:
      "Oui. La plateforme est pensée pour les accès réservés, les expériences premium et les abonnements.",
  },
  {
    question: "Puis-je personnaliser sa façon de parler ?",
    answer:
      "Oui. Tu peux définir le ton, le style, l’attitude, l’expertise, les limites et la structure de réponse.",
  },
  {
    question: "C’est réservé aux créateurs ?",
    answer:
      "Non. Ça marche aussi pour les coachs, consultants, agences, fondateurs, communautés et marques premium.",
  },
];

function SectionTitle({
  badge,
  title,
  description,
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
        {badge}
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-white/60 sm:text-lg">
        {description}
      </p>
    </div>
  );
}

export default function HomePage() {
  const { isSignedIn } = useUser();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-10rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-[10%] top-[28rem] h-[22rem] w-[22rem] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute right-[8%] top-[16rem] h-[20rem] w-[20rem] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.08)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide">PersonaFlux</div>
              <div className="text-xs text-white/45">
                Plateforme de clones IA visuels
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <Link href="#product" className="transition hover:text-white">
              Produit
            </Link>
            <Link href="#features" className="transition hover:text-white">
              Fonctionnalités
            </Link>
            <Link href="#pricing" className="transition hover:text-white">
              Tarifs
            </Link>
            <Link href="#faq" className="transition hover:text-white">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {!isSignedIn && (
              <div className="flex items-center gap-3">
                <SignInButton mode="redirect">
                  <button className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white sm:inline-flex">
                    Connexion
                  </button>
                </SignInButton>

                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:scale-[1.02]"
                >
                  Commencer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {isSignedIn && (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white sm:inline-flex"
                >
                  Dashboard
                </Link>

                <UserButton
                  userProfileMode="navigation"
                  userProfileUrl="/account"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-10 w-10",
                      userButtonPopoverCard:
                        "bg-[#111111] border border-white/10 text-white",
                      userButtonPopoverActionButton:
                        "text-white hover:bg-white/5",
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="relative px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 shadow-[0_0_30px_rgba(255,255,255,0.04)]">
              <Zap className="h-4 w-4" />
              Plateforme premium de clones IA pour créateurs, marques et fondateurs
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Transforme ton image, ta voix et ta personnalité en produit IA premium.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65 sm:text-xl">
              Construis un clone IA visuel, crédible et monétisable, prêt pour de vrais
              utilisateurs, de vraies conversations et de vrais abonnements.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {!isSignedIn && (
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:scale-[1.02]"
                >
                  Créer mon compte
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

              {isSignedIn && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:scale-[1.02]"
                >
                  Ouvrir le dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

              <Link
                href="/examples"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Voir les exemples
                <Play className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="text-2xl font-semibold text-white">{stat.value}</div>
                  <div className="mt-1 text-sm text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-10 h-28 w-28 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -right-8 bottom-10 h-28 w-28 rounded-full bg-white/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_80px_rgba(255,255,255,0.06)] backdrop-blur-xl">
              <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="rounded-[1.5rem] border border-white/10 bg-black/70 p-4">
                  <div className="h-64 rounded-[1.25rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))]" />
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-semibold">Alex</div>
                      <div className="mt-1 text-sm text-white/50">Clone visuel premium</div>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                      live
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/60">
                    Stratégique, chaleureux, direct et créatif. Pensé pour les
                    conversations premium et l’accès réservé.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Image", "Voix", "Personnalité", "Accès payant"].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-black/80 p-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">Alex Clone</div>
                        <div className="text-sm text-white/45">Répond instantanément</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                      <div className="h-2 w-2 rounded-full bg-emerald-300" />
                      Online
                    </div>
                  </div>

                  <div className="space-y-4 py-5">
                    <div className="max-w-[85%] rounded-3xl rounded-tl-md bg-white/10 px-4 py-3 text-sm leading-7 text-white/90">
                      Salut, je suis Alex. Je peux expliquer l’offre, présenter la
                      marque et guider les visiteurs vers un abonnement premium.
                    </div>
                    <div className="ml-auto max-w-[80%] rounded-3xl rounded-br-md border border-white/10 bg-white px-4 py-3 text-sm leading-7 text-black">
                      Qu’est-ce qui rend ça différent d’un chatbot classique ?
                    </div>
                    <div className="max-w-[88%] rounded-3xl rounded-tl-md bg-white/10 px-4 py-3 text-sm leading-7 text-white/90">
                      C’est plus un produit d’identité digitale qu’un simple outil. Tu
                      définis le visage, le ton, le positionnement, l’accès et la
                      monétisation.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {[
                        "Onboarding créateur",
                        "Accès premium",
                        "Capture de leads",
                      ].map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 rounded-full border border-white/10 bg-black px-4 py-3 text-sm text-white/40">
                        Demande quelque chose à ton clone...
                      </div>
                      <button className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black">
                        Envoyer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] px-6 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm tracking-[0.25em] text-white/35 sm:text-base">
          {logos.map((logo) => (
            <span key={logo}>{logo}</span>
          ))}
        </div>
      </section>

      <section id="product" className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            badge="Comment ça marche"
            title="Du profil au produit IA payant"
            description="Un workflow simple pour créer un clone propre, crédible et réellement utilisable."
          />

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-[0_0_50px_rgba(255,255,255,0.03)]"
              >
                <div className="text-sm font-medium tracking-[0.25em] text-white/40">
                  {step.number}
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-white">{step.title}</h3>
                <p className="mt-4 text-base leading-7 text-white/60">{step.text}</p>
                <div className="mt-8 inline-flex items-center gap-2 text-sm text-white/70">
                  En savoir plus
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            badge="Fonctionnalités"
            title="Tout ce qu’il faut pour une expérience premium"
            description="Pas juste une UI de chatbot. Une vraie direction produit pour l’identité, l’accès et la monétisation."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:bg-white/[0.05]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-base leading-7 text-white/60">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
              <Star className="h-4 w-4" />
              Cas d’usage premium
            </div>
            <h3 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Plus qu’un clone. Un vrai produit.
            </h3>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
              Positionne ton IA comme un coach, une identité de marque, une expérience
              membre ou une couche de conversion premium.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {useCases.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white/80"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
                    <Check className="h-4 w-4" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white/45">Aperçu revenus</div>
                <div className="mt-1 text-2xl font-semibold">Couche monétisation</div>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                Preview
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-black/50 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Revenu mensuel récurrent</div>
                      <div className="text-sm text-white/45">
                        Abonnements et accès privés
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-semibold">12 480€</div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/50 p-5">
                  <div className="text-sm text-white/45">Taux de conversion</div>
                  <div className="mt-2 text-3xl font-semibold">8.4%</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/50 p-5">
                  <div className="text-sm text-white/45">Membres payants</div>
                  <div className="mt-2 text-3xl font-semibold">1 294</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            badge="Tarifs"
            title="Des offres pensées pour lancer, grandir et monétiser"
            description="Commence simplement, affine l’expérience, puis transforme-la en produit par abonnement."
          />

          <div className="mt-16 grid gap-6 xl:grid-cols-3">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-[2rem] border p-8 ${
                  plan.featured
                    ? "border-white bg-white text-black shadow-[0_0_80px_rgba(255,255,255,0.12)]"
                    : "border-white/10 bg-white/[0.03] text-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div
                      className={`text-sm ${
                        plan.featured ? "text-black/60" : "text-white/45"
                      }`}
                    >
                      {plan.name}
                    </div>
                    <div className="mt-2 text-4xl font-semibold">{plan.price}</div>
                    <div
                      className={`mt-1 text-sm ${
                        plan.featured ? "text-black/65" : "text-white/55"
                      }`}
                    >
                      par mois
                    </div>
                  </div>
                  {plan.featured && (
                    <div className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                      Le plus populaire
                    </div>
                  )}
                </div>

                <p
                  className={`mt-5 text-base leading-7 ${
                    plan.featured ? "text-black/70" : "text-white/60"
                  }`}
                >
                  {plan.description}
                </p>

                <Link
                  href={plan.href}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-medium transition ${
                    plan.featured
                      ? "bg-black text-white hover:opacity-90"
                      : "border border-white/10 bg-white text-black hover:scale-[1.01]"
                  }`}
                >
                  {plan.cta}
                </Link>

                <div className="mt-8 space-y-4">
                  {plan.features.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          plan.featured ? "bg-black/10" : "bg-white/10"
                        }`}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                      <span
                        className={`text-sm ${
                          plan.featured ? "text-black/75" : "text-white/70"
                        }`}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionTitle
            badge="FAQ"
            title="Les questions avant de passer premium"
            description="Réduis les frictions et réponds aux objections de tes futurs utilisateurs payants."
          />

          <div className="mt-16 space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7"
              >
                <h3 className="text-lg font-medium text-white sm:text-xl">
                  {faq.question}
                </h3>
                <p className="mt-3 text-base leading-7 text-white/60">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 pt-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-white text-black shadow-[0_0_90px_rgba(255,255,255,0.08)]">
          <div className="grid gap-8 px-8 py-12 sm:px-10 lg:grid-cols-[1fr_auto] lg:items-center lg:px-14 lg:py-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-black/60">
                Prêt à lancer
              </div>
              <h3 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Lance ton clone maintenant. Transforme-le en produit ensuite.
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-8 text-black/65 sm:text-lg">
                Commence par l’identité, structure l’expérience, puis passe à une vraie
                plateforme premium.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              {!isSignedIn && (
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white"
                >
                  Créer un compte
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

              {isSignedIn && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white"
                >
                  Ouvrir le dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

              <Link
                href="/billing"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3.5 text-sm font-medium text-black"
              >
                Voir les tarifs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-base font-semibold">PersonaFlux</div>
            <div className="mt-1 text-sm text-white/45">
              Clones IA visuels premium pour produits digitaux modernes.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm text-white/55">
            <Link href="/billing" className="transition hover:text-white">
              Tarifs
            </Link>
            <Link href="/examples" className="transition hover:text-white">
              Exemples
            </Link>
            <Link href="/create" className="transition hover:text-white">
              Créer
            </Link>
            <Link href="/dashboard" className="transition hover:text-white">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}