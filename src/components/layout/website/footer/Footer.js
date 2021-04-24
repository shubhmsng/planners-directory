import React, { Component } from "react";
import TermsModal from "./TermsModal";
import PrivacyPolicy from "./PrivacyPolicy";
import { connect } from "react-redux";


import "../../../../styles/Footer.css";

class Footer extends Component {
  state = {
    modalIsOpen: false,
    pIsOpen: false
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  openModalP = () => {
    this.setState({ pIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  closeModalP = () => {
    this.setState({ pIsOpen: false });
  };

  onClickEmail = () => {
    window.location.href = "mailto:address@dmail.com";
  };

  render() {
    const { t, terms } = this.props;
    if (!this.props.terms) return null;
    return (
      <footer className="copyright-footer fixed-bottom" style={{ zIndex: "5" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 align-self-center">
              <ul className="short-nav">
                <li>
                  <a onClick={this.openModalP} href="javascript:;">
                    {t.privacyPolicy}
                  </a>
                </li>

                <li>
                  <a onClick={this.openModal} href="javascript:;">
                    {t.termsCondition}
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="contact-list social-list text-right">
                <li>
                  <a href="/facebook" target="_blank">
                    <i className="fab fa-facebook-f" />
                  </a>
                </li>
                <li>
                  <a href="/twitter" target="_blank">
                    <i className="fab fa-twitter" />
                  </a>
                </li>
                <li>
                  <a href="/insta" target="_blank">
                    <i className="fab fa-instagram" />
                  </a>
                </li>
                <li>
                  <a href="/linkdn" target="_blank">
                    <i className="fab fa-linkedin-in" />
                  </a>
                </li>
                <li>
                  <a href="#" onClick={this.onClickEmail}>
                    <i className="fas fa-envelope"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <TermsModal
          openModal={this.openModal}
          closeModal={this.closeModal}
          modalIsOpen={this.state.modalIsOpen}
          terms={terms}
          t={t}
        />

        <PrivacyPolicy
          openModal={this.openModalP}
          closeModal={this.closeModalP}
          modalIsOpen={this.state.pIsOpen}
          pp={this.props.pp}
          t={t}
        />
      </footer>
    );
  }
}

const mapStateToProps = state => ({
  terms: state.admin.admin.terms,
  pp: state.admin.admin.pp,
  t: state.common.translatedLabels
});

export default connect(mapStateToProps)(Footer);
