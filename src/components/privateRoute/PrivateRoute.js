import { Navigate, Outlet } from "react-router-dom";
import { selectAuth } from "../../selectors/AuthSelector";
import { useSelector } from "react-redux";
import { getIdToken } from "../../api/authToken";

const PrivateRoutes = () => {
  const { isAuthenticated } = useSelector(selectAuth);
  const hasToken = Boolean(getIdToken());
  return isAuthenticated || hasToken ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoutes;
