import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import useUserUnit from "../../hooks/useUserUnit";
import { setRootUnitId } from "../../slices/unitTreeSlice";
import { UserUnit } from "../../slices/userUnitSlice";
import { useQuery } from "@tanstack/react-query";
import treeUnitApi, { UserUnitQueryParams } from "../../services/unitTreeApi";
import { RootState } from "../../app/store";

const UserUnitList: React.FC = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { rootUnitId, error } = useAppSelector((state) => state.unitTree);
  const { userUnitList } = useAppSelector((state) => state.userUnit);
  const { rootNodeSelect } = useUserUnit();
  const dispatch = useAppDispatch();
  const userUnitInitialState = useMemo(() => {
    const initialState: UserUnit = {
      UnitID: 0,
      Unit: "",
      UnitTypeID: 0,
      ReferenceID: "",
      ImgUrl: "",
      ParentUnit: "",
      ChildCount: 0,
      ChildTeamsCount: 0,
      IsActiveForHunting: false,
      IsHuntingComplete: false,
      IsArchived: false,
      IsAllowedToRegisterLands: false,
      IsMainUnit: false,
      IsMunicipalityUser: false,
      IsExporter: false,
      IsPriceUser: false,
      IsLandAssignableUser: false,
      IsLandOwner: false,
      IsReporter: false,
      IsHead: false,
      IsGuest: false,
      IsHuntingPolice: false,
    };
    return initialState;
  }, []);

  const userUnitReq: UserUnitQueryParams = {
    dnnUserId: user.UserId,
    isAdmin: user.IsAdmin,
  };

  const {
    //*** */
    data: userUnits,
    // isLoading,
    // isError,
    // error: userUnitsError,
  } = useQuery({
    queryKey: ["userUnit"],
    queryFn: () =>
      userUnitReq.dnnUserId != 0
        ? treeUnitApi.userUnit(userUnitReq)
        : undefined,
    enabled: !!(userUnitReq.dnnUserId != 0),
    select: (data) => {
      return data?.filter((userUnit) => {
        // Example: Filter nodes based on some condition
        return userUnit.UnitTypeID !== 6;
      });
    },
  });

  const handleSelectUnit = (unitId: number) => {
    dispatch(setRootUnitId(unitId));
    rootNodeSelect(unitId);
    console.log(rootUnitId, "selected new  user unit/UserUnitList");
  };

  useEffect(() => {
    const defaultUnits: UserUnit[] | undefined = userUnitList.filter(
      (unit: UserUnit) => unit.IsMainUnit
    );

    const defaultUnit = defaultUnits
      ? defaultUnits[0]
      : userUnits
      ? userUnits[0]
      : userUnitInitialState;
    if (defaultUnit) {
      dispatch(setRootUnitId(defaultUnit.UnitID));
      rootNodeSelect(defaultUnit.UnitID);
    }
  }, [userUnits]);

  if (error) {
    throw new Error(error);
  }

  return (
    <div>
      <select
        className="bg-white dark:bg-gray-800  divide-y divide-gray-200 border-gray-300 dark:border-gray-600 
        text-[14px] text-gray-700 dark:text-white block w-full rounded-md focus:outline-none focus:shadow-outline-blue focus:ring focus:ring-blue-200
         dark:focus:border-blue-500 dark:focus:shadow-outline-blue dark:focus:ring dark:focus:ring-blue-200 transition duration-300
         border px-2 py-[6px] font-sans text-sm font-normal outline outline-0 focus:placeholder-opacity-0 focus:border-customBlue  focus:outline-0   appearance-none focus:shadow-outline-blue 
                                     "
        value={rootUnitId}
        onChange={(e) => handleSelectUnit(parseInt(e.target.value))}
      >
        <option
          value={0}
          disabled
          className="bg-gray-300 p-4 border border-b-2 border-gray-600"
        >
          User Registered units
        </option>
        {userUnits &&
          userUnits?.map((unit) => (
            <option
              key={unit.UnitID}
              value={unit.UnitID}
              className="hover:text-sky-500 dark:hover:text-hoverBlue"
            >
              {unit.Unit}
            </option>
          ))}
      </select>
    </div>
  );
};
//export default UnitList;
export const MemorizedUserUnitList = React.memo(UserUnitList);
