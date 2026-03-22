"use client";

import { useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ cloneId: string }>;
};

type GeneratedImage = {
  id: string;
  url: string;
  type?: string;
};

export default function CloneStudioPage({ params }: PageProps) {
  const [cloneId, setCloneId] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then((value) => setCloneId(value.cloneId));
  }, [params]);

  async function handleGenerateImages() {
    if (!cloneId) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/clones/${cloneId}/generate-images`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Erreur pendant la génération");
        return;
      }

      setImages(data.images ?? []);
    } catch (err) {
      console.error(err);
      setError("Impossible de générer les images");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-4xl font-bold">Clone studio</h1>
          <p className="mt-3 text-gray-400">
            Génère les premiers visuels cohérents de ton clone.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={handleGenerateImages}
              disabled={loading || !cloneId}
              className="rounded-2xl bg-white px-6 py-3 font-semibold text-black disabled:opacity-50"
            >
              {loading ? "Génération..." : "Generate images"}
            </button>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
            >
              <img
                src={image.url}
                alt="Generated clone"
                className="h-auto w-full object-cover"
              />
              <div className="p-4 text-sm text-gray-400">{image.id}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}