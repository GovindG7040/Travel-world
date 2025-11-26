// frontend/src/shared/SearchBar.jsx
import React, { useRef } from "react";
import "../styles/search-bar.css";
import { Col, Form, FormGroup } from "reactstrap";

import { BASE_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const locationRef = useRef("");
  const distanceRef = useRef("");
  const maxGroupSizeRef = useRef("");
  const navigate = useNavigate();

  const searchHandler = async () => {
    const location = (locationRef.current?.value || "").trim();
    const distance = (distanceRef.current?.value || "").trim();
    const maxGroupSize = (maxGroupSizeRef.current?.value || "").trim();

    if (!location || !distance || !maxGroupSize) {
      return alert("Please fill all fields");
    }

    // encode query params to avoid bad characters / spaces
    const qCity = encodeURIComponent(location);
    const qDistance = encodeURIComponent(distance);
    const qMax = encodeURIComponent(maxGroupSize);

    const url = `${BASE_URL}/tours/search?city=${qCity}&distance=${qDistance}&maxGroupSize=${qMax}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        // log the status and text to debug server responses
        const txt = await res.text();
        console.error("Search error response:", res.status, txt);
        return alert("Something went wrong (see console)");
      }

      const result = await res.json();
      navigate(
        `/tours/search?city=${qCity}&distance=${qDistance}&maxGroupSize=${qMax}`,
        { state: result.data }
      );
    } catch (err) {
      console.error("Network/search fetch error:", err);
      alert("Something went wrong (network).");
    }
  };

  return (
    <Col lg="12">
      <div className="search__bar">
        <Form className="d-flex align-items-center gap-4">
          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span>
              <i className="ri-map-pin-line"></i>
            </span>
            <div>
              <h6>Location</h6>
              <input type="text" placeholder="Where are you going?" ref={locationRef} />
            </div>
          </FormGroup>

          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span>
              <i className="ri-map-pin-time-line"></i>
            </span>
            <div>
              <h6>Distance</h6>
              <input type="number" placeholder="Distance k/m" ref={distanceRef} />
            </div>
          </FormGroup>

          <FormGroup className="d-flex gap-3 form__group form__group-last">
            <span>
              <i className="ri-group-line"></i>
            </span>
            <div>
              <h6>Max People</h6>
              <input type="number" placeholder="0" ref={maxGroupSizeRef} />
            </div>
          </FormGroup>

          <span className="search__icon" role="button" onClick={searchHandler}>
            <i className="ri-search-line"></i>
          </span>
        </Form>
      </div>
    </Col>
  );
};

export default SearchBar;
