import React from "react";

const PackageListItem = ({
  offer,
  price,
  bundle,
  handleEnvelope,
  pTitle,
  adminPackage
}) => {
  return (
    <li className="list-group-item">
      <h5
        style={{
          marginBottom: "10px",
          textTransform: "uppercase",
          textAlign: "left",
          fontSize: "20px"
        }}
      >
        {bundle}
      </h5>
      <span>{offer}</span>
      <span
        style={{
          display: "block",
          fontSize: "1.5rem",
          fontWeight: "500"
        }}
      >
        {price}
      </span>
      {/* {
            !adminPackage &&
            <button
                type="button"
                onClick={() => handleEnvelope(pTitle)}
                className="btn icon-btn btn-primary"
            >
                <span className="envelope-icon" />
            </button>d
        } */}

      <button
        type="button"
        onClick={() => handleEnvelope(pTitle, bundle)}
        className="btn icon-btn btn-primary"
      >
        <span className="envelope-icon" />
      </button>
    </li>
  );
};

export default PackageListItem;
