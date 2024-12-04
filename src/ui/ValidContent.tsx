import React from "react";

interface ValidContentProps {
  description: string | undefined;
  logoutHandle: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  t: any;
}

const ValidContent: React.FC<ValidContentProps> = ({
  description,
  logoutHandle,
  t,
}) => (
  <div className="p-10">
    <p>{description}</p>
    <p className="flex justify-center pt-5">{t("mapping:login_request")}</p>
    <div className="flex w-1/2 justify-center m-auto py-5">
      <button
        className="w-full px-6 py-2 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out rounded-md border-2 border-transparent background-gradient hover:border-blue-500 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:border-blue-500 active:bg-blue-700"
        onClick={logoutHandle}
      >
        Logout
      </button>
    </div>
  </div>
);

export default ValidContent;
