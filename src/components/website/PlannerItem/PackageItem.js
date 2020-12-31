import React from "react";
import PackageListItem from "./PackageListItem";
import Spinner from "../../common/Spinner/Spinner";
const PackageItem = ({
  pTitle,
  pDesc,
  isOfr1Enable,
  isOfr2Enable,
  isOfr3Enable,
  offer1,
  offer2,
  offer3,
  offer1Price,
  offer2Price,
  offer3Price,
  handleEnvelope,
  classNam,
  adminPackage,
  t
}) => {
  const title = pTitle => {
    if (pTitle === "Diamond") return t.diamond;
    if (pTitle === "Silver") return t.silver;
    if (pTitle === "Bronze") return t.bronze;
    if (pTitle === "Bespoke") return t.bespoke;
    if (pTitle === "Custom") return t.custom;
    if (pTitle === "Gold") return t.gold;
    if (pTitle === "Platinum") return t.platinum;
  };
  if (classNam) {
    return (
      <div className={classNam}>
        {/* Price Table Start*/}
        <div className={`price-table radius-5 bg-image-${pTitle}`}>
          <div className="min-h">
            <div
              className={`price-table-head ${pTitle}`}
              // style={{ backgroundImage: "url(images/diamond-pkg.jpg)" }}
            >
              <h6>{pTitle ? title(pTitle) : null}</h6>
            </div>
            {pDesc ? (
              <div className="price-table-caption">
                {/* <h5>{t.description + ":"}</h5> */}
                <p>{pDesc ? pDesc : null}</p>
              </div>
            ) : null}
            {adminPackage && (
              <div style={{ textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => handleEnvelope(pTitle)}
                  className="btn icon-btn btn-primary align-center"
                >
                  <span className="envelope-icon" />
                </button>
              </div>
            )}
          </div>
          <ul className={`list-group list-group-flush bg-image-${pTitle}`}>
            {isOfr1Enable && offer1 ? (
              <PackageListItem
                bundle="Bundle 1"
                offer={offer1}
                price={offer1Price ? offer1Price : ""}
                handleEnvelope={handleEnvelope}
                pTitle={pTitle}
                adminPackage={adminPackage}
              />
            ) : null}

            {isOfr2Enable && offer2 ? (
              <PackageListItem
                bundle="Bundle 2"
                offer={offer2}
                price={offer2Price ? offer2Price : ""}
                handleEnvelope={handleEnvelope}
                pTitle={pTitle}
                adminPackage={adminPackage}
              />
            ) : null}
            {isOfr3Enable && offer3 ? (
              <PackageListItem
                bundle="Bundle 3"
                offer={offer3}
                price={offer3Price ? offer3Price : ""}
                handleEnvelope={handleEnvelope}
                pTitle={pTitle}
                adminPackage={adminPackage}
              />
            ) : null}
          </ul>
        </div>
        {/* /Price Table End*/}
      </div>
    );
  } else {
    return <Spinner />;
  }
};

export default PackageItem;
