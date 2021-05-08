import React, { Component } from "react";
import logo from "../../../../img/logo.png";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { logoutUser } from "../../../../actions/authActions";
import { ReactComponent as AdminIcon } from "../../../../img/icon-7.svg";
import { ReactComponent as LogOutIcon } from "../../../../img/icon-9.svg";

class TopBar extends Component {
  state = { screenSize: "" };
  onLogout = () => {
    this.props.logoutUser();
    this.props.history.push("/login");
  };

  onClickContactAdmin = () => {
    window.location.href = "mailto:address@dmail.com??subject=Enter Store Name";
  };

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    this.setState({ screenSize: window.innerWidth });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }

  render() {
    const { t, user } = this.props;
    console.log("t is", this.state.screenSize);

    return (
      <div className="topbar">
        <div className="topbar-left	d-none d-lg-block">
          <div className="text-center">
            <a href="index.html" className="logo">
              <img src={logo} width={130} alt="logo" />
            </a>
          </div>
        </div>

        <nav className="navbar-custom">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-11 col-md-11" style={{marginLeft: "50px"}}>
                <ul className=" list-inline float-right mb-0" style={{ textAlign: "end" }}>
                  <li className="list-inline-item">
                    <a
                      href="#"
                      className="nav-link dropdown-toggle arrow-none waves-effect nav-user mt-2"
                      onClick={this.onClickContactAdmin}
                    >
                      <i>
                        <AdminIcon style={{height: "23px", width: "30px"}} />
                      </i>
                      {t.contactAdmin}
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a
                      onClick={this.onLogout}
                      href="/"
                      className="nav-link dropdown-toggle arrow-none waves-effect nav-user mt-2"
                    >
                      <i>
                        <LogOutIcon style={{height: "23px", width: "30px"}} />
                      </i>
                      {t.logout}
                    </a>
                  </li>
                </ul>
                <ul className="list-inline menu-left mb-0">
                  <li className="list-inline-item">
                    <button
                      type="button"
                      className="button-menu-mobile open-left waves-effect"
                    >
                      <i className="ion-navicon" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="clearfix" />
        </nav>
      </div>
    );
  }
}

// const mapStateToProps = (state, auth) => ({
//   t: state.common.dashboardLabels,
//   user: auth.user
// });

// export default connect(
//   mapStateToProps,
//   { logoutUser }
// )(withRouter(TopBar));

const mapStateToProps = ({ auth }) => {
  const { user } = auth;
  return {
    user
  };
};

export default connect(mapStateToProps, {
  logoutUser
})(withRouter(TopBar));
