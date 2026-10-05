import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/api', '/auth', '/checkout'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'DuckDuckBot', 'Applebot'],
        allow: '/',
      },
      // AI-powered search engines — allow for visibility in AI search results
      {
        userAgent: ['ChatGPT-User', 'OAI-SearchBot', 'PerplexityBot', 'Claude-Web', 'GoogleOther'],
        allow: '/',
      },
      // Training bots — block to prevent data scraping for model training
      {
        userAgent: [
          'GPTBot',
          'CCBot',
          'Google-Extended',
          'anthropic-ai',
          'Bytespider',
          'FacebookBot',
          'cohere-ai',
        ],
        disallow: '/',
      },
    ],
    sitemap: 'https://thegrowsetu.com/sitemap.xml',
    host: 'https://thegrowsetu.com',
  }
}
