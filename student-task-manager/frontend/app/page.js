import { redirect } from "next/navigation";

// The dashboard route group is wrapped in AuthGuard, which will bounce
// unauthenticated users to /login automatically.
export default function RootPage() {
  redirect("/overview");
}
