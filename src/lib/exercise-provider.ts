export type ExerciseAudio = {
  exerciseSlug: string;
  exerciseName: string;
  audioUrl: string | null;
  transcript: string;
  audioStatus: "not_started" | "generating" | "ready" | "failed" | "unavailable";
  voice: string;
  generatedAt?: string;
  transcriptHash?: string;
};

export type MediaStatus = "queued" | "generating" | "processing" | "ready" | "failed" | "unavailable";

export type ExerciseMedia = {
  exerciseSlug: string;
  exerciseName: string;
  videoUrl: string | null;
  videoType: "mp4" | "webm" | "hls" | null;
  audioUrl: string | null;
  transcript: string;
  photoUrl: string | null;
  photoAlt: string | null;
  photoSource: string | null;
  photoSourcePage: string | null;
  status: MediaStatus;
  videoStatus: MediaStatus;
  audioStatus: MediaStatus;
};

export interface ExerciseMediaProvider {
  search(params: {
    query?: string;
    muscle?: string;
    equipment?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: ExerciseMedia[]; total: number }>;
  
  getBySlug(slug: string): Promise<ExerciseMedia | null>;
}

// ------------------------------------------------------------------
// Your Move Implementation (Mocking real API structure)
// ------------------------------------------------------------------
class YMoveExerciseProvider implements ExerciseMediaProvider {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.YMOVE_API_BASE_URL || "https://exercise-api.ymove.app/api/v2";
    this.apiKey = process.env.YMOVE_API_KEY || "";
  }

  private headers() {
    return {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  async search(params: any): Promise<{ items: ExerciseMedia[]; total: number }> {
    if (!this.apiKey) {
      throw new Error("YMOVE_API_KEY is not configured.");
    }
    
    // In a real implementation, you would append params to this URL.
    // url.searchParams.append(...)
    const url = new URL(`${this.baseUrl}/exercises`);
    
    try {
      const res = await fetch(url.toString(), { headers: this.headers() });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) throw new Error("Unauthorized Provider API Key");
        if (res.status === 429) throw new Error("Rate limit exceeded");
        throw new Error("Provider API error");
      }
      const data = await res.json();
      
      const items = data.data.map((ex: any) => this.normalize(ex));
      return { items, total: data.total || items.length };
    } catch (e) {
      console.error("YMove search error:", e);
      throw e;
    }
  }

