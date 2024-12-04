// components/InvalidContent.tsx
import React from "react";

interface InvalidContentProps {
  t: any;
  description: string | undefined;
}

const InvalidContent: React.FC<InvalidContentProps> = ({ t, description }) => (
  <div className="flex flex-col p-10">
    <p>{description}</p>
    <p className="flex justify-around pt-2">{t("mapping:close_request")}</p>
  </div>
);

export default InvalidContent;
