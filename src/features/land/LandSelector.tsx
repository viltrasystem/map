import { useEffect, useState } from "react";
import { useGetMunicipalityListQuery } from "../../services/landSelectorApi";
import Button from "../../ui/Button";
import FormRowVertical from "../../ui/FormRowVertical";
import SpinnerMini from "../../ui/SpinnerMini";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Municipality } from "../../lib/types";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import Input from "../../ui/Input";
import { z } from "zod";
import { RootState } from "../../app/store";
import { useTranslation } from "react-i18next";
import DarkModeToggle from "../../ui/DarkModeToggle";
import TranslationToggle from "../../ui/TranslationToggle";
import { loadLand } from "../../thunk/selectedlandThunk";
import { useLocation, useNavigate } from "react-router-dom";
import { setselectedLandState } from "../../slices/selectedlandSlice";
import ErrorTxt from "../../ui/ErrorTxt";
import _ from "lodash";
import { HiOutlineXMark } from "react-icons/hi2";
import IconButton from "../../ui/IconButton";
import { wordExistsInUri } from "../../lib/helpFunction";
import { setSelectedLayerState } from "../../slices/selectedLayerSlice";
import { setSelectedTab } from "../../slices/tabSelectionSlice";
import { GiDeer } from "react-icons/gi";

interface LandSelectorProps {
  isLandSelectorModalIsOpen?: boolean;
  landSelectorModalClose?: () => void;
  onSelectedLayerLoad?: () => void;
}

