import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import Modal from "react-modal";
import Worldwide from "../icons/worldwide.svg";
import Facebook from "../icons/facebook.svg";
import LinkedIn from "../icons/linkedin.svg";
import Instagram from "../icons/instagram.svg";
import PlaceHolderImage from "../../../../img/images/package-img.jpg";

import isEmpty from "../../../../utils/is-empty";

const PlannerItem = ({ user, pathname, t, imageValues }) => {
  const {
    categories,
    eventTypes,
    description,
    targetMarket,
    phoneNo1,
    phoneNo2,
    phoneNo3,
    instaAdress,
    website,
    storeName,
    twitterAdress,
    linkdnAdress,
    fbAdress,
    images
  } = user;

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)"
    }
  };

  //React Hooks
  // const [modalIsOpen, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);

  // const imageValues = !isEmpty(images) ? Object.values(images) : "";
  const renderModalImages = imageValues => {
    let items = [];
    for (let i = 0; i < imageValues.length; i++) {
      items.push({
        original: imageValues[i],
        originalClass: "react-img-gallery"
      });
    }
    setItems(items);
    setIsOpen(true);
  };

  const targetMarketStyling = tmarket => {
    if (tmarket === "up") return t.upMarket;
    if (tmarket === "mix") return t.marketMix;
    if (tmarket === "stream") return t.mainStream;
  };

  return (
    <div className="package-thumb-wrap list-style">
      <div className="package-thumb-header pb-3" >
        <div className="row">
          <div className="col-md-6">
            <div className="row mb-3">
              <div className="col-md-5">
                <h6>
                  <strong>{storeName}</strong>
                </h6>
                <div className="rating_down">
                  <div style={{ width: "80%" }} className="rating_up" />
                </div>
              </div>
              <div className="col-md-7">
                <div className="" style={{ display: "inline-block" }}>
                  {categories.map(category => (
                    <div key={category._id} className="badge">
                      {category.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {pathname === "/planners" ? (
            <div className="col-md-6">
              {!isEmpty(eventTypes) ? (
                <div className="post-meta mb-0">
                  {" "}
                  <h5>{t.eventType + ":"}</h5>
                  <ul>
                    {eventTypes.map(event => (
                      <li>{event.label}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-6">
          <div className="package-thumb-caption border-0">
            <p style={{overflowWrap: "anywhere"}}>{description}</p>
          </div>
        </div>
        {!isEmpty(imageValues) ? (
          <div className="col-md-6">
            <button
              type="button"
              className="package-img-thumb"
              // data-toggle="modal"
              // data-target=".bd-example-modal-lg"
              onClick={() => renderModalImages(imageValues)}
            >
              <img src={imageValues[0]} alt="First" />
            </button>
            {/* {isOpen && (
              <Lightbox
                mainSrc={imageValues[photoIndex]}
                nextSrc={imageValues[(photoIndex + 1) % imageValues.length]}
                prevSrc={
                  imageValues[
                    (photoIndex + imageValues.length - 1) % imageValues.length
                  ]
                }
                mainSrcThumbnail={null}
                prevSrcThumbnail={null}
                nextSrcThumbnail={null}
                onCloseRequest={() => setIsOpen(false)}
                onMovePrevRequest={() =>
                  setPhotoIndex(
                    (photoIndex + imageValues.length - 1) % imageValues.length
                  )
                }
                onMoveNextRequest={() =>
                  setPhotoIndex((photoIndex + 1) % imageValues.length)
                }
              />
            )} */}
          </div>
        ) : (
          <div className="col-md-6">
            <img src={PlaceHolderImage} alt="planner-directory-placeholder" />
          </div>
        )}
      </div>
      <div className="package-thumb-footer border-0 pt-3">
        <div className="d-flex justify-content-between pb-2">
          <div className="d-flex flex-wrap">
              {
                (website || fbAdress || linkdnAdress || instaAdress) &&
                <div className="text-left pr-5">
                  <ul className="contact-list social-list">
                      {website ? (
                          <li>
                            <a href={website} target="_blank" rel="noopener noreferrer">
                              <img src={Worldwide} alt="Website Adress" />
                            </a>
                          </li>
                      ) : null}
                      {fbAdress ? (
                          <li>
                            <a href={fbAdress} target="_blank" rel="noopener noreferrer">
                              <img className="" src={Facebook} alt="Facebook Addres" />
                            </a>
                          </li>
                      ) : null}
                      {linkdnAdress ? (
                          <li>
                            <a
                                href={linkdnAdress}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                              <img src={LinkedIn} alt="LinkedIn Adress" />
                            </a>
                          </li>
                      ) : null}

                      {instaAdress ? (
                          <li>
                            <a
                                href={instaAdress}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                              <img src={Instagram} alt="Instagram Adress" />
                            </a>
                          </li>
                      ) : null}
                  </ul>
                </div>
              }
            <div className>
              <ul className="contact-list">
                  {phoneNo1 && (
                      <li style={{ paddingRight: "4px" }}>
                  <span style={{ paddingRight: "0.4rem" }}>
                    <i className="fa fa-phone" />
                  </span>
                          {phoneNo1}
                      </li>
                  )}
                  {phoneNo2 && (
                      <li style={{ paddingRight: "4px" }}>
                  <span style={{ paddingRight: "0.4rem" }}>
                    <i className="fa fa-phone" />
                  </span>
                          {phoneNo2}
                      </li>
                  )}
                  {phoneNo3 && (
                      <li style={{ paddingRight: "4px" }}>
                  <span style={{ paddingRight: "0.4rem" }}>
                    <i className="fa fa-phone" />
                  </span>
                          {phoneNo3}
                      </li>
                  )}
              </ul>
            </div>
          </div>
          <div className="small-btn-wrap d-flex justify-content-end align-items-center">
            <span className={targetMarket}>
              {targetMarketStyling(targetMarket)}
            </span>
            {pathname === "/planners" ? (
              <Link
                className={`btn th-bg badge p-2`}
                to={{
                  pathname: `/planners/${storeName}`,
                  state: { userId: user.user }
                }}
              >
                {t.viewDetails}
              </Link>
            ) : (
              <Link
                className={`btn th-bg badge p-2`}
                to={{
                  pathname: `/vendors/${storeName}`,
                  state: { userId: user.user }
                }}
              >
                {t.viewDetails}
              </Link>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
        overlayClassName="react-modal-overlay"
      >
        <div className="modal-header" style={{ padding: "5px", background: "white" }}>
          <button type="button" className="close" onClick={() => setIsOpen(false)}>
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">Close</span>
          </button>
        </div>
        <ImageGallery
          items={items}
          showBullets={true}
          showThumbnails={false}
          showPlayButton={false}
          showFullscreenButton={false}
          autoPlay={true}
          infinite={false}
          slideDuration={100}
          onImageError={PlaceHolderImage}
        />
      </Modal>
    </div>
  );
};

export default PlannerItem;
