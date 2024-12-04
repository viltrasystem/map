import { useAppSelector } from "../app/hook";
import { RootState } from "../app/store";

const UserHeader = () => {
  const DispalyName = useAppSelector(
    (state: RootState) => state.auth.user.DisplayName
  );
  return (
    <div className="flex font-normal items-center text-sm p-2 bg-logo hover:opacity-80">
      {" "}
      {DispalyName}
    </div>
  );
};

export default UserHeader;
