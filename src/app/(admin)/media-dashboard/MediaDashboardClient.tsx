"use client";

import { useState } from "react";
import { Loader2, Play, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function MediaDashboardClient({ exercises, initialJobs }: { exercises: any[], initialJobs: any[] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const generateVideo = async (slug: string) => {
    setLoadingMap(prev => ({ ...prev, [slug]: true }));
    try {
      const res = await fetch("/api/exercises/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseSlug: slug }),
      });
      const data = await res.json();
      if (data.jobId) {
        // Poll for updates immediately or let the user refresh
        alert(`Job ${data.jobId} started! Check jobs list.`);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setLoadingMap(prev => ({ ...prev, [slug]: false }));
    }
  };

  const pollJob = async (jobId: number) => {
    try {
      const res = await fetch(`/api/exercises/video/status/${jobId}`);
      const data = await res.json();
      alert(`Job ${jobId} status: ${data.status}`);
      // In a real app we'd update the local state with the new job status
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Exercises</h2>
        <div className="space-y-4">
          {exercises.map(ex => (
            <div key={ex.id} className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white">{ex.name}</h3>
                <p className="text-xs text-muted">Status: <span className="text-accent">{ex.videoStatus}</span></p>
                {ex.videoUrl && <p className="text-xs text-emerald-400 mt-1">Has Video</p>}
              </div>
              <button 
                onClick={() => generateVideo(ex.slug)}
                disabled={loadingMap[ex.slug] || ex.videoStatus === "generating"}
                className="bg-accent text-black px-4 py-2 rounded-md font-bold text-xs disabled:opacity-50 flex items-center gap-2"
              >
                {loadingMap[ex.slug] ? <Loader2 size={14} className="animate-spin"/> : <Play size={14} />}
                Generate
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Recent Jobs</h2>
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className="p-4 bg-white/5 rounded-lg border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">Job #{job.id} - {job.exerciseSlug}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
                  job.status === 'ready' ? 'bg-emerald-400/20 text-emerald-400' :
                  job.status === 'failed' ? 'bg-red-400/20 text-red-400' :
                  'bg-yellow-400/20 text-yellow-400'
                }`}>
                  {job.status}
                </span>
              </div>
              <p className="text-xs text-muted font-mono break-all">{job.providerJobId || "No provider ID yet"}</p>
              {job.errorMessage && <p className="text-xs text-red-400 mt-1">Error: {job.errorMessage}</p>}
              
              <div className="mt-2">
                 <button onClick={() => pollJob(job.id)} className="text-xs text-accent underline">Check Status</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
