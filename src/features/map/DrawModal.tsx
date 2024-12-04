import React, { useRef, useState } from "react";
import { LiaDrawPolygonSolid, LiaTreeSolid } from "react-icons/lia";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { HiLocationMarker } from "react-icons/hi";
import { IoAnalyticsOutline } from "react-icons/io5";
import { MdDeleteOutline, MdFence, MdOutlineGrass } from "react-icons/md";
import { RiText } from "react-icons/ri";
import ListComponent from "../../ui/ListComponent";
import FormRowVertical from "../../ui/FormRowVertical";
import { useTranslation } from "react-i18next";
import { FaTree } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { GiPositionMarker } from "react-icons/gi";
import { TbPoint } from "react-icons/tb";
import { GiCow } from "react-icons/gi";
import { LuTreeDeciduous } from "react-icons/lu";
import { GiHut } from "react-icons/gi";
import { RxHome } from "react-icons/rx";
import { FaRegCircle } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
  setSelectedColor,
  setSelectedDrawOption,
  setSelectedLineSize,
  setSelectedFontSize,
  setSelectedImageOption,
  setTypedText,
} from "../../slices/mapDrawFeatureSlice";
import { RootState } from "../../app/store";

type ModalState = {
  isModalOpen: boolean;
  modalClose: () => void;
};

// type iconStyle = {
//   color: string; // Set the color based on the condition
//   LineSize: string;
// };
enum DrawFeature {
  Point = "Point",
  LineString = "LineString",
  Polygon = "Polygon",
  Text = "Text",
  Edit = "Edit",
  Delete = "Delete",
}

enum ImageFeature {
  PositionMarker = "position_marker",
  Point = "point",
  Circle = "circle",
  Fence = "fence",
  Cross = "cross",
  Home = "home",
  Hut = "hut",
  Tree = "tree",
  SolidTree = "solid_tree",
  TreeDeciduous = "tree_deciduous",
  Cow = "cow",
  Grass = "grass",
}

