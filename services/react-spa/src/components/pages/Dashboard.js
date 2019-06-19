import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import DashboardLayout from '../layouts/Dashboard/';

import { HeaderContent, FooterContent, NavContent } from './chunks';


function DashboardPage() {
  const components = {
    HeaderContent: HeaderContent,
    NavContent: NavContent,
    PageContent: getPageContent(),
    FooterContent: FooterContent,
  };

  return DashboardLayout(components)
}

export default DashboardPage;

function getPageContent() {
  const styles = ({ breakpoints }) => ({
    root: {
      padding: 16,
      [breakpoints.up("sm")]: {
        padding: 24,
        maxWidth: 500,
        margin: "auto"
      },
      [breakpoints.up("md")]: {
        maxWidth: 1000
      }
    }
  });

  return withStyles(styles)(({ classes }) => (
    <div className={classes.root}>
      <Typography variant={"overline"}>INTRODUCING</Typography>
      <Typography weight={"bold"} variant={"h4"} gutterBottom>
        Screenshot Maker
      </Typography>
      <Typography gutterBottom>
        <b>Version 0.0.1</b>
      </Typography>
      <Typography indent={"small"}>
        This is a simple (test) project that provides the ability to create and store screenshots of WEB-pages (sites).
      </Typography>
    </div>
  ));
}
