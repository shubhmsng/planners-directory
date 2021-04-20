import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Filters from "../Filters/Filters";
import { connect } from "react-redux";
import { getPlanners } from "../../../../actions/plannerActions";
import { getVendors } from "../../../../actions/vendorActions";
import PlannerItem from "../PlannerItem/PlannerItem";

import {
  getFilterOptions,
  getStatesOptions,
  getCityOptions,
  getAllCountriesOptions,
} from "../../../../actions/optionActions";
import { resetResults } from "../../../../actions/common";
import Spinner from "../../../common/Spinner/Spinner";
import NoResults from "../../NoResults";
import queryString from "query-string";
import isEmpty from "../../../../utils/is-empty";
import Pagination from "../../../../utils/Pagination";

class Planners extends Component {
  state = {
    pager: {},
    pageOfItems: [],
    pageNo: 1,
    query: "",
    acountry: "",
    country: "",
    st: "",
    city: "",
    eventType: "",
    categories: "",
    targetMarket: "",
    seeAll: false,
    filterFound: "",
    isLoading: false,
  };

  componentDidMount = async () => {
    let params;
    await this.props.getAllCountriesOptions();
    if (this.props.pageOfItems.length < 1) {
      console.log("IN FUCKING CDM");
      // Getting Search Query Params and Mapping it to state
      const { search } = this.props.location;
      params = queryString.parse(search) || "";
      this.urlMapper(params, "initial");
    }
    if (!this.props.filtersLoaded) this.props.getFilterOptions();
    await this.props.getAllCountriesOptions();
    if (params) {
      await this.props.getAllCountriesOptions();
      await this.handleFilters();
    }
  };

