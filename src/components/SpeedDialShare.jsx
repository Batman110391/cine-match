import ShareIcon from "@mui/icons-material/Share";
import { Hidden, SpeedDial, SpeedDialAction } from "@mui/material";
import React from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  EmailShareButton,
  EmailIcon,
} from "react-share";

export default function SpeedDialShare({ movieID, type, title }) {
  const facebookButtonRef = React.useRef(null);
  const whatsAppButtonRef = React.useRef(null);
  const emailShareButtonRef = React.useRef(null);

  const currentPath = type === "movie" ? "movies" : "showtv";

  const currentUrl = `${window.location.origin}/${currentPath}/${movieID}/${type}`;
  const titleShare = `Cinematch: ${title}`;

  const handleSpeedDialActionClick = (key) => {
    switch (key) {
      case "facebook":
        if (facebookButtonRef.current) {
          facebookButtonRef.current.click();
        }
        break;
      case "whatsapp":
        if (whatsAppButtonRef.current) {
          whatsAppButtonRef.current.click();
        }
        break;
      case "email":
        if (emailShareButtonRef.current) {
          emailShareButtonRef.current.click();
        }
        break;

      default:
        break;
    }
  };

  const actions = [
    <SpeedDialAction
      key="facebook"
      icon={<FacebookIcon size={32} round />}
      tooltipTitle="Condividi su Facebook"
      onClick={() => handleSpeedDialActionClick("facebook")}
    />,
    <SpeedDialAction
      key="whatsapp"
      icon={<WhatsappIcon size={32} round />}
      tooltipTitle="Condividi su WhatsApp"
      onClick={() => handleSpeedDialActionClick("whatsapp")}
    />,
    <SpeedDialAction
      key="email"
      icon={<EmailIcon size={32} round />}
      tooltipTitle="Condividi per Email"
      onClick={() => handleSpeedDialActionClick("email")}
    />,
  ];

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial share"
        direction={"down"}
        icon={<ShareIcon color="action" />}
        FabProps={{
          size: "small",
          sx: {
            background: "transparent",
            boxShadow: "none",
            "&:hover": {
              background: "transparent",
              boxShadow: "none",
            },
          },
        }}
        sx={{
          position: "absolute",
          right: 0,
          top: 10,
        }}
      >
        {actions}
      </SpeedDial>
      <Hidden>
        <FacebookShareButton
          ref={facebookButtonRef}
          url={currentUrl}
          quote={titleShare}
          hashtag={"#cinematch"}
        />
        <WhatsappShareButton
          ref={whatsAppButtonRef}
          url={currentUrl}
          title={titleShare}
        />
        <EmailShareButton
          ref={emailShareButtonRef}
          url={currentUrl}
          subject={"Cinematch info"}
          body={titleShare}
        />
      </Hidden>
    </>
  );
}
