import React, { ReactNode } from "react";

interface ErrorTxtProps {
  children: ReactNode;
  classes?: string;
}

const ErrorTxt: React.FC<ErrorTxtProps> = ({ classes, children }) => {
  return <span className={classes}>{children}</span>;
};

export default ErrorTxt;
