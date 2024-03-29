import React from "react";
import { Text, Button } from "grommet";
import { Copy } from "grommet-icons";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Floater from "react-floater";
import useClipboard from "react-use-clipboard";

import useResponsive from "../lib/useResponsive";

const CopyIcon = styled(Copy)`
  :hover {
    stroke: #000;
  }
  :active {
    stroke: #666;
  }
`;

const AddressLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: #333;
  :hover {
    background-color: #efefef;
  }
`;

const Address = ({
  address,
  size = "medium",
  type = "node",
  inline = false,
}) => {
  const [isCopied, setCopied] = useClipboard(address);

  const r = useResponsive();

  const textSizes = {
    xsmall: "12px",
    medium: "20px",
    large: r({ default: "30px", small: "40px" }),
    default: "36px",
  };
  const margin = {
    xsmall: "x-small",
    medium: "x-small",
    large: "small",
    default: "x-small",
  };
  const weights = {
    xsmall: "normal",
    medium: "normal",
    large: "bold",
    default: "bold",
  };
  const isDesktop = r({ default: false, medium: true });

  const addressLink = (
    <AddressLink
      to={`/${type === "node" ? "sn" : "user"}/${address}`}
    >{`${address.substr(0, 8)}…${address.substr(-4)}`}</AddressLink>
  );

  return (
    <div
      style={{
        display: inline ? "inline-flex" : "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text
        margin={{ right: margin[size] || margin.default }}
        size={textSizes[size] || textSizes.default}
        weight={weights[size] || weights.default}
      >
        {isDesktop ? (
          <Floater
            event="hover"
            content={address}
            styles={{
              wrapper: {
                display: r({ default: "table-caption", medium: "flex" }),
              },
              floater: {
                maxWidth: type === "node" ? 900 : 1500,
              },
              container: {
                backgroundColor: "#000",
                color: "#fff",
                minHeight: 25,
              },
              arrow: {
                color: "#000",
              },
              content: {
                fontSize: 20,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
              },
            }}
          >
            {addressLink}
          </Floater>
        ) : (
          addressLink
        )}
      </Text>
      <Button onClick={setCopied} icon={<CopyIcon size={size} />} />
    </div>
  );
};

export default Address;
