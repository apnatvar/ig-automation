import ConnectedAccountsCard from "@/components/pages/all-accounts";
import UrlToast from "@/components/toasts";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Suspense>
        <UrlToast />
      </Suspense>
      <ConnectedAccountsCard />
    </>
  );
}
