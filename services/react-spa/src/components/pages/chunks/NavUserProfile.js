import React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";


import { authService } from '../../../services/index';

const NavHeaderEx = ({ collapsed }) => {
  const { email = '...', username = '' } = authService.__getDecodedToken() || {};

  return (
    <>
      <div style={{ padding: collapsed ? 8 : 16, transition: "0.3s" }}>
        <Avatar
          style={{
            width: collapsed ? 48 : 60,
            height: collapsed ? 48 : 60,
            transition: "0.3s",
          }}
          src={'/default_profile.svg'}
        />
        <div style={{ paddingBottom: 16 }} />
        <Typography variant={"h6"} noWrap>
          { username }
        </Typography>
        <Typography color={"textSecondary"} noWrap gutterBottom>
          { email }
        </Typography>
        {!collapsed && <Typography color={"textSecondary"} noWrap gutterBottom>
          <Button
            // href={'/logout'}
            color={"secondary"}
            variant={"outlined"}
            size={"small"}
            onClick={
              (e) => { authService.signOut().then(() => window.location.href = '/') }
            }
          >
            Logout
          </Button>
        </Typography>}
      </div>
      <Divider />
    </>
  )
};

NavHeaderEx.propTypes = {
  collapsed: PropTypes.bool.isRequired
};
NavHeaderEx.defaultProps = {};

export default NavHeaderEx;
