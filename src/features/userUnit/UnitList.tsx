import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import { selectRootNode } from "../../lib/selectRootNode";

const UnitList: React.FC = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { selectedRootUnitId, error } = useAppSelector((state) => state.tree);
  const { userUnitList } = useAppSelector((state) => state.userUnit);
  const { status } = useAppSelector(
    (state: RootState) => ({
      status: state.unitLandLayer.status,
    }),
    (prev, next) => prev.status === next.status
  );

  const dispatch = useAppDispatch();

  const handleSelectUnit = (unitId: number) => {
    selectRootNode(unitId, userUnitList, user, dispatch);
  };

  if (error) {
    throw new Error(error);
  }

  return (
    <div>
      <select
        className={`appearance-none bg-white dark:bg-gray-800 border p-[8px] divide-y divide-gray-200 border-gray-300 dark:border-gray-600 
        text-[14px] text-gray-700 dark:text-white block w-full rounded  focus:outline-none focus:border-blue-500 focus:shadow-outline-blue focus:ring focus:ring-blue-200
         dark:focus:border-blue-500 dark:focus:shadow-outline-blue dark:focus:ring dark:focus:ring-blue-200 transition duration-300 ${
           status === "loading" ? "opacity-75 pointer-events-none" : ""
         }`}
        value={selectedRootUnitId}
        onChange={(e) => handleSelectUnit(parseInt(e.target.value))}
        disabled={status === "loading"}
      >
        <option
          value={0}
          disabled
          className="bg-gray-300 p-4 border border-b-2 border-gray-600"
        >
          User Registered units
        </option>
        {userUnitList &&
          userUnitList?.map((unit) => (
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

export const MemorizedUnitList = React.memo(UnitList);
