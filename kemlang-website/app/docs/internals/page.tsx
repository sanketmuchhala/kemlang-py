import { redirect } from "next/navigation";

export default function InternalsRedirect() {
  redirect("/docs/how-it-works");
}
