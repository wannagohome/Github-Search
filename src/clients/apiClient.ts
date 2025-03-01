import { Repository } from "../models";

interface SearchRepositoriesResponse {
  items: Repository[];
  total_count: number;
}

export class ApiClient {
  private static readonly BASE_URL = "https://api.github.com";

  static async searchRepositories(
    keyword: string,
    page: number = 1
  ): Promise<SearchRepositoriesResponse | null> {
    if (!keyword.trim()) {
      return null;
    }

    const response = await fetch(
      `${this.BASE_URL}/search/repositories?q=${encodeURIComponent(
        keyword
      )}&page=${page}`
    );

    if (!response || !response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      items: data.items || [],
      total_count: data.total_count || 0,
    };
  }
}