  getPlanners = async () => {
    await this.props.getPlanners();
    this.setState({
      pager: this.props.pager,
      pageOfItems: this.props.pageOfItems,
    });
  };
  componentWillReceiveProps = async (prevProps, prevState) => {
    console.log("CWRCPRS HITS");
    if (prevProps.location.search != this.props.location.search) {
      const {
        country,
        acountry,
        st,
        categories,
        city,
        eventType,
        targetMarket,
      } = this.state;
      const previousSearch = prevProps.location.search;
      let url;
      let search;
      //  await  this.setState({isLoading:true})
      const { pathname } = this.props.location;
      let currentSearch = this.props.location.search;
      const currentPath = this.props.location.pathname;
      const previousPath = prevProps.location.pathname;
      let currentParams = queryString.parse(currentSearch) || "";
      let previousParams = queryString.parse(previousSearch);
      if (previousParams.co != currentParams.co) {
        if (pathname == "/planners") {
          if (currentParams.co == acountry) {
            console.log("cwrp handle filter");
            await this.setState({ acountry: previousParams.co, country: "" });

            if (
              previousParams.co &&
              this.props.allCountriesOptions.length > 0
            ) {
              await this.props.getAllCountriesOptions();
              const elementFound = await this.props.allCountriesOptions.filter(
                (u) => u.value == previousParams.co
              );
              // console.log(elementFound, 'element fountd',params.co,'array',this.props.allCountriesOptions);
              if (elementFound.length == 0) {
                console.log("country element no found");
                delete currentParams.co;
                if (currentParams.st) delete currentParams.st;
                if (currentParams.ct) delete currentParams.ct;
                const newHistory = queryString.stringify(currentParams);
                currentSearch = "?" + newHistory;
                url = pathname.concat(currentSearch);
                url = this.updateQueryStringParameter(url, "co", "");
                if (pathname === "/planners") {
                  this.props.getPlanners({ url: currentSearch });
                } else {
                  this.props.getVendors({ url: currentSearch });
                }
              } else {
                if (acountry !== previousParams.co)
                  await this.setState({ acountry: previousParams.co });
                console.log("matched countries");
                const newHistory = queryString.stringify(previousParams);
                currentSearch = "?" + newHistory;
                if (pathname === "/planners") {
                  this.props.getPlanners({ url: currentSearch });
                } else {
                  this.props.getVendors({ url: currentSearch });
                }
                if (this.state.acountry) {
                  await this.props.getStatesOptions({
                    code: this.state.acountry,
                  });
                }
              }
            }
            if (!previousParams.co) {
              if (currentParams.co) delete currentParams.co;
              if (currentParams.st) delete currentParams.st;
              if (currentParams.ct) delete currentParams.ct;
              const newHistory = queryString.stringify(currentParams);
              currentSearch = "?" + newHistory;
              url = pathname.concat(currentSearch);
              url = this.updateQueryStringParameter(url, "co", "");
              if (pathname === "/planners") {
                this.props.getPlanners({ url: currentSearch });
              } else {
                this.props.getVendors({ url: currentSearch });
              }
            }
          }
        }
        if (pathname == "/vendors") {
          if (currentParams.co == country) {
            console.log("cwrp handle filter");
            await this.setState({ country: previousParams.co, acountry: "" });

            if (
              previousParams.co &&
              this.props.allCountriesOptions.length > 0
            ) {
              await this.props.getAllCountriesOptions();
              const elementFound = await this.props.allCountriesOptions.filter(
                (u) => u.value == previousParams.co
              );
              // console.log(elementFound, 'element fountd',params.co,'array',this.props.allCountriesOptions);
              if (elementFound.length == 0) {
                console.log("country element no found");
                delete currentParams.co;
                if (currentParams.st) delete currentParams.st;
                if (currentParams.ct) delete currentParams.ct;
                const newHistory = queryString.stringify(currentParams);
                currentSearch = "?" + newHistory;
                url = pathname.concat(currentSearch);
                url = this.updateQueryStringParameter(url, "co", "");
                if (pathname === "/vendors") {
                  this.props.getVendors({ url: currentSearch });
                } else {
                  this.props.getPlanners({ url: currentSearch });
                }
              } else {
                if (country !== previousParams.co)
                  await this.setState({ country: previousParams.co });
                console.log("matched countries");
                const newHistory = queryString.stringify(previousParams);
                currentSearch = "?" + newHistory;
                if (pathname === "/vendors") {
                  this.props.getPlanners({ url: currentSearch });
                } else {
                  this.props.getVendors({ url: currentSearch });
                }
                if (this.state.country) {
                  await this.props.getStatesOptions({
                    code: this.state.country,
                  });
                }
              }
            }
            if (!previousParams.co) {
              if (currentParams.co) delete currentParams.co;
              if (currentParams.st) delete currentParams.st;
              if (currentParams.ct) delete currentParams.ct;
              const newHistory = queryString.stringify(currentParams);
              currentSearch = "?" + newHistory;
              url = pathname.concat(currentSearch);
              url = this.updateQueryStringParameter(url, "co", "");
              if (pathname === "/planners") {
                this.props.getPlanners({ url: currentSearch });
              } else {
                this.props.getVendors({ url: currentSearch });
              }
            }
          }
        }
      }
      // countries end
      if (previousParams.st != currentParams.st) {
        // console.log('cwrp handle filter 2 states', previousParams.st,currentParams,'state',this.state.st)

        if (currentParams.st && !isEmpty(st) && currentParams.st == st) {
          // console.log('cwrp handle filter 2 states', previousParams.st,currentParams)

          if (!previousParams.st) {
            delete currentParams.st;
            const newHistory = queryString.stringify(currentParams);
            currentSearch = "?" + newHistory;
            url = pathname.concat(currentSearch);
            // this.props.history.push(url);
            await this.setState({ st: "" });
            if (pathname === "/planners") {
              this.props.getPlanners({ url: currentSearch });
            } else {
              this.props.getVendors({ url: currentSearch });
            }
          }
          if (previousParams.st && previousParams.co) {
            if (
              !this.props.stateOptions &&
              this.props.stateOptions.length < 1
            ) {
              if (previousParams.co) {
                await this.props.getStatesOptions({ code: previousParams.co });
              }
            }
            const elementFound = await this.props.stateOptions.filter(
              (u) => u.value == previousParams.st
            );
            if (elementFound.length == 0) {
              delete previousParams.st;

              if (previousParams.ct) delete previousParams.ct;

              const newHistory = queryString.stringify(previousParams);
              currentSearch = "?" + newHistory;
              url = pathname.concat(currentSearch);
              url = this.updateQueryStringParameter(
                url,
                "st",
                "Select State..."
              );
              url = this.updateQueryStringParameter(
                url,
                "ct",
                "Select City..."
              );
              if (pathname === "/planners") {
                this.props.getPlanners({ url: currentSearch });
              } else {
                this.props.getVendors({ url: currentSearch });
              }
              // this.props.history.push(url);
              console.log(currentSearch, "current");
              await this.setState({ st: "", city: "" });
            } else {
              console.log("matched states element", elementFound);

              const data = {
                code: previousParams.st,
              };
              await this.props.getCityOptions(data);
              const newHistory = queryString.stringify(previousParams);
              currentSearch = "?" + newHistory;
              url = pathname.concat(currentSearch);
              url = this.updateQueryStringParameter(
                url,
                "st",
                previousParams.st
              );
              // this.props.history.push(url);
              await this.setState({ st: previousParams.st });
              if (pathname === "/planners") {
                this.props.getPlanners({ url: currentSearch });
              } else {
                this.props.getVendors({ url: currentSearch });
              }
              console.log(
                currentParams.st,
                previousParams.st,
                "state set",
                this.state.st
              );
            }
          }

          //  await this.handleFilters()
        }
        //
        if (!this.state.st && previousParams.st) {
          console.log("logic is here");
          if (previousParams.co) {
            await this.props.getStatesOptions({ code: previousParams.co });
          }
          const elementFound = await this.props.stateOptions.filter(
            (u) => u.value == previousParams.st
          );
          if (elementFound.length == 0) {
            delete previousParams.st;

            if (previousParams.ct) delete previousParams.ct;

            const newHistory = queryString.stringify(previousParams);
            currentSearch = "?" + newHistory;
            url = pathname.concat(currentSearch);
            // this.props.history.push(url);
            url = this.updateQueryStringParameter(url, "st", "Select State...");
            url = this.updateQueryStringParameter(url, "ct", "Select City...");
            if (pathname === "/planners") {
              this.props.getPlanners({ url: currentSearch });
            } else {
              this.props.getVendors({ url: currentSearch });
            }
            console.log(currentSearch, "current");
            await this.setState({ st: "", city: "" });
          } else {
            console.log("matched states element logic in here", elementFound);

            const data = {
              code: previousParams.st,
            };
            await this.props.getCityOptions(data);
            const newHistory = queryString.stringify(previousParams);
            currentSearch = "?" + newHistory;
            // url = pathname.concat(currentSearch);
            // url = this.updateQueryStringParameter(url,'st',previousParams.st)
            if (pathname === "/planners") {
              this.props.getPlanners({ url: currentSearch });
            } else {
              this.props.getVendors({ url: currentSearch });
            }
            // this.props.history.push(url);
            await this.setState({ st: previousParams.st });
          }
        }
      }

      // state end
      if (
        previousParams.ct != currentParams.ct &&
        previousParams.st &&
        previousParams.co
      ) {
        if (currentParams.ct && !isEmpty(city) && currentParams.ct == city) {
          console.log(currentParams.ct, "city", previousParams.ct);

          if (!previousParams.ct) {
            delete currentParams.ct;
            const newHistory = queryString.stringify(currentParams);
            currentSearch = "?" + newHistory;
            url = pathname.concat(currentSearch);
            //this.props.history.push(url);

            if (pathname === "/planners") {
              this.props.getPlanners({ url: currentSearch });
            } else {
              this.props.getVendors({ url: currentSearch });
            }
            await this.setState({ city: "" });
          }

          if (previousParams.ct != currentParams.ct) {
            if (
              currentParams.ct &&
              !isEmpty(city) &&
              currentParams.ct == city
            ) {
              console.log(currentParams.ct, "city", previousParams.ct);

              if (!previousParams.ct) {
                delete currentParams.ct;
                const newHistory = queryString.stringify(currentParams);
                currentSearch = "?" + newHistory;
                url = pathname.concat(currentSearch);
                if (pathname === "/planners") {
                  this.props.getPlanners({ url: currentSearch });
                } else {
                  this.props.getVendors({ url: currentSearch });
                }
                // this.props.history.push(url);
                await this.setState({ city: "" });
              }

              if (previousParams.st && previousParams.co && previousParams.ct) {
                if (
                  !this.props.cityOptions &&
                  this.props.cityOptions.length < 1
                ) {
                  if (previousParams.st) {
                    const data = {
                      code: previousParams.st,
                    };
                    await this.props.getCityOptions(data);
                  }
                }
                const elementFound = await this.props.cityOptions.filter(
                  (u) => u.value == previousParams.ct
                );
                if (elementFound.length == 0) {
                  console.log("not matched");
                  delete previousParams.ct;
                  const newHistory = queryString.stringify(previousParams);
                  currentSearch = "?" + newHistory;
                  url = pathname.concat(currentSearch);
                  if (pathname === "/planners") {
                    this.props.getPlanners({ url: currentSearch });
                  } else {
                    this.props.getVendors({ url: currentSearch });
                  }
                  //   this.props.history.push(url);
                  console.log(currentSearch, "current");
                  await this.setState({ city: "" });
                } else {
                  console.log("matched states element", elementFound);

                  const newHistory = queryString.stringify(previousParams);
                  currentSearch = "?" + newHistory;
                  url = pathname.concat(currentSearch);
                  url = this.updateQueryStringParameter(
                    url,
                    "ct",
                    previousParams.ct
                  );
                  //  this.props.history.push(url);
                  await this.setState({ city: previousParams.ct });
                  if (pathname === "/planners") {
                    this.props.getPlanners({ url: currentSearch });
                  } else {
                    this.props.getVendors({ url: currentSearch });
                  }
                  // console.log(currentParams.st,previousParams.st,'state set',this.state.st);
                }
              }

              // await this.handleFilters()
            }
          }
          // await this.handleFilters()
        }
        if (!this.state.city && previousParams.st && previousParams.co) {
          console.log("logic is here");
          if (previousParams.st) {
            const data = {
              code: previousParams.st,
            };
            await this.props.getCityOptions(data);
          }
          const elementFound = await this.props.cityOptions.filter(
            (u) => u.value == previousParams.ct
          );
          if (elementFound.length == 0) {
            delete previousParams.ct;

            const newHistory = queryString.stringify(previousParams);
            currentSearch = "?" + newHistory;
            url = pathname.concat(currentSearch);
            if (pathname === "/planners") {
              this.props.getPlanners({ url: currentSearch });
            } else {
              this.props.getVendors({ url: currentSearch });
            }

            //     this.props.history.push(url);
            console.log(currentSearch, "current");
            await this.setState({ city: "" });
          } else {
            console.log("matched states element logic in here", elementFound);

            const newHistory = queryString.stringify(previousParams);
            currentSearch = "?" + newHistory;

            // url = pathname.concat(currentSearch);
            // url = this.updateQueryStringParameter(url,'st',previousParams.st)
            // this.props.history.push(url);
            if (pathname === "/planners") {
              this.props.getPlanners({ url: currentSearch });
            } else {
              this.props.getVendors({ url: currentSearch });
            }
            await this.setState({ city: previousParams.ct });
          }
        }
      }

      // city end
      if (previousParams.cat != currentParams.cat) {
        if (
          currentParams.cat &&
          !isEmpty(categories) &&
          currentParams.cat == categories
        ) {
          // console.log('cwrp handle filter 2 states', previousParams.st,currentParams)

          if (!previousParams.cat) {
            delete currentParams.cat;
            const newHistory = queryString.stringify(currentParams);
            currentSearch = "?" + newHistory;
            url = pathname.concat(currentSearch);

            await this.setState({ categories: "" });
          }
          if (previousParams.cat) {
            await this.setState({ categories: previousParams.cat });
            const newHistory = queryString.stringify(previousParams);
            currentSearch = "?" + newHistory;
            url = pathname.concat(currentSearch);
            url = this.updateQueryStringParameter(url, "cat", categories);
            if (pathname === "/planners") {
              this.props.getPlanners({ url: currentSearch });
            } else {
              this.props.getVendors({ url: currentSearch });
            }
          }

          //  await this.handleFilters()
        }
        //
        if (!this.state.categories && previousParams.cat) {
          console.log("logic is here");

          const newHistory = queryString.stringify(previousParams);
          currentSearch = "?" + newHistory;

          url = pathname.concat(currentSearch);
          url = await this.updateQueryStringParameter(
            url,
            "cat",
            previousParams.cat
          );
          // this.props.history.push(url);
          await this.setState({ categories: previousParams.cat });
          if (pathname === "/planners") {
            this.props.getPlanners({ url: currentSearch });
          } else {
            this.props.getVendors({ url: currentSearch });
          }
        }
      }
      // categories end   11
      if (previousParams.tm != currentParams.tm) {
        if (
          currentParams.tm &&
          !isEmpty(targetMarket) &&
          currentParams.tm == targetMarket
        ) {
          // console.log('cwrp handle filter 2 states', previousParams.st,currentParams)

          if (!previousParams.tm) {
            delete currentParams.tm;
            const newHistory = queryString.stringify(currentParams);
            currentSearch = "?" + newHistory;
            url = pathname.concat(currentSearch);

            await this.setState({ targetMarket: "" });
          }
          if (previousParams.tm) {
            await this.setState({ categories: previousParams.tm });
            const newHistory = queryString.stringify(previousParams);
            currentSearch = "?" + newHistory;
            url = pathname.concat(currentSearch);
            url = this.updateQueryStringParameter(url, "tm", targetMarket);
            if (pathname === "/planners") {
              this.props.getPlanners({ url: currentSearch });
            } else {
              this.props.getVendors({ url: currentSearch });
            }
          }

          //  await this.handleFilters()
        }
        //
        if (!this.state.targetMarket && previousParams.tm) {
          console.log("logic is here");

          const newHistory = queryString.stringify(previousParams);
          currentSearch = "?" + newHistory;

          url = pathname.concat(currentSearch);
          url = await this.updateQueryStringParameter(
            url,
            "tm",
            previousParams.tm
          );
          // this.props.history.push(url);
          await this.setState({ targetMarket: previousParams.tm });
          if (pathname === "/planners") {
            this.props.getPlanners({ url: currentSearch });
          } else {
            this.props.getVendors({ url: currentSearch });
          }
        }
      }
      // target market end
      if (previousParams.et != currentParams.et) {
        if (
          currentParams.et &&
          !isEmpty(eventType) &&
          currentParams.et == eventType
        ) {
          // console.log('cwrp handle filter 2 states', previousParams.st,currentParams)

          if (!previousParams.et) {
            delete currentParams.et;
            const newHistory = queryString.stringify(currentParams);
            currentSearch = "?" + newHistory;
            url = pathname.concat(currentSearch);

            await this.setState({ eventType: "" });
          }
          if (previousParams.et) {
            await this.setState({ eventType: previousParams.et });
            const newHistory = queryString.stringify(previousParams);
            currentSearch = "?" + newHistory;
            url = pathname.concat(currentSearch);
            url = this.updateQueryStringParameter(url, "et", eventType);
            if (pathname === "/planners") {
              this.props.getPlanners({ url: currentSearch });
            } else {
              this.props.getVendors({ url: currentSearch });
            }
          }

          //  await this.handleFilters()
        }
        //
        if (!this.state.eventType && previousParams.et) {
          console.log("logic is here");

          const newHistory = queryString.stringify(previousParams);
          currentSearch = "?" + newHistory;

          url = pathname.concat(currentSearch);
          url = await this.updateQueryStringParameter(
            url,
            "et",
            previousParams.et
          );
          // this.props.history.push(url);
          await this.setState({ eventType: previousParams.et });
          if (pathname === "/planners") {
            this.props.getPlanners({ url: currentSearch });
          } else {
            this.props.getVendors({ url: currentSearch });
          }
        }
      }
      // event type end
    }

    // if (!this.props.location.search && prevProps.location.search) {
    //   this.clearFilters();
    // }

    // await  this.setState({isLoading:false})
  };