const LandSelector: React.FC<LandSelectorProps> = ({
  isLandSelectorModalIsOpen,
  landSelectorModalClose,
  onSelectedLayerLoad,
}: LandSelectorProps) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [valuesSet, setValuesSet] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<
    Municipality | null | undefined
  >(null);
  const [showItemList, setShowItemList] = useState<boolean>(false);
  const {
    data: manucipilityList,
    isLoading: municipalityLoading,
    isError: municipalityError,
  } = useGetMunicipalityListQuery();
  const { t } = useTranslation();
  const location = useLocation();
  const from = location.state?.from;

  type TLandSelectorSchema = z.infer<typeof landSelectorSchema>;
  const dispatch = useAppDispatch();
  const { landList, isloaded, noContent, isLoading, isError } = useAppSelector(
    (state: RootState) => state.selectland
  );

  const {
    isMapping,
    rootId,
    unitId,
    currentUserId,
    landId,
    municipality,
    mainNo,
    subNo,
  } = useAppSelector((state: RootState) => state.mapping);

  const landSelectorSchema = z.object({
    municipality: z.string().refine(
      () => {
        return manucipilityList?.find(
          (obj) => obj.MunicipalityName === selectedItem?.MunicipalityName
        );
      },
      {
        message: t("landSelector:invalid_municipality"),
      }
    ),
    mainNo: z.string().refine(
      (val) => {
        const parsed = parseFloat(val);
        return !isNaN(parsed); // && parsed >= 0
      },
      { message: t("landSelector:invalid_number") }
    ),
    //.transform((val) => parseFloat(val)),
    subNo: z.string().refine(
      (val) => {
        const parsed = parseFloat(val);
        return !isNaN(parsed); // && parsed >= 0
      },
      { message: t("landSelector:invalid_number") }
    ),
    //.transform((val) => parseFloat(val)),
    plotNo: z
      .union([
        z.number().positive({ message: t("landSelector:invalid_number") }),
        z.string().refine(
          (value) => {
            const parsed = parseFloat(value);
            return !isNaN(parsed); // && parsed >= 0
          },
          { message: t("landSelector:invalid_number") }
        ),
        z.string().refine((value) => value === ""),
      ])
      .transform((value) => (value === "" ? undefined : value))
      .optional(),
  });

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, touchedFields, dirtyFields },
    setValue,
    getValues,
    // control,
  } = useForm<TLandSelectorSchema>({
    resolver: zodResolver(landSelectorSchema),
    mode: "onBlur",
  });

  const labelClasses: string =
    "pointer-events-none flex h-full w-full select-none text-sm font-normal";
  const inputClasses: string =
    "h-full w-full rounded-md border border-gray-300 bg-transparent  px-3 py-2 font-sans text-sm font-normal outline outline-0 transition-all focus:placeholder-opacity-0 focus:border-customBlue  focus:outline-0 text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-slate-800";
  const errorLineClasses: string =
    "absolute left-2 top-[64px] inline-block text-rose-400 text-[11px]";

  console.log(
    isMapping,
    rootId,
    unitId,
    currentUserId,
    municipality,
    mainNo,
    subNo,
    `isMapping,
    rootId,
    unitId,
    currentUserId,
    municipality,
    mainNo,
    subNo`
  );
  useEffect(() => {
    if (manucipilityList) {
      if (isMapping) {
        if (municipality) {
          const currentMunicipility = manucipilityList.find(
            (item) => item.MunicipalityNo.toString() === municipality
          );
          if (currentMunicipility) {
            console.log("url loaded");
            setInputValue(currentMunicipility.MunicipalityName);
            setSelectedItem(currentMunicipility);
            setShowItemList(false);
            setValue("municipality", currentMunicipility.MunicipalityName, {
              shouldValidate: true,
            });
            //   const mainNoStr = mainNo.toString();
            // setValue("municipality", municipality);
            if (mainNo) setValue("mainNo", mainNo);
            if (subNo) setValue("subNo", subNo);
            setValuesSet(true);
          } else {
            // for error to trigger
            (async () => {
              await trigger();
            })();
          }
        }
      } else {
        const listCount = landList.length;
        if (listCount > 0) {
          const currentMunicipility = manucipilityList.find(
            (item) =>
              item.MunicipalityNo ===
              Number(landList[listCount - 1].municipality)
          );
          if (currentMunicipility) {
            console.log("previous land data filed");
            setInputValue(currentMunicipility.MunicipalityName);
            setSelectedItem(currentMunicipility);
            setShowItemList(false);
            setValue("municipality", currentMunicipility.MunicipalityName, {
              shouldValidate: true,
            });
            //   const mainNoStr = mainNo.toString();
            // setValue("municipality", municipality);
            if (mainNo)
              setValue("mainNo", landList[listCount - 1].mainNo.toString());
            if (subNo) setValue("subNo", landList[listCount - 1].toString());
            // setValuesSet(true);
          } else {
            // for error to trigger
            (async () => {
              await trigger();
            })();
          }
        }
      }
    }
  }, [
    manucipilityList,
    isMapping,
    landList,
    municipality,
    mainNo,
    subNo,
    setValue,
    trigger,
  ]);

  const onSubmit: SubmitHandler<TLandSelectorSchema> = async (data) => {
    const land = {
      municipality: data.municipality.substring(data.municipality.length - 4),
      mainNo: Number(data.mainNo),
      subNo: Number(data.subNo),
      plotNo: data.plotNo ? Number(data.plotNo) : undefined,
    };

    const isLandAlreadyFetch = landList.some((obj) => _.isEqual(obj, land));

    if (!isLandAlreadyFetch) {
      const landObj = {
        landId: landId,
        ...land,
      };
      dispatch(setselectedLandState(land));
      dispatch(loadLand(landObj));
      setIsFormSubmitted(true);
    } else {
      if (onSelectedLayerLoad) {
        const layerString = `${land.mainNo}/${land.subNo}`;
        dispatch(
          setSelectedLayerState({
            isClicked: true,
            isMouseEnter: false,
            layerName: layerString,
          })
        );
        onSelectedLayerLoad();
        if (landSelectorModalClose) {
          landSelectorModalClose();
        }
      }
    }
    dispatch(setSelectedTab("selectedLand"));
  };

  useEffect(() => {
    if (valuesSet) {
      (async () => {
        const isValid = await trigger();
        if (isValid) {
          onSubmit(getValues());
        }
      })();
    }
  }, [valuesSet, trigger, getValues]);

  const navigate = useNavigate();
  useEffect(() => {
    if (isFormSubmitted && isloaded && !noContent && !isError) {
      if (landSelectorModalClose) {
        landSelectorModalClose();
      }

      if (!wordExistsInUri("dashboard")) {
        navigate(`/dashboard`);
      }
    }
  }, [
    isFormSubmitted,
    isloaded,
    navigate,
    dispatch,
    isError,
    landSelectorModalClose,
    noContent,
  ]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setShowItemList(true);
    setInputValue(value);
  };

  const handleItemClick = (item: Municipality) => {
    setInputValue(item.MunicipalityName);
    setSelectedItem(item);
    setShowItemList(false);
    setValue("municipality", item.MunicipalityName, { shouldValidate: true });
  };

  const handleDeleteItem = () => {
    setInputValue("");
    setSelectedItem(null);
    setShowItemList(false);
  };

  const handleLandSelectorModalClose = () => {
    if (landSelectorModalClose) {
      landSelectorModalClose();
    } else if (from) {
      navigate(from, { replace: true }); // again load previous page which load land_selector(land page)
    } else {
      navigate("/dashboard");
    }
  };

  const filteredMunicipalityList = manucipilityList?.filter((item) =>
    item.MunicipalityName.toLowerCase().includes(inputValue.toLowerCase())
  );
  const errorSummeryClasses: string = "inline-block text-rose-600 text-sm";

  if (!isLandSelectorModalIsOpen && landId === 0) return null;

  return (
    <main className="modal h-screen max-h-screen fixed inset-0 flex m-auto content-center justify-center items-start md:items-center top-24 md:top-0 z-50">
      <section className="bg-neutral-100 md:max-w-4xl rounded-xl max-w-[24rem] sm:max-w-md">
        <div className="gap-6 flex h-full flex-wrap items-start justify-center text-neutral-800 font-light">
          <div className="w-full">
            <div className="block rounded-lg  shadow-2xl text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-slate-600">
              <div className="flex gap-1  justify-end  pt-2 pr-5">
                <DarkModeToggle />
                <TranslationToggle />
                <IconButton onClick={handleLandSelectorModalClose}>
                  <HiOutlineXMark size={35} />
                </IconButton>
              </div>
              <div className="flex gap-1 flex-col items-center text-center pt-2 sm:pt-4 bg-logo">
                <GiDeer className="w-10 h-10 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-14 lg:h-14 xl:w-16 xl:h-16" />
                <div className="text-gradient">
                  <h1
                    className="text-base font-medium 
                                        sm:text-lg sm:font-medium 
                                        md:text-xl md:font-medium 
                                        lg:text-2xl lg:font-medium
                                        xl:text-2xl xl:font-medium"
                  >
                    {t("landSelector:title")}
                  </h1>
                </div>
              </div>
              <form
                className="px-4 py-2 sm:px-6 sm:py-4"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <p className="pb-4  text-xs xs:text-sm  md:text-base font-medium">
                  {t("landSelector:detail")}
                </p>
                {municipalityError && (
                  <ErrorTxt
                    classes={`${errorSummeryClasses} pb-2 text-xs sm:text-sm`}
                  >
                    {t("landSelector:sever_error")}
                  </ErrorTxt>
                )}
                {isFormSubmitted && isloaded && noContent && !isError && (
                  <ErrorTxt
                    classes={`${errorSummeryClasses} pb-2 text-xs sm:text-sm`}
                  >
                    {t("landSelector:no_land_requested")}
                  </ErrorTxt>
                )}
                <div className="relative">
                  <div>
                    <FormRowVertical
                      label={t("landSelector:municipality")}
                      error={`${
                        (selectedItem &&
                          selectedItem.MunicipalityName !== inputValue) ||
                        (selectedItem === null && inputValue != "")
                          ? t("landSelector:invalid_municipality")
                          : ""
                      }`}
                      //  error={errors?.municipality?.message}
                      name="municipality"
                      errorClasses={errorLineClasses}
                      labelClasses={`${labelClasses} text-xs sm:text-sm`}
                    >
                      <input
                        id="municipality"
                        type="text"
                        placeholder={t("landSelector:municipality_placeholder")}
                        className={`${inputClasses} xs:text-[12px] sm:text-sm border-l-4 ${
                          (selectedItem &&
                            selectedItem.MunicipalityName !== inputValue) ||
                          (selectedItem === null && inputValue != "")
                            ? "border-rose-400"
                            : ""
                        } 
                           ${
                             selectedItem &&
                             selectedItem.MunicipalityName === inputValue &&
                             inputValue !== ""
                               ? "border-green-400 border-l-green-400"
                               : ""
                           } 
                           `}
                        //  disabled={isLoading}
                        value={inputValue}
                        disabled={selectedItem !== null || municipalityLoading}
                        {...register("municipality", {
                          required: true,
                          onChange: (e) => {
                            console.log("handleInputChange");
                            handleInputChange(e);
                          },
                          onBlur: (e) => {
                            console.log("blur", e);
                          },
                          // validate: (value) =>
                          //   validMunicipalities.includes(value) ||
                          //   "Invalid municipality. Please select a valid option.",
                        })}
                      />
                    </FormRowVertical>
                  </div>
                  <div className="absolute top-8 right-2">
                    {municipalityLoading && <SpinnerMini />}
                    {!municipalityLoading &&
                      !municipalityError &&
                      selectedItem &&
                      inputValue && (
                        <button
                          onClick={handleDeleteItem}
                          disabled={municipalityLoading}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                          </svg>
                        </button>
                      )}
                    {!municipalityLoading &&
                      !municipalityError &&
                      !showItemList &&
                      !inputValue && (
                        <button
                          onClick={() => setShowItemList(true)}
                          disabled={municipalityLoading}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    {!municipalityLoading &&
                      !municipalityError &&
                      showItemList && (
                        <button onClick={() => setShowItemList(false)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                  </div>
                  <div className="absolute top-[64px] left-0  z-50 w-full max-h-44 overflow-y-auto slim-scroll">
                    {showItemList && manucipilityList && (
                      <ul className="border rounded-md bg-white dark:bg-slate-500 text-gray-600 dark:text-slate-200 focus:ring-2 shadow-lg">
                        {filteredMunicipalityList
                          ? filteredMunicipalityList.map((item) => (
                              <li
                                className="cursor-pointer xs:text-[12px] sm:text-sm hover:bg-[#1eb4ff] py-[6px] px-3"
                                key={item.MunicipalityNo} // Using a unique key
                                onClick={() => {
                                  handleItemClick(item);
                                  console.log("select from type word");
                                }}
                              >
                                {item.MunicipalityName}
                              </li>
                            ))
                          : manucipilityList.map((item) => (
                              <li
                                className="cursor-pointer xs:text-[12px] sm:text-sm hover:bg-[#1eb4ff] py-[6px] px-3"
                                key={item.MunicipalityNo} // Using a unique key
                                onClick={() => {
                                  handleItemClick(item);
                                  console.log("select from no type word");
                                }}
                              >
                                {item.MunicipalityName}
                              </li>
                            ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex justify-center gap-4 my-6 md:my-8">
                  <FormRowVertical
                    label={t("landSelector:main_no")}
                    error={errors?.mainNo?.message}
                    name="mainNo"
                    errorClasses={errorLineClasses}
                    labelClasses={`${labelClasses} text-xs sm:text-sm`}
                  >
                    <Input
                      id="mainNo"
                      name="mainNo"
                      type="number"
                      className={`${inputClasses} xs:text-[12px] sm:text-sm border-l-4 ${
                        errors.mainNo?.message && "border-rose-400"
                      }  ${
                        !errors.mainNo &&
                        touchedFields.mainNo &&
                        dirtyFields.mainNo &&
                        "border-green-400 border-l-green-400"
                      } `}
                      placeholder={t("landSelector:main_no_placeholder")}
                      register={register}
                      disabled={isLoading}
                      required
                    />
                  </FormRowVertical>
                  <FormRowVertical
                    label={t("landSelector:sub_no")}
                    error={errors.subNo?.message}
                    name="subNo"
                    errorClasses={errorLineClasses}
                    labelClasses={`${labelClasses} text-xs sm:text-sm`}
                  >
                    <Input
                      id="subNo"
                      name="subNo"
                      type="number"
                      className={`${inputClasses} xs:text-[12px] sm:text-sm border-l-4 ${
                        errors.subNo?.message && "border-rose-400"
                      }  ${
                        !errors.subNo &&
                        touchedFields.subNo &&
                        dirtyFields.subNo &&
                        "border-green-400 border-l-green-400"
                      } `}
                      placeholder={t("landSelector:sub_no_placeholder")}
                      register={register}
                      disabled={isLoading}
                      required
                    />
                  </FormRowVertical>
                  <FormRowVertical
                    label={t("landSelector:plot_no")}
                    error={errors.plotNo?.message}
                    name="plotNo"
                    errorClasses={errorLineClasses}
                    labelClasses={`${labelClasses} text-xs sm:text-sm`}
                  >
                    <Input
                      id="plotNo"
                      name="plotNo"
                      type="number"
                      className={`${inputClasses} xs:text-[12px] sm:text-sm  ${
                        errors.plotNo?.message && "border-rose-400"
                      }  ${
                        !errors.plotNo &&
                        touchedFields.plotNo &&
                        dirtyFields.plotNo &&
                        "border-green-400"
                      } `}
                      placeholder={t("landSelector:plot_no_placeholder")}
                      register={register}
                      disabled={isLoading}
                      required
                    />
                  </FormRowVertical>
                </div>
                <div className="flex  w-1/2 justify-center m-auto">
                  <Button type="submit" disabled={false}>
                    {!isLoading ? (
                      t("landSelector:btn_text")
                    ) : (
                      <div className="grid grid-flow-col justify-items-end">
                        <p> {t("landSelector:btn_text")}</p>
                        <p>
                          <SpinnerMini width={"w-4"} height={"h-4"} />
                        </p>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandSelector;
