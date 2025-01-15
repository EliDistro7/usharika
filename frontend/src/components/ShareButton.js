// ShareButton.js
import React from "react";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  ButtonGroup,
} from "react-bootstrap";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
import { FaInstagram, FaShareAlt } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

const ShareButton = ({ url, title }) => {
  const handleWebShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: `Angalia ${title} kwenye platform yetu!`,
          url: url,
        })
        .then(() => console.log("Content shared successfully!"))
        .catch((error) => console.error("Error sharing content:", error));
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  const instagramShareUrl = `https://www.instagram.com/?url=${encodeURIComponent(url)}`;

  return (
    <DropdownButton
      as={ButtonGroup}
      id="dropdown-custom-components"
      title={<><FaShareAlt /> Share</>}
      variant="outline-secondary"
      className="rounded shadow-sm"
    >
      {/* Web Share Button */}
      <Dropdown.Item onClick={handleWebShare}>
        Share Link
      </Dropdown.Item>
      
      {/* Social Media Share Buttons */}
      <Dropdown.Item>
        <FacebookShareButton url={url} quote={`Check out ${title} on our platform!`}>
          <FacebookIcon size={32} round /> Facebook
        </FacebookShareButton>
      </Dropdown.Item>
      <Dropdown.Item>
        <TwitterShareButton url={url} title={`Check out ${title} on our platform!`}>
          <BsTwitterX size={32} round /> Twitter
        </TwitterShareButton>
      </Dropdown.Item>
      <Dropdown.Item>
        <WhatsappShareButton url={url} title={`Check out ${title} on our platform!`}>
          <WhatsappIcon size={32} round /> WhatsApp
        </WhatsappShareButton>
      </Dropdown.Item>

      {/* Instagram Share Button */}
      <Dropdown.Item href={instagramShareUrl} target="_blank" rel="noopener noreferrer">
        <FaInstagram size={32} style={{ marginRight: "8px" }} />
        Instagram
      </Dropdown.Item>
    </DropdownButton>
  );
};

export default ShareButton;
