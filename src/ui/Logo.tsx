import { GiDeer } from "react-icons/gi";
interface LogoProps {
  size: number;
}

const Logo: React.FC<LogoProps> = ({ size }) => {
  return <GiDeer size={size} />;
};

export default Logo;
