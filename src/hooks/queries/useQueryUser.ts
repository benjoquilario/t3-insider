import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "@/lib/metrics"
import { useSession } from "next-auth/react"

export function useQueryUser() {
  const { data: session } = useSession()
  const userId = session?.user.id

  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => getCurrentUser(),
  })
}