  componentDidUpdate = async (prevProps, prevState) => {
    const previousSearch = prevProps.location.search;
    const currentSearch = this.props.location.search;
    const currentPath = this.props.location.pathname;
    const previousPath = prevProps.location.pathname;
    let currentParams = queryString.parse(currentSearch) || "";
    let previousParams = queryString.parse(previousSearch);
    if (prevState.acountry != this.state.acountry) {
      console.log("cdu handle filter");
    }
    //  console.log(prevState.acountry,'prevst',this.state.acountry,'current',currentParams.co,'currentpar',previousParams.co,'prevparam','co history2')

    //  if(currentParams.co == this.state.acountry){
    //    this.handleFilters();
    //  }
    // if (previousSearch !== currentSearch) {

    //   await this.handleFilters();

    // }

    if (currentPath !== previousPath) {
      console.log("in cdu condition");
      const { search } = this.props.history.location;
      if (currentPath === "/planners") {
        this.props.getPlanners({ url: search });
        this.setState({ country: "" });
      } else {
        this.props.getVendors({ url: search });
        this.setState({ acountry: "" });
      }

      // await this.handleFilters();
    }
  };

  /* This Mehtod will map url params to component state on intial and 
     updates */
  urlMapper = (params, method) => {
    let mappingObject = {};
    const stateMappingObject = {
      ...(!isEmpty(params) &&
        !isEmpty(params.query) && { query: params.query }),
      ...(!isEmpty(params) &&
        !isEmpty(params.pageNo) && { pageNo: params.pageNo }),
      ...(!isEmpty(params) && !isEmpty(params.co) && { acountry: params.co }),
      ...(!isEmpty(params) && !isEmpty(params.st) && { st: params.st }),
      ...(!isEmpty(params) && !isEmpty(params.ct) && { city: params.ct }),
      ...(!isEmpty(params) &&
        !isEmpty(params.cat) && { categories: params.cat }),
      ...(!isEmpty(params) && !isEmpty(params.et) && { eventType: params.et }),
      ...(!isEmpty(params) &&
        !isEmpty(params.tm) && { targetMarket: params.tm }),
    };
    if (params && params.co) mappingObject.acountry = params.co;
    else mappingObject.acountry = "";
    if (params && params.st) mappingObject.st = params.st;
    else mappingObject.st = "";
    if (params && params.ct) mappingObject.city = params.ct;
    else mappingObject.city = "";
    if (params && params.cat) mappingObject.categories = params.cat;
    else mappingObject.categories = "";
    if (params && params.et) mappingObject.eventType = params.et;
    else mappingObject.eventType = "";
    if (params && params.tm) mappingObject.targetMarket = params.tm;
    else mappingObject.targetMarket = "";

    this.setState(mappingObject, () => {
      if (method === "initial") {
        if (this.state.acountry || this.state.country) {
          if (this.state.acountry) {
            this.props.getStatesOptions({
              code: this.state.acountry,
              country: "",
            });
          }
          if (this.state.country) {
            this.props.getStatesOptions({
              code: this.state.country,
              acountry: "",
            });
          }

          if (this.state.st) this.props.getCityOptions({ code: this.state.st });
        }
        const { pathname } = this.props.location;
        const { search } = this.props.location;
        const url = search;
        if (pathname === "/planners") this.props.getPlanners({ url });
        else if (pathname === "/vendors") this.props.getVendors({ url });
      } else {
        const { pathname } = this.props.location;
        const { search } = this.props.location;
        const url = search;
        if (pathname === "/planners") this.props.getPlanners({ url });
        else if (pathname === "/vendors") this.props.getVendors({ url });
      }
    });
  };
  onChange = async (e) => {
    e.persist();

    const cityValue = e.target.value;
    console.log(e.target.name, "eeee");
    if (e.target.name == "city") {
      this.setState({ city: cityValue, filterFound: "city" }, () => {
        this.handleFilters();
      });
    } else {
      this.setState({ [e.target.name]: e.target.value }, () => {
        this.handleFilters();
      });
    }
  };

