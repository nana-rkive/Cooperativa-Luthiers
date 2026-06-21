export interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  code?: string;
  message: string;
  details?: string[] | Record<string, string[]>;
}
