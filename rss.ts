import Parser from 'rss-parser';
import { NewsItem, NewsTopic, NewsSource } from '@/types';

const parser = new Parser();

export const FEEDS = [
  { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC' as NewsSource, defaultTopic: 'GEOPOLITICS' as NewsTopic },
  { url: 'https://moxie.foxnews.com/google-publisher/world.xml', source: 'FOX_NEWS' as NewsSource, defaultTopic: 'GEOPOLITICS' as NewsTopic },
  { url: 'https://www.defensenews.com/arc/outboundfeeds/rss/', source: 'DEFENSE_NEWS' as NewsSource, defaultTopic: 'DEFENSE' as NewsTopic },
  { url: 'https://news.google.com/rss/search?q=site:reuters.com', source: 'REUTERS' as NewsSource, defaultTopic: 'GEOPOLITICS' as NewsTopic },
];

export function determineTopic(title: string, content: string, defaultTopic: NewsTopic): NewsTopic {
  const text = (title + ' ' + content).toLowerCase();
  if (text.includes('cyber') || text.includes('hack') || text.includes('breach')) return 'CYBER';
  if (text.includes('military') || text.includes('army') || text.includes('weapon') || text.includes('defense') || text.includes('pentagon')) return 'DEFENSE';
  if (text.includes('war ') || text.includes('conflict') || text.includes('battle') || text.includes('fighting') || text.includes('strike')) return 'CONFLICTS';
  if (text.includes('nuclear') || text.includes('atomic') || text.includes('uranium')) return 'NUCLEAR';
  if (text.includes('terror') || text.includes('attack') || text.includes('bomb')) return 'TERRORISM';
  if (text.includes('tech') || text.includes('ai ') || text.includes('software') || text.includes('innovation')) return 'TECHNOLOGY';
  if (text.includes('economy') || text.includes('market') || text.includes('stock') || text.includes('fed ') || text.includes('trade')) return 'ECONOMIC';
  if (text.includes('space ') || text.includes('satellite') || text.includes('nasa') || text.includes('orbit')) return 'SPACE';
  if (text.includes('climat') || text.includes('environment') || text.includes('carbon') || text.includes('warming')) return 'CLIMATE';
  if (text.includes('earthquake') || text.includes('flood') || text.includes('disaster') || text.includes('storm')) return 'DISASTERS';
  if (text.includes('health') || text.includes('virus') || text.includes('pandemic') || text.includes('medical')) return 'HEALTH';
  if (text.includes('election') || text.includes('treaty') || text.includes('diploma') || text.includes('president')) return 'GEOPOLITICS';
  return defaultTopic;
}

export function determineThreat(title: string, content: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const text = (title + ' ' + content).toLowerCase();
  if (text.includes('breaking') || text.includes('urgent') || text.includes('critical') || text.includes('emergency') || text.includes('escalat')) return 'CRITICAL';
  if (text.includes('warning') || text.includes('threat') || text.includes('danger') || text.includes('significant')) return 'HIGH';
  if (text.includes('update') || text.includes('ongoing') || text.includes('develop')) return 'MEDIUM';
  return 'LOW';
}

export function parseLocation(title: string, content: string): string {
  const regions = ['Israel', 'Gaza', 'Ukraine', 'Russia', 'Washington', 'Beijing', 'London', 'Brussels', 'Tehran', 'Moscow', 'Kyiv', 'Jerusalem', 'Tel Aviv', 'Beirut', 'Damascus', 'Cairo', 'Riyadh', 'Taiwan'];
  const text = (title + ' ' + content);
  for (const region of regions) {
    if (text.includes(region)) return region.toUpperCase();
  }
  return 'GLOBAL';
}

export async function fetchIntelligenceData(): Promise<NewsItem[]> {
  const allItems: NewsItem[] = [];

  interface ParsedItem {
    title?: string;
    content?: string;
    contentSnippet?: string;
    link?: string;
    pubDate?: string;
    guid?: string;
  }

  const feedPromises = FEEDS.map(async (feedEntry) => {
    try {
      const feed = await parser.parseURL(feedEntry.url);

      const mappedItems: NewsItem[] = (feed.items as ParsedItem[]).slice(0, 1).map((item) => {
        const content = item.contentSnippet || item.content || '';
        const topic = determineTopic(item.title || '', content, feedEntry.defaultTopic);

        return {
          id: item.guid || item.link || Math.random().toString(36),
          timestamp: item.pubDate ? new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live',
          date: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          source: feedEntry.source,
          topic: topic,
          title: item.title || 'Untitled Update',
          brief: {
            point1: content.slice(0, 150) + (content.length > 150 ? '...' : ''),
            point2: "Source: " + feedEntry.source,
            point3: item.link || '#'
          },
          originalUrl: item.link || '#',
          severity: 3,
          location: parseLocation(item.title || '', content),
          threatLevel: determineThreat(item.title || '', content)
        } as NewsItem;
      });
      return mappedItems;
    } catch (err) {
      console.error(`Failed to fetch ${feedEntry.url}:`, err);
      return [] as NewsItem[];
    }
  });

  const results = await Promise.all(feedPromises);
  results.forEach((res) => allItems.push(...res));

  // Sort by date newest first
  allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return allItems;
}
