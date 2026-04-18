export interface Entry {
  id: string;
  text: string;
  weight: number;
}

export interface WheelSettings {
  spinDuration: number;
  showWinnerDialog: boolean;
  enableSound: boolean;
  theme: 'vibrant' | 'pastel' | 'monochrome' | 'dark' | 'natural';
}

export const DEFAULT_ENTRIES: Entry[] = [
  { id: '1', text: 'Option 1', weight: 1 },
  { id: '2', text: 'Option 2', weight: 1 },
  { id: '3', text: 'Option 3', weight: 1 },
  { id: '4', text: 'Option 4', weight: 1 },
  { id: '5', text: 'Option 5', weight: 1 },
];

export const THEMES = {
  vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FDCB6E', '#6C5CE7', '#A8E6CF'],
  pastel: ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'],
  monochrome: ['#1A1A1A', '#333333', '#4D4D4D', '#666666', '#808080', '#999999', '#B3B3B3', '#CCCCCC'],
  dark: ['#2D3436', '#636E72', '#B2BEC3', '#DFE6E9', '#0984E3', '#00CEC9', '#D63031', '#E17055'],
  natural: ['#8b9d83', '#e6ccb2', '#b87d64', '#c7d5b1', '#d4a373', '#faedcd', '#ccd5ae', '#e9edc9'],
};
