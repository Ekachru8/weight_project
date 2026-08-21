export type ExerciseMedia = {
  providerExerciseId: string;
  exerciseSlug: string;
  name: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  videoType: "mp4" | "hls" | "webm" | "unknown";
  instructions: string[];
  formCues: string[];
  commonMistakes: string[];
  muscles: string[];
  equipment: string[];
  difficulty: string | null;
  source: "ymove" | "musclewiki" | "local";
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
    return {
      providerExerciseId: ymoveExercise.id?.toString() || ymoveExercise.slug,
      exerciseSlug: ymoveExercise.slug,
      name: ymoveExercise.name,
      videoUrl: ymoveExercise.video?.url || ymoveExercise.video_url || null,
      thumbnailUrl: ymoveExercise.video?.thumbnail || ymoveExercise.thumbnail_url || null,
      videoType: "mp4", // Or detect from URL
      instructions: ymoveExercise.instructions || [],
      formCues: ymoveExercise.cues || [],
      commonMistakes: ymoveExercise.mistakes || [],
      muscles: ymoveExercise.targetMuscles || [],
      equipment: ymoveExercise.equipment ? [ymoveExercise.equipment] : [],
      difficulty: ymoveExercise.difficulty || null,
      source: "ymove",
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
    return {
      providerExerciseId: mwExercise.id?.toString() || mwExercise.slug,
      exerciseSlug: mwExercise.slug,
      name: mwExercise.title || mwExercise.name,
      videoUrl: mwExercise.videos?.[0]?.url || mwExercise.video_url || null,
      thumbnailUrl: mwExercise.images?.[0]?.url || mwExercise.thumbnail_url || null,
      videoType: "mp4",
      instructions: mwExercise.instructions || [],
      formCues: mwExercise.formCues || [],
      commonMistakes: mwExercise.mistakes || [],
      muscles: mwExercise.target?.primary || [],
      equipment: mwExercise.equipment ? [mwExercise.equipment] : [],
      difficulty: mwExercise.difficulty || null,
      source: "musclewiki",
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
    if (asset && asset.status === "ready" && asset.videoUrl) {
      return {
        providerExerciseId: slug,
        exerciseSlug: slug,
        name: asset.exerciseName,
        videoUrl: asset.videoUrl,
        thumbnailUrl: null,
        videoType: "mp4",
        instructions: [], // Falls back to local database instructions
        formCues: [],
        commonMistakes: [],
        muscles: [],
        equipment: [],
        difficulty: null,
        source: "local"
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
