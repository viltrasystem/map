import React, { ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  name: string;
  classes: string;
}

const Label: React.FC<LabelProps> = ({ name, children, classes }) => {
  return (
    <label htmlFor={name} className={`${classes} flex items-center`}>
      {children}
    </label>
  );
};

export default Label;
