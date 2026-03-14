import rss from '@astrojs/rss';
import { getArticles } from '../utils/api';

export async function GET(context) {
  const articles = await getArticles();
  
  return rss({
    title: 'DFFW Daily',
    description: 'The fastest, minimalist local news for the Dallas-Frisco-Fort Worth metroplex.',
    site: context.site || 'https://dffwdaily.com',
    items: articles.map((post) => ({
      title: post.title,
      pubDate: new Date(post.published_at),
      description: post.content.substring(0, 150) + '...',
      link: `/articles/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
