import fs from "fs";
import path from "path";
import https from "https";
import { EXERCISE_ASSETS } from "../src/data/exercise-assets";

// Helper to download a file
const downloadFile = (url: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function main() {
  console.log("Starting asset download/mocking script...");
  const publicDir = path.join(process.cwd(), "public", "exercises");
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Dummy URLs for testing (since we don't have actual Pixabay API access or keys)
  const DUMMY_VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4";
  const DUMMY_AUDIO_URL = "https://www.w3schools.com/html/horse.mp3"; // Or similar small dummy audio

  for (const [slug, asset] of Object.entries(EXERCISE_ASSETS)) {
    console.log(`Processing ${slug}...`);
    
    const videoDest = path.join(publicDir, `${slug}.mp4`);
    const audioDest = path.join(publicDir, `${slug}-voiceover.mp3`);

    if (!fs.existsSync(videoDest)) {
      console.log(`Downloading dummy video for ${slug}...`);
      try {
        await downloadFile(DUMMY_VIDEO_URL, videoDest);
        console.log(`Saved ${slug}.mp4`);
      } catch (err) {
        console.error(`Failed to download video for ${slug}:`, err);
      }
    } else {
      console.log(`Video for ${slug} already exists.`);
    }

    if (!fs.existsSync(audioDest)) {
      console.log(`Downloading dummy audio for ${slug}...`);
      try {
        await downloadFile(DUMMY_AUDIO_URL, audioDest);
        console.log(`Saved ${slug}-voiceover.mp3`);
      } catch (err) {
        console.error(`Failed to download audio for ${slug}:`, err);
      }
    } else {
      console.log(`Audio for ${slug} already exists.`);
    }
  }

  console.log("Asset download script completed.");
}

main().catch(console.error);
