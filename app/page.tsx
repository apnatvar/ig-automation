"use client";
import InstagramLoginCard from "@/components/cards/ig-connect-card";
import AutoReplyCard from "@/components/cards/create-comment-campaign-card";
import SignUpCard from "@/components/cards/signup-card";
import ReviewCampaignsCard from "@/components/cards/review-campaigns";
import CampaignCard from "@/components/cards/ig-comment-campaign-card";
import SocialCampaignsCard from "@/components/cards/all-campaigns-card";
import LoginCard from "@/components/cards/login-card";
import LandingHero from "@/components/hero";
import ConnectedAccountsCard from "@/components/cards/all-accounts-card";
import {
  TotalCommentsCard,
  CommentsWithKeywordCard,
  CommentsRepliedToCard,
} from "@/components/cards/analytics-campaign";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import DynamicLogin from "@/components/dynamic-overlays/login";
import DynamicSignUp from "@/components/dynamic-overlays/signup";

export default function Home() {
  const isMobile = useIsMobile();
  return (
    //TODO add more dynamic overlays to minimise number of routes
    <>
      {isMobile && <SidebarTrigger />}
      <DynamicLogin />
      <DynamicSignUp />
      <LandingHero />
      <LoginCard />
      <InstagramLoginCard />
      <AutoReplyCard />
      <SignUpCard />
      <ReviewCampaignsCard />
      <CampaignCard />
      <SocialCampaignsCard />
      <ConnectedAccountsCard />
      <TotalCommentsCard />
      <CommentsWithKeywordCard />
      <CommentsRepliedToCard />
    </>
  );
}
