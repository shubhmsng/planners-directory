import React, { Component } from "react";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import { getTranslatedLabels } from "./actions/common";
// import setAuthToken from "./utils/setAuthToken";
// import jwt_decode from "jwt-decode";

import "./styles/dashboard.css";
import "./App.css";
import "./styles/old.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import Website from "./components/layout/website/Website";
import {
  Home,
  Planners,
  Vendors,
  PlannerItem,
  AboutUsW,
  Users,
} from "./components/website/index";
import {
  Login,
  Register,
  AboutPlanner2,
  AboutVendor,
} from "./components/auth/index";

//Dashboard Imports
import {
  Dashboard,
  DashboardToggler,
  AdminDashboard,
} from "./components/layout/dashboard/index";
import { getAdminData } from "./actions/adminActions";

//Admin Imports
import {
  Search,
  Noticeboard,
  UniquePackages,
  Category,
  AboutUs,
  Terms,
  PrivacyPolicy,
  Images,
  EventType,
  Catering,
  BlockContinent,
  BlockCountries,
  UserStats,
  ChangeTargetMarket,
} from "./components/admin/index";

//Dashboard Imports
import {
  DashBoardNoticeboard,
  Profile,
  Packages,
  Office,
  UploadImages,
  Keywords,
  Services,
  Setting,
} from "./components/dashboard/index";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//MiddleWare Code
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ImageGaller from "./components/testing/imageGallery";
import "./styles/image-gallery.css";
class App extends Component {
  componentDidMount() {
    console.log("CDM CALLED");
    if (!this.props.translatedLabels) {
      this.props.getTranslatedLabels("eng");
    }
    if (!this.props.loadingfromAdmin) {
      this.props.getAdminData();
    }
  }

  render() {
    console.log(this.props.lang);
    return (
      <Router>
        <React.Fragment>
          <ToastContainer />
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Website>
                  <Home t={this.props.t} />
                </Website>
              )}
            />
            {/* <Route
              path="/planers/search"
              render={({ location }) => (
                <Website>
                  <Planners location={location} />
                </Website>
              )}
            /> */}
            {/* <Route
              exact
              path="/planners"
              render={({ location }) => (
                <Website>
                  <Planners location={location} />
                </Website>
              )}
            /> */}
            {/* <Route
              exact
              path="/planners"
              render={({ location, history }) => (
                <Website>
                  <Users location={location} history={history} />
                </Website>
              )}
            /> */}
            <Route
              exact
              path="/planners"
              render={() => (
                <Website>
                  <Planners />
                </Website>
              )}
            />
            {/* <Route
              exact
              path="/vendors"
              render={({ location, history }) => (
                <Website>
                  <Users location={location} history={history} />
                </Website>
              )}
            /> */}
            <Route
              exact
              path="/vendors"
              render={() => (
                <Website>
                  <Vendors />
                </Website>
              )}
            />
            <Route
              exact
              path="/planners/:id"
              render={({ match, location }) => (
                <Website>
                  <PlannerItem match={match} location={location} />
                </Website>
              )}
            />

