-- 1. Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT NOT NULL,
    published_at TIMESTAMPTZ DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Configure Row Level Security (RLS) for the articles table
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow public anonymous reads for published articles
CREATE POLICY "Public articles are viewable by everyone."
    ON public.articles
    FOR SELECT
    USING (status = 'published');

-- 4. Storage Bucket: Create public-images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('public-images', 'public-images', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage Policy: Allow public read access to the bucket
CREATE POLICY "Public read access to public-images bucket"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'public-images');

-- Note: 
-- The GitHub Actions automation script will use the Service Role Key, 
-- which automagically bypasses RLS for INSERTs and image uploads.
