import React from "react";
import Modal from "react-modal";
import { Editor } from "react-draft-wysiwyg";
const TermsModal = ({ onCancel, onConfirm, show, onSubmit }) => {
  const final = () => {
    onSubmit();
    onConfirm();
  };

  return (
    <Modal
      isOpen={show}
      onRequestClose={() => onCancel()}
      className="react-confirm-popup"
      overlayClassName="react-modal-confirm"
    >
      <div className="">
        <div className="modal-header">
          <button type="button" className="close" onClick={() => onCancel()}>
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="about-us-wrap radius-5">
          <h5
            style={{
              fontSize: "20px",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
            className="title"
          >
            You may have some unsaved changes. Are you sure you want to leave
            the page?
          </h5>
          <div className="osr-btn-group p-b-15 text-center pt-3">
            <button
              className="os-btn waves-effect waves-light save-btn text-uppercase"
              onClick={() => {
                final();
              }}
            >
              Confirm
            </button>
            <button
              className="os-btn waves-effect waves-light cancel-btn text-uppercase"
              onClick={() => onCancel()}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TermsModal;
