"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function useEnsurePaginationDefaults() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.toString() === "") {
      router.replace("?page=0&size=10", { scroll: false });
    }
  }, [router, searchParams]);
}
