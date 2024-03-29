import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, Link, withRouter } from "react-router-dom";
import { getAdminImages } from "../../../../actions/adminActions";
import SidebarLink from "./Reusable/SidebarLink";
import Logo from "../../../../img/logo-dark.png";
import { ReactComponent as Icon1 } from "../../../../img/icon-1.svg";
import { ReactComponent as Icon2 } from "../../../../img/icon-2.svg";
import { ReactComponent as Icon3 } from "../../../../img/icon-3.svg";
import { ReactComponent as Icon4 } from "../../../../img/icon-4.svg";
import { ReactComponent as Icon5 } from "../../../../img/icon-5.svg";
import { ReactComponent as Icon6 } from "../../../../img/icon-6.svg";
import { ReactComponent as Icon7 } from "../../../../img/icon-7.svg";
import { ReactComponent as Icon8 } from "../../../../img/icon-8.svg";

class VendorSidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {openSidebar: false}
  }

  hideSidebar = (e) => {
    if(window.innerWidth < 1020) {
      this.setState({openSidebar: !this.state.openSidebar})
    }
  }

  handleClick = (e) => {
    if(window.innerWidth < 1020) {
      this.hideSidebar();
    }
    if (this.props.disabled) {
      e.preventDefault();
    }
  };

  render() {
    const { disabled, t } = this.props;
    return (
      <div className="left side-menu" style={ window.innerWidth < 1020 ? this.state.openSidebar  ? {zIndex: "100001", left: "0"} : {zIndex: "100001", left: "-100%"} : {zIndex: "100001", left: "0"}}>
        <button
          type="button"
          className="navbar-toggler mt-2"
          onClick = {(e) => this.setState({openSidebar: !this.state.openSidebar})}
          style={{position: "fixed", left: "20px", top: "6px"}}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="left-side-logo d-block d-lg-none">
          <div style={{textAlign: "end", paddingRight: "10px"}}>
            <Link to="/dashboard/noticeboard" className="logo">
              <img src={Logo} width={130} alt="logo" />
            </Link>
          </div>
        </div>
        <div className="sidebar-inner slimscrollleft" style={{overflowY: "auto"}}>
          <div id="sidebar-menu">
            <ul className="nav nav-tabs" role="tablist">
              <SidebarLink
                label={t.noticeBoard}
                comp={<Icon1 />}
                linkTo="/dashboard/noticeboard"
                onClick={this.handleClick}
                disabled={disabled}
              />
              <SidebarLink
                label={t.profile}
                comp={<Icon2 />}
                onClick={this.hideSidebar}
                linkTo="/dashboard/profile"
              />
              <SidebarLink
                label={t.services}
                comp={<Icon3 />}
                linkTo="/dashboard/services"
                onClick={this.handleClick}
                disabled={disabled}
              />
              <SidebarLink
                label={t.uploadImage}
                comp={<Icon4 />}
                linkTo="/dashboard/images"
                onClick={this.handleClick}
                disabled={disabled}
              />
              <SidebarLink
                label={t.keywords}
                comp={<Icon5 />}
                linkTo="/dashboard/keywords"
                onClick={this.handleClick}
                disabled={disabled}
              />
              <SidebarLink
                label={t.office}
                comp={<Icon6 />}
                linkTo="/dashboard/office"
                onClick={this.handleClick}
                disabled={disabled}
              />
              {/* <li className="nav-item">
                <NavLink
                  exact
                  to="/dashboard/contact"
                  className="nav-link waves-effect"
                >
                  <i>
                    <Icon7 />
                  </i>{" "}
                  <span>Contact Admin</span>
                </NavLink>
              </li> */}
              <SidebarLink
                label={t.setting}
                comp={<Icon8 />}
                linkTo="/dashboard/settings"
                onClick={this.handleClick}
                disabled={disabled}
              />
            </ul>

            <div className="sponsor">
              <a
                href={this.props.sponsorLink}
                target="_blank"
                rel="noopener noreferrer"
                alt="Sponsor Link"
              >
                {" "}
                <img
                  style={{ width: "230px", height: "200px" }}
                  src={this.props.sponserBy}
                  alt="Sponser BY"
                />
              </a>
            </div>
            <p style={{ color: "#ff8080" }}>Sponser By</p>
          </div>
          <div className="clearfix" />
        </div>
        {/* end sidebarinner */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  sponserBy: state.admin.admin.sponsorBy,
  sponsorLink: state.admin.admin.sponsorLink,
  t: state.common.dashboardLabels,
});

export default connect(mapStateToProps, {
  getAdminImages,
})(VendorSidebar);