            <Route
              exact
              path="/vendors/:id"
              render={({ match, location, history }) => (
                <Website>
                  <PlannerItem
                    match={match}
                    location={location}
                    history={history}
                  />
                </Website>
              )}
            />
            {/* <Route
              exact
              path="/planner/search"
              render={location => (
                <Website>
                  <Register location={location} />
                </Website>
              )}
            /> */}
            <Route
              exact
              path="/login"
              render={() => (
                <Website>
                  <Login t={this.props.t} />
                </Website>
              )}
            />
            <Route
              exact
              path="/register"
              render={() => (
                <Website>
                  <Register t={this.props.t} />
                </Website>
              )}
            />
            <Route
              exact
              path="/about-us"
              render={() => (
                <Website>
                  <AboutUsW t={this.props.t} />
                </Website>
              )}
            />
            <Route
              exact
              path="/about-planner"
              render={() => (
                <Website>
                  <AboutPlanner2 t={this.props.t} />
                </Website>
              )}
            />
            <Route
              exact
              path="/about-vendor"
              render={() => (
                <Website>
                  <AboutVendor
                    websiteBg={this.props.websiteBg}
                    t={this.props.t}
                  />
                </Website>
              )}
            />
            <Route
              exact
              path="/dashboard/admin"
              render={() => (
                <AdminDashboard>
                  <div>
                    <Search />
                  </div>
                </AdminDashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/admin/user"
              render={({ location }) => (
                <AdminDashboard>
                  <div>
                    <ChangeTargetMarket location={location} />
                  </div>
                </AdminDashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/admin/noticeboard"
              render={() => (
                <AdminDashboard>
                  <div>
                    <Noticeboard />
                  </div>
                </AdminDashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/admin/packages"
              render={() => (
                <AdminDashboard>
                  <div>
                    <UniquePackages />
                  </div>
                </AdminDashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/admin/categories"
              render={() => (
                <AdminDashboard>
                  <div>
                    <Category />
                  </div>
                </AdminDashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/admin/about-us"
              render={() => (
                <AdminDashboard>
                  <div>
                    <AboutUs />
                  </div>
                </AdminDashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/admin/terms"
              render={() => (
                <AdminDashboard>
                  <div>
                    <Terms />
                  </div>
                </AdminDashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/admin/privacy-policy"
              render={() => (
                <AdminDashboard>
                  <div>
                    <PrivacyPolicy />
                  </div>
                </AdminDashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/admin/upload-bg"
              render={() => (
                <AdminDashboard>
                  <div>
                    <Images />
                  </div>
                </AdminDashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/admin/event-types"
              render={() => (
                <AdminDashboard>
                  <div>
                    <EventType />
                  </div>
                </AdminDashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/admin/caterings"
              render={() => (
                <AdminDashboard>
                  <div>
                    <Catering />
                  </div>
                </AdminDashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/admin/continents"
              render={() => (
                <AdminDashboard>
                  <div>
                    <BlockContinent />
                  </div>
                </AdminDashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/admin/countries"
              render={() => (
                <AdminDashboard>
                  <div>
                    <BlockCountries />
                  </div>
                </AdminDashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/admin/user-stats"
              render={() => (
                <AdminDashboard>
                  <div>
                    <UserStats />
                  </div>
                </AdminDashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/admin/setting"
              render={() => (
                <AdminDashboard>
                  <div>
                    <Setting />
                  </div>
                </AdminDashboard>
              )}
            />
            <Route
              exact
              path="/dashboard-toggler"
              render={() => <DashboardToggler />}
            />
            <Route exact path="/dashboard" render={() => <Dashboard />} />
            <Route
              exact
              path="/dashboard/noticeboard"
              render={() => (
                <Dashboard>
                  <div>
                    <DashBoardNoticeboard />
                  </div>{" "}
                </Dashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/vendor/noticeboard"
              render={() => (
                <Dashboard>
                  <div>
                    <DashBoardNoticeboard />
                  </div>
                </Dashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/profile"
              render={() => (
                <Dashboard>
                  <div>
                    <Profile />
                  </div>
                </Dashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/packages"
              render={() => (
                <Dashboard>
                  <div>
                    <Packages />
                  </div>
                </Dashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/office"
              render={() => (
                <Dashboard>
                  <div>
                    <Office />
                  </div>
                </Dashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/images"
              render={() => (
                <Dashboard>
                  <div>
                    <UploadImages />
                  </div>
                </Dashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/keywords"
              render={() => (
                <Dashboard>
                  <div>
                    <Keywords />
                  </div>
                </Dashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/services"
              render={() => (
                <Dashboard>
                  <div>
                    <Services />
                  </div>
                </Dashboard>
              )}
            />
            <Route
              exact
              path="/dashboard/settings"
              render={() => (
                <Dashboard>
                  <div>
                    <Setting />
                  </div>
                </Dashboard>
              )}
            />
            <Route exact path="/testing" render={() => <ImageGaller />} />
          </Switch>
        </React.Fragment>
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  loadingfromAdmin: state.common.loadingfromAdmin,
  websiteBg: state.admin.admin.websiteBg,
  t: state.common.translatedLabels,
  lang: state.common.language,
});

export default connect(mapStateToProps, { getAdminData, getTranslatedLabels })(
  App
);
