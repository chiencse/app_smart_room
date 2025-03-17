import { useEffect } from "react";
import { useRouter, usePathname } from "expo-router";

export default function useRouteLogger() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("Navigated to:", pathname);
  }, [pathname]); // Logs route changes

  return router;
}