const DrawModal: React.FC<ModalState> = ({
  isModalOpen,
  modalClose,
}: ModalState) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  // #region Drag modal
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isPointer, setIsPointer] = useState(false);
  const [isDrawingFeature, setIsDrawingFeature] = useState(false);
  const [drawingFeature, setDrawingFeature] = useState<string | undefined>(
    undefined
  );
  const drawingFeatureRef = useRef<undefined | string>(undefined);
  const [isTextFeature, setIsTextFeature] = useState(false);
  const [iconStyle, setIconStyle] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  console.log("render");
  // Local state to manage the selected value
  // const [selectedValue, setSelectedValue] = useState(selectedColor.toLowerCase());
  const selectedColor = useAppSelector(
    (state: RootState) => state.draw.selectedColor
  );
  const selectedLineSize = useAppSelector(
    (state: RootState) => state.draw.selectedLineSize
  );
  const selectedFontSize = useAppSelector(
    (state: RootState) => state.draw.selectedFontSize
  );
  const isSidebarVisible: boolean = useAppSelector(
    (state: RootState) => state.sideBar.isSidebarVisible
  );
  //const selectedColor = store.getState().draw.selectedColor;
  //const selectedLineSize = store.getState().draw.selectedLineSize;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlurEvent = () => {
    dispatch(setTypedText(inputValue));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("down");
    setIsDragging(true);
    if (modalRef.current) {
      const offsetX = e.clientX - modalRef.current.offsetLeft;
      const offsetY = e.clientY - modalRef.current.offsetTop;
      setDragOffset({ x: offsetX, y: offsetY });
    }
  };

  const childElementMouseDownHandler = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && modalRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      modalRef.current.style.left = `${newX}px`;
      modalRef.current.style.top = `${newY}px`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  // #endregion

  // #region feature selection
  const handleSelectedColor = (color: string) => {
    const allowedColors: ("red" | "green" | "yellow" | "blue" | "black")[] = [
      "red",
      "green",
      "yellow",
      "blue",
      "black",
    ];

    if (allowedColors.includes(color as any)) {
      setColor(color);
      setIconStyle(color);

      dispatch(
        setSelectedColor(color as "red" | "green" | "yellow" | "blue" | "black")
      );
    } else {
      console.log("Invalid color selected");
    }
  };

  const handleSelectedLine = (lineSize: string) => {
    const allowedLineSize: (1 | 2 | 3 | 4 | 5)[] = [1, 2, 3, 4, 5];
    const parsedLineSize = parseInt(lineSize, 10);

    if (allowedLineSize.includes(parsedLineSize as 1 | 2 | 3 | 4 | 5)) {
      dispatch(setSelectedLineSize(parsedLineSize as 1 | 2 | 3 | 4 | 5));
    } else {
      console.log("Invalid  line option selected");
    }
  };

  const handleSelectedFont = (fontSize: string) => {
    const allowedFontSize: ("8px" | "12px" | "16px" | "24px" | "32px")[] = [
      "8px",
      "12px",
      "16px",
      "24px",
      "32px",
    ];

    if (allowedFontSize.includes(fontSize as any)) {
      dispatch(
        setSelectedFontSize(
          fontSize as "8px" | "12px" | "16px" | "24px" | "32px"
        )
      );
    } else {
      console.log("Invalid  line option selected");
    }
  };

  const handleDrawFeature = (drawFeature: DrawFeature) => {
    console.log("feature", drawFeature);
    if (drawingFeatureRef.current !== drawFeature) {
      drawingFeatureRef.current = drawFeature;
      console.log("feature in", drawFeature);
      const allowedFeature: DrawFeature[] = [
        DrawFeature.Point,
        DrawFeature.LineString,
        DrawFeature.Polygon,
        DrawFeature.Text,
        DrawFeature.Edit,
        DrawFeature.Delete,
      ];

      if (allowedFeature.includes(drawFeature)) {
        const isDrawing =
          drawFeature === "Point" ||
          drawFeature === "LineString" ||
          drawFeature === "Polygon";
        setIsPointer(drawFeature === "Point");
        setIsTextFeature(drawFeature === "Text");
        setDrawingFeature(drawFeature);
        setIsDrawingFeature(isDrawing);
        setColor(setSelectedColor.type);
        setIconStyle(setSelectedColor.type);
        dispatch(setSelectedDrawOption(drawFeature));
      } else {
        console.log("Invalid draw option selected");
      }
    } else {
      setIsPointer(false);
      setIsTextFeature(false);
      setDrawingFeature(undefined);
      setIsDrawingFeature(false);
      dispatch(setSelectedDrawOption(null));
      drawingFeatureRef.current = undefined;
    }
  };

  const handleImageFeature = (imageFeature: ImageFeature) => {
    const allowedImage: ImageFeature[] = [
      ImageFeature.PositionMarker,
      ImageFeature.Point,
      ImageFeature.Circle,
      ImageFeature.Fence,
      ImageFeature.Cross,
      ImageFeature.Home,
      ImageFeature.Hut,
      ImageFeature.Tree,
      ImageFeature.SolidTree,
      ImageFeature.TreeDeciduous,
      ImageFeature.Cow,
      ImageFeature.Grass,
    ];

    if (allowedImage.includes(imageFeature)) {
      setIcon(imageFeature);
      setIconStyle(color);
      dispatch(setSelectedImageOption(imageFeature));
    } else {
      console.log("Invalid image option selected");
    }
  };
  // #endregion

  if (!isModalOpen) return null;

  const inputClasses: string =
    "h-full w-full rounded-md border  border-2  border-gray-400 bg-transparent px-3 py-2 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all focus:placeholder-opacity-0 focus:border-customBlue  focus:outline-0";
  const labelClasses: string =
    "pointer-events-none flex h-full w-full select-none text-sm font-normal";
  return (
    <div
      ref={modalRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`modal max-w-[280px] h-fit fixed inset-0 ${
        isSidebarVisible ? "left-[320px]" : "left-[30px]"
      } top-14 bg-slate-300 bg-opacity-90 dark:bg-opacity-60 hover:bg-opacity-75 z-50`}
    >
      <div>
        <div className="modal-content flex flex-col">
          <div className="flex flex-row items-center justify-between dark:bg-gray-900 dark:bg-opacity-90 p-2 cursor-grab border-b-2">
            <h6 className="text-left font-semibold text-blue-600">
              {t("drawModel:modal_title")}
            </h6>
            <button
              className="bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white text-blue-600"
              onClick={modalClose}
            >
              <svg
                className="w-5 h-5 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
            </button>
          </div>
          <div
            onMouseDown={childElementMouseDownHandler}
            className="flex flex-wrap  justify-evenly"
          >
            <div className="w-[100%] sx:w-1/2 flex  justify-evenly p-1 gap-[2px]">
              <div className="max-w-[40px] w-1/3 p-1  rounded overflow-hidden shadow-md hover:text-white bg-slate-200 hover:bg-slate-400 border-black border-0 hover:shadow-2xl cursor-pointer">
                <HiLocationMarker
                  className={`${
                    drawingFeature === DrawFeature.Point ? "text-blue-600" : ""
                  } w-7 h-7`}
                  onClick={() => handleDrawFeature(DrawFeature.Point)}
                />
              </div>
              <div className="max-w-[40px] w-1/3 p-1  rounded overflow-hidden shadow-md hover:text-white bg-slate-200 hover:bg-slate-400 border-black border-0 hover:shadow-2xl cursor-pointer">
                <LiaDrawPolygonSolid
                  className={`${
                    drawingFeature === DrawFeature.Polygon
                      ? "text-blue-600"
                      : ""
                  } w-7 h-7`}
                  onClick={() => handleDrawFeature(DrawFeature.Polygon)}
                />
              </div>
              <div className="max-w-[40px] w-1/3 p-1  rounded overflow-hidden shadow-md hover:text-white bg-slate-200 hover:bg-slate-400 border-black border-0 hover:shadow-2xl cursor-pointer">
                <IoAnalyticsOutline
                  className={`${
                    drawingFeature === DrawFeature.LineString
                      ? "text-blue-600"
                      : ""
                  } w-7 h-7`}
                  onClick={() => handleDrawFeature(DrawFeature.LineString)}
                />
              </div>
            </div>
            <div className="w-[100%] sx:w-1/2  flex justify-evenly p-1 gap-[2px] sx:-ml-2">
              <div className="max-w-[40px] w-1/3 p-1  rounded overflow-hidden shadow-md hover:text-white bg-slate-200 hover:bg-slate-400 border-black border-0 hover:shadow-2xl cursor-pointer">
                <LiaProjectDiagramSolid
                  className={`${
                    drawingFeature === DrawFeature.Edit ? "text-blue-600" : ""
                  } w-7 h-7`}
                  onClick={() => handleDrawFeature(DrawFeature.Edit)}
                />
              </div>
              <div className="max-w-[40px] w-1/3  p-1  rounded overflow-hidden shadow-md hover:text-white bg-slate-200 hover:bg-slate-400 border-black border-0 hover:shadow-2xl cursor-pointer">
                <RiText
                  className={`${
                    drawingFeature === DrawFeature.Text ? "text-blue-600" : ""
                  } w-7 h-7`}
                  onClick={() => handleDrawFeature(DrawFeature.Text)}
                />
              </div>
              {/* <div className="w-1/3 sm:w-1/6 p-1  rounded overflow-hidden shadow-md">
            </div> */}
              <div className="max-w-[40px] w-1/3 p-1  rounded overflow-hidden shadow-md hover:text-white bg-slate-200 hover:bg-slate-400 border-black border-0 hover:shadow-2xl cursor-pointer">
                <MdDeleteOutline
                  className={`${
                    drawingFeature === DrawFeature.Delete ? "text-blue-600" : ""
                  } w-7 h-7`}
                  onClick={() => handleDrawFeature(DrawFeature.Delete)}
                />
              </div>
            </div>
          </div>
          {!isDrawingFeature && !isTextFeature && (
            <div onMouseDown={childElementMouseDownHandler} className="flex">
              <span className="text-sm p-2 ml-auto">
                {`${
                  drawingFeature
                    ? drawingFeature + " " + t("drawModel:txt_selected_feture")
                    : t("drawModel:txt_select_feture")
                }`}
              </span>
            </div>
          )}
          {isDrawingFeature && (
            <div
              onMouseDown={childElementMouseDownHandler}
              className="flex flex-wrap  justify-evenly"
            >
              <div className="w-[100%] sx:w-1/2 flex  justify-evenly p-1 gap-[2px]">
                <FormRowVertical
                  label={t("drawModel:color")}
                  name="color"
                  error={undefined}
                  errorClasses=""
                  labelClasses={labelClasses}
                >
                  <ListComponent
                    options={["Black", "Green", "Yellow", "Blue", "Red"]}
                    handleListSelect={handleSelectedColor}
                    selectedValue={selectedColor}
                  />
                </FormRowVertical>
              </div>
              {!isPointer && (
                <div className="w-[100%] sx:w-1/2 flex  justify-evenly p-1 gap-[2px]">
                  <FormRowVertical
                    label={t("drawModel:font_size")}
                    name="color"
                    error={undefined}
                    errorClasses=""
                    labelClasses={labelClasses}
                  >
                    <ListComponent
                      options={[1, 2, 3, 4, 5]}
                      handleListSelect={handleSelectedLine}
                      selectedValue={selectedLineSize}
                    />
                  </FormRowVertical>
                </div>
              )}
              {isPointer && (
                <div className="w-[100%] sx:w-1/2 flex  justify-evenly p-1 gap-[2px]">
                  <FormRowVertical
                    label={t("drawModel:font_size")}
                    name="color"
                    error={undefined}
                    errorClasses=""
                    labelClasses={labelClasses}
                  >
                    <ListComponent
                      options={["8px", "12px", "16px", "24px", "32px"]}
                      handleListSelect={handleSelectedFont}
                      selectedValue={selectedFontSize}
                    />
                  </FormRowVertical>
                </div>
              )}
            </div>
          )}
          {isPointer && (
            <div
              onMouseDown={childElementMouseDownHandler}
              className="flex flex-wrap  justify-evenly"
            >
              <div className="flex flex-wrap  w-[100%]">
                <div className="w-[100%] sx:w-1/2 flex  justify-evenly p-1 gap-[2px]">
                  <div className="max-w-[40px] w-1/6 p-[1px] cursor-pointer">
                    <GiPositionMarker
                      size="20"
                      className="w-7 h-7"
                      style={
                        icon === "position_marker" ? { color: iconStyle } : {}
                      }
                      onClick={() =>
                        handleImageFeature(ImageFeature.PositionMarker)
                      }
                    />
                  </div>
                  <div className="max-w-[40px] w-1/6 p-[1px] cursor-pointer">
                    <TbPoint
                      size="20"
                      className="w-7 h-7"
                      style={icon === "point" ? { color: iconStyle } : {}}
                      onClick={() => handleImageFeature(ImageFeature.Point)}
                    />
                  </div>
                  <div className="max-w-[40px] w-1/6 p-[1px] cursor-pointer">
                    <FaRegCircle
                      size="20"
                      className="w-7 h-7"
                      style={icon === "circle" ? { color: iconStyle } : {}}
                      onClick={() => handleImageFeature(ImageFeature.Circle)}
                    />
                  </div>
                </div>
                <div className="w-[100%] sx:w-1/2  flex justify-evenly p-[1px] gap-[2px] sx:-ml-2">
                  <div className="max-w-[40px] w-1/6 p-[1px] cursor-pointer">
                    <MdFence
                      size="20"
                      className="w-7 h-7"
                      style={icon === "fence" ? { color: iconStyle } : {}}
                      onClick={() => handleImageFeature(ImageFeature.Fence)}
                    />
                  </div>
                  <div className="max-w-[40px] w-1/6 p-[1px] cursor-pointer">
                    <RxCross1
                      size="20"
                      className="w-7 h-7"
                      style={icon === "cross" ? { color: iconStyle } : {}}
                      onClick={() => handleImageFeature(ImageFeature.Cross)}
                    />
                  </div>
                  <div className="max-w-[40px] w-1/6 p-[1px] cursor-pointer">
                    <RxHome
                      size="20"
                      className="w-7 h-7"
                      style={icon === "home" ? { color: iconStyle } : {}}
                      onClick={() => handleImageFeature(ImageFeature.Home)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap w-[100%]">
                <div className="w-[100%] sx:w-1/2 flex  justify-evenly p-1 gap-[2px]">
                  <div className="max-w-[40px] w-1/6 p-[1px] cursor-pointer">
                    <GiHut
                      size="20"
                      className="w-7 h-7"
                      style={icon === "hut" ? { color: iconStyle } : {}}
                      onClick={() => handleImageFeature(ImageFeature.Hut)}
                    />
                  </div>
                  <div className="max-w-[40px] w-1/6 p-[1px] cursor-pointer">
                    <LiaTreeSolid
                      size="20"
                      className="w-7 h-7"
                      style={icon === "tree" ? { color: iconStyle } : {}}
                      onClick={() => handleImageFeature(ImageFeature.Tree)}
                    />
                  </div>
                  <div className="max-w-[40px] w-1/6 p-[1px] cursor-pointer">
                    <FaTree
                      size="20"
                      className="w-7 h-7"
                      style={icon === "solid_tree" ? { color: iconStyle } : {}}
                      onClick={() => handleImageFeature(ImageFeature.SolidTree)}
                    />
                  </div>
                </div>
                <div className="w-[100%] sx:w-1/2  flex justify-evenly p-[1px] gap-[2px] sx:-ml-2">
                  <div className="max-w-[40px] w-1/6 p-[1px] cursor-pointer">
                    <LuTreeDeciduous
                      size="20"
                      className="w-7 h-7"
                      style={
                        icon === "tree_deciduous" ? { color: iconStyle } : {}
                      }
                      onClick={() =>
                        handleImageFeature(ImageFeature.TreeDeciduous)
                      }
                    />
                  </div>
                  <div className="max-w-[40px] w-1/6 p-[1px] cursor-pointer">
                    <GiCow
                      size="20"
                      className="w-7 h-7"
                      style={icon === "cow" ? { color: iconStyle } : {}}
                      onClick={() => handleImageFeature(ImageFeature.Cow)}
                    />
                  </div>
                  <div className="max-w-[40px] w-1/6 p-[1px] cursor-pointer">
                    <MdOutlineGrass
                      size="20"
                      className="w-7 h-7"
                      style={icon === "grass" ? { color: iconStyle } : {}}
                      onClick={() => handleImageFeature(ImageFeature.Grass)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {isTextFeature && (
            <>
              <div
                onMouseDown={childElementMouseDownHandler}
                className="flex-1 pl-2 pr-2 grow-1 p-2"
              >
                <FormRowVertical
                  label={t("drawModel:type_text")}
                  error=""
                  name="text_input"
                  errorClasses=""
                  labelClasses={labelClasses}
                >
                  <input
                    type="text"
                    id="text_input"
                    placeholder={t("drawModel:type_text")}
                    className={`${inputClasses} ${
                      inputValue.length > 0 ? "border-blue-500" : ""
                    }`}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleBlurEvent}
                  />
                </FormRowVertical>
              </div>
              <div
                onMouseDown={childElementMouseDownHandler}
                className="flex-shrink-0 pl-2 pr-2 mr-auto"
              >
                <FormRowVertical
                  label={t("drawModel:color")}
                  name="color"
                  error={undefined}
                  errorClasses=""
                  labelClasses={labelClasses}
                >
                  <ListComponent
                    options={["Black", "Green", "Yellow", "Blue", "Red"]}
                    handleListSelect={handleSelectedColor}
                    selectedValue={selectedColor}
                  />
                </FormRowVertical>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawModal;