  onSelectCountry = async (e) => {
    const countryCode = e.target.value;
    const label = {
      code: countryCode,
    };
    this.setState({ isLoading: true });
    let states;

    const { pathname } = this.props.location;
    if (pathname == "/planners") {
      this.setState(
        {
          acountry: countryCode,
          st: "",
          country: "",
          city: "",
          filterFound: "country",
        },
        () => this.handleFilters()
      );

      if (this.state.acountry) {
        this.props.getStatesOptions({
          code: this.state.acountry,
        });
      }
    }
    if (pathname == "/vendors") {
      console.log("vendors state set");
      this.setState(
        {
          country: countryCode,
          st: "",
          acountry: "",
          city: "",
          filterFound: "country",
        },
        () => {
          this.handleFilters();
        }
      );

      if (this.state.country) {
        this.props.getStatesOptions({
          code: this.state.country,
        });
      }
    }
  };

  onSelectState = async (e) => {
    let stateValue = e.target.value;
    const data = {
      code: stateValue,
    };
    await this.setState({ isLoading: true });
    await this.props.getCityOptions(data);
    await this.setState(
      { st: stateValue, city: "", filterFound: "state" },
      () => {
        this.handleFilters();
      }
    );
  };

  handlePagination = (page) => {
    let { search } = this.props.location;
    const { pathname } = this.props.location;
    let params = queryString.parse(search) || "";
    params.pageNo = page;

    const newHistory = queryString.stringify(params);
    search = "?" + newHistory;
    if (pathname === "/planners") {
      this.props.getPlanners({ url: search });
    } else {
      this.props.getVendors({ url: search });
    }

    //  let url = pathname.concat(search);
    //  this.props.history.push(url);

    // let s = !isEmpty(search) ? search : "";
    // let newUrl = s.substring(0, s.indexOf("&"));
    // let pageNo = !isEmpty(newUrl) ? newUrl : "";
    // this.setState({ pageNo });
  };

