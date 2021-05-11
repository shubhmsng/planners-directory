import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import SidebarLink from "./Reusable/SidebarLink";
import Logo from "../../../../img/logo-dark.png";
class AdminSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {openSidebar: false}
  }

  hideSidebar = (e) => {
    if(window.innerWidth < 1020) {
      this.setState({openSidebar: !this.state.openSidebar})
    }
  }

  render() {
    return (
      <div className="left side-menu" style={ window.innerWidth < 1020 ? this.state.openSidebar  ? {zIndex: "100001", left: "0"} : {zIndex: "100001", left: "-100%"} : {zIndex: "100001", left: "0"}}>
        <button
          type="button"
          className="navbar-toggler mt-2"
          onClick = {(e) => this.setState({openSidebar: !this.state.openSidebar})}
          style={{position: "fixed", left: "20px", top: "6px"}}
        >
          <i className="navbar-toggler-icon" />
        </button>
        <div className="left-side-logo d-block d-lg-none">
          <div style={{textAlign: "end", paddingRight: "10px"}}>
            <a href="/dashboard/admin/" className="logo">
              <img src={Logo} width={130} alt="logo" />
            </a>
          </div>
        </div>
        <div className="sidebar-inner slimscrollleft" style={{overflowY: "auto"}}>
          <div id="sidebar-menu">
            <ul className="nav nav-tabs" role="tablist">
              <SidebarLink label="Search" linkTo="/dashboard/admin" onClick={this.hideSidebar} />

              <SidebarLink
                label="Noticeboard"
                linkTo="/dashboard/admin/noticeboard"
                onClick={this.hideSidebar}
              />

              <SidebarLink
                label="Unique Packages"
                linkTo="/dashboard/admin/packages"
                onClick={this.hideSidebar}
              />

              <SidebarLink
                label="Categories"
                linkTo="/dashboard/admin/categories"
                onClick={this.hideSidebar}
              />

              <SidebarLink
                label="Event Types"
                linkTo="/dashboard/admin/event-types"
                onClick={this.hideSidebar}
              />

              <SidebarLink
                label="Caterings"
                linkTo="/dashboard/admin/caterings"
                onClick={this.hideSidebar}
              />

              <SidebarLink
                label="About Us"
                linkTo="/dashboard/admin/about-us"
                onClick={this.hideSidebar}
              />

              <SidebarLink
                label="T &amp; C
                "
                linkTo="/dashboard/admin/terms"
                onClick={this.hideSidebar}
              />

              <SidebarLink
                label="Privacy Policy"
                linkTo="/dashboard/admin/privacy-policy"
                onClick={this.hideSidebar}
              />

              <SidebarLink
                label="Upload Images"
                linkTo="/dashboard/admin/upload-bg"
                onClick={this.hideSidebar}
              />

              <SidebarLink
                label="Continents"
                linkTo="/dashboard/admin/continents"
                onClick={this.hideSidebar}
              />
              <SidebarLink
                label="Countries"
                linkTo="/dashboard/admin/countries"
                onClick={this.hideSidebar}
              />

              <SidebarLink label="Stats" linkTo="/dashboard/admin/user-stats" onClick={this.hideSidebar} />

              <SidebarLink label="Setting" linkTo="/dashboard/admin/setting" onClick={this.hideSidebar} />
            </ul>
          </div>
          <div className="clearfix" />
        </div>
        {/* end sidebarinner */}
      </div>
    );
  }
}

export default withRouter(AdminSidebar);