  async getBySlug(slug: string): Promise<ExerciseMedia | null> {
    if (!this.apiKey) {
      throw new Error("YMOVE_API_KEY is not configured.");
    }
    try {
      const url = new URL(`${this.baseUrl}/exercises/${slug}`);
      const res = await fetch(url.toString(), { headers: this.headers() });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Provider API error: ${res.status}`);
      
      const data = await res.json();
      return this.normalize(data.data || data);
    } catch (e) {
      console.error(`YMove getBySlug error for ${slug}:`, e);
      throw e;
    }
  }

  private normalize(ymoveExercise: any): ExerciseMedia {
    const videoUrl = ymoveExercise.video?.url || ymoveExercise.video_url || null;
    return {
      exerciseSlug: ymoveExercise.slug,
      exerciseName: ymoveExercise.name,
      videoUrl,
      videoType: videoUrl ? "mp4" : null,
      audioUrl: null,
      transcript: "",
      photoUrl: ymoveExercise.photoUrl || null,
      photoAlt: ymoveExercise.photoAlt || null,
      photoSource: ymoveExercise.photoSource || null,
      photoSourcePage: ymoveExercise.photoSourcePage || null,
      status: videoUrl ? "ready" : "unavailable",
      videoStatus: videoUrl ? "ready" : "unavailable",
      audioStatus: "unavailable"
    };
  }
}

// ------------------------------------------------------------------
// MuscleWiki Implementation (Mocking real API structure)
// ------------------------------------------------------------------
class MuscleWikiExerciseProvider implements ExerciseMediaProvider {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.MUSCLEWIKI_API_BASE_URL || "https://api.musclewiki.com";
    this.apiKey = process.env.MUSCLEWIKI_API_KEY || "";
  }

  private headers() {
    return {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  async search(params: any): Promise<{ items: ExerciseMedia[]; total: number }> {
    if (!this.apiKey) {
      throw new Error("MUSCLEWIKI_API_KEY is not configured.");
    }
    const url = new URL(`${this.baseUrl}/exercises`);
    try {
      const res = await fetch(url.toString(), { headers: this.headers() });
      if (!res.ok) throw new Error(`Provider API error: ${res.status}`);
      const data = await res.json();
      const items = data.map((ex: any) => this.normalize(ex));
      return { items, total: items.length };
    } catch (e) {
      console.error("MuscleWiki search error:", e);
      throw e;
    }
  }

  async getBySlug(slug: string): Promise<ExerciseMedia | null> {
    if (!this.apiKey) {
      throw new Error("MUSCLEWIKI_API_KEY is not configured.");
    }
    try {
      // MuscleWiki might not support direct slug lookup, usually requires ID.
      // Assuming for architecture that they do support a similar route.
      const url = new URL(`${this.baseUrl}/exercises/${slug}`);
      const res = await fetch(url.toString(), { headers: this.headers() });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Provider API error: ${res.status}`);
      
      const data = await res.json();
      return this.normalize(data);
    } catch (e) {
      console.error(`MuscleWiki getBySlug error for ${slug}:`, e);
      throw e;
    }
  }

  private normalize(mwExercise: any): ExerciseMedia {
    const videoUrl = mwExercise.videos?.[0]?.url || mwExercise.video_url || null;
    return {
      exerciseSlug: mwExercise.slug,
      exerciseName: mwExercise.title || mwExercise.name,
      videoUrl,
      videoType: videoUrl ? "mp4" : null,
      audioUrl: null,
      transcript: "",
      photoUrl: mwExercise.photoUrl || null,
      photoAlt: mwExercise.photoAlt || null,
      photoSource: mwExercise.photoSource || null,
      photoSourcePage: mwExercise.photoSourcePage || null,
      status: videoUrl ? "ready" : "unavailable",
      videoStatus: videoUrl ? "ready" : "unavailable",
      audioStatus: "unavailable"
    };
  }
}

// ------------------------------------------------------------------
// Local Asset Fallback
// ------------------------------------------------------------------
class LocalExerciseProvider implements ExerciseMediaProvider {
  async search(params: any): Promise<{ items: ExerciseMedia[]; total: number }> {
    return { items: [], total: 0 };
  }

  async getBySlug(slug: string): Promise<ExerciseMedia | null> {
    const { EXERCISE_ASSETS } = await import("@/data/exercise-assets");
    const asset = EXERCISE_ASSETS[slug];
    if (asset) {
      const vStatus = asset.videoUrl ? "ready" : "unavailable";
      const aStatus = asset.voiceoverUrl ? "ready" : "unavailable";
      return {
        exerciseSlug: slug,
        exerciseName: asset.exerciseName,
        videoUrl: asset.videoUrl || null,
        videoType: asset.videoUrl ? "mp4" : null,
        audioUrl: asset.voiceoverUrl || null,
        transcript: asset.transcript || "",
        photoUrl: (asset as any).photoUrl || null,
        photoAlt: (asset as any).photoAlt || null,
        photoSource: (asset as any).photoSource || null,
        photoSourcePage: (asset as any).photoSourcePage || null,
        status: asset.status === "ready" ? "ready" : "unavailable",
        videoStatus: vStatus,
        audioStatus: aStatus,
      };
    }
    return null;
  }
}

// ------------------------------------------------------------------
// Provider Factory
// ------------------------------------------------------------------
export function getExerciseProvider(): ExerciseMediaProvider {
  const providerType = process.env.EXERCISE_MEDIA_PROVIDER || "local";
  
  if (providerType === "ymove") return new YMoveExerciseProvider();
  if (providerType === "musclewiki") return new MuscleWikiExerciseProvider();
  
  return new LocalExerciseProvider();
}
