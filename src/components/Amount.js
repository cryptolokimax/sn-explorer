import React from "react";
import { Button } from "grommet";
import styled from "styled-components";
import NumberFormat from "react-number-format";
import Floater from "react-floater";
import useClipboard from "react-use-clipboard";
import useResponsive from "../lib/useResponsive";

const CopyButton = styled(Button)`
  :hover {
    opacity: 0.9;
  }
  :active {
    opacity: 0.7;
  }
`;

const Amount = ({ amount, metric = " OXEN", decimalScale = 2 }) => {
  const amountWithPrecision = amount && amount.toFixed(9).replace(/\.?0+$/, "");
  const [isCopied, setCopied] = useClipboard(amountWithPrecision);
  const r = useResponsive();

  const numOfDecimals =
    amountWithPrecision &&
    amountWithPrecision.toString() &&
    amountWithPrecision.toString().split(".") &&
    amountWithPrecision.toString().split(".").length > 1
      ? amountWithPrecision.toString().split(".")[1].length
      : 0;

  const isDesktop = r({ default: false, medium: true });

  return isDesktop && numOfDecimals > 2 ? (
    <Floater
      event="hover"
      content={
        <div
          style={{
            fontSize: 20,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
          }}
        >
          {amountWithPrecision}
          <br />
          <span style={{ fontSize: 14 }}>(click to copy)</span>
        </div>
      }
      styles={{
        floater: {
          maxWidth: 900,
        },
        container: {
          backgroundColor: "#00C781",
          color: "#fff",
          minHeight: 25,
        },
        arrow: {
          color: "#00C781",
        },
      }}
    >
      <CopyButton onClick={setCopied}>
        <NumberFormat
          value={amount}
          displayType="text"
          thousandSeparator
          decimalScale={decimalScale}
          suffix={metric}
        />
      </CopyButton>
    </Floater>
  ) : (
    <NumberFormat
      value={amount}
      displayType="text"
      thousandSeparator
      decimalScale={decimalScale}
      suffix={metric}
    />
  );
};

export default Amount;
