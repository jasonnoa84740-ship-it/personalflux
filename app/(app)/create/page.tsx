"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Image as ImageIcon,
  Lock,
  Mic,
  Shield,
  Sparkles,
  Upload,
  Wand2,
} from "lucide-react";

const traitsList = [
  "Chaleureux",
  "Persuasif",
  "Créatif",
  "Luxe",
  "Direct",
  "Élégant",
  "Expert",
  "Premium",
];

export default function CreatePage() {
  const router = useRouter();
  const { userId } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Créateur");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [responseStyle, setResponseStyle] = useState("Élégant et premium");
  const [primaryGoal, setPrimaryGoal] = useState("Monétiser des conversations");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [loadingAction, setLoadingAction] = useState<"draft" | "publish" | null>(null);
  const [generatingAvatar, setGeneratingAvatar] = useState(false);
  const [error, setError] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [generatedAvatarUrl, setGeneratedAvatarUrl] = useState<string | null>(null);

  function toggleTrait(trait: string) {
    setSelectedTraits((prev) =>
      prev.includes(trait)
        ? prev.filter((item) => item !== trait)
        : [...prev, trait]
    );
  }

  function handleOpenFilePicker() {
    fileInputRef.current?.click();
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Formats acceptés : JPG, PNG, WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L’image doit faire moins de 5 MB.");
      return;
    }

    setError("");
    setImageFile(file);
    setGeneratedAvatarUrl(null);

    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  }

  async function generateAIAvatar() {
    setError("");

    if (!name.trim() && !description.trim()) {
      setError("Ajoute au moins un nom ou une description pour générer l’avatar.");
      return;
    }

    try {
      setGeneratingAvatar(true);

      const res = await fetch("/api/clones/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          category,
          shortDescription: shortDescription.trim(),
          description: description.trim(),
          responseStyle,
          primaryGoal,
          traits: selectedTraits,
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        throw new Error("Réponse invalide pendant la génération de l’avatar.");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Erreur pendant la génération de l’avatar.");
      }

      setGeneratedAvatarUrl(data.image);
      setImageFile(null);
      setImagePreview(data.image);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible de générer l’avatar."
      );
    } finally {
      setGeneratingAvatar(false);
    }
  }

  async function uploadAvatarIfNeeded() {
    if (generatedAvatarUrl?.startsWith("data:image/")) {
      const res = await fetch("/api/clone-avatar-from-dataurl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataUrl: generatedAvatarUrl,
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        throw new Error(text || "Impossible d’uploader l’avatar IA.");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Impossible d’uploader l’avatar IA.");
      }

      return data.url as string;
    }

    if (generatedAvatarUrl && !generatedAvatarUrl.startsWith("data:image/")) {
      return generatedAvatarUrl;
    }

    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await fetch("/api/clone-avatar", {
      method: "POST",
      body: formData,
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      const text = await res.text();
      throw new Error(text || "Impossible d’uploader l’image.");
    }

    if (!res.ok) {
      throw new Error(data?.error || "Impossible d’uploader l’image.");
    }

    return data.url as string;
  }

  async function saveClone(status: "DRAFT" | "PUBLISHED") {
    setError("");

    if (!userId) {
      setError("Tu dois être connecté pour créer un clone.");
      return;
    }

    if (!name.trim()) {
      setError("Le nom du clone est obligatoire.");
      return;
    }

    try {
      setLoadingAction(status === "DRAFT" ? "draft" : "publish");

      const avatarUrl = await uploadAvatarIfNeeded();

      const res = await fetch("/api/clones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          category,
          shortDescription: shortDescription.trim() || null,
          description: description.trim() || null,
          avatarUrl: avatarUrl || null,
          responseStyle,
          primaryGoal,
          tone: selectedTraits.join(", ") || null,
          traits: selectedTraits,
          visibility: "PRIVATE",
          status,
          appearance: {
            energy: selectedTraits.join(", ") || null,
            fashionStyle: responseStyle,
            referenceImageUrl: avatarUrl || null,
          },
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        throw new Error(text || "Impossible d’enregistrer le clone.");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Impossible d’enregistrer le clone.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await saveClone("PUBLISHED");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-12rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-[8%] top-[35rem] h-[18rem] w-[18rem] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute right-[10%] top-[18rem] h-[22rem] w-[22rem] rounded-full bg-white/5 blur-3xl" />
      </div>

      <header className="border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>

            <div>
              <div className="text-sm font-semibold tracking-wide">Créer ton clone</div>
              <div className="text-xs text-white/45">
                Avatar, personnalité et positionnement
              </div>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white sm:inline-flex"
          >
            Aller au dashboard
          </Link>
        </div>
      </header>

      <section className="px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
              <Sparkles className="h-4 w-4" />
              Construction du clone
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Donne une vraie identité à ton clone IA
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-8 text-white/60 sm:text-lg">
              Commence par générer ou importer un avatar fort, puis définis la
              personnalité, le style et l’objectif de ton clone.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid gap-8 xl:grid-cols-[1fr_0.95fr]">
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_60px_rgba(255,255,255,0.03)] sm:p-8">
                  <div className="mb-6">
                    <div className="text-lg font-semibold">Identité du clone</div>
                    <div className="mt-1 text-sm text-white/45">
                      Nom, catégorie et promesse principale
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-3 block text-sm font-medium text-white/80">
                        Nom du clone
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Alex Vision"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none placeholder:text-white/30 focus:border-white/25"
                      />
                    </div>

                    <div>
                      <label className="mb-3 block text-sm font-medium text-white/80">
                        Catégorie
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none focus:border-white/25"
                      >
                        <option>Créateur</option>
                        <option>Coach</option>
                        <option>Consultant</option>
                        <option>Marque personnelle</option>
                        <option>Business</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="mb-3 block text-sm font-medium text-white/80">
                      Description courte
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Un clone premium spécialisé dans le branding, la stratégie et les conversations privées."
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none placeholder:text-white/30 focus:border-white/25"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="mb-3 block text-sm font-medium text-white/80">
                      Histoire / Positionnement
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Décris qui est ton clone, ce qu’il représente, son énergie, son univers, sa façon de parler, ses limites et son objectif principal."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-[1.5rem] border border-white/10 bg-black px-4 py-4 text-white outline-none placeholder:text-white/30 focus:border-white/25"
                    />
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                  <div className="mb-6">
                    <div className="text-lg font-semibold">Personnalité & style</div>
                    <div className="mt-1 text-sm text-white/45">
                      Ce qui donne une vraie présence au clone
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-white/80">
                      Traits de personnalité
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {traitsList.map((trait) => {
                        const active = selectedTraits.includes(trait);

                        return (
                          <button
                            key={trait}
                            type="button"
                            onClick={() => toggleTrait(trait)}
                            className={`rounded-full border px-4 py-2 text-sm transition ${
                              active
                                ? "border-white bg-white text-black"
                                : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {trait}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-3 block text-sm font-medium text-white/80">
                        Style de réponse
                      </label>
                      <select
                        value={responseStyle}
                        onChange={(e) => setResponseStyle(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none focus:border-white/25"
                      >
                        <option>Élégant et premium</option>
                        <option>Chaleureux et humain</option>
                        <option>Direct et vendeur</option>
                        <option>Expert et pédagogique</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-3 block text-sm font-medium text-white/80">
                        Objectif principal
                      </label>
                      <select
                        value={primaryGoal}
                        onChange={(e) => setPrimaryGoal(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-white outline-none focus:border-white/25"
                      >
                        <option>Monétiser des conversations</option>
                        <option>Vendre un service</option>
                        <option>Créer une audience</option>
                        <option>Offrir un assistant privé</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">Accès et confidentialité</div>
                        <p className="mt-2 text-sm leading-7 text-white/55">
                          Tu pourras rendre ce clone public, privé, réservé aux membres
                          ou accessible uniquement via abonnement.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Checklist premium</div>
                      <div className="text-sm text-white/45">
                        Pour un rendu crédible et désirable
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      "Un nom mémorable et cohérent",
                      "Une description claire et premium",
                      "Une personnalité bien définie",
                      "Une proposition de valeur compréhensible",
                      "Un positionnement monétisable",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-white/75">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="sticky top-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_60px_rgba(255,255,255,0.03)] sm:p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <div className="text-xl font-semibold">Avatar du clone</div>
                      <div className="mt-1 text-sm text-white/45">
                        Génère ou importe ton image principale
                      </div>
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
                      Brouillon
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-black/60 p-4">
                    <div className="relative h-[440px] overflow-hidden rounded-[1.25rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))]">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Aperçu du clone"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-white/35">
                          L’avatar du clone apparaîtra ici
                        </div>
                      )}
                    </div>

                    <div className="mt-5">
                      <div className="text-2xl font-semibold">
                        {name.trim() || "Nom du clone"}
                      </div>
                      <div className="mt-1 text-sm text-white/45">
                        Clone premium · {category}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-white/60">
                      {shortDescription.trim() ||
                        "Un clone haut de gamme, stratégique, humain et persuasif, pensé pour offrir des conversations exclusives et monétisables."}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {(selectedTraits.length > 0
                        ? selectedTraits
                        : ["Premium", "Privé", "Voix", "Abonnement"]
                      ).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-6">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />

                      <div className="grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={handleOpenFilePicker}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"
                        >
                          <Upload className="h-4 w-4" />
                          Importer une image
                        </button>

                        <button
                          type="button"
                          onClick={generateAIAvatar}
                          disabled={generatingAvatar}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Wand2 className="h-4 w-4" />
                          {generatingAvatar ? "Génération..." : "Générer avatar IA"}
                        </button>
                      </div>

                      {imageFile && (
                        <div className="mt-3 text-xs text-white/50">
                          Fichier sélectionné : {imageFile.name}
                        </div>
                      )}

                      {generatedAvatarUrl && (
                        <div className="mt-3 text-xs text-emerald-300">
                          Avatar IA généré avec succès.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/40 p-4">
                    <div className="text-sm text-white/45">Message d’introduction</div>
                    <div className="mt-3 rounded-3xl rounded-tl-md bg-white/10 px-4 py-3 text-sm leading-7 text-white/90">
                      Salut, je suis {name.trim() || "ton clone"}. Je peux t’aider à
                      clarifier ton image, structurer ton offre et t’accompagner dans des
                      conversations premium.
                    </div>
                  </div>

                  <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                        <Mic className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">Voix du clone</div>
                        <div className="text-sm text-white/45">
                          Bientôt disponible
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        alert("La gestion de la voix sera ajoutée juste après l’image.")
                      }
                      className="mt-5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                    >
                      Configurer la voix
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-white/45">
                Tu pourras modifier tous ces paramètres plus tard depuis le dashboard.
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => saveClone("DRAFT")}
                  disabled={loadingAction !== null}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingAction === "draft"
                    ? "Sauvegarde..."
                    : "Sauvegarder en brouillon"}
                </button>

                <button
                  type="submit"
                  disabled={loadingAction !== null}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingAction === "publish" ? "Création..." : "Créer le clone"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}