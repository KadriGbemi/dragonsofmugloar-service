import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

import type { APIResponse } from "../../types/index.types.ts";

export class DragonsOfMugloarAPIClient {
  private readonly client: AxiosInstance;

  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      ...config,
    });

    this.registerInterceptors();
  }

  private registerInterceptors(): void {
    this.client.interceptors.request.use((config) => {
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        throw this.handleError(error);
      },
    );
  }

  private handleError(error: AxiosError): APIResponse<never> {
    if (error.response) {
      if (error.response.status === 404) {
        return {
          success: false,
          error: {
            message: "Game not found or game expired. Start new game.",
            status: 404,
            type: "expired",
          },
        };
      }

      return {
        success: false,
        error: {
          message: `Error: ${error.response.status}, We couldn't reach the game service right now. Please try again shortly.`,
          status: error.response.status,
          type: "api_error",
        },
      };
    }

    if (error.request) {
      return {
        success: false,
        error: {
          message: "Game service is currently unavailable. Try again",
          status: 503,
          type: "unavailable",
        },
      };
    }

    return {
      success: false,
      error: { message: error.message, status: 500, type: "unknown" },
    };
  }

  public async get<T>(url: string): Promise<T> {
    const { data } = await this.client.get<T>(url);
    return data;
  }

  public async post<TResponse, TRequest = unknown>(
    url: string,
    body?: TRequest,
  ): Promise<TResponse> {
    const { data } = await this.client.post<TResponse>(url, body);

    return data;
  }
}
