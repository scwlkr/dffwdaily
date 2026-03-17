# Image Automation Guide

This guide outlines the complete process to automatically generate and attach free, high-quality images to both future and existing DFFW Daily articles using cost-free APIs (like Google's Gemini / Imagen APIs or huggingface inference).

## The Strategy

To keep infrastructure costs at zero, we leverage AI generative image APIs within our Node.js automation script. Instead of paying for stock photos, the system will read the article context, generate an optimized prompt, request an image, store it in Supabase Storage, and link it to the article record.

## 1. Setting Up Free Image Generation

### Option A: Google Gemini / Imagen (Recommended)
Since we already use the Gemini API for text generation, we can leverage Google's Image generation capabilities.

1. Obtain a Google AI Studio API Key (if not already using one for text).
2. Add the key to your `automation/.env` file: `GEMINI_API_KEY=your_key_here`.

### Option B: Hugging Face Inference API (Free Tier)
For open-source stable diffusion models.

1. Create a free account at Hugging Face.
2. Generate an access token and add it to `automation/.env` as `HF_API_KEY=your_key_here`.

## 2. Automating Future Articles

We will update the GitHub Action's `index.js` automation script.

### Step-by-Step Implementation:

1. **Generate the Image Prompt**: After Gemini writes the news round-up, ask it to output a single highly descriptive image prompt (e.g., "A hyper-realistic, dark and moody skyline of Dallas Texas at twilight, minimal, high contrast, 16:9").
2. **Call the Image API**:
   ```javascript
   // Example pseudo-code for fetching an image
   const imageResponse = await fetch('IMAGE_API_ENDPOINT', {
       method: 'POST',
       headers: { 'Authorization': `Bearer ${process.env.GEMINI_API_KEY}` },
       body: JSON.stringify({ prompt: generatedPrompt, aspectRatio: "16:9" })
   });
   const imageBuffer = await imageResponse.arrayBuffer();
   ```
3. **Upload to Supabase Storage**:
   ```javascript
   const fileName = `article-headers/${Date.now()}.jpg`;
   const { data, error } = await supabase.storage
       .from('images')
       .upload(fileName, imageBuffer, { contentType: 'image/jpeg' });
   
   const publicImageUrl = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl;
   ```
4. **Attach to Article**: When executing the SQL `INSERT` into the `articles` table, include the `publicImageUrl` in the `image_url` column.

## 3. Backfilling Existing Articles

To add images to articles that have already been published without them:

1. Create a new utility script: `automation/backfill_images.js`.
2. **Query Missing Images**: 
   ```javascript
   const { data: articles } = await supabase
       .from('articles')
       .select('id, title, content')
       .is('image_url', null);
   ```
3. **Process in Batches**: Loop through the `articles` array. To avoid rate limits on free tiers, process 5 articles at a time using a delay (`setTimeout`).
4. **Generate & Update**: For each article, feed the `title` and `content` to the LLM to generate an image prompt. Generate the image, upload it to Supabase Storage, and run an `UPDATE` query:
   ```javascript
   await supabase
       .from('articles')
       .update({ image_url: publicImageUrl })
       .eq('id', article.id);
   ```

## 4. Optimization & Best Practices

- **WebP Conversion**: If your free API returns PNG/JPEG, use a lightweight Node library like `sharp` to convert the buffer to `WebP` before uploading to Supabase. This saves bandwidth and improves frontend Lighthouse scores.
- **Error Handling**: Wrap the image generation block in a `try/catch`. If the API fails, insert the article anyway with a `null` image_url, and let the backfill script catch it later.
- **Styling**: On the Astro frontend, ensure the `<img />` tag uses `loading="lazy"`, `decoding="async"`, and `object-fit="cover"` with a fallback gradient incase the image is missing.
