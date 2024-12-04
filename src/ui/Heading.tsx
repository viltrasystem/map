interface HeadingPros {
  headingElement: string;
  headingTxt: string;
}

const Heading: React.FC<HeadingPros> = ({ headingElement, headingTxt }) => {
  const combinedClasses = `${
    headingElement === "h1"
      ? "text-5xl font-semibold"
      : headingElement === "h2"
      ? "text-4xl font-semibold"
      : headingElement === "h3"
      ? "text-3xl font-medium"
      : headingElement === "h4"
      ? "text-2xl font-medium"
      : ""
  }`;
  return <h1 className={`${combinedClasses} leading-normal`}>{headingTxt}</h1>;
};

export default Heading;
