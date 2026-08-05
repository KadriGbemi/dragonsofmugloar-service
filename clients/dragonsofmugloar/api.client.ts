import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

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

  private handleError(error: AxiosError): Error {
    if (error.response) {
      return new Error(
        `Dragons of Mugloar API responded with ${error.response.status}`,
      );
    }

    if (error.request) {
      return new Error("Dragons of Mugloar API is unavailable.");
    }

    return new Error(error.message);
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
