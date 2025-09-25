import ReviewCampaignsCard from "@/components/cards/review-campaigns";
import InstagramOverviewCard from "@/components/pages/instagram-summary";
import UrlToast from "@/components/toasts";
import { Suspense } from "react";

export default function AllCampaigns() {
  return (
    <>
      <Suspense>
        <UrlToast />
      </Suspense>
      <InstagramOverviewCard />
      <ReviewCampaignsCard />
    </>
  );
}
