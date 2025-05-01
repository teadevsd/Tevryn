import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";


const ProtectedRoute = ({ element }) => {
  const { userData, loadingUserData } = useContext(AppContext);
  const location = useLocation();

  if (loadingUserData) {
    return <div>Loading...</div>; // Optional spinner
  }

  if (!userData || !localStorage.getItem("accessToken")) {
    localStorage.setItem("redirectPath", location.pathname);
    return <Navigate to="/auth" replace />;
  }

  return element;
};

export default ProtectedRoute;
