import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../components/product/productList/ProductList.module.scss";
import { PageMenu, ProductItem } from "../../components/index.js";
import { getWishlist, removeFromWishlist } from "../../redux/features/auth/authSlice";

const Wishlist = () => {
  const [grid, setGrid] = useState(true);
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.auth);

  const removeWishlist = async (product) => {
    const productId = product._id;
    await dispatch(removeFromWishlist(productId));
    await dispatch(getWishlist());
  };

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  return (
    <>
      <section>
        <div className="container">
          <PageMenu />
          <h2>My Wishlist</h2>
          <div className="--underline"></div>
          <div className={grid ? `${styles.grid}` : `${styles.list}`}>
            {wishlist.length === 0 ? (
              <p>No product found in your wishlist...</p>
            ) : (
              <>
                {wishlist.map((product) => {
                  return (
                    <div key={product._id}>
                      <ProductItem {...product} grid={grid} product={product} />
                      <button
                        className="--btn --btn-primary --btn-block"
                        onClick={() => removeWishlist(product)}
                      >
                        Romove From Wishlist
                      </button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Wishlist;
