"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        {/* LEFT */}
        <div className="rounded-3xl border border-white/10 p-10">
          <h1 className="text-5xl font-bold">
            Connecte-toi à ton espace
          </h1>
          <p className="mt-6 text-lg text-gray-400">
            Accède à ton dashboard, gère tes clones IA, tes conversations et ton abonnement.
          </p>
        </div>

        {/* RIGHT */}
        <div className="rounded-3xl border border-white/10 p-10">
          <SignIn
            path="/login"
            routing="path"
            appearance={{
              elements: {
                card: "bg-transparent shadow-none border-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white text-black",
                formButtonPrimary: "bg-white text-black hover:opacity-90",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}