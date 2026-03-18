import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
              <Sparkles className="h-4 w-4" />
              Connexion
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Connecte-toi à ton espace
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
              Accède à ton dashboard, gère tes clones IA, tes conversations et ton abonnement.
            </p>

            <div className="mt-10 flex justify-center lg:justify-start">
              <SignIn
                path="/login"
                routing="path"
                signUpUrl="/signup"
                forceRedirectUrl="/dashboard"
                appearance={{
                  variables: {
                    colorBackground: "#0a0a0a",
                    colorPrimary: "#ffffff",
                    colorText: "#ffffff",
                    colorInputBackground: "#111111",
                    colorInputText: "#ffffff",
                  },
                  elements: {
                    card: "bg-[#0a0a0a] border border-white/10 shadow-none rounded-3xl",
                    headerTitle: "text-white",
                    headerSubtitle: "text-white/60",
                    socialButtonsBlockButton:
                      "border border-white/10 bg-[#111111] text-white hover:bg-[#1a1a1a] rounded-xl shadow-none",
                    socialButtonsBlockButtonText: "text-white",
                    formButtonPrimary:
                      "bg-white text-black hover:bg-white/90 rounded-xl shadow-none",
                    formFieldInput:
                      "bg-[#111111] text-white border border-white/10 focus:border-white rounded-xl",
                    formFieldLabel: "text-white/80",
                    footerActionLink: "text-white underline",
                    formFieldAction: "text-white/70 hover:text-white",
                    dividerLine: "bg-white/10",
                    dividerText: "text-white/40",
                    identityPreviewText: "text-white",
                    identityPreviewEditButton: "text-white",
                    formResendCodeLink: "text-white underline",
                    otpCodeFieldInput:
                      "bg-[#111111] text-white border border-white/10 rounded-xl",
                  },
                }}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
            <div className="text-sm text-white/45">Pourquoi te connecter ?</div>
            <h2 className="mt-2 text-2xl font-semibold">Retrouve toute ton activité</h2>

            <div className="mt-8 space-y-4">
              {[
                "Gérer tes clones en temps réel",
                "Modifier ton positionnement et ta personnalité",
                "Accéder au dashboard premium",
                "Préparer l’abonnement et la monétisation",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white/70"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-[1.01]"
              >
                Créer un compte
              </Link>

              <Link
                href="/billing"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 transition hover:bg-white/10"
              >
                Voir les offres premium
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}