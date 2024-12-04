import { LandInfo } from "../../slices/landSummarySlice";

const SubSubRow = ({ land }: { land: LandInfo }) => (
  <div className="flex w-full justify-normal gap-16 py-2 px-3 bg-gray-50 dark:bg-gray-600 border-b dark:border-gray-500 hover:bg-sky-200 dark:hover:bg-hoverBlue">
    <div className="flex flex-col">
      <h4 className="text-gray-700 dark:text-slate-50 font-sans text-sm">
        Land Owner/s : {land.LandOwners ? land.LandOwners.length : 0}
      </h4>
      <ul className="flex-1 font-extralight text-xs text-gray-700 dark:text-slate-50">
        {land.LandOwners.map((owner, index) => (
          <li
            key={index}
            className={
              owner.IsSelected
                ? "text-blue-600 dark:text-blue-300  pt-2"
                : "pt-2"
            }
          >
            {owner.FullName} {owner.Email} ({owner.ContactNumber})
          </li>
        ))}
      </ul>
    </div>
    <div className="flex flex-col">
      <h4 className="text-gray-700 dark:text-slate-50 font-sans text-sm">
        Unit/s : {land.LandUnits.length}
      </h4>
      <ul className="flex-1 font-extralight text-xs text-gray-700 dark:text-slate-50">
        {land.LandUnits.map((unit, index) => (
          <li key={index} className="pt-2">
            {unit.Unit}
          </li>
        ))}
      </ul>
    </div>
    <div className="flex flex-col">
      <h4 className="text-gray-700 dark:text-slate-50 font-sans text-sm">
        Shared among/s : {land.NoOfReferencedLands}
      </h4>
      <h5 className="text-xs py-2 font-extralight text-gray-700 dark:text-slate-50">
        note/s : {land.Notes != "" ? land.Notes : "-"}
      </h5>
    </div>
  </div>
);
export default SubSubRow;
