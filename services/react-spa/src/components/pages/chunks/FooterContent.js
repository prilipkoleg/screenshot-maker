import React from "react";
import Typography from "@material-ui/core/Typography";

const FooterEx = () => (
  <div style={{ maxWidth: 700, margin: "auto", textAlign: "center" }}>
    <Typography variant="caption" align={"center"}>
      © Copyright {(new Date()).getFullYear()}
    </Typography>
  </div>
);

FooterEx.propTypes = {};
FooterEx.defaultProps = {};

export default FooterEx;