  handleFilters = async () => {
    console.log("hhandle filters call");

    const {
      country,
      acountry,
      st,
      categories,
      city,
      eventType,
      targetMarket,
    } = this.state;

    const { pathname } = this.props.location;
    this.setState({ isLoading: true });
    let { search } = this.props.location;
    console.log("search at top", search);
    const temp = await this.state.filterFound;
    let url;
    let params = queryString.parse(search) || "";

    if (temp == "country") {
      if (params.st) delete params["st"];
      if (params.ct) delete params["ct"];
      if (pathname == "/planners") params.co = acountry;
      if (pathname == "/vendors") params.co = country;
      const newHistory = queryString.stringify(params);
      search = "?" + newHistory;
      console.log(search, "search country hit");
    }
    if (temp == "state") {
      if (params.co) {
        if (params.ct) delete params["ct"];
        params.st = st;
        const newHistory = queryString.stringify(params);

        search = "?" + newHistory;
      } else await this.setState({ st: "" });
      //  console.log(search,'search state hit')
      //   url = pathname.concat(search);
      //   url = this.updateQueryStringParameter(url,'st',params.st)
    }
    if (temp == "city") {
      params.ct = city;
      const newHistory = queryString.stringify(params);

      search = "?" + newHistory;
    }

    // country filter

    if (params.co && this.props.allCountriesOptions.length == 0) {
      await this.props.getAllCountriesOptions();
    }
    if (params.co && this.props.allCountriesOptions.length > 0) {
      console.log("handle filters in co");
      await this.props.getAllCountriesOptions();
      const elementFound = await this.props.allCountriesOptions.filter(
        (u) => u.value == params.co
      );
      console.log(
        elementFound,
        "element fountd",
        params.co,
        "array",
        this.props.allCountriesOptions
      );
      if (elementFound.length == 0) {
        console.log("country element no found in handle filters");
        delete params.co;
        if (params.st) delete params.st;
        if (params.ct) delete params.ct;
        const newHistory = queryString.stringify(params);
        search = "?" + newHistory;
        url = pathname.concat(search);
        url = this.updateQueryStringParameter(url, "co", "Select Country...");
        if (pathname == "/planners") this.setState({ acountry: "" });
        if (pathname == "/vendors") this.setState({ country: "" });
      } else {
        if (acountry !== params.co && pathname == "/planners")
          await this.setState({ acountry: params.co });
        if (country !== params.co && pathname == "/vendors")
          await this.setState({ country: params.co });
        console.log("matched countries");
        if (this.state.acountry && pathname == "/planners") {
          this.props.getStatesOptions({
            code: this.state.acountry,
          });
        }
        if (this.state.country && pathname == "/vendors") {
          this.props.getStatesOptions({
            code: this.state.country,
          });
        }
      }
    }
    // end contries filter

    if (params.st && this.props.stateOptions.length == 0) {
      if (this.state.acountry) {
        await this.props.getStatesOptions({
          code: this.state.acountry,
        });
      }
      if (this.state.country) {
        await this.props.getStatesOptions({
          code: this.state.country,
        });
      }
    }
    if (params.st && params.co && this.props.stateOptions.length > 0) {
      console.log("handle filters in state");

      if (pathname == "/planners") {
        await this.props.getStatesOptions({
          code: this.state.acountry,
        });
      }
      if (pathname == "/vendors") {
        await this.props.getStatesOptions({
          code: this.state.country,
        });
      }

      const elementFound = await this.props.stateOptions.filter(
        (u) => u.value == params.st
      );
      // console.log(elementFound, 'element fountd',params.co,'array',this.props.allCountriesOptions);
      if (elementFound.length == 0) {
        console.log("state element no found in handle filters");

        if (params.st) delete params.st;
        if (params.ct) delete params.ct;
        const newHistory = queryString.stringify(params);
        search = "?" + newHistory;
        url = pathname.concat(search);
        url = this.updateQueryStringParameter(url, "st", "Select State...");
        await this.setState({ st: "" });
      } else {
        await this.setState({ st: params.st });
        console.log("matched states");
        const data = {
          code: params.st,
        };
        await this.props.getCityOptions(data);
      }
    }
    // state end

    if (params.ct && params.st && params.co) {
      if (!this.props.cityOptions || this.props.cityOptions.length < 1) {
        const data = {
          code: params.st,
        };
        await this.props.getCityOptions(data);
      }

      const elementFound = await this.props.cityOptions.filter(
        (u) => u.value == params.ct
      );

      if (elementFound.length == 0) {
        console.log("country element no found");
        delete params.ct;

        const newHistory = queryString.stringify(params);
        search = "?" + newHistory;
        url = pathname.concat(search);
        url = this.updateQueryStringParameter(url, "ct", "Select City");
        await this.setState({ city: "" });
      } else {
        const stFound = this.props.stateOptions.filter(
          (u) => u.value == params.st
        );
        const coFound = this.props.cityOptions.filter(
          (u) => u.value == params.co
        );
        if (stFound && coFound) {
          this.setState({ st: params.st, city: params.ct });
        } else {
          console.log("country element no found");

          if (params.st) delete params.st;
          if (params.ct) delete params.ct;
          const newHistory = queryString.stringify(params);
          search = "?" + newHistory;
        }
      }
    }
    if (params.ct && (!params.st || !params.co)) {
      if (params.ct) delete params.ct;
      const newHistory = queryString.stringify(params);
      search = "?" + newHistory;
    }

    if (!isEmpty(categories)) {
      params.cat = categories;
      const newHistory = queryString.stringify(params);

      search = "?" + newHistory;
      url = pathname.concat(search);
      url = this.updateQueryStringParameter(url, "cat", categories);
    } else if (isEmpty(categories) && search.cat) {
      await this.setState({ categories: search.cat });
    }

    if (!isEmpty(eventType)) {
      params.et = eventType;
      const newHistory = queryString.stringify(params);

      search = "?" + newHistory;
      url = pathname.concat(search);
      url = this.updateQueryStringParameter(url, "et", eventType);
    } else if (isEmpty(eventType) && search.et) {
      await this.setState({ eventType: search.et });
    }

    if (!isEmpty(targetMarket)) {
      params.tm = targetMarket;
      const newHistory = queryString.stringify(params);

      search = "?" + newHistory;
      url = pathname.concat(search);
      url = this.updateQueryStringParameter(url, "tm", targetMarket);
    } else if (isEmpty(targetMarket) && search.tm) {
      await this.setState({ targetMarket: search.tm });
    }

    url = pathname.concat(search);
    console.log("URL AFTER CHANGING", url);

    this.props.history.push(url);

    let finalSearch = this.props.history.location.search;
    if (pathname === "/planners") {
      this.props.getPlanners({ url: finalSearch });
    } else {
      this.props.getVendors({ url: finalSearch });
    }

    await this.setState({ filterFound: "", isLoading: false });
  };

