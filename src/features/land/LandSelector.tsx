import { useEffect, useState } from "react";
import { useGetMunicipalityListQuery } from "../../services/landSelectorApi";
import Button from "../../ui/Button";
import FormRowVertical from "../../ui/FormRowVertical";
import Heading from "../../ui/Heading";
import Logo from "../../ui/Logo";
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

interface LandSelectorProps {
  isLandSelectorModalIsOpen?: boolean;
  landSelectorModalClose?: () => void;
}

const LandSelector: React.FC<LandSelectorProps> = ({
  isLandSelectorModalIsOpen,
  landSelectorModalClose,
}: LandSelectorProps) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [valuesSet, setValuesSet] = useState(false);
  const [LandExist, setLandExist] = useState(false);
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
  const {
    //land,
    landList,
    isloaded,
    //isLandAvailable,
    noContent,
    isLoading,
    //error,
    isError,
  } = useAppSelector((state: RootState) => state.selectland);
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
  // "absolute left-0 -top-3.5 text-neutral-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-800 peer-focus:text-sm";
  const inputClasses: string =
    "h-full w-full rounded-md border border-gray-300 bg-transparent  px-3 py-2 font-sans text-sm font-normal outline outline-0 transition-all focus:placeholder-opacity-0 focus:border-customBlue  focus:outline-0 text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-slate-800"; // disabled:border-0
  /// "peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600 bg-transparent";
  const errorLineClasses: string =
    "absolute left-2 top-[64px] inline-block text-rose-400 text-[11px]";
  //const errorSummeryClasses: string = "inline-block text-rose-600 text-sm";

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
  }, [manucipilityList, municipality, mainNo, subNo, setValue, trigger]);

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
      //dispatch(setLoadingState(true));
      setIsFormSubmitted(true);
      setLandExist(false);
    } else {
      setLandExist(true);
    }
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
      //dispatch(setselectedLandState(land)); // Dispatch action to update land in Redux state

      if (landSelectorModalClose) {
        landSelectorModalClose();
      }

      if (!wordExistsInUri("dashboard")) {
        navigate(`/dashboard`);
      }
    }
  }, [isFormSubmitted, isloaded, navigate, dispatch, isError]);

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

  //if (municipalityLoading) return <Spinner />;
  if (!isLandSelectorModalIsOpen && landId === 0) return null;

  return (
    <main className="modal  h-fit fixed inset-0 flex m-auto content-center justify-center items-center z-50">
      <section className="bg-neutral-100 max-w-5xl rounded-xl">
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
              <div className="flex gap-1 flex-col items-center text-center pt-6 bg-logo">
                <Logo size={60} />
                <div className="text-gradient">
                  <Heading
                    headingElement="h4"
                    headingTxt={t("landSelector:title")}
                  />
                </div>
              </div>
              <form
                className="mt-6 p-6"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <p className="pb-4">{t("landSelector:detail")}</p>
                {municipalityError && (
                  <ErrorTxt classes={`${errorSummeryClasses} pb-2`}>
                    {t("landSelector:sever_error")}
                  </ErrorTxt>
                )}
                {LandExist && (
                  <ErrorTxt classes={`${errorSummeryClasses} pb-2`}>
                    {t("landSelector:land_exist_error")}
                  </ErrorTxt>
                )}
                {isFormSubmitted && isloaded && noContent && !isError && (
                  <ErrorTxt classes={`${errorSummeryClasses} pb-2`}>
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
                      labelClasses={labelClasses}
                    >
                      <input
                        id="municipality"
                        type="text"
                        placeholder={t("landSelector:municipality_placeholder")}
                        className={`${inputClasses} border-l-4 ${
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
                  <div className="absolute top-[64px] left-0  z-50 w-full">
                    {showItemList && manucipilityList && (
                      <ul className="border rounded-md bg-white text-gray-600 focus:ring-2 shadow-lg">
                        {filteredMunicipalityList
                          ? filteredMunicipalityList.map((item) => (
                              <li
                                className="cursor-pointer hover:bg-[#1eb4ff] py-[6px] px-3"
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
                                className="cursor-pointer hover:bg-[#1eb4ff] py-[6px] px-3"
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
                <div className="flex justify-center gap-4 my-8">
                  <FormRowVertical
                    label={t("landSelector:main_no")}
                    error={errors?.mainNo?.message}
                    name="mainNo"
                    errorClasses={errorLineClasses}
                    labelClasses={labelClasses}
                  >
                    <Input
                      id="mainNo"
                      name="mainNo"
                      type="number"
                      className={`${inputClasses} border-l-4 ${
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
                    labelClasses={labelClasses}
                  >
                    <Input
                      id="subNo"
                      name="subNo"
                      type="number"
                      className={`${inputClasses} border-l-4 ${
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
                    labelClasses={labelClasses}
                  >
                    <Input
                      id="plotNo"
                      name="plotNo"
                      type="number"
                      className={`${inputClasses}  ${
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
                    {!false ? (
                      t("landSelector:btn_text")
                    ) : (
                      <div className="grid grid-flow-col justify-items-end">
                        <p> t("landSelector:btn_text")</p>
                        <p>
                          <SpinnerMini />
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
