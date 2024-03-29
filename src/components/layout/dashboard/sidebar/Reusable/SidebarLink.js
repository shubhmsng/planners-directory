import React from "react";
import classnames from "classnames";
import { NavLink } from "react-router-dom";

const SidebarLink = ({ label, comp, linkTo, onClick, disabled }) => {
  console.info();
  return (
    <li
      // className={classnames("nav-item", {
      //   lidisabled: disabled
      // })}
      className={disabled ? "lidisabled" : "nav-item"}
    >
      <NavLink
        className={classnames("nav-link waves-effect", {
          "disabled-nav-link": disabled
        })}
        onClick={onClick}
        activeStyle={{ fontWeight: "bold", color: "white" }}
        exact
        to={linkTo}
      >
        <i style={{height: "20px"}}>{comp}</i> <span>{label}</span>
      </NavLink>
    </li>
  );
};

export default SidebarLink;
