export type Player = 'A' | 'B';
export type RaceType = 3 | 5 | 7;

export interface GameRecord {
  id: string;
  index: number;
  winner: Player;
  rawScoreA: number;
  rawScoreB: number;
  finalScoreA: number;
  finalScoreB: number;
  handicapValue: number;
  handicapRecipient: Player | null;
  isGoldenGame: boolean;
  advantage: number;
  note?: string; 
}

export interface MatchState {
  playerAName: string;
  playerBName: string;
  totalCost: number;
  winsA: number;
  winsB: number;
  raceType: RaceType;
  games: GameRecord[];
  isFinished: boolean;
  matchWinner: Player | null;
}

export type ViewName = 'calculator' | 'rules' | 'history';
