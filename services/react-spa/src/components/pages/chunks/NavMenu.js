import React from 'react';
import { NavLink, withRouter, } from 'react-router-dom';
import {
  MenuList,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Icon,
} from '@material-ui/core';


const list = [
  {
    primaryText: 'Home',
    icon: 'house',
    href: '/',
  },
  {
    primaryText: 'Create Screenshot',
    icon: 'add_photo_alternate',
    href: '/screenshot/create',
  },
  {
    primaryText: 'My Screenshots',
    icon: 'collections',
    href: '/screenshot/list',
  },
];


const NavContentMenuEx = ({ location: { pathname } }) => {
  const LinkRef = React.forwardRef((props, ref) => <NavLink {...props} innerRef={ref} />);

  return (
    <MenuList>
      {list.map(({ primaryText, icon, href }, i) => (
        <MenuItem
          button
          key={i}
          component={LinkRef}
          selected={href === pathname}
          activeClassName="selected"
          to={href}
        >
          <ListItemIcon>
            <Icon>{icon}</Icon>
          </ListItemIcon>
          <ListItemText
            primary={primaryText}
            // primaryTypographyProps={{ noWrap: true }}
          />
        </MenuItem>
      ))}
    </MenuList>
  )
};

NavContentMenuEx.propTypes = {};
NavContentMenuEx.defaultProps = {};

export default withRouter(NavContentMenuEx);