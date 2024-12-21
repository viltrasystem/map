import { LandInfo } from "../../slices/landSummarySlice";

const SubSubRow = ({ land }: { land: LandInfo }) => (
  <div className="flex w-full justify-normal gap-16 py-2 px-3 bg-gray-50 dark:bg-gray-600 border-b dark:border-gray-500 hover:bg-sky-200 dark:hover:bg-hoverBlue">
    <div className="flex flex-col">
      <h4 className="font-sans xs:font-extralight md:font-medium xs:text-[0.75rem] md:text-sm text-gray-700 dark:text-slate-50">
        Land Owner/s : {land.LandOwners ? land.LandOwners.length : 0}
      </h4>
      <ul className="flex-1 text-gray-700 dark:text-slate-50">
        {land.LandOwners.map((owner, index) => (
          <li
            key={index}
            className={`xs:font-extralight md:font-medium xs:text-[0.65rem] sx:text-[0.75rem]
              ${
                owner.IsSelected
                  ? "text-blue-600 dark:text-blue-300  pt-2"
                  : "pt-2"
              }`}
          >
            {owner.FullName} {owner.Email} ({owner.ContactNumber})
          </li>
        ))}
      </ul>
    </div>
    <div className="flex flex-col">
      <h4 className="font-sans xs:font-extralight md:font-medium xs:text-[0.75rem] md:text-sm text-gray-700 dark:text-slate-50">
        Unit/s : {land.LandUnits.length}
      </h4>
      <ul className="flex-1 text-gray-700 dark:text-slate-50">
        {land.LandUnits.map((unit, index) => (
          <li
            key={index}
            className="pt-2 xs:font-extralight md:font-medium xs:text-[0.65rem] sx:text-[0.75rem]"
          >
            {unit.Unit}
          </li>
        ))}
      </ul>
    </div>
    <div className="flex flex-col min-w-max">
      <h4 className="font-sans xs:font-extralight md:font-medium xs:text-[0.75rem] md:text-sm text-gray-700 dark:text-slate-50">
        Shared among/s : {land.NoOfReferencedLands}
      </h4>
      <span className="py-2 xs:font-extralight md:font-medium xs:text-[0.65rem] sx:text-[0.75rem] text-gray-700 dark:text-slate-50">
        note/s : {land.Notes != "" ? land.Notes : "-"}
      </span>
    </div>
  </div>
);
export default SubSubRow;
