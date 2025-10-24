import { redirect, useSearchParams } from "react-router";
import type { Route } from "./+types/home";
import PageLayout from "../components/PageLayout";
import VerificationForm from "../components/VerificationForm";
import RecentVerifications from "../components/verification/RecentVerifications";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title:
        (import.meta.env.VITE_ENV && import.meta.env.VITE_ENV !== "production"
          ? `(${import.meta.env.VITE_ENV}) `
          : "") + "verify.sourcify.dev",
    },
    {
      name: "description",
      content: "Verify your smart contracts with Sourcify",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader?.includes("better-auth.session_token")) {
    throw redirect(
      import.meta.env.VITE_ENV === "production"
        ? "https://evm.walnut.dev/login"
        : "http://evm.walnut.local/login"
    );
  }
}

export default function Home() {
  const [searchParams] = useSearchParams();
  const preselectedChainId = searchParams.get("chainId") || undefined;
  return (
    <PageLayout title="Verify Smart Contracts">
      <>
        <VerificationForm preselectedChainId={preselectedChainId} hideImport />
        <div className="p-4 md:p-8 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <RecentVerifications />
        </div>
      </>
    </PageLayout>
  );
}
