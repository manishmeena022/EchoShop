import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser } from "../../redux/features/auth/authSlice";

const AdminOnlyRoute = ({ children }) => {

  const user = useSelector(selectUser);
  const userRole = user?.role;

  if (userRole === "admin") {
    return children;
  }
  
  return (
    <section style={{ height: "80vh" }}>
      <div className="container">
        <h2>Permission Denied.</h2>
        <p>This page can only be viewed by an Admin user.</p>
        <br />
        <Link to="/">
          <button className="--btn">&larr; Back To Home</button>
        </Link>
      </div>
    </section>
  );
};

export const AdminOnlyLink = ({ children }) => {
  const user = useSelector(selectUser);
  const userRole = user?.role;

  if (userRole === "admin") {
    return children;
  }
  return null;
};

export default AdminOnlyRoute;