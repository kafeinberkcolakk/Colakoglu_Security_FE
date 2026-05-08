export interface ApiResponse<T> {
  code: number;
  data: T;
  isSuccess: boolean;
  message: string;
}
