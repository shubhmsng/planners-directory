import React from "react";
import ReactSelect from "../../../common/SelectListGroup";

const Filters = ({
  country,
  acountry,
  st,
  city,
  categories,
  targetMarket,
  eventType,
  onChange,
  onSelectCountry,
  onSelectState,
  africanCountriesOptions,
  countriesOptions,
  stateOptions,
  cityOptions,
  categoryOptions,
  targetMarketOptions,
  eventTypeOptions,
  clearFilters,
  pathname,
  filtersExist,
  t,
  disable,
}) => {
  return (
    //aside-area, filter-title
    <div className="aside-area">
      <h5 className="filter-title">
        <i className="fas fa-sliders-h" /> {t.filterBy}
      </h5>
      <form>
        {pathname === "/vendors" ? (
          <div className="form-group">
            <ReactSelect
              name="country"
              options={countriesOptions}
              value={country ? country : ""}
              onChange={onSelectCountry}
              disabled={disable}
            />
          </div>
        ) : null}
        {pathname === "/planners" ? (
          <div className="form-group">
            <ReactSelect
              name="acountry"
              options={africanCountriesOptions}
              value={acountry ? acountry : ""}
              onChange={onSelectCountry}
              disabled={disable}
            />
          </div>
        ) : null}

        {acountry || country ? (
          <div className="form-group">
            <ReactSelect
              name="st"
              options={stateOptions}
              value={st ? st : ""}
              onChange={onSelectState}
              disabled={disable}
            />
          </div>
        ) : null}
        {st ? (
          <div className="form-group">
            <ReactSelect
              name="city"
              options={cityOptions}
              value={city ? city : ""}
              onChange={onChange}
              placeholder="Select City"
              disabled={disable}
            />
          </div>
        ) : null}

        <div className="form-group">
          <ReactSelect
            name="categories"
            value={categories}
            onChange={onChange}
            options={categoryOptions}
            disabled={disable}
          />
        </div>
        <div className="form-group">
          <ReactSelect
            name="targetMarket"
            value={targetMarket}
            onChange={onChange}
            options={targetMarketOptions}
            disabled={disable}
          />
        </div>
        {pathname === "/planners" ? (
          <div className="">
            <ReactSelect
              name="eventType"
              value={eventType}
              onChange={onChange}
              options={eventTypeOptions}
              disabled={disable}
            />
          </div>
        ) : null}
        {filtersExist() ? (
          <button
            onClick={clearFilters}
            style={{
              color: "blue",
              border: "none",
              cursor: "pointer",
              display: "inline-block",
              backgroundColor: "inherit",
              paddingTop: "3px",
              paddingBottom: "3px",
              paddingLeft: "30px",
              paddingRight: "30px",
              textAlign: "center",
              marginTop: "10px",
              marginBottom: "10px",
              backgroundColor: "yellow",
              border: "1px solid black",
              fontSize: "18px",
            }}
          >
            {t.clearFilters}
          </button>
        ) : null}
      </form>
    </div>
  );
};

export default Filters;
