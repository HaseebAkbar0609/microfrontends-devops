export interface WebinarStateType {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  teams_link: string;
}

export interface WebinarContextType {
  webinars: Record<string, WebinarStateType[]>;
  isLoading: boolean;
}
