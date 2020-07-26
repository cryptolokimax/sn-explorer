import React from "react";
import { Box } from "grommet";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { slide as Menu } from "react-burger-menu";

import { Amount, Status } from ".";

import constants from "../constants";

import useResponsive from "../lib/useResponsive";

const StatusLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: #333;
  :hover {
    background-color: #efefef;
  }
  :active {
    background-color: #eee;
  }
`;

const styles = {
  bmBurgerButton: {
    position: "fixed",
    width: "36px",
    height: "30px",
    left: "9px",
    top: "36px",
  },
  bmBurgerBars: {
    background: "#373a47",
  },
  bmBurgerBarsHover: {
    background: "#a90000",
  },
  bmCrossButton: {
    height: "24px",
    width: "24px",
  },
  bmCross: {
    background: "#bdc3c7",
  },
  bmMenuWrap: {
    position: "fixed",
    height: "100%",
  },
  bmMenu: {
    background: "#ffffff",
    padding: "1.5em 0.5em 0",
    fontSize: "1.15em",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    color: "#b8b7ad",
    padding: "1em 0.5em",
  },
  bmItem: {
    display: "inline-block",
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.3)",
  },
};

const Navbar = ({ serviceNodeStats }) => {
  const r = useResponsive();
  const menu = (
    <Box
      direction="row-responsive"
      pad="small"
      justify="between"
      style={{ outline: 0 }}
    >
      {serviceNodeStats.map((s) => (
        <StatusLink key={s.status} to={`/status/${s.status.toLowerCase()}`}>
          <Box
            align="center"
            justify={r({ default: "between", medium: "center" })}
            pad="xsmall"
            direction="row"
            style={{ paddingTop: r({ default: "25px", medium: "0px" }) }}
          >
            <Box align="end" justify="center" pad="xsmall">
              <Status status={s.status} />
            </Box>
            <Box align="start" justify="center" pad="xsmall">
              <Amount amount={s.count} metric="" />
            </Box>
          </Box>
        </StatusLink>
      ))}
    </Box>
  );
  return r({ default: <Menu styles={styles}>{menu}</Menu>, medium: menu });
};

export default Navbar;
