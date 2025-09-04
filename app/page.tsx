import { DataCard } from "@/components/cards/login-card";
import InstagramLoginCard from "@/components/cards/ig-connect-card";
import AutoReplyCard from "@/components/cards/interaction-card";
import SignUpCard from "@/components/cards/signup-card";

export default function Home() {
  return (
    <><DataCard/><InstagramLoginCard/><AutoReplyCard/><SignUpCard/></>
  );
}
