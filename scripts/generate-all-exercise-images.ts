import fs from "fs";
import path from "path";

async function generateAll() {
  const exercisesFile = path.join(process.cwd(), "src", "data", "exercises.ts");
  const assetsFile = path.join(process.cwd(), "src", "data", "exercise-assets.ts");
  
  if (!fs.existsSync(exercisesFile) || !fs.existsSync(assetsFile)) {
    console.error("Exercises or assets file not found. Ensure you are running from the root.");
    process.exit(1);
  }

  // We load the TS file using dynamic import / require workaround, or we can just parse it, 
  // but since we are in a node script using tsx, we can import it directly.
  const { EXERCISES } = await import("../src/data/exercises");
  
  console.log(`Loaded ${EXERCISES.length} exercises from catalog.`);

  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  for (const ex of EXERCISES) {
    try {
      const hash = require("crypto").createHash("sha256").update(ex.name).digest("hex").slice(0, 16);
      
      const { generateImage } = await import("../src/lib/image-generator");
      
      const result = await generateImage({
        prompt: `Create a professional fitness instruction image showing one realistic adult athlete performing exactly ${ex.name}. Category: ${ex.category}.`,
        slug: ex.slug,
        hash: hash
      });

      if (result && result.imageUrl) {
        console.log(`✅ Success: ${ex.slug}`);
        successCount++;
        
        const data = {
          exerciseName: ex.name,
          imageUrl: result.imageUrl,
          imageAlt: `${ex.name} exercise form`,
          imageSource: "ai_generated",
          imagePromptHash: hash
        };

        // Let's update exercise-assets.ts to inject the new metadata.
        updateAssetFile(ex.slug, data);

      } else {
        console.log(`❌ Failed: ${ex.slug} - Unknown error`);
        failCount++;
      }
      
      // Sleep to avoid rate limits
      await new Promise(r => setTimeout(r, 1000));
      
    } catch (err) {
      console.error(`Error processing ${ex.slug}:`, err);
      failCount++;
    }
  }

  console.log(`\nGeneration complete!`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Skipped: ${skippedCount}`);
}

function updateAssetFile(slug: string, data: any) {
  const assetsPath = path.join(process.cwd(), "src", "data", "exercise-assets.ts");
  let content = fs.readFileSync(assetsPath, "utf-8");

  const entryStart = content.indexOf(`"${slug}": {`);
  if (entryStart === -1) {
    // Need to insert new entry
    const endMatch = content.lastIndexOf("};");
    if (endMatch !== -1) {
      const newEntry = `  "${slug}": {
    exerciseSlug: "${slug}",
    exerciseName: "${data.exerciseName}",
    imageUrl: "${data.imageUrl}",
    imageAlt: "${data.imageAlt}",
    imageStatus: "ready",
    imageSource: "${data.imageSource}",
    imagePromptHash: "${data.imagePromptHash}"
  },\n`;
      content = content.slice(0, endMatch) + newEntry + content.slice(endMatch);
      fs.writeFileSync(assetsPath, content, "utf-8");
    }
  } else {
    // We already have an entry, let's just append the image fields right before the closing brace
    const nextBrace = content.indexOf("},", entryStart);
    if (nextBrace !== -1) {
      // Check if imageUrl is already there
      const entryText = content.slice(entryStart, nextBrace);
      if (entryText.includes("imageUrl:")) {
        // Skip updating for now or replace lines
        return;
      }
      
      const toInject = `\n    imageUrl: "${data.imageUrl}",\n    imageAlt: "${data.imageAlt}",\n    imageStatus: "ready",\n    imageSource: "${data.imageSource}",\n    imagePromptHash: "${data.imagePromptHash}"`;
      content = content.slice(0, nextBrace) + toInject + content.slice(nextBrace);
      fs.writeFileSync(assetsPath, content, "utf-8");
    }
  }
}

generateAll().catch(console.error);
