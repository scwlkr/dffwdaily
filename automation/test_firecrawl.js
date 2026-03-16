import FirecrawlApp from '@mendable/firecrawl-js';
import dotenv from 'dotenv';
dotenv.config();
const app = new FirecrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});
app.search('test').then(res => {
  console.log("IsArray?", Array.isArray(res));
  console.log("Keys:", Object.keys(res));
  if (res.data) console.log("Has data that is Array?", Array.isArray(res.data));
}).catch(console.error);
