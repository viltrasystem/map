import React, { ReactNode } from "react";
interface FulPageProps {
  children: ReactNode;
}

const FullPage: React.FC<FulPageProps> = ({ children }) => {
  return (
    <div className="flex justify-center items-center bg-slate-200 h-screen">
      {children}
    </div>
  );
};

export default FullPage;
