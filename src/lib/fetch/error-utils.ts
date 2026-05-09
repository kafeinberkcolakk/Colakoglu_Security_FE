import { AxiosError } from "axios";

const HTTP_UNAUTHORIZED = 401;
const HTTP_CLIENT_MIN = 400;
const HTTP_CLIENT_MAX = 499;

function statusOf(error: unknown): number | undefined {
  if (error instanceof AxiosError) {
    return error.response?.status;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status: unknown }).status === "number"
  ) {
    return (error as { status: number }).status;
  }
  return undefined;
}

export function is401(error: unknown): boolean {
  return statusOf(error) === HTTP_UNAUTHORIZED;
}

export function isClient4xx(error: unknown): boolean {
  const status = statusOf(error);
  return (
    status !== undefined &&
    status >= HTTP_CLIENT_MIN &&
    status <= HTTP_CLIENT_MAX
  );
}
