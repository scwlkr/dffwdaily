export interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string;
  published_at: string;
  status: string;
}

export async function getArticles(): Promise<Article[]> {
  const supabaseUrl = import.meta.env.SUPABASE_URL;
  const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;
  
  // Provide robust mock data if Supabase keys are not set, ensuring the build never fails prematurely.
  if (!supabaseUrl || !supabaseKey) {
    console.warn("[DFFW Daily] No Supabase credentials found. Rendering mock articles.");
    return [
      {
        id: "tech-corridor-frisco",
        title: "The Rapid Expansion of Frisco's Tech Corridor",
        content: "New tech companies are flooding into Frisco bringing thousands of jobs to the area. Leaders predict unprecedented growth over the next five years.\n\n## The Economic Boom\nIt's undeniable that the landscape is changing. Corporate campuses are replacing empty fields, bringing a new era of prosperity.",
        image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600&h=900",
        published_at: new Date().toISOString(),
        status: "published"
      },
      {
        id: "fort-worth-stockyards",
        title: "Fort Worth's Historic Stockyards Undergo Modernization",
        content: "City planners announce a delicate balance between preserving history and implementing necessary modern infrastructure upgrades to the historic districts.\n\n## Striking a Balance\nThe cobblestones remain, but new subterranean facilities aim to improve local utilities without disturbing the aesthetic.",
        image_url: "https://images.unsplash.com/photo-1549480119-94ce126dc632?auto=format&fit=crop&q=80&w=1600&h=900",
        published_at: new Date(Date.now() - 86400000).toISOString(),
        status: "published"
      }
    ];
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/articles?select=*&status=eq.published&order=published_at.desc`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (!res.ok) {
      console.error("[DFFW Daily] Failed to fetch articles", await res.text());
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("[DFFW Daily] Fetch error:", err);
    return [];
  }
}
