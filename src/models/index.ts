export interface Repository {
  id: number;
  name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
}

export interface Search {
  keyword: string;
  date: Date;
}