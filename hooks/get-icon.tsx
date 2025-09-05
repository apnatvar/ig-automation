import * as React from "react"
import { FaCircle, FaFacebook, FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from "react-icons/fa6"
/**
 * getSocialIcon — returns a JSX icon for a given platform name.
 * Accepted names: "instagram", "facebook", "linkedin", "youtube", "x", "twitter"
 * Usage: {getSocialIcon("Instagram", { className: "h-6 w-6" })}
 */
export function getSocialIcon(
  name: string,
) {
  const key = name.trim().toLowerCase()
  const Icon =
    key === "instagram"
      ? <FaInstagram className="mr-2 h-4 w-4"/>
      : key === "facebook"
      ? <FaFacebook className="mr-2 h-4 w-4"/>
      : key === "linkedin"
      ? <FaLinkedin className="mr-2 h-4 w-4"/>
      : key === "youtube"
      ? <FaYoutube className="mr-2 h-4 w-4"/>
      : key === "x" || key === "twitter"
      ? <FaXTwitter className="mr-2 h-4 w-4"/>
      : <FaCircle className="mr-2 h-4 w-4"/>
  return Icon
}