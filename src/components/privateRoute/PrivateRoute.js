import { Navigate, Outlet } from "react-router-dom";
import { selectAuth } from "../../selectors/AuthSelector";
import { useSelector } from "react-redux";

const PrivateRoutes = () => {
  const { isAuthenticated } = useSelector(selectAuth);

  let auth = { token: false };
  // return true ? <Outlet /> : <Navigate to="/" />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
