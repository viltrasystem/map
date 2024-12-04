import { ReactNode, useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { RootState } from "../app/store";
import { jwtDecode } from "jwt-decode";
import { setAuthState } from "../slices/authSlice";
import { useRefreshTokenMutation } from "../services/refreshApi";
import LoadingModal from "./LoadingModal";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const { token, user } = useAppSelector((state: RootState) => state.auth);
  const [refreshMutation] = useRefreshTokenMutation();

  // Memoize the refresh request to prevent recreation on each render
  const refreshRequest = useMemo(
    () => ({
      UserId: user.UserId,
      Token: token?.accessToken,
      RefreshToken: token?.refreshToken,
    }),
    [user.UserId, token?.accessToken, token?.refreshToken]
  );

  useEffect(() => {
    const validateToken = async () => {
      if (token && token.accessToken && user.UserId !== 0) {
        const decodedToken = jwtDecode(token.accessToken);
        const expiryDate = decodedToken?.exp
          ? new Date(decodedToken.exp * 1000)
          : null;

        if (expiryDate) {
          const currentDate = new Date();
          if (currentDate < expiryDate) {
            setIsLoading(false);
            return;
          } else {
            try {
              const result = await refreshMutation(refreshRequest).unwrap();
              if (result) {
                dispatch(setAuthState(result));
                setIsLoading(false);

                return;
              }
            } catch {
              navigate("/login", { state: { from: location } });
            }
          }
        } else {
          navigate("/login", { state: { from: location } });
        }
      } else {
        navigate("/login", { state: { from: location } });
      }
    };

    validateToken();
  }, []);

  if (isLoading) return <LoadingModal />;

  return children;
};

export default ProtectedRoute;
