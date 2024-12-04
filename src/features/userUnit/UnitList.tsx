import { setSelectedRootUnitId } from "../../slices/treeSlice";
import useUserUnitSelect from "../../hooks/useUserUnitSelect";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hook";

const UnitList: React.FC = () => {
  const { selectedRootUnitId, error } = useAppSelector((state) => state.tree);

  const userUnit = useAppSelector((state) => state.userUnit);
  const { selectRootNode } = useUserUnitSelect();

  const dispatch = useAppDispatch();

  const handleSelectUnit = (unitId: number) => {
    dispatch(setSelectedRootUnitId(unitId));
    selectRootNode(unitId);
    console.log(selectedRootUnitId, "selected new unit");
  };

  if (error) {
    throw new Error(error);
  }

  return (
    <div>
      <select
        className="appearance-none bg-white dark:bg-gray-800 border p-[8px] divide-y divide-gray-200 border-gray-300 dark:border-gray-600 
        text-[14px] text-gray-700 dark:text-white block w-full rounded  focus:outline-none focus:border-blue-500 focus:shadow-outline-blue focus:ring focus:ring-blue-200
         dark:focus:border-blue-500 dark:focus:shadow-outline-blue dark:focus:ring dark:focus:ring-blue-200 transition duration-300"
        value={selectedRootUnitId}
        onChange={(e) => handleSelectUnit(parseInt(e.target.value))}
      >
        <option
          value={0}
          disabled
          className="bg-gray-300 p-4 border border-b-2 border-gray-600"
        >
          User Registered units
        </option>
        {userUnit &&
          userUnit?.map((unit) => (
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
