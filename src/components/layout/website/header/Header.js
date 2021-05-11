import React, { Component } from "react";
import { withRouter, Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { resetResults } from "../../../../actions/common";
import Logo from "../../../../img/images/logo.png";

import Lang1 from "../../../../img/images/languages-1.png";
import Lang2 from "../../../../img/images/languages-2.png";
import Lang3 from "../../../../img/images/languages-3.png";
import Lang4 from "../../../../img/images/languages-4.png";
import LoginIcon from "../../../../img/images/login-icon.png";

import { getPlanners } from "../../../../actions/plannerActions";
import { getVendors } from "../../../../actions/vendorActions";

import "../../../../styles/Header.css";
import { getTranslatedLabels } from "../../../../actions/common";

class Header extends Component {
  state = { clickedLink: "" };

  forVendor = "";
  forPlanner = "";
  forHome = "";
  forAbout = "";

  onClickLink = (name) => {
    console.info();
    this.props.resetResults();
    if (name === "/planners") {
      this.setState({ name: "active-planners" });
      this.props.getPlanners();
    }
    if (name === "/vendors") {
      this.props.getVendors();
      this.setState({ name: "active-vendors" });
    }
    if (name === "/") this.setState({ name: "active-home" });
    if (name === "/about-us") this.setState({ name: "active-about" });

    this.props.history.push(name);
  };

  componentDidMount() {
    this.forHome = "active-home";
  }

  componentWillUpdate() {
    if (this.props.history.location.pathname === "/planners") {
      this.forPlanner = "active-planners";
      this.forVendor = "";
      this.forAbout = "";
      this.forHome = "";
    }

    if (this.props.history.location.pathname === "/vendors") {
      this.forVendor = "active-vendors";
      this.forPlanner = "";
      this.forAbout = "";
      this.forHome = "";
    }

    if (this.props.history.location.pathname === "/") {
      this.forPlanner = "";
      this.forVendor = "";
      this.forHome = "active-home";
      this.forAbout = "";
    }

    if (this.props.history.location.pathname === "/about-us") {
      this.forPlanner = "";
      this.forVendor = "";
      this.forHome = "";
      this.forAbout = "active-about";
    }
  }

  render() {
    const { translatedLabels } = this.props;

    // if (this.props.history.location.pathname === "/") {
    //   this.forPlanner = "";
    //   this.forVendor = "";
    //   this.forAbout = "";
    // } else if (this.props.history.location.pathname === "/planners") {
    //   this.forVendor = "";
    //   this.forHome = "";
    //   this.forAbout = "";
    // } else if (this.props.history.location.pathname === "/vendors") {
    //   this.forPlanner = "";
    //   this.forHome = "";
    //   this.forAbout = "";
    // } else if (this.props.history.location.pathname === "/about-us") {
    //   this.forPlanner = "";
    //   this.forHome = "";
    //   this.forVendor = "";
    // }
    return (
      <header className="fixed-top" style={{ zIndex: "5" }}>
        <div className="container">
          <nav className="navbar navbar-expand-lg">
            <Link className="navbar-brand" to="/">
              <img className="header-img" src={Logo} alt="Logo" />
            </Link>
            <div className="ml-auto">
              <ul className="lang-list text-right">
                <li>
                  <a
                    href="javascript:;"
                    onClick={() => this.props.getTranslatedLabels("eng")}
                  >
                    <img className="header-img" src={Lang1} alt="Lang1" />
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:;"
                    onClick={() => this.props.getTranslatedLabels("fre")}
                  >
                    <img className="header-img" src={Lang2} alt="Lang2" />
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:;"
                    onClick={() => this.props.getTranslatedLabels("por")}
                  >
                    <img className="header-img" src={Lang3} alt="Lang3" />
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:;"
                    onClick={() => this.props.getTranslatedLabels("swa")}
                  >
                    <img className="header-img" src={Lang4} alt="Lang4" />
                  </a>
                </li>
              </ul>
              <div className="float-left">
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarNav"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav">
                    <li className="nav-item active">
                      <a
                        // className="nav-link"

                        className={`nav-link planners-link ${
                          this.forHome === "active-home"
                            ? "active-planners"
                            : ""
                        }`}
                        data-toggle="collapse"
                        data-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        onClick={() => this.onClickLink("/")}
                      >
                        {translatedLabels ? translatedLabels.home : "Home"}
                        <span className="sr-only">(current)</span>
                      </a>
                    </li>

                    <li className="nav-item">
                      <a
                        className={`nav-link planners-link ${
                          this.forPlanner === "active-planners"
                            ? "active-planners"
                            : ""
                        }`}
                        onClick={() => this.onClickLink("/planners")}
                        data-toggle="collapse"
                        data-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        to="/planners"
                      >
                        {translatedLabels
                          ? translatedLabels.planners
                          : "Planners"}
                      </a>
                    </li>

                    <li className="nav-item">
                      <a
                        className={`nav-link vendors-link ${
                          this.forVendor === "active-vendors"
                            ? "active-vendors"
                            : ""
                        }`}
                        onClick={() => this.onClickLink("/vendors")}
                        data-toggle="collapse"
                        data-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                      >
                        {translatedLabels
                          ? translatedLabels.vendors
                          : "Vendors"}
                      </a>
                    </li>

                    <li className="nav-item">
                      <a
                        // className="nav-link"
                        className={`nav-link planners-link ${
                          this.forAbout === "active-about"
                            ? "active-planners"
                            : ""
                        }`}
                        data-toggle="collapse"
                        data-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        onClick={() => this.onClickLink("/about-us")}
                      >
                        {translatedLabels
                          ? translatedLabels.aboutUs
                          : "About Us"}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <Link className="float-right login-btn" to="/login">
                <img
                  style={{ maxWidth: "100%" }}
                  src={LoginIcon}
                  alt="Login Icon"
                />
              </Link>
            </div>
          </nav>
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  translatedLabels: state.common.translatedLabels
});

export default connect(mapStateToProps, {
  getPlanners,
  getVendors,
  getTranslatedLabels,
  resetResults
})(withRouter(Header));
