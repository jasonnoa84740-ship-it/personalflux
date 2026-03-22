"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Mic,
  Send,
  Sparkles,
  Settings2,
  ImagePlus,
  X,
  Upload,
  Crown,
  Lock,
} from "lucide-react";

type MessageMode = "steps" | "detailed" | "short" | "smart";

type Message = {
  role: "user" | "assistant";
  content: string;
  mode?: MessageMode;
  imageUrl?: string;
};

type CloneData = {
  id: string;
  name: string;
  category: string;
  description: string;
  shortDescription: string;
  tone: string;
  visibility: string;
  objective: string;
  status: string;
  imageUrl?: string | null;
  traits?: string[];
  tags?: string[];
};

type SpeechRecognitionType = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onresult:
    | ((event: {
        results: ArrayLike<ArrayLike<{ transcript: string }>>;
      }) => void)
    | null;
  start: () => void;
  stop: () => void;
};

type ApiResponse = {
  error?: string;
  message?: string;
  reply?: string;
  mode?: MessageMode;
  url?: string;
  clone?: {
    id?: string;
    name?: string;
    category?: string | null;
    description?: string | null;
    shortDescription?: string | null;
    tone?: string | null;
    visibility?: string | null;
    primaryGoal?: string | null;
    objective?: string | null;
    status?: string | null;
    avatarUrl?: string | null;
    imageUrl?: string | null;
    traits?: string[];
  };
  [key: string]: unknown;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionType;
    SpeechRecognition?: new () => SpeechRecognitionType;
  }
}

const FREE_MESSAGE_LIMIT = 8;
const FREE_IMAGE_LIMIT = 2;
const PLAN_LINK = "/pricing";

function getUsageKey(cloneId: string) {
  return `personaflux_usage_${cloneId}`;
}

function getMessagesKey(cloneId: string) {
  return `personaflux_messages_${cloneId}`;
}

function loadUsage(cloneId: string) {
  if (typeof window === "undefined") {
    return { messages: 0, images: 0 };
  }

  try {
    const raw = localStorage.getItem(getUsageKey(cloneId));
    if (!raw) return { messages: 0, images: 0 };

    const parsed = JSON.parse(raw);
    return {
      messages: Number(parsed?.messages || 0),
      images: Number(parsed?.images || 0),
    };
  } catch {
    return { messages: 0, images: 0 };
  }
}

function saveUsage(
  cloneId: string,
  usage: { messages: number; images: number }
) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getUsageKey(cloneId), JSON.stringify(usage));
}

function parseStructuredContent(content: string) {
  const lines = content.split("\n").map((line) => line.trim());

  let mainIdea = "";
  let advice = "";
  const steps: Array<{ title: string; body: string[] }> = [];
  const paragraphs: string[] = [];

  let currentStep: { title: string; body: string[] } | null = null;

  for (const line of lines) {
    if (!line) continue;

    if (/^Idée principale\s*:/i.test(line)) {
      mainIdea = line.replace(/^Idée principale\s*:/i, "").trim();
      currentStep = null;
      continue;
    }

    if (/^Étape\s*\d+\s*:/i.test(line)) {
      if (currentStep) steps.push(currentStep);

      currentStep = {
        title: line.match(/^Étape\s*\d+\s*:/i)?.[0] || line,
        body: [line.replace(/^Étape\s*\d+\s*:/i, "").trim()].filter(Boolean),
      };
      continue;
    }

    if (/^Conseil\s*:/i.test(line)) {
      if (currentStep) {
        steps.push(currentStep);
        currentStep = null;
      }
      advice = line.replace(/^Conseil\s*:/i, "").trim();
      continue;
    }

    if (currentStep) {
      currentStep.body.push(line);
    } else {
      paragraphs.push(line);
    }
  }

  if (currentStep) steps.push(currentStep);

  return { mainIdea, steps, advice, paragraphs };
}

