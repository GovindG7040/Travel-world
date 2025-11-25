// src/pages/TourDetails.jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import "../styles/tour-details.css";

import { useParams } from "react-router-dom";
import { Col, Container, Form, ListGroup, Row } from "reactstrap";
import calculateAvgRating from "../utils/avgRating";
import avatar from "../assets/images/avatar.jpg";
import Booking from "../components/Booking/Booking";
import Newsletter from "../shared/Newsletter";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";

import { AuthContext } from "../context/AuthContext";

const TourDetails = () => {
  const { id } = useParams();
  const reviewMsgRef = useRef(null);
  const [tourRating, setTourRating] = useState(null);
  const { user } = useContext(AuthContext);

  // fetch data from database
  const { data: tour, loading, error } = useFetch(`${BASE_URL}/tours/${id}`);

  // defensive defaults
  const {
    photo,
    title,
    desc,
    price,
    reviews = [],
    address,
    city,
    distance,
    maxGroupSize,
  } = tour || {};

  const { totalRating, avgRating } = calculateAvgRating(reviews || []);

  const options = { day: "numeric", month: "long", year: "numeric" };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please sign in");
      return;
    }

    const reviewText = reviewMsgRef.current?.value?.trim?.() || "";
    if (!reviewText) {
      return alert("Please write a review before submitting");
    }

    // require rating (optional — if you want to allow unrated text, remove this)
    if (!tourRating || tourRating < 1) {
      return alert("Please select a star rating (1-5)");
    }

    const reviewObj = {
      username: user.username,
      reviewText,
      rating: tourRating,
    };

    try {
      const res = await fetch(`${BASE_URL}/review/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reviewObj),
      });

      // read raw text -> parse JSON to avoid 'Unexpected token <' problems
      const text = await res.text();
      let result = null;
      try {
        result = JSON.parse(text);
      } catch (parseErr) {
        // server returned non-JSON (likely HTML error or 404 page). log full response for debugging.
        console.error("Non-JSON response when submitting review:", text);
        throw new Error("Server returned unexpected response format. See console for details.");
      }

      if (!res.ok) {
        console.error("Review submit failed:", result);
        return alert(result.message || `Failed to submit (status ${res.status})`);
      }

      alert(result.message || "Review submitted successfully");

      // clear input and rating
      if (reviewMsgRef.current) reviewMsgRef.current.value = "";
      setTourRating(null);

      // Ideally re-fetch the tour data here so the new review appears without reload.
      // If your useFetch hook returns a refetch function, call it here (e.g. refetch()).
      // For now fallback to a full reload to update UI:
      window.location.reload();
    } catch (err) {
      console.error("Review submit error:", err);
      alert(err.message || "Something went wrong while submitting review");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tour]);

  return (
    <>
      <section>
        <Container>
          {loading && <h4 className="text-center pt-5">Loading.....</h4>}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && (
            <Row>
              <Col lg="8">
                <div className="tour__content">
                  <img src={photo} alt={title || "tour photo"} />
                  <div className="tour__info">
                    <h2>{title}</h2>
                    <div className="d-flex align-items-center gap-5">
                      <span className="tour__rating d-flex align-items-center gap-1">
                        <i
                          className="ri-star-fill"
                          style={{ color: "var(--secondary-color)" }}
                        ></i>
                        {avgRating === 0 ? null : avgRating}
                        {totalRating === 0 ? "Not rated" : <span>({reviews?.length})</span>}
                      </span>

                      <span>
                        <i className="ri-map-pin-user-fill"></i>
                        {address}
                      </span>
                    </div>

                    <div className="tour__extra-details">
                      <span>
                        <i className="ri-map-pin-2-line"></i>
                        {city}
                      </span>
                      <span>
                        <i className="ri-money-dollar-circle-line"></i>${price}/per person
                      </span>
                      <span>
                        <i className="ri-map-pin-time-line"></i>
                        {distance} k/m
                      </span>
                      <span>
                        <i className="ri-group-line"></i>
                        {maxGroupSize} people{" "}
                      </span>
                    </div>
                    <h5>Description</h5>
                    <p>{desc}</p>
                  </div>

                  <div className="tour__reviews mt-4">
                    <h4>Reviews ({reviews?.length} reviews)</h4>

                    <Form onSubmit={submitHandler}>
                      <div
                        className="d-flex align-items-center gap-3 mb-4 rating__group"
                        role="radiogroup"
                        aria-label="Select rating"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span
                            key={n}
                            onClick={() => setTourRating(n)}
                            role="radio"
                            aria-checked={tourRating === n}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") setTourRating(n);
                            }}
                            style={{
                              cursor: "pointer",
                              fontWeight: tourRating === n ? 700 : 400,
                            }}
                          >
                            {n}
                            <i
                              className="ri-star-fill"
                              style={{ marginLeft: 6, color: tourRating >= n ? "#f6b93b" : "#ddd" }}
                            ></i>
                          </span>
                        ))}
                      </div>

                      <div className="review__input">
                        <input
                          type="text"
                          ref={reviewMsgRef}
                          placeholder="share your thoughts"
                          required
                          aria-label="Review text"
                        />
                        <button className="btn primary__btn text-white" type="submit">
                          Submit
                        </button>
                      </div>
                    </Form>

                    <ListGroup className="user__reviews" style={{ marginTop: 12 }}>
                      {reviews?.length === 0 && <p>No reviews yet — be the first!</p>}
                      {reviews?.map((review) => (
                        <div className="review__item" key={review._id || review.createdAt}>
                          <img src={avatar} alt="user avatar" />
                          <div className="w-100">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h5>{review.username}</h5>
                                <p>{new Date(review.createdAt).toLocaleDateString("en-US", options)}</p>
                              </div>
                              <span className="d-flex align-items-center">
                                {review.rating}
                                <i className="ri-star-fill" style={{ color: "#f6b93b", marginLeft: 6 }}></i>
                              </span>
                            </div>
                            <h6>{review.reviewText}</h6>
                          </div>
                        </div>
                      ))}
                    </ListGroup>
                  </div>
                </div>
              </Col>
              <Col lg="4">
                <Booking tour={tour} avgRating={avgRating} />
              </Col>
            </Row>
          )}
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default TourDetails;
