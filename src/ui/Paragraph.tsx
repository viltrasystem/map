import React, { ReactNode } from "react";

interface ParagraphProps {
  children: ReactNode;
  classes: string;
}

const Paragraph: React.FC<ParagraphProps> = ({ classes, children }) => {
  return <p className={classes}>{children}</p>;
};

export default Paragraph;
