import { Navigate, Outlet } from "react-router-dom";
import { selectAuth } from "../../selectors/AuthSelector";
import { useSelector } from "react-redux";
import CustomCookies from "../../api/Cookies";

const PrivateRoutes = () => {
  const { isAuthenticated } = useSelector(selectAuth);
  const hasToken = CustomCookies.hasToken();
  return isAuthenticated || hasToken ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoutes;
