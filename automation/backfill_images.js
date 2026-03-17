import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// Removed Gemini as it's rate limited for testing
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function generateImage(leadStorySummary) {
  console.log('🎨 Generating image via Pollinations.ai for testing...');
  try {
    const url = `https://loremflickr.com/1200/675/dallas,news?random=${Math.floor(Math.random() * 1000)}`;
    
    // Fetch the image
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('⚠️ Image generation failed:', error);
  }
  return null;
}

async function uploadImage(imageBuffer) {
  if (!imageBuffer) return null;

  console.log('☁️ Uploading image to Supabase Storage...');
  const fileName = `article-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.jpg`;
  
  const { data, error } = await supabase.storage
    .from('public-images')
    .upload(fileName, imageBuffer, {
      contentType: 'image/jpeg',
      upsert: false
    });
    
  if (error) throw error;
  
  const { data: publicUrlData } = supabase.storage
    .from('public-images')
    .getPublicUrl(fileName);
    
  return publicUrlData.publicUrl;
}

async function backfillImages() {
  console.log('🔍 Checking for articles without an image or with placeholder URL...');
  
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, content, image_url')
    .or('image_url.is.null,image_url.ilike.%placehold.co%');

  if (error) {
    console.error('❌ Supabase Query Error:', error);
    return;
  }

  if (!articles || articles.length === 0) {
    console.log('✅ No articles found requiring image backfills.');
    return;
  }

  console.log(`📌 Found ${articles.length} articles to process.`);

  for (const article of articles) {
    console.log(`\\n▶️ Processing Article ID: ${article.id}`);
    console.log(`   Title: ${article.title}`);

    // Wait a bit to respect free tier limits
    await new Promise(resolve => setTimeout(resolve, 5000));

    // For the prompt, use the title and a snippet of the content
    const snippet = article.content ? article.content.substring(0, 200) : '';
    const leadStorySummary = `${article.title}. Context: ${snippet}`;

    try {
      const imageBuffer = await generateImage(leadStorySummary);
      
      if (imageBuffer) {
        const publicUrl = await uploadImage(imageBuffer);
        if (publicUrl) {
          console.log(`✅ Image generated and uploaded: ${publicUrl}`);
          
          await supabase
            .from('articles')
            .update({ image_url: publicUrl })
            .eq('id', article.id);
            
          console.log('✅ Article DB record updated!');
        }
      } else {
        console.log('⏭️ Skipping: No image was returned.');
      }
    } catch (e) {
      console.error(`❌ Failed to process article ID ${article.id}:`, e.message);
    }
  }
  
  console.log('\\n🎉 Backfill complete!');
}

backfillImages();
