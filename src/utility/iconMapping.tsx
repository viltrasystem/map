import ReactDOMServer from "react-dom/server";
import { HiLocationMarker } from "react-icons/hi";
import { GiPositionMarker, GiHut, GiCow } from "react-icons/gi";
import { TbPoint } from "react-icons/tb";
import { FaRegCircle, FaTree } from "react-icons/fa";
import { MdFence, MdOutlineGrass } from "react-icons/md";
import { RxCross1, RxHome } from "react-icons/rx";
import { LuTreeDeciduous } from "react-icons/lu";
import { LiaTreeSolid } from "react-icons/lia";

/**
 * Generates the SVG string for the specified icon type, color, and size.
 * @param iconType
 * @param color
 * @param size
 * @returns An SVG string for the specified icon or an empty string if the icon type is not found.
 */
export const getSvgIconString = (
  iconType: string,
  color: string,
  size: string
): string => {
  const iconMapping: { [key: string]: JSX.Element } = {
    position_marker_hi: <HiLocationMarker style={{ color }} size={size} />,
    position_marker_gi: <GiPositionMarker style={{ color }} size={size} />,
    point: <TbPoint style={{ color }} size={size} />,
    circle: <FaRegCircle style={{ color }} size={size} />,
    fence: <MdFence style={{ color }} size={size} />,
    cross: <RxCross1 style={{ color }} size={size} />,
    home: <RxHome style={{ color }} size={size} />,
    hut: <GiHut style={{ color }} size={size} />,
    tree: <LiaTreeSolid style={{ color }} size={size} />,
    solid_tree: <FaTree style={{ color }} size={size} />,
    tree_deciduous: <LuTreeDeciduous style={{ color }} size={size} />,
    cow: <GiCow style={{ color }} size={size} />,
    grass: <MdOutlineGrass style={{ color }} size={size} />,
  };

  const iconElement = iconMapping[iconType];
  return iconElement ? ReactDOMServer.renderToString(iconElement) : "";
};