  filtersExist = () => {
    const {
      country,
      acountry,
      st,
      categories,
      city,
      eventType,
      targetMarket,
    } = this.state;
    if (
      isEmpty(country) &&
      isEmpty(acountry) &&
      isEmpty(st) &&
      isEmpty(categories) &&
      isEmpty(city) &&
      isEmpty(eventType) &&
      isEmpty(targetMarket)
    ) {
      return false;
    } else return true;
  };

  clearFilters = async () => {
    this.setState({
      country: "",
      acountry: "",
      st: "",
      city: "",
      eventType: "",
      categories: "",
      targetMarket: "",
    });

    const { pathname } = this.props.location;
    let final_search = pathname.concat("?");
    if (pathname === "/planners") {
      this.props.getPlanners();
    } else {
      this.props.getVendors();
    }
    this.props.history.push(final_search);
  };

  updateQueryStringParameter = (uri, key, value) => {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf("?") !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, "$1" + key + "=" + value + "$2");
    } else {
      return uri + separator + key + "=" + value;
    }
  };

  seeAll = () => {
    this.setState({ seeAll: !this.state.seeAll });
    const { pathname } = this.props.location;
    pathname === "/planners"
      ? this.props.getPlanners()
      : this.props.getVendors();
  };

  createImages = (images) => {
    let imageValues = [];
    for (let i = 0; i < images.length; i++) {
      if (!isEmpty(images[i])) {
        imageValues.push(images[i]);
      }
    }
    return imageValues;
  };
  // onNext = async()=>{
  //   console.log('hit')
  // }
  render() {
    const {
      country,
      acountry,
      st,
      city,
      eventType,
      categories,
      targetMarket,
    } = this.state;

    const { pathname } = this.props.location;

    const {
      allAfricanCountriesOptions,
      allCountriesOptions,
      stateOptions,
      cityOptions,
      eventTypeOptions,
      targetMarketOptions,
      categoriesOptions,
      loading,
      pager,
      pageOfItems,
      t,
    } = this.props;
    const { search } = this.props.location;

    const params = queryString.parse(search) || "";
    const disable = this.props.noResults;
    let s = !isEmpty(search) ? search : "";
    console.log("S", s);

    let tobeRendered = null;

    if (this.props.loading || this.state.isLoading) tobeRendered = <Spinner />;
    else if (pageOfItems && pageOfItems.length > 0) {
      tobeRendered = pageOfItems.map((user) => (
        <PlannerItem
          key={user._id}
          user={user}
          imageValues={
            user.images ? this.createImages(Object.values(user.images)) : []
          }
          pathname={pathname}
          t={t}
        />
      ));
    } else {
      tobeRendered = <NoResults seeAll={this.seeAll} pathname={pathname} />;
    }

    let pagination =
      !loading &&
      !this.state.isLoading &&
      pager &&
      pager.pages &&
      pager.pages.length > 0 ? (
        <Pagination
          pager={pager}
          s={s}
          handlePagination={this.handlePagination}
        />
      ) : null;

    // Adding dynamic value for Label for Categories

    return (
      <section className="admin-section d-flex justify-content-center">
        <div className="container">
          <div className="row">
            <div className="col-md-2">
              <Filters
                country={country}
                acountry={acountry}
                st={st}
                city={city}
                categories={categories}
                eventType={eventType}
                targetMarket={targetMarket}
                africanCountriesOptions={allAfricanCountriesOptions}
                countriesOptions={allCountriesOptions}
                pathname={pathname}
                eventTypeOptions={eventTypeOptions}
                stateOptions={stateOptions}
                cityOptions={cityOptions}
                categoryOptions={categoriesOptions}
                targetMarketOptions={targetMarketOptions}
                onSelectCountry={this.onSelectCountry}
                onSelectState={this.onSelectState}
                clearFilters={this.clearFilters}
                onChange={this.onChange}
                filtersExist={this.filtersExist}
                t={t}
                disable={params.query ? disable : false}
                // onNext = {()=>this.onNext()}
              />
            </div>
            <div className="col-md-10">
              <div className={pathname === "/vendors" ? "vendor" : ""}>
                {tobeRendered}
              </div>
              <div className="packages-area">{pagination}</div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  allAfricanCountriesOptions: state.options.allAfricanCountriesOptions,
  allCountriesOptions: state.options.allCountriesOptions,
  cityOptions: state.options.cityOptions,
  stateOptions: state.options.stateOptions,
  categoriesOptions: state.options.webCatOptions,
  eventTypeOptions: state.options.webEventOptions,
  targetMarketOptions: state.options.targetMarketOptions,
  filtersLoaded: state.options.filtersLoaded,
  pager: state.common.pager,
  pageOfItems: state.common.pageOfItems,
  vendors: state.vendor.vendors,
  loading: state.common.loading,
  noResults: state.common.noResults,
  t: state.common.translatedLabels,
});
export default connect(mapStateToProps, {
  resetResults,
  getPlanners,
  getVendors,
  getFilterOptions,
  getStatesOptions,
  getCityOptions,
  getAllCountriesOptions,
})(withRouter(Planners));
