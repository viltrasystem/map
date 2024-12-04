import React, { useState } from "react";
import { useGetMunicipalityListQuery } from "../../services/landSelectorApi";
import { Municipality } from "../../lib/types";
const TestLand = () => {
  const [value, setValue] = useState("");
  const { data: manucipilityList } = useGetMunicipalityListQuery();
  const handleItemClick = (item: Municipality) => {
    console.log("selected");
    setValue(item.MunicipalityName);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <input type="text" value={value} onChange={handleChange} />

      <ul>
        {manucipilityList?.map((item) => (
          <li
            className="cursor-pointer hover:bg-[#1eb4ff] py-[6px] px-3"
            key={item.MunicipalityNo} // Using a unique key
            onClick={() => {
              handleItemClick(item);
              console.log("select from type word");
            }}
          >
            {item.MunicipalityName} {item.MunicipalityNo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestLand;
