export interface BadgeProps {
  id: string;
  source: { uri: string };
  label: string;
  userId: string;
}

export interface BadgeComponents {
  name: string;
  image: string;
  size: number;
  margin: number;
  custom?: object;
}

export type BadgeCache = {
  badge: number;
  lastFetch: number;
};

export type BadgeGroupItem = { 
  type: string; 
  label: string; 
  uri: string 
};