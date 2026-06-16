export interface Channel {
  name: string;
  logo: string;
  url: string;
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'sub';
  player: string;
  team: 'home' | 'away';
  subtitle?: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  homeFlag: string;
  awayTeam: string;
  awayFlag: string;
  homeScore: number;
  awayScore: number;
  status: 'LIVE' | 'UPCOMING' | 'FINISHED';
  minute?: number;
  group: string;
  stadium: string;
  city: string;
  date: string;
  time: string;
  events?: MatchEvent[];
}

export interface ChatMessage {
  id: string;
  user: string;
  countryCode: string;
  message: string;
  timestamp: string;
  badge?: 'VIP' | 'MOD' | 'PREMIUM' | 'FANS';
  color: string;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  votes: number[];
  userChoice?: number;
  isClosed: boolean;
}

export interface GroupTable {
  letter: string;
  teams: {
    name: string;
    flag: string;
    played: number;
    points: number;
    goalDiff: number;
  }[];
}
