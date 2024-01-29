import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BsTrash } from "react-icons/bs";
import StarRating from "react-star-ratings";
import { FaEdit } from "react-icons/fa";
import "./ReviewProducts.module.scss";
import { Spinner, Card  } from "../../components/index.js";
import { deleteReview, getProduct, reviewProduct, updateReview } from "../../redux/features/product/productSlice";

const ReviewProducts = () => {

  const { id } = useParams();
  const [rate, setRate] = useState(0);
  const [review, setReview] = useState("");
  const [userReview, setUserReview] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const { isLoading, product } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  const submitReview = async (e) => {
    e.preventDefault();
    const today = new Date();
    const date = today.toDateString();
    if (rate === 0 || review === "") {
      return toast.error("Please enter rating and review");
    }
    const formData = {
      star: rate,
      review,
      reviewDate: date,
    };
    
    await dispatch(reviewProduct({ id, formData }));
    navigate(-1);
  };

  const delReview = async (e) => {
    const formData = {
      userID: user._id,
    };
    await dispatch(deleteReview({ id, formData }));
    navigate(-1);
  };
  
  const startEdit = async () => {
    setIsEditing(true);
    setRate(userReview[0].star);
    setReview(userReview[0].review);
  };

  const editReview = async (e) => {
    e.preventDefault();
    const today = new Date();
    const date = today.toDateString();
    if (rate === 0 || review === "") {
      return toast.error("Please enter rating and review");
    }
    const formData = {
      star: rate,
      review,
      reviewDate: date,
      userID: userReview[0].userID,
    };
    await dispatch(updateReview({ id, formData }));
    navigate(-1);
  };
  
  useEffect(() => {
    const reviewed = product?.ratings.filter((rev) => {
      return rev.userID === user?._id;
    });
    setUserReview(reviewed);
  }, [product, user]);

  const changeStar = (newRating, name) => {
    setRate(newRating);
  };

  return (
    <section>
      <div className="container review">
        <h2>Review Products</h2>
        {isLoading && product === null ? (
          <Spinner />
        ) : (
          <>
            <p>
              <b>Product name:</b> {product?.name}
            </p>
            <img
              src={product?.image[0]}
              alt={product?.name}
              style={{ width: "100px" }}
            />
          </>
        )}
        {userReview?.length > 0 && !isEditing ? (
          <Card cardClass={"card"}>
            <h3>Product Reviews</h3>
            <div>
              {userReview.map((item, index) => {
                const { star, review, reviewDate, name } = item;
                return (
                  <div key={index} className="review --flex-between --p">
                    <div>
                      <StarRating
                        starDimension="20px"
                        starSpacing="2px"
                        starRatedColor="#F6B01E"
                        rating={star}
                        changeRating={changeStar}
                        editing={false}
                      />
                      <p>{review}</p>
                      <span>
                        <b>{reviewDate}</b>
                      </span>
                      <br />
                      <span>
                        <b>by: {name}</b>
                      </span>
                    </div>
                    <div>
                      <FaEdit
                        color="green"
                        size={25}
                        onClick={() => startEdit()}
                      />
                      <BsTrash color="red" size={25} onClick={delReview} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ) : (
          <Card cardClass={"card --width-500px --p"}>
            <form>
              <label>Rating:</label>
              <StarRating
                starDimension="20px"
                starSpacing="2px"
                starRatedColor="#F6B01E"
                starHoverColor="#F6B01E"
                rating={rate}
                changeRating={changeStar}
                editing={true}
                isSelectable={true}
              />
              <label>Review</label>
              <textarea
                value={review}
                required
                onChange={(e) => setReview(e.target.value)}
                cols="30"
                rows="10"
              ></textarea>
              {!isEditing ? (
                <button
                  onClick={(e) => submitReview(e)}
                  className="--btn --btn-primary"
                >
                  Submit Review
                </button>
              ) : (
                <div className="--flex-start">
                  <button
                    onClick={(e) => editReview(e)}
                    className="--btn --btn-primary"
                  >
                    Update Review
                  </button>
                  <button onClick={() => setIsEditing(false)} className="--btn">
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </Card>
        )}
      </div>
    </section>
  );
};

export default ReviewProducts;
