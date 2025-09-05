import InstagramLoginCard from "@/components/cards/ig-connect-card";
import AutoReplyCard from "@/components/cards/create-comment-campaign-card";
import SignUpCard from "@/components/cards/signup-card";
import ReviewCampaignsCard from "@/components/cards/review-campaigns";
import CampaignCard from "@/components/cards/ig-comment-campaign-card";
import SocialCampaignsCard from "@/components/cards/all-campaigns-card";
import LoginCard from "@/components/cards/login-card";
import LandingHero from "@/components/hero";

export default function Home() {
  return (
    <>
    <LandingHero/>
    <LoginCard/>
    <InstagramLoginCard/>
    <AutoReplyCard/>
    <SignUpCard/>
    <ReviewCampaignsCard/>
    {/* <TotalCommentsCard/>
    <CommentsWithKeywordCard/>
    <CommentsRepliedToCard/> */}
    <CampaignCard/>
    <SocialCampaignsCard/>
    </>
  );
}
