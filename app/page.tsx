import { DataCard } from "@/components/cards/login-card";
import InstagramLoginCard from "@/components/cards/ig-connect-card";
import AutoReplyCard from "@/components/cards/interaction-card";
import SignUpCard from "@/components/cards/signup-card";
import ReviewCampaignsCard from "@/components/cards/review-campaigns";
import CampaignCard from "@/components/cards/campaign-card";
import SocialCampaignsCard from "@/components/cards/all-campaigns-card";

export default function Home() {
  return (
    <>
    <DataCard/>
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
