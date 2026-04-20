import { redirect } from "next/navigation";

/**
 * /ecosystem — top-level route guard.
 * Redirects to the first valid sub-page so users never hit a 404
 * when clicking the "Ecosystem" label in the Navbar.
 */
export default function EcosystemPage() {
  redirect("/ecosystem/investors");
}