function RenderAssistantSteps({ content }: { content: string }) {
  const { mainIdea, steps, advice, paragraphs } = parseStructuredContent(content);

  return (
    <div className="max-w-[760px] space-y-4">
      {mainIdea && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.05] px-5 py-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Idée principale
          </div>
          <div className="text-[16px] font-medium leading-7 text-white">
            {mainIdea}
          </div>
        </div>
      )}

      {paragraphs.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-4">
          <div className="space-y-2 text-[15px] leading-7 text-white/90">
            {paragraphs.map((p, i) => (
              <div key={i}>{p}</div>
            ))}
          </div>
        </div>
      )}

      {steps.length > 0 && (
        <div className="grid gap-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-4 transition hover:bg-white/[0.06]"
            >
              <div className="mb-2 text-sm font-semibold text-white">
                {step.title}
              </div>
              <div className="space-y-2 text-[15px] leading-7 text-white/88">
                {step.body.map((line, j) => (
                  <div key={j}>{line}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {advice && (
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
            Conseil
          </div>
          <div className="text-[15px] leading-7 text-emerald-100">{advice}</div>
        </div>
      )}
    </div>
  );
}

function RenderAssistantDetailed({ content }: { content: string }) {
  return (
    <div className="max-w-[760px] rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="space-y-4 whitespace-pre-wrap text-[15px] leading-7 text-white/92">
        {content
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line, i) => (
            <div key={i}>{line}</div>
          ))}
      </div>
    </div>
  );
}

function RenderAssistantMessage({
  content,
  mode,
}: {
  content: string;
  mode?: MessageMode;
}) {
  if (mode === "detailed") {
    return <RenderAssistantDetailed content={content} />;
  }

  if (mode === "steps") {
    return <RenderAssistantSteps content={content} />;
  }

  const looksStructured =
    /Idée principale\s*:|Étape\s*\d+\s*:|Conseil\s*:/i.test(content);

  if (looksStructured) {
    return <RenderAssistantSteps content={content} />;
  }

  return <RenderAssistantDetailed content={content} />;
}

function RenderUserMessage({
  content,
  imageUrl,
}: {
  content: string;
  imageUrl?: string;
}) {
  return (
    <div className="max-w-[680px] rounded-3xl bg-white px-5 py-3 text-[15px] leading-7 text-black shadow-sm">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Image envoyée"
          className="mb-3 max-h-72 w-full rounded-2xl object-cover"
        />
      )}
      {content}
    </div>
  );
}

