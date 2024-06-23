import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "@/lib/metrics"

export function useQueryUser(userId?: string) {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => getCurrentUser(),
  })
}
