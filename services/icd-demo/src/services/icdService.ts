import axios from 'axios';
import { icdAuthService } from './icdAuthService';
import { AppError } from '../middleware/errorHandler';

interface SearchResultItem {
  id: string;
  title: string;
  theCode?: string;
  [key: string]: any;
}

interface SearchResponse {
  destinationEntities?: SearchResultItem[];
  [key: string]: any;
}

export class IcdService {
  private static instance: IcdService;
  private readonly baseUrl = 'https://id.who.int/icd';

  private constructor() {}

  public static getInstance(): IcdService {
    if (!IcdService.instance) {
      IcdService.instance = new IcdService();
    }
    return IcdService.instance;
  }

  /**
   * Helper to strip HTML tags (like <em class="match">) from search titles.
   */
  private cleanTitle(title: any): string {
    if (typeof title === 'string') {
      return title.replace(/<[^>]*>/g, '');
    }
    if (title && typeof title === 'object' && title['@value']) {
      return String(title['@value']).replace(/<[^>]*>/g, '');
    }
    return '';
  }

  /**
   * Extract the last segment (numeric ID) from a WHO entity URI.
   */
  private extractIdFromUri(uri: string): string {
    if (!uri) return '';
    const parts = uri.split('/');
    return parts[parts.length - 1] || '';
  }

  /**
   * Searches the WHO ICD-11 Foundation/linearization API.
   */
  public async searchDiseases(query: string) {
    if (!query || query.trim() === '') {
      const error: AppError = new Error('Query parameter "q" is required.');
      error.statusCode = 400;
      throw error;
    }

    try {
      const token = await icdAuthService.getAccessToken();
      const searchUrl = `${this.baseUrl}/entity/search`;

      console.log(`[IcdService] Executing search for query: "${query}"`);

      const response = await axios.get<SearchResponse>(searchUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'API-Version': 'v2',
          'Accept-Language': 'en'
        },
        params: {
          q: query
        }
      });

      const destinationEntities = response.data.destinationEntities || [];
      
      const results = destinationEntities.map(entity => ({
        id: this.extractIdFromUri(entity.id),
        code: entity.theCode || '',
        title: this.cleanTitle(entity.title)
      }));

      return {
        success: true,
        query,
        total: results.length,
        results
      };

    } catch (error: any) {
      console.error(`[IcdService] Error during search for "${query}":`, error.response?.data || error.message);
      
      const appError: AppError = new Error(
        error.response?.data?.message || 'Failed to fetch search results from WHO ICD API.'
      );
      appError.statusCode = error.response?.status || 500;
      appError.details = error.response?.data;
      throw appError;
    }
  }

  /**
   * Gets details for a specific ICD-11 entity.
   */
  public async getEntityDetails(id: string) {
    // Sanitize input to allow only alphanumeric characters, preventing SSRF or traversal.
    const sanitizedId = id.replace(/[^a-zA-Z0-9]/g, '');
    if (!sanitizedId) {
      const error: AppError = new Error('Invalid entity ID format.');
      error.statusCode = 400;
      throw error;
    }

    try {
      const token = await icdAuthService.getAccessToken();
      const entityUrl = `${this.baseUrl}/entity/${sanitizedId}`;

      console.log(`[IcdService] Requesting entity details for ID: "${sanitizedId}"`);

      const response = await axios.get(entityUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'API-Version': 'v2',
          'Accept-Language': 'en'
        }
      });

      const data = response.data;

      // Extract title
      let title = '';
      if (data.title) {
        title = this.cleanTitle(data.title);
      }

      // Extract definition
      let definition = '';
      if (data.definition) {
        definition = this.cleanTitle(data.definition);
      } else if (data.longDefinition) {
        definition = this.cleanTitle(data.longDefinition);
      }

      // Extract parent ID
      let parent = '';
      if (Array.isArray(data.parent) && data.parent.length > 0) {
        parent = this.extractIdFromUri(data.parent[0]);
      } else if (typeof data.parent === 'string') {
        parent = this.extractIdFromUri(data.parent);
      }

      // Extract children IDs
      let children: string[] = [];
      if (Array.isArray(data.child)) {
        children = data.child
          .map((childUri: string) => this.extractIdFromUri(childUri))
          .filter(Boolean);
      }

      return {
        success: true,
        data: {
          id: this.extractIdFromUri(data['@id'] || entityUrl),
          code: data.code || '',
          title,
          definition,
          parent,
          children
        }
      };

    } catch (error: any) {
      console.error(`[IcdService] Error fetching details for ID "${sanitizedId}":`, error.response?.data || error.message);
      
      const appError: AppError = new Error(
        error.response?.status === 404
          ? `ICD Entity with ID "${sanitizedId}" not found.`
          : 'Failed to fetch entity details from WHO ICD API.'
      );
      appError.statusCode = error.response?.status || 500;
      appError.details = error.response?.data;
      throw appError;
    }
  }
}

export const icdService = IcdService.getInstance();
