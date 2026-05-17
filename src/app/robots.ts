import type {MetadataRoute} from 'next';
import {absoluteUrl} from '@/lib/seo';

const AI_AND_SEARCH_BOTS = [
  'Googlebot',
  'Bingbot',
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'ChatGPT-User',
  'OAI-SearchBot',
  'PerplexityBot',
  'Applebot-Extended',
  'Google-Extended',
  'FacebookBot'
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/admin/', '/api/'];
  return {
    rules: [
      {userAgent: '*', allow: '/', disallow},
      ...AI_AND_SEARCH_BOTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow
      }))
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/')
  };
}
