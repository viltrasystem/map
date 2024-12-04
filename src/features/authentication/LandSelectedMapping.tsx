import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hook";
import { RootState, persistor } from "../../app/store";
import { useTranslation } from "react-i18next";
import { logout } from "../../thunk/authThunk";
import { LogoutRequest } from "../../lib/types";
import { setLandMapping, MappingState } from "../../slices/landMappingSlice";
import useValidateRequest from "../../hooks/useValidateRequest";
import RequestValidation from "../../pages/RequestValidation";
import { setLoadingState } from "../../slices/loadingSlice";

type UrlParams = {
  rootId?: string;
  unitId?: string;
  currentUserId?: string;
  landId?: string;
  municipality?: string;
  mainNo?: string;
  subNo?: string;
};

const LandSelectedMapping: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isValid, setIsValid] = useState(false);
  const [isUserValid, setIsUserValid] = useState(false);
  const [isValidatingComplete, setIsValidatingComplete] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined
  );
  const location = useLocation();
  const previousLocation = location.state?.from;
  const dispatch = useAppDispatch();

  const { token, user, isAuthenticated } = useAppSelector(
    (state: RootState) => state.auth
  );

  const params = useParams<UrlParams>();

  const validateLandMapping = (parsedParams: Record<string, number>) => {
    const landMapping: MappingState = {
      isMapping: true,
      rootId: parsedParams.rootId,
      unitId: parsedParams.unitId,
      currentUserId: parsedParams.currentUserId,
      landId: parsedParams.landId,
      municipality: parsedParams.municipality.toString(),
      mainNo: parsedParams.mainNo.toString(),
      subNo: parsedParams.subNo.toString(),
    };
    dispatch(setLandMapping(landMapping));

    dispatch(setLoadingState(true));
    navigate("/land_selector", { state: { from: previousLocation } }); // for load previous page which load land_selector
  };

  const handleValidationComplete = (
    isValid: boolean,
    isUserValid: boolean,
    errorMessage?: string
  ) => {
    if ((!isValid || !isUserValid) && errorMessage) {
      setValidationError(errorMessage); // Show the error message
    }
    setIsValid(isValid);
    setIsUserValid(isUserValid);
    setIsValidatingComplete(true);
  };

  const validationCallbacks = {
    land_mapping: validateLandMapping,
  };

  useValidateRequest({
    params,
    validationCallbacks,
    onValidationComplete: handleValidationComplete, // Pass completion handler
    userId: user.UserId,
    routeIdentifier: "land_mapping",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  const logoutRequest: LogoutRequest = {
    UserId: user.UserId,
    Token: token.accessToken,
    RefreshToken: token.refreshToken,
  };

  const logoutHandle = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    dispatch(logout(logoutRequest));
    persistor.purge(); // Clears the persisted storage
  };

  return (
    <div>
      {isValidatingComplete && (
        <RequestValidation
          isValid={isValid}
          isUserValid={isUserValid}
          isUnitMatch={undefined}
          description={validationError}
          logoutHandle={logoutHandle}
          t={t}
        />
      )}
    </div>
  );
};

export default LandSelectedMapping;
