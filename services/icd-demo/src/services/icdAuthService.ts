import axios from 'axios';
import { AppError } from '../middleware/errorHandler';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export class IcdAuthService {
  private static instance: IcdAuthService;
  
  private accessToken: string | null = null;
  private tokenType: string | null = null;
  private expiresAt: number = 0; // Epoch timestamp in ms
  private refreshTimeout: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): IcdAuthService {
    if (!IcdAuthService.instance) {
      IcdAuthService.instance = new IcdAuthService();
    }
    return IcdAuthService.instance;
  }

  /**
   * Retrieves the current active access token. 
   * If cached and valid, returns it; otherwise, fetches a new one.
   */
  public async getAccessToken(): Promise<string> {
    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutes in ms

    // Return cached token if still valid beyond buffer time
    if (this.accessToken && this.expiresAt > now + bufferTime) {
      return this.accessToken;
    }

    // Otherwise, fetch new token
    await this.fetchNewToken();
    return this.accessToken!;
  }

  /**
   * Retrieves the raw token details (token_type, expires_in, access_token).
   */
  public async getTokenDetails() {
    const token = await this.getAccessToken();
    const remainingTime = Math.max(0, Math.round((this.expiresAt - Date.now()) / 1000));
    
    return {
      success: true,
      token_type: this.tokenType || 'Bearer',
      expires_in: remainingTime,
      access_token: token
    };
  }

  /**
   * Fetches a new token from WHO Access Management and schedules auto-refresh.
   */
  private async fetchNewToken(): Promise<void> {
    const clientId = process.env.ICD_CLIENT_ID;
    const clientSecret = process.env.ICD_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      const error: AppError = new Error('WHO ICD credentials are not configured in environment variables.');
      error.statusCode = 500;
      throw error;
    }

    try {
      const tokenUrl = 'https://icdaccessmanagement.who.int/connect/token';
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('scope', 'icdapi_access');

      const credentialsBase64 = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      const response = await axios.post<TokenResponse>(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentialsBase64}`
        }
      });

      const { access_token, token_type, expires_in } = response.data;

      this.accessToken = access_token;
      this.tokenType = token_type;
      this.expiresAt = Date.now() + expires_in * 1000;

      console.log(`[IcdAuthService] Successfully fetched new token. Expires in ${expires_in}s.`);

      // Schedule background refresh before it expires
      this.scheduleTokenRefresh(expires_in);

    } catch (error: any) {
      console.error('[IcdAuthService] Error fetching OAuth token:', error.response?.data || error.message);
      const appError: AppError = new Error('Failed to retrieve WHO OAuth token.');
      appError.statusCode = error.response?.status || 500;
      appError.details = error.response?.data;
      throw appError;
    }
  }

  /**
   * Schedules a token refresh to run in the background.
   */
  private scheduleTokenRefresh(expiresInSeconds: number): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    // Refresh 5 minutes (300 seconds) before expiration
    const refreshBuffer = 5 * 60;
    const timeToRefresh = Math.max(10, expiresInSeconds - refreshBuffer); // ensure positive wait

    console.log(`[IcdAuthService] Scheduling background token refresh in ${timeToRefresh}s.`);

    this.refreshTimeout = setTimeout(async () => {
      try {
        console.log('[IcdAuthService] Triggering scheduled background token refresh...');
        await this.fetchNewToken();
      } catch (err: any) {
        console.error('[IcdAuthService] Scheduled background token refresh failed. Will retry on next request.', err.message);
      }
    }, timeToRefresh * 1000);
  }

  // Cleanup method (mostly for testing / clean shutdown if needed)
  public destroy(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }
}

export const icdAuthService = IcdAuthService.getInstance();
