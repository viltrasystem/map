import { useEffect } from "react";
import { isValidParam } from "../lib/types";
import { useAppSelector } from "../app/hook";
import { RootState } from "../app/store";
import { useTranslation } from "react-i18next";

interface UseValidateRequestProps {
  params: Record<string, string | undefined>;
  validationCallbacks: Record<string, (params: Record<string, number>) => void>;
  onValidationComplete: (
    isValid: boolean,
    isUserValid: boolean,
    errorMessage?: string
  ) => void; // Updated callback
  userId: number;
  routeIdentifier: string;
}

const useValidateRequest = ({
  params,
  validationCallbacks,
  onValidationComplete,
  userId,
  routeIdentifier,
}: UseValidateRequestProps) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { t } = useTranslation();
  useEffect(() => {
    const allParamsValid = Object.values(params).every(isValidParam);

    if (!allParamsValid) {
      onValidationComplete(false, true, t("mapping:invalid_request"));
      return; // Stop execution if params are invalid
    }

    const parsedParams = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [
        key,
        parseInt(value as string, 10),
      ])
    );

    // Check if the userId matches the currentUserId parameter
    if (parsedParams.currentUserId !== userId) {
      const name = user.DisplayName?.toUpperCase();
      onValidationComplete(true, false, t("mapping:different_user", { name }));
      return; // Stop execution if user ID doesn't match
    }

    // Call the appropriate validation callback if everything is valid
    if (validationCallbacks[routeIdentifier]) {
      validationCallbacks[routeIdentifier](parsedParams);
    }

    onValidationComplete(true, true); // Indicate validation success
  }, [
    user,
    params,
    validationCallbacks,
    userId,
    routeIdentifier,
    onValidationComplete,
    t,
  ]);
};

export default useValidateRequest;
