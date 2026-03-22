"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewClonePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("friendly");
  const [imageUrl, setImageUrl] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [genderPresentation, setGenderPresentation] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [fashionStyle, setFashionStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/clones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          tone,
          avatarUrl: imageUrl,
          visibility: "PRIVATE",
          status: "DRAFT",
          traits: [],
          appearance: {
            energy: tone,
            approxAgeRange: ageRange,
            genderPresentation,
            hairColor,
            eyeColor,
            skinTone,
            fashionStyle,
            referenceImageUrl: imageUrl,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Erreur pendant la création du clone");
        return;
      }

      router.push(`/studio/clone/${data.clone.id}`);
    } catch (err) {
      console.error(err);
      setError("Impossible de créer le clone");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-3 text-center text-5xl font-bold">
          Create your visual clone
        </h1>

        <p className="mb-10 text-center text-gray-400">
          Ajoute une identité claire. On la transforme ensuite en personnage
          visuel cohérent.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8"
        >
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Nom du clone
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none"
              placeholder="Jason"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Description / personnalité
            </label>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none"
              placeholder="Ambitieux, direct, créatif, aime les projets stylés..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Style / ton
            </label>
            <select
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="friendly">Friendly</option>
              <option value="direct">Direct</option>
              <option value="charismatic">Charismatic</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Image URL
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <p className="mt-2 text-sm text-gray-500">
              On garde l’URL comme image de référence pour l’instant.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Tranche d’âge
              </label>
              <input
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none"
                placeholder="25-34"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Présentation de genre
              </label>
              <input
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none"
                placeholder="masculin, féminin, androgyne..."
                value={genderPresentation}
                onChange={(e) => setGenderPresentation(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Couleur des cheveux
              </label>
              <input
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none"
                placeholder="brun foncé"
                value={hairColor}
                onChange={(e) => setHairColor(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Couleur des yeux
              </label>
              <input
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none"
                placeholder="marron"
                value={eyeColor}
                onChange={(e) => setEyeColor(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Teint / peau
              </label>
              <input
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none"
                placeholder="olive claire"
                value={skinTone}
                onChange={(e) => setSkinTone(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Style vestimentaire
              </label>
              <input
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none"
                placeholder="casual premium"
                value={fashionStyle}
                onChange={(e) => setFashionStyle(e.target.value)}
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Création..." : "Create visual clone"}
          </button>
        </form>
      </div>
    </main>
  );
}