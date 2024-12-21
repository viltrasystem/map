import { HiOutlineLogout } from "react-icons/hi";
import SpinnerMini from "./SpinnerMini";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { useNavigate } from "react-router-dom";
import { RootState, persistor } from "../app/store";
import { logout } from "../thunk/authThunk";
import { LogoutRequest } from "../lib/types";
import { getToastOptions } from "../lib/helpFunction";
import { toast } from "react-toastify";

interface LogoutProps {
  isInsidePanel: boolean;
}
const HeaderMenu: React.FC<LogoutProps> = ({ isInsidePanel }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token, user, isLoading, isAuthenticated, isError, error } =
    useAppSelector((state: RootState) => state.auth);
  const logoutRequest: LogoutRequest = {
    UserId: user.UserId,
    Token: token.accessToken,
    RefreshToken: token.refreshToken,
  };

  const logoutHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault(); // Prevent the default behavior of the button click event
    dispatch(logout(logoutRequest));
    persistor.purge(); // Clears the persisted storage
  };

  useEffect(() => {
    if (!isError && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [navigate, dispatch, isAuthenticated, isError]);

  useEffect(() => {
    if (isError) {
      toast.error(error.errorMsg!, {
        ...getToastOptions,
        position: "top-center",
        theme: "light",
      });
    }
  }, [isError, error, dispatch]);

  return (
    <div>
      {isInsidePanel && (
        <div
          className="me-1 px-1 py-1 w-[95%] inline-flex items-center font-normal text-sm bg-none border-none  text-gray-600 dark:text-gray-300 dark:hover:text-gray-900 hover:text-gray-900 rounded-sm hover:bg-slate-300 active:bg-slate-200 hover:ring-0 hover:ring-slate-100 cursor-pointer"
          onClick={logoutHandler}
        >
          {!isLoading ? <HiOutlineLogout size={20} /> : <SpinnerMini />}
          <span className="pl-4"> Log out</span>
        </div>
      )}
      {!isInsidePanel && (
        <div
          className="me-1 px-3 py-1 inline-flex items-center font-normal text-sm bg-none border-none   text-gray-600 dark:text-gray-300 dark:hover:text-gray-900 hover:text-gray-900 rounded-sm hover:bg-slate-200 active:bg-slate-300 hover:ring hover:ring-slate-200  cursor-pointer"
          onClick={logoutHandler}
        >
          <span className="pr-4"> Log out</span>
          {!isLoading ? <HiOutlineLogout size={20} /> : <SpinnerMini />}
        </div>
      )}
    </div>
  );
};

export default HeaderMenu;
