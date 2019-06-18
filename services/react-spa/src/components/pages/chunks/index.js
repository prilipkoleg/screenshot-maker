import React from "react";
import NavUserProfileComp from './NavUserProfile';
import NavMenuComp from './NavMenu';

const navContent = ({collapsed}) => (
  <React.Fragment>
    <NavUserProfileComp collapsed={collapsed}/>
    <NavMenuComp/>
  </React.Fragment>
);

export { default as HeaderContent } from './HeaderContent';
export { default as FooterContent } from './FooterContent';
export const NavMenu = NavMenuComp;
export const NavUserProfile = NavUserProfileComp;
export const NavContent = navContent;
