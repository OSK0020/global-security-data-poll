export type NewsTopic = 'ALL' | 'CYBER' | 'GEOPOLITICS' | 'DEFENSE';
export type NewsSource = 'REUTERS' | 'BBC' | 'AP' | 'HACKER_NEWS' | 'DARK_READING' | 'DEFENSE_NEWS' | 'AL_JAZEERA' | 'SPACE';

export interface IntelligenceBrief {
  point1: string;
  point2: string;
  point3: string;
}

export interface NewsItem {
  id: string;
  timestamp: string; // ISO 8601 string or HH:mm format for display
  date: string; // YYYY-MM-DD for calendar grouping
  source: NewsSource;
  topic: NewsTopic;
  title: string;
  brief: IntelligenceBrief;
  originalUrl: string;
  severity: 1 | 2 | 3 | 4 | 5; // For heatmap intensity
}
