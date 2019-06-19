import React, { useState } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";

import { Root, Header, Nav, Content, Footer } from "./MUI";

const config = {
  "navAnchor": "left",
  "navVariant": {
    "xs": "persistent",
    "sm": "persistent",
    "md": "permanent"
  },
  "navWidth": {
    "xs": 240,
    "sm": 256,
    "md": 230
  },
  "collapsible": {
    "xs": true,
    "sm": true,
    "md": true
  },
  "collapsedWidth": {
    "xs": 64,
    "sm": 64,
    "md": 64
  },
  "clipped": {
    "xs": false,
    "sm": false,
    "md": false
  },
  "headerPosition": {
    "xs": "relative",
    "sm": "relative",
    "md": "relative"
  },
  "squeezed": {
    "xs": false,
    "sm": false,
    "md": true
  },
  "footerShrink": {
    "xs": true,
    "sm": true,
    "md": true
  }
};

function DashboardLayout(components = {}) {
  const { HeaderContent, FooterContent, PageContent, NavContent } = components;

  const [loading, setLoading] = useState(false);
  const [preset, setPreset] = useState("createDefaultLayout");
  const [data, setData] = useState({
    header: true,
    nav: true,
    content: true,
    footer: true
  });

  return (
    <MuiThemeProvider theme={createMuiTheme()}>
      {loading ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Typography variant={"h2"}>Changing Preset...</Typography>
        </div>
      ) : (
        <Root config={config} style={{ minHeight: "100vh" }}>
          <CssBaseline />
          <Header
            menuIcon={{
              inactive: <Icon>menu_rounded</Icon>,
              active: <Icon>arrow_back_ios</Icon>
            }}
          >
            {/* HEADER goes here */}
            {
              ({ screen, collapsed }) =>
                data.header
                && HeaderContent
                && <HeaderContent screen={screen} collapsed={collapsed} />
            }
            {/* HEADER goes here */}
          </Header>
          <Nav
            collapsedIcon={{
              inactive: <Icon>chevron_left</Icon>,
              active: <Icon>chevron_right</Icon>
            }}
            // header={({ collapsed }) => data.nav && NavContent && <NavContent collapsed={collapsed} /> }
          >
            {/* HEADER goes here */}
            {({ collapsed }) => data.nav && NavContent && <NavContent collapsed={collapsed} />}
            {/* HEADER goes here */}
          </Nav>
          <Content>
            {/* CONTENT goes here */}
            { PageContent ? <PageContent/> : ''}
            {/* CONTENT goes here */}
          </Content>
          <Footer>
            {/* FOOTER goes here */}
            { data.footer && FooterContent && <FooterContent/> }
            {/* FOOTER goes here */}
          </Footer>
        </Root>
      )}
    </MuiThemeProvider>
  );
}

export default DashboardLayout;