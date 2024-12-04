import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState, persistor } from "../../app/store";
import { useTranslation } from "react-i18next";
import useValidateRequest from "../../hooks/useValidateRequest";
import RequestValidation from "../../pages/RequestValidation";
import { setLoadingState } from "../../slices/loadingSlice";
import { logout } from "../../thunk/authThunk";
import { LogoutRequest } from "../../lib/types";
import { MappingState, setLandMapping } from "../../slices/landMappingSlice";
import { setSummaryUnit } from "../../slices/summarySlice";

type UrlParams = {
  unitId?: string;
  currentUserId?: string;
};

const LandOwnerMapping: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isValid, setIsValid] = useState(false);
  const [isUserValid, setIsUserValid] = useState(false);
  const [isValidatingComplete, setIsValidatingComplete] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined
  );
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { user, token, isAuthenticated } = useAppSelector(
    (state: RootState) => state.auth
  );

  const params = useParams<UrlParams>();

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

  const validateLandOwner = (parsedParams: Record<string, number>) => {
    dispatch(setLoadingState(true));
    const landMapping: MappingState = {
      currentUserId: parsedParams.currentUserId,
      rootId: parsedParams.unitId,
      unitId: parsedParams.unitId,
      isMapping: false,
      landId: 0,
      mainNo: "",
      municipality: "",
      subNo: "",
    };

    dispatch(
      setSummaryUnit({
        unitId: landMapping.rootId,
        summaryType: "landowner",
      })
    );
    dispatch(setLandMapping(landMapping));
    navigate("/landowner");
  };

  const validationCallbacks = {
    land_owner: validateLandOwner,
  };

  useValidateRequest({
    params,
    validationCallbacks,
    onValidationComplete: handleValidationComplete, // Pass completion handler
    userId: user.UserId,
    routeIdentifier: "land_owner",
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

export default LandOwnerMapping;