function LimitModal({
  open,
  onClose,
  type,
}: {
  open: boolean;
  onClose: () => void;
  type: "messages" | "images";
}) {
  if (!open) return null;

  const title =
    type === "messages"
      ? "Limite de messages atteinte"
      : "Limite d’images atteinte";

  const subtitle =
    type === "messages"
      ? "Tu as utilisé tout le quota gratuit de cette conversation."
      : "Tu as utilisé tout le quota d’images gratuit de cette conversation.";

  const plans = [
    {
      name: "Starter",
      desc: "Pour débloquer plus de messages et continuer à tester.",
      accent: "text-white",
    },
    {
      name: "Pro",
      desc: "Pour un usage sérieux avec plus d’images et de conversations.",
      accent: "text-emerald-300",
    },
    {
      name: "Scale",
      desc: "Pour pousser PersonaFlux plus loin avec une vraie intensité d’usage.",
      accent: "text-amber-300",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-white">
              <Lock className="h-5 w-5" />
              <div className="text-xl font-semibold">{title}</div>
            </div>
            <div className="text-sm text-white/60">{subtitle}</div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-white/5 p-2 text-white/70 transition hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <Crown className={`h-4 w-4 ${plan.accent}`} />
                <div className={`text-lg font-semibold ${plan.accent}`}>
                  {plan.name}
                </div>
              </div>

              <div className="mb-5 text-sm leading-6 text-white/65">
                {plan.desc}
              </div>

              <a
                href={PLAN_LINK}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:opacity-90"
              >
                Voir l’abonnement
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function readJsonSafe(res: Response): Promise<ApiResponse> {
  const raw = await res.text();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return { message: raw };
  }
}

export default function CloneChatPage() {
  const params = useParams();

  const cloneId = useMemo(() => {
    const fromParams =
      (params?.cloneId as string) ||
      (params?.id as string) ||
      (params?.slug as string);

    if (fromParams && String(fromParams).trim()) {
      return String(fromParams).trim();
    }

    if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/").filter(Boolean);
      return parts[parts.length - 1] || "";
    }

    return "";
  }, [params]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingClone, setLoadingClone] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string>("");
  const [sendOnEnter, setSendOnEnter] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [limitModal, setLimitModal] = useState<"messages" | "images" | null>(
    null
  );
  const [usedMessageCount, setUsedMessageCount] = useState(0);
  const [usedImageCount, setUsedImageCount] = useState(0);
  const [cloneData, setCloneData] = useState<CloneData>({
    id: "",
    name: "",
    category: "",
    description: "",
    shortDescription: "",
    tone: "",
    visibility: "",
    objective: "",
    status: "En ligne",
    imageUrl: null,
    traits: [],
    tags: [],
  });

  const suggestions = useMemo(
    () => [
      "Analyse cette idée et rends-la plus forte",
      "Donne-moi une stratégie simple mais premium",
      "Trouve-moi un angle plus original",
      "Explique-moi ça comme un expert",
      "Améliore mon positionnement",
      "Transforme ça en offre plus vendable",
    ],
    []
  );

  const initials = useMemo(
    () => (cloneData.name || "C").slice(0, 1).toUpperCase(),
    [cloneData.name]
  );

  const remainingMessages = Math.max(0, FREE_MESSAGE_LIMIT - usedMessageCount);
  const remainingImages = Math.max(0, FREE_IMAGE_LIMIT - usedImageCount);

  useEffect(() => {
    if (!cloneId) return;

    const usage = loadUsage(cloneId);
    setUsedMessageCount(usage.messages);
    setUsedImageCount(usage.images);
  }, [cloneId]);

  useEffect(() => {
    if (!cloneId) return;

    try {
      const savedMessages = localStorage.getItem(getMessagesKey(cloneId));

      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("LOAD MESSAGES ERROR:", error);
      setMessages([]);
    }
  }, [cloneId]);

  useEffect(() => {
    if (!cloneId) return;

    try {
      localStorage.setItem(getMessagesKey(cloneId), JSON.stringify(messages));
    } catch (error) {
      console.error("SAVE MESSAGES ERROR:", error);
    }
  }, [messages, cloneId]);

  useEffect(() => {
    async function loadClone() {
      try {
        if (!cloneId) {
          setLoadingClone(false);
          return;
        }

        setLoadingClone(true);

        const res = await fetch(`/api/clones/${cloneId}?t=${Date.now()}`, {
          cache: "no-store",
        });
        const data = await readJsonSafe(res);

        if (!res.ok) {
          throw new Error(data?.error || "Impossible de charger le clone.");
        }

        const clone = data.clone || {};

        const longDescription =
          typeof clone.description === "string" ? clone.description.trim() : "";
        const shortDesc =
          typeof clone.shortDescription === "string"
            ? clone.shortDescription.trim()
            : "";

        const cloneDescription =
          longDescription || shortDesc || "Aucune description.";

        const cloneAvatar =
          (typeof clone.avatarUrl === "string" && clone.avatarUrl.trim()) ||
          (typeof clone.imageUrl === "string" && clone.imageUrl.trim()) ||
          null;

        setCloneData({
          id: typeof clone.id === "string" ? clone.id : "",
          name: typeof clone.name === "string" ? clone.name : "Clone",
          category:
            typeof clone.category === "string" && clone.category.trim()
              ? clone.category
              : "Clone",
          description: cloneDescription,
          shortDescription: shortDesc,
          tone:
            typeof clone.tone === "string" && clone.tone.trim()
              ? clone.tone
              : "Premium",
          visibility:
            typeof clone.visibility === "string" && clone.visibility.trim()
              ? clone.visibility
              : "Privé",
          objective:
            (typeof clone.primaryGoal === "string" && clone.primaryGoal.trim()) ||
            (typeof clone.objective === "string" && clone.objective.trim()) ||
            "Converser",
          status:
            typeof clone.status === "string" && clone.status.trim()
              ? clone.status
              : "En ligne",
          imageUrl: cloneAvatar,
          traits: Array.isArray(clone.traits) ? clone.traits : [],
          tags: [
            (typeof clone.tone === "string" && clone.tone.trim()) || "Premium",
            (typeof clone.visibility === "string" && clone.visibility.trim()) ||
              "Privé",
            (typeof clone.category === "string" && clone.category.trim()) ||
              "Clone",
          ],
        });
      } catch (error) {
        console.error("LOAD CLONE ERROR:", error);
      } finally {
        setLoadingClone(false);
      }
    }

    loadClone();
  }, [cloneId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, uploadedImage]);

  function clearConversation() {
    if (!cloneId) return;

    setMessages([]);

    try {
      localStorage.removeItem(getMessagesKey(cloneId));
    } catch (error) {
      console.error("CLEAR CONVERSATION ERROR:", error);
    }
  }

  function startVoiceInput() {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();

      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  async function uploadImageToServer(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await readJsonSafe(res);

    if (!res.ok) {
      throw new Error(data?.error || "Upload image impossible.");
    }

    return data.url as string;
  }

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (usedImageCount >= FREE_IMAGE_LIMIT) {
      setLimitModal("images");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setUploadedImage(localPreview);
    setUploadedImageName(file.name);
  }

  function clearImage() {
    if (uploadedImage?.startsWith("blob:")) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setUploadedImageName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSend(custom?: string) {
    const text = (custom ?? input).trim();

    if ((!text && !uploadedImage) || loading || loadingClone || !cloneId) return;

    if (usedMessageCount >= FREE_MESSAGE_LIMIT) {
      setLimitModal("messages");
      return;
    }

    let uploadedImageUrl: string | null = null;
    let imageDataUrl: string | null = null;
    const selectedFile = fileInputRef.current?.files?.[0] || null;

    if (selectedFile && usedImageCount >= FREE_IMAGE_LIMIT) {
      setLimitModal("images");
      return;
    }

    if (selectedFile) {
      uploadedImageUrl = await uploadImageToServer(selectedFile);
      imageDataUrl = await fileToDataUrl(selectedFile);
    }

    const imageToSend = uploadedImage;

    const userMessage: Message = {
      role: "user",
      content: text || "Image envoyée",
      imageUrl: uploadedImageUrl || imageToSend || undefined,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const nextMessageCount = usedMessageCount + 1;
    const nextImageCount = selectedFile ? usedImageCount + 1 : usedImageCount;

    setUsedMessageCount(nextMessageCount);
    setUsedImageCount(nextImageCount);

    saveUsage(cloneId, {
      messages: nextMessageCount,
      images: nextImageCount,
    });

    clearImage();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cloneId,
          message: text || "Analyse cette image.",
          history: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          clone: {
            name: cloneData.name,
            description: cloneData.description,
            tone: cloneData.tone,
            category: cloneData.category,
            objective: cloneData.objective,
          },
          imageDataUrl: imageDataUrl || undefined,
          imageUrl: uploadedImageUrl || undefined,
        }),
      });

      const data = await readJsonSafe(res);

      if (!res.ok) {
        throw new Error(data?.error || "Impossible de générer une réponse.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "Pas de réponse générée.",
          mode: data.mode || "smart",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          mode: "detailed",
          content:
            error instanceof Error
              ? error.message
              : "Erreur serveur pendant la réponse.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <LimitModal
        open={!!limitModal}
        type={limitModal || "messages"}
        onClose={() => setLimitModal(null)}
      />

      <div
        className={`grid min-h-screen ${
          compactMode ? "grid-cols-[1fr]" : "grid-cols-[280px_1fr]"
        }`}
      >
        {!compactMode && (
          <aside className="hidden border-r border-white/10 bg-white/[0.02] p-5 lg:block">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-white/10 text-3xl font-semibold">
              {cloneData.imageUrl ? (
                <img
                  src={cloneData.imageUrl}
                  alt={cloneData.name || "Clone"}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <h1 className="mt-5 text-2xl font-semibold">
              {cloneData.name || "Chargement..."}
            </h1>

            <p className="mt-1 text-sm text-white/50">
              Clone premium · {cloneData.category || "Clone"}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(cloneData.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-5 text-sm leading-7 text-white/60">
              {cloneData.description || "Chargement du clone..."}
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-sm font-medium text-white/90">Accès actuel</div>

              <div className="mt-4 space-y-3 text-sm text-white/70">
                <div>
                  <span className="text-white/40">Messages restants :</span>{" "}
                  {remainingMessages}/{FREE_MESSAGE_LIMIT}
                </div>
                <div>
                  <span className="text-white/40">Images restantes :</span>{" "}
                  {remainingImages}/{FREE_IMAGE_LIMIT}
                </div>
                <div>
                  <span className="text-white/40">Statut :</span>{" "}
                  {cloneData.status || "En ligne"}
                </div>
              </div>
            </div>
          </aside>
        )}

        <section className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 px-4 py-4 backdrop-blur md:px-8">
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
              <div className="min-w-0">
                <div className="truncate text-lg font-semibold">
                  {cloneData.name || "Chargement..."}
                </div>
                <div className="text-sm text-emerald-400">
                  {loadingClone ? "Chargement du clone..." : "Conversation live"}
                </div>
              </div>

              <div className="relative flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowActions((v) => !v);
                    setShowSettings(false);
                  }}
                  className="rounded-full border border-white/10 bg-white/5 p-3 text-white/70 transition hover:bg-white/10"
                  title="Actions rapides"
                >
                  <Sparkles className="h-4 w-4" />
                </button>

                <button
                  onClick={() => {
                    setShowSettings((v) => !v);
                    setShowActions(false);
                  }}
                  className="rounded-full border border-white/10 bg-white/5 p-3 text-white/70 transition hover:bg-white/10"
                  title="Réglages"
                >
                  <Settings2 className="h-4 w-4" />
                </button>

                {showActions && (
                  <div className="absolute right-12 top-14 z-30 w-72 rounded-2xl border border-white/10 bg-zinc-950 p-3 shadow-2xl">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                      Actions rapides
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          handleSend("Rends cette idée plus désirable et plus premium")
                        }
                        className="w-full rounded-xl bg-white/5 px-3 py-2 text-left text-sm text-white/85 transition hover:bg-white/10"
                      >
                        Booster une idée
                      </button>

                      <button
                        onClick={() =>
                          handleSend("Donne-moi un angle plus original et plus fort")
                        }
                        className="w-full rounded-xl bg-white/5 px-3 py-2 text-left text-sm text-white/85 transition hover:bg-white/10"
                      >
                        Trouver un angle original
                      </button>

                      <button
                        onClick={() => {
                          if (usedImageCount >= FREE_IMAGE_LIMIT) {
                            setLimitModal("images");
                            return;
                          }
                          fileInputRef.current?.click();
                        }}
                        className="flex w-full items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-left text-sm text-white/85 transition hover:bg-white/10"
                      >
                        <ImagePlus className="h-4 w-4" />
                        Upload image
                      </button>
                    </div>
                  </div>
                )}

                {showSettings && (
                  <div className="absolute right-0 top-14 z-30 w-72 rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-2xl">
                    <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                      Réglages UI
                    </div>

                    <div className="space-y-4 text-sm">
                      <label className="flex items-center justify-between gap-3">
                        <span className="text-white/80">Mode compact</span>
                        <input
                          type="checkbox"
                          checked={compactMode}
                          onChange={(e) => setCompactMode(e.target.checked)}
                        />
                      </label>

                      <label className="flex items-center justify-between gap-3">
                        <span className="text-white/80">Envoyer avec Entrée</span>
                        <input
                          type="checkbox"
                          checked={sendOnEnter}
                          onChange={(e) => setSendOnEnter(e.target.checked)}
                        />
                      </label>

                      <button
                        onClick={clearConversation}
                        className="w-full rounded-xl bg-red-500/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/30"
                      >
                        Reset la conversation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 md:px-8">
              {messages.length === 0 && !loadingClone && (
                <div className="mt-16 flex flex-col items-center text-center">
                  <div className="mb-3 text-3xl font-semibold text-white">
                    Parle avec {cloneData.name || "ton clone"}
                  </div>
                  <div className="mb-8 max-w-md text-sm leading-7 text-white/50">
                    Pose une question, envoie une image ou teste une idée.
                    Le but ici, c’est d’aller vite vers une réponse utile,
                    lisible et premium.
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex w-full ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "user" ? (
                    <RenderUserMessage
                      content={msg.content}
                      imageUrl={msg.imageUrl}
                    />
                  ) : (
                    <RenderAssistantMessage
                      content={msg.content}
                      mode={msg.mode}
                    />
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/70">
                    Le clone réfléchit...
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          <div className="sticky bottom-0 border-t border-white/10 bg-black/90 backdrop-blur">
            <div className="mx-auto w-full max-w-4xl px-4 py-4 md:px-8">
              <div className="mb-4 flex flex-wrap gap-2">
                {suggestions.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={loading || loadingClone}
                    onClick={() => handleSend(prompt)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75 transition hover:bg-white/10 disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {uploadedImage && (
                <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm text-white/80">
                      Image prête à envoyer
                      {uploadedImageName ? ` : ${uploadedImageName}` : ""}
                    </div>
                    <button
                      onClick={clearImage}
                      className="rounded-lg bg-white/5 p-2 text-white/70 hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <img
                    src={uploadedImage}
                    alt="Preview"
                    className="max-h-52 rounded-xl object-cover"
                  />
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-end gap-3"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImagePick}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => {
                    if (usedImageCount >= FREE_IMAGE_LIMIT) {
                      setLimitModal("images");
                      return;
                    }
                    fileInputRef.current?.click();
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white/70 transition hover:bg-white/10"
                  title="Ajouter une image"
                >
                  <Upload className="h-5 w-5" />
                </button>

                <div className="flex-1 rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3 shadow-inner">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && sendOnEnter) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Écris ton message ici..."
                    className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/35"
                  />
                </div>

                <button
                  type="button"
                  onClick={startVoiceInput}
                  className={`rounded-2xl border border-white/10 p-3 transition ${
                    isListening
                      ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                  title="Vocal"
                >
                  <Mic className="h-5 w-5" />
                </button>

                <button
                  type="submit"
                  disabled={loading || loadingClone}
                  className="rounded-2xl bg-white px-5 py-3 text-black transition hover:opacity-90 disabled:opacity-60"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}