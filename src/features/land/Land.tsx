import { ZodSchema, z } from "zod";
import { MemorizedUnitTree } from "../tree/UnitTree";
import { LandDetailReq } from "./LandDetail";
import IconButton, { IconClasses } from "../../ui/IconButton";
import { HiOutlineMinus, HiOutlinePlus, HiOutlineXMark } from "react-icons/hi2";
import Heading from "../../ui/Heading";
import { MemorizedUserUnitList } from "../tree/UserUnitList";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDarkMode } from "../../context/DarkModeContext";
import {
  QueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import landApi, {
  LandData,
  Landowner,
  SearchRequest,
} from "../../services/landApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ILandSchema,
  ManageLand,
  MultipleLandOwner,
  ownerSchema,
  ownershipTypeSchema,
  unitsSchema,
} from "../../lib/types";
import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import FormRowHorizontal from "../../ui/FormRowHorizontal";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import SpinnerMini from "../../ui/SpinnerMini";
import {
  getToastOptions,
  parseFormattedNumber,
  formatNumber,
  localeFormats,
  normalizedValue,
  LocaleKey,
} from "../../lib/helpFunction";
import { BarLoader } from "../../ui/LoadingModal";
import { HiOutlineSearch } from "react-icons/hi";
import { RiCloseFill, RiMapPinAddLine } from "react-icons/ri";
import { useTranslation as useCustomTranslation } from "../../context/TranslationContext";
//import LocaleInput from "../../ui/LocaleInput";
import { CheckedNode, setCheckedUnits } from "../../slices/unitTreeSlice";
import { LandUnitInfo } from "../../slices/landSummarySlice";
import ToolTip from "../../ui/ToolTip";
import { FaInfoCircle } from "react-icons/fa";
import ErrorToggle from "./ErrorToggle";
import { GiDeer } from "react-icons/gi";

interface LandProps {
  landDetailReq: LandDetailReq;
  landModalClose: () => void;
}

export const Land: React.FC<LandProps> = ({
  landDetailReq,
  landModalClose,
}: LandProps) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { isDarkMode } = useDarkMode();
  const { language: locale } = useCustomTranslation();
  const [selectionType, setSelectionType] = useState<number>(0);
  const [treeView, setTreeView] = useState<boolean>(false);
  const { checkedNode } = useAppSelector((state) => state.unitTree);
  const [showErrors, setShowErrors] = useState(false);
  const submRef = useRef(1);

  console.log(
    "Land running..................................................."
  );

  const landSchema: ZodSchema<ILandSchema> = z
    .object({
      LandId: z.number().min(0, t("land:val_landId_positive_number")).int(),
      OwnershipTypeId: z
        .string()
        .min(1, t("land:val_ownershipTypeId_required")),
      searchQuery: z.string(),
      Municipality: z
        .string()
        .min(1, t("land:val_municipality_required"))
        .regex(/^[\d,.\s]+$/, t("land:val_municipality_number_only")),
      MainNo: z
        .string()
        .min(1, t("land:val_main_no_required"))
        .regex(/^[\d,.\s]+$/, t("land:val_main_no_number_only")),
      SubNo: z
        .string()
        .min(1, t("land:val_sub_no_required"))
        .regex(/^[\d,.\s]+$/, t("land:val_sub_no_number_only")),
      PlotNo: z
        .string()
        //.regex(/^[\d,.\s]+$/, t("land:val_plot_no_number_only"))
        .optional(),
      AreaInForest: z
        .string()
        .regex(/^[\d,.\s]+$/, t("land:val_forest_area_number_only"))
        .refine((val) => !isNaN(parseFloat(val)), {
          message: t("landSelector:invalid_number"),
        }),
      AreaInMountain: z
        .string()
        .regex(/^[\d,.\s]+$/, t("land:val_mountain_area_number_only"))
        .refine((val) => !isNaN(parseFloat(val)), {
          message: t("landSelector:invalid_number"),
        }),
      AreaInAgriculture: z
        .string()
        .regex(/^[\d,.\s]+$/, t("land:val_agriculture_area_number_only"))
        .refine((val) => !isNaN(parseFloat(val)), {
          message: t("landSelector:invalid_number"),
        }),
      TotalArea: z
        .string()
        .regex(/^[\d,.\s]+$/, t("land:val_total_area_number_only"))
        .refine((val) => !isNaN(parseFloat(val)), {
          message: t("landSelector:invalid_number"),
        }),
      Notes: z.string().optional(),
      selectedOwners: z
        .array(ownerSchema)
        .nonempty(t("land:val_selected_names_required")),
      archivedOwners: z.array(ownerSchema).optional(),
      selectedUnits: z
        .array(unitsSchema)
        .nonempty(t("land:val_selected_units_required")),
      ownershipTypes: z
        .array(ownershipTypeSchema)
        .nonempty(t("land:val_ownershipt_types_required")),
      availableOwners: z.array(ownerSchema).optional(),
    })
    .refine(
      (data) =>
        parseFloat(
          parseFloat(normalizedValue(data.TotalArea.toString())).toFixed(2)
        ) ===
        parseFloat(
          (
            parseFloat(normalizedValue(data.AreaInForest.toString())) +
            parseFloat(normalizedValue(data.AreaInMountain.toString())) +
            parseFloat(normalizedValue(data.AreaInAgriculture.toString()))
          ).toFixed(2)
        ),
      {
        message: t("land:val_total_area_sum"),
        path: ["TotalArea"], // Path to where the error should be associated`
      }
    );

  const { data: landDetail, isLoading } = useQuery({
    queryKey: ["land", landDetailReq.LandId],
    queryFn: () => landApi.fetchLand(landDetailReq),
    enabled: !!(landDetailReq.LandId >= 0),
  });

  const {
    register,
    //control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    watch,
    formState: { errors, touchedFields, dirtyFields },
  } = useForm<ILandSchema>({
    resolver: zodResolver(landSchema),
    defaultValues: landDetail,
    mode: "onBlur",
    disabled: landDetail === undefined,
  });

  const searchQuery = watch("searchQuery");
  const selectedOwners = watch("selectedOwners");
  const availableOwners = watch("availableOwners");
  const ownershipTypes = watch("ownershipTypes");

  const handleInputBlur = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    type InputAreaTypes =
      | "AreaInForest"
      | "AreaInMountain"
      | "AreaInAgriculture";

    const inputName = event.target.name as InputAreaTypes;

    const newValue = parseFormattedNumber(
      event.target.value !== "" ? event.target.value : "0",
      localeFormats[locale as LocaleKey].decimalSeparator,
      locale
    );
    setValue(
      inputName,
      formatNumber(newValue, localeFormats[locale as LocaleKey].locale)
    );

    const areaInMountain = parseFormattedNumber(
      watch("AreaInMountain") !== "" ? watch("AreaInMountain") : "0",
      localeFormats[locale as LocaleKey].decimalSeparator,
      locale
    );

    const areaInAgriculture = parseFormattedNumber(
      watch("AreaInAgriculture") !== "" ? watch("AreaInAgriculture") : "0",
      localeFormats[locale as LocaleKey].decimalSeparator,
      locale
    );

    const areaInForest = parseFormattedNumber(
      watch("AreaInForest") !== "" ? watch("AreaInForest") : "0",
      localeFormats[locale as LocaleKey].decimalSeparator,
      locale
    );

    const totalArea = parseFloat(
      (
        parseFloat(normalizedValue(areaInForest)) +
        parseFloat(normalizedValue(areaInMountain)) +
        parseFloat(normalizedValue(areaInAgriculture))
      ).toFixed(2)
    );

    setValue(
      "TotalArea",
      formatNumber(
        totalArea.toString(),
        localeFormats[locale as LocaleKey].locale
      )
    );
  };

  useEffect(() => {
    if (landDetail) {
      Object.keys(landDetail).forEach((key) => {
        setValue(key as keyof ILandSchema, landDetail[key as keyof LandData]);
      });
    }
  }, [landDetail]);

  useEffect(() => {
    console.log(landDetail, "landDetail");
    if (landDetail) {
      const decimalSeparator: string =
        localeFormats[locale as LocaleKey].decimalSeparator;
      const curLocale: string = localeFormats[locale as LocaleKey].locale;

      const checkedUnits: CheckedNode[] = landDetail.selectedUnits?.map(
        (selectedUnit: LandUnitInfo) => {
          return {
            UnitId: selectedUnit.UnitId,
            ParentId: -1,
            Unit: selectedUnit.Unit,
            LandTypeId: selectedUnit.LandTypeId,
            IsChecked: true,
          };
        }
      );
      dispatch(setCheckedUnits(checkedUnits));

      const selectedOwners = [...landDetail.selectedOwners];
      setValue("selectedOwners", selectedOwners);

      const selectedUnits = [...landDetail.selectedUnits];
      setValue("selectedUnits", selectedUnits);

      const formattedData = {
        AreaInForest: formatNumber(
          parseFormattedNumber(
            landDetail.AreaInForest.toString(),
            decimalSeparator,
            locale
          ),
          curLocale
        ),
        AreaInMountain: formatNumber(
          parseFormattedNumber(
            landDetail.AreaInMountain.toString(),
            decimalSeparator,
            locale
          ),
          curLocale
        ),
        AreaInAgriculture: formatNumber(
          parseFormattedNumber(
            landDetail.AreaInAgriculture.toString(),
            decimalSeparator,
            locale
          ),
          curLocale
        ),
        TotalArea: formatNumber(
          parseFormattedNumber(
            landDetail.TotalArea.toString(),
            decimalSeparator,
            locale
          ),
          curLocale
        ),
      };
      reset(formattedData);

      setValue(
        "OwnershipTypeId",
        Number(landDetail.OwnershipTypeId) > 0
          ? landDetail.OwnershipTypeId.toString()
          : "1"
      );
      setValue("searchQuery", "");
      setValue("LandId", landDetail.LandId);
      // document?.getElementById("totalArea")?.disabled = true;
    }
  }, [landDetail, reset]);

  const onSubmit: SubmitHandler<ILandSchema> = async (land) => {
    toast.dismiss();

    const areaInForest: number = parseFloat(
      normalizedValue(
        parseFormattedNumber(
          getValues("AreaInForest"),
          localeFormats[locale as LocaleKey].decimalSeparator,
          locale
        )
      )
    );

    const areaInMountain: number = parseFloat(
      normalizedValue(
        parseFormattedNumber(
          getValues("AreaInMountain"),
          localeFormats[locale as LocaleKey].decimalSeparator,
          locale
        )
      )
    );

    const areaInAgriculture: number = parseFloat(
      normalizedValue(
        parseFormattedNumber(
          getValues("AreaInAgriculture"),
          localeFormats[locale as LocaleKey].decimalSeparator,
          locale
        )
      )
    );

    if (land.selectedOwners.length > 0 && land.selectedUnits.length > 0) {
      if (
        (areaInForest > 0 &&
          land.selectedUnits.filter((unit) => unit.LandTypeId === 1).length ===
            0) ||
        (areaInMountain > 0 &&
          land.selectedUnits.filter((unit) => unit.LandTypeId === 2).length ===
            0) ||
        (areaInAgriculture > 0 &&
          land.selectedUnits.filter((unit) => unit.LandTypeId === 3).length ===
            0)
      ) {
        toast.warning(t("land:area_selected_without_units"), {
          ...getToastOptions,
          position: "top-center",
          theme: isDarkMode ? "dark" : "light",
          style: {
            backgroundColor: isDarkMode ? "#111827" : "#f1f5f9",
            color: isDarkMode ? "#e5e7eb" : "#334155",
          },
        });
      } else if (
        (areaInForest === 0 &&
          land.selectedUnits.filter((unit) => unit.LandTypeId === 1).length >
            0) ||
        (areaInMountain === 0 &&
          land.selectedUnits.filter((unit) => unit.LandTypeId === 2).length >
            0) ||
        (areaInAgriculture === 0 &&
          land.selectedUnits.filter((unit) => unit.LandTypeId === 3).length > 0)
      ) {
        toast.warning(t("land:unit_selected_without_area"), {
          ...getToastOptions,
          position: "top-center",
          theme: isDarkMode ? "dark" : "light",
          style: {
            backgroundColor: isDarkMode ? "#111827" : "#f1f5f9",
            color: isDarkMode ? "#e5e7eb" : "#334155",
          },
        });
      } else {
        if (parseInt(land.OwnershipTypeId) > 0) {
          mutate(land);
        } else {
          toast.warning(t("land:ownership_type_missing"), {
            ...getToastOptions,
            position: "top-center",
            theme: isDarkMode ? "dark" : "light",
            style: {
              backgroundColor: isDarkMode ? "#111827" : "#f1f5f9",
              color: isDarkMode ? "#e5e7eb" : "#334155",
            },
          });
        }
      }
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      submRef.current += 1; ///////////////////// not necessary
    } else {
      setShowErrors(false);
      submRef.current = 1;
    }
  }, [errors]);

  const handleClick = () => {
    setShowErrors(false);
    submRef.current = 1;
  };

  const {
    mutate,
    isPending,
    //isError: postError,
    //  isSuccess,
  } = useMutation<MultipleLandOwner, Error, ILandSchema>({
    mutationFn: async (land: ILandSchema) => {
      const areaInForest: number = parseFloat(
        normalizedValue(
          parseFormattedNumber(
            getValues("AreaInForest"),
            localeFormats[locale as LocaleKey].decimalSeparator,
            locale
          )
        )
      );

      const areaInMountain: number = parseFloat(
        normalizedValue(
          parseFormattedNumber(
            getValues("AreaInMountain"),
            localeFormats[locale as LocaleKey].decimalSeparator,
            locale
          )
        )
      );

      const areaInAgriculture: number = parseFloat(
        normalizedValue(
          parseFormattedNumber(
            getValues("AreaInAgriculture"),
            localeFormats[locale as LocaleKey].decimalSeparator,
            locale
          )
        )
      );
      const landDetail: ManageLand = {
        Id: land.LandId,
        Municipality: land.Municipality,
        MainNo: land.MainNo,
        SubNo: land.SubNo,
        PlotNo: land.PlotNo,
        OwnershipTypeId: parseInt(land.OwnershipTypeId),
        AreaInForest: areaInForest,
        AreaInMountain: areaInMountain,
        AreaInAgriculture: areaInAgriculture,
        Notes: land.Notes,
        Landowners: land.selectedOwners,
        ArchivedLandowners: land.archivedOwners,
        LandUnits: land.selectedUnits,
        CreatedBy: user.UserId,
      };
      const response = await landApi.manageLandDetail(landDetail);
      return response;
    },
    onSuccess: (data: MultipleLandOwner, land: ILandSchema) => {
      let msg = "";
      if (land.LandId > 0) {
        if (land.selectedOwners.length > 1 && data.IsSameMultipleLandExist) {
          if (data.IsSameLand) {
            msg = t("land:successfully_update_multiple_owner", {
              contactPersonName: data.ContactPersonName,
            });
          } else {
            msg = t("land:successfully_add_same_multiple_owner", {
              contactPersonName: data.ContactPersonName,
            });
          }
        } else {
          msg = t("land:successfully_updated");
        }
      } else {
        if (land.selectedOwners.length > 1) {
          if (data.IsSameMultipleLandExist) {
            msg = t("land:successfully_add_same_multiple_owner", {
              contactPersonName: data.ContactPersonName,
            });
          } else {
            msg = t("land:successfully_save_multiple_owner");
          }
        } else {
          msg = t("land:successfully_save");
        }
      }
      toast.success(msg, {
        ...getToastOptions,
        position: "top-center",
        theme: isDarkMode ? "dark" : "light",
        style: {
          backgroundColor: isDarkMode ? "#111827" : "#f1f5f9",
          color: isDarkMode ? "#e5e7eb" : "#334155",
        },
      });
      const invalidateKey = ["land"] as QueryFilters;
      handleRemoveData(invalidateKey);
    },
    onError: () => {
      toast.error(t("land:error_on_updating"), {
        ...getToastOptions,
        position: "top-center",
        theme: isDarkMode ? "dark" : "light",
        style: {
          backgroundColor: isDarkMode ? "#111827" : "#f1f5f9",
          color: isDarkMode ? "#e5e7eb" : "#334155",
        },
      });
    },
  });

  const { data: filteredNames, isLoading: isFilteringUser } = useQuery({
    queryKey: ["filteredNames", searchQuery],
    queryFn: () => {
      const searchRequest: SearchRequest = {
        searchQuery: searchQuery,
        userDnnId: user.UserId,
        isAdmin: user.IsAdmin,
      };
      return landApi.fetchFilteredNames(searchRequest);
    },
    enabled: searchQuery ? searchQuery.length >= 3 : false,
  });

  useEffect(() => {
    if (filteredNames) {
      setValue("availableOwners", filteredNames);
    }
  }, [filteredNames]);

  useEffect(() => {
    if (landDetail?.LandOwnershipType) {
      setValue("ownershipTypes", landDetail?.LandOwnershipType);
    }
  }, [landDetail?.LandOwnershipType]);

  useEffect(() => {
    if (landDetail?.selectedOwners) {
      setValue("selectedOwners", landDetail?.selectedOwners);
    }
  }, [landDetail?.selectedOwners]);

  useEffect(() => {
    if (checkedNode) {
      const checkedNodes: LandUnitInfo[] = checkedNode.filter((node) => {
        if (node.IsChecked) {
          return {
            UnitId: node.UnitId,
            LandTypeId: node.LandTypeId,
            Unit: node.Unit,
          };
        }
      });
      setValue("selectedUnits", checkedNodes);
    }
  }, [checkedNode]);

  const onMoveToSelected = (owner: Landowner) => {
    const curOwner = getValues("selectedOwners")?.find(
      (curOwner) => curOwner.Id === owner.Id
    );
    if (!curOwner) {
      const selectedOwners = [...getValues("selectedOwners"), owner];
      setValue("selectedOwners", selectedOwners);
      const owners = availableOwners?.filter((n) => n.Id !== owner.Id);
      setValue("availableOwners", owners);
    }
  };

  // const handleOwnershipTypesChange = (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const selectedOwnershipTypeId = event.target.value;
  //   setValue("OwnershipTypeId", selectedOwnershipTypeId);
  //   // console.log(
  //   //   parseInt(selectedOwnershipTypeId),
  //   //   selectedOwnershipTypeId,
  //   //   watch("OwnershipTypeId")
  //   // );
  //   watch("OwnershipTypeId");
  // };

  const onMoveToArchived = (owner: Landowner) => {
    const selectedOwners =
      getValues("selectedOwners")?.filter((n) => n.Id !== owner.Id) ?? [];
    setValue("selectedOwners", selectedOwners);

    const curOwner = getValues("archivedOwners")?.find(
      (curOwner) => curOwner.Id === owner.Id
    );

    if (!curOwner) {
      const archivedOwners = getValues("archivedOwners")
        ? [...getValues("archivedOwners")!, owner]
        : [owner];
      setValue("archivedOwners", archivedOwners);
    }
  };

  const handleRemoveData = (queryKey: QueryFilters) => {
    queryClient.removeQueries(queryKey);
  };

  const handleTreeType = (selectionType: number) => {
    setSelectionType(selectionType);
    setTreeView(true);
  };

  const handleCloseTreeView = () => {
    setSelectionType(0);
    setTreeView(false);
  };

  const landModalWindowClose = () => {
    reset({
      LandId: 0,
      OwnershipTypeId: "1",
      searchQuery: "",
      Municipality: "",
      MainNo: "",
      SubNo: "",
      PlotNo: "",
      AreaInForest: undefined,
      AreaInMountain: undefined,
      AreaInAgriculture: undefined,
      TotalArea: undefined,
      Notes: "",
      selectedOwners: [],
      availableOwners: [],
      archivedOwners: [],
      ownershipTypes: [],
    });
    const invalidateKey = ["land"] as QueryFilters;
    handleRemoveData(invalidateKey);
    toast.dismiss();
    landModalClose();
  };

  // const toggleErrorVisibility = () => {
  //   setShowError((prev) => !prev);
  //   if (autoHideTimeout) clearTimeout(autoHideTimeout); // Clear timeout if manually toggled
  // };

  // useEffect(() => {
  //   if (errors) {
  //     setShowError(true);
  //     if (autoHideTimeout) clearTimeout(autoHideTimeout);
  //     setAutoHideTimeout(setTimeout(() => setShowError(false), 5000)); // Hide after 5 seconds
  //   } else {
  //     setShowError(false);
  //   }
  // }, [errors]);
  const errorMessages = Object.values(errors).map((error) => error.message);

  const labelClasses: string =
    "pointer-events-none flex h-full w-full select-none text-sm font-normal";
  const inputClasses: string =
    "w-full rounded-md border border-gray-300  px-2 py-1 font-sans text-sm font-normal outline outline-0 transition-all focus:placeholder-opacity-0 focus:border-customBlue  focus:outline-0 text-gray-800  dark:text-gray-200 dark:bg-slate-800";
  const errorLineClasses: string = "inline-block text-rose-400 text-[11px]";
  const iconClasses: IconClasses = {
    padding_x: "px-[2px]",
  };

  return (
    <main className="fixed inset-0 flex m-auto content-center justify-center items-center z-40 max-w-2xl">
      <section
        className="rounded-lg shadow-2xl max-w-2xl w-full transform transition-transform duration-300 ease-in-out animate-fadeIn"
        role="dialog"
        aria-modal="true"
      >
        <div className="h-[40rem] max-h-fit min-w-full flex-wrap items-start justify-center text-neutral-800 font-light rounded-lg shadow-2xl bg-neutral-100 dark:text-gray-200 dark:bg-slate-700">
          <div className="flex justify-between items-center pt-3 px-4">
            <span className="bg-logo flex-shrink-0">
              <GiDeer className="w-8 h-8 sm:w-8 sm:h-8" />
            </span>
            <h1
              className="text-base font-medium text-gradient
               sm:text-lg sm:font-medium 
               md:text-xl md:font-medium 
               lg:text-2xl lg:font-medium 
               xl:text-2xl xl:font-medium 
               text-center flex-grow"
            >
              {t("land:title")}{" "}
            </h1>
            <span className="flex-shrink-0">
              <IconButton onClick={landModalWindowClose} classes={iconClasses}>
                <HiOutlineXMark size={20} width={10} />
              </IconButton>
            </span>
          </div>
          {isLoading && landDetail === undefined && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white dark:bg-gray-900 border-gray-200 rounded-lg p-4 flex flex-col items-center md:w-40 sm:w-28">
                <BarLoader />
              </div>
            </div>
          )}
          <ErrorToggle
            errors={errorMessages}
            showError={showErrors}
            submit={submRef.current}
          />
          <div>
            {!treeView && !isLoading && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={`space-y-1`}
                onClick={handleClick}
              >
                <div className="px-6 py-3 relative">
                  <div>
                    {/* Main Layout Container  */}
                    <div className={`grid grid-cols-[14rem,1fr] gap-6`}>
                      {/*  First Row  */}
                      <div className="flex flex-col gap-4">
                        <input type="hidden" {...register("LandId")} />
                        <FormRowHorizontal
                          label={t("land:municipality")}
                          // error={errors?.Municipality?.message ?? ""}
                          name="municipality"
                          errorClasses={errorLineClasses}
                          labelClasses={labelClasses}
                        >
                          <Input
                            id="municipality"
                            name="Municipality"
                            type="text"
                            className={`${inputClasses} border-l-4  ${
                              !errors.Municipality &&
                              ((touchedFields.Municipality &&
                                dirtyFields.Municipality) ||
                                watch("Municipality")) &&
                              "border-green-400 border-l-green-400"
                            } ${errors.Municipality && "border-l-rose-400"}`}
                            register={register}
                            placeholder=""
                            isNumber={true}
                            disabled={false}
                            required
                          />
                        </FormRowHorizontal>
                        <FormRowHorizontal
                          label={t("land:main_no")}
                          // error={errors.MainNo?.message ?? ""}
                          name="MainNo"
                          errorClasses={errorLineClasses}
                          labelClasses={labelClasses}
                        >
                          <Input
                            id="mainNo"
                            name="MainNo"
                            type="text"
                            className={`${inputClasses} border-l-4   ${
                              !errors.MainNo &&
                              ((touchedFields.MainNo && dirtyFields.MainNo) ||
                                watch("MainNo")) &&
                              "border-green-400 border-l-green-400"
                            }
                          ${errors.MainNo && "border-l-rose-400"}`}
                            register={register}
                            placeholder=""
                            isNumber={true}
                            disabled={false}
                            required
                          />
                        </FormRowHorizontal>
                        <FormRowHorizontal
                          label={t("land:sub_no")}
                          // error={errors.SubNo?.message ?? ""}
                          name="SubNo"
                          errorClasses={errorLineClasses}
                          labelClasses={labelClasses}
                        >
                          <Input
                            id="subNo"
                            name="SubNo"
                            type="text"
                            className={`${inputClasses} border-l-4 ${
                              !errors.SubNo &&
                              ((touchedFields.SubNo && dirtyFields.SubNo) ||
                                watch("SubNo")) &&
                              "border-green-400 border-l-green-400"
                            } ${errors.SubNo && "border-l-rose-400"}`}
                            register={register}
                            isNumber={true}
                            disabled={false}
                            placeholder=""
                          />
                        </FormRowHorizontal>
                        <FormRowHorizontal
                          label={t("land:plot_no")}
                          error=""
                          name="PlotNo"
                          errorClasses=""
                          labelClasses={labelClasses}
                        >
                          <Input
                            id="plotNo"
                            name="PlotNo"
                            type="text"
                            className={inputClasses}
                            //   placeholder={t("owner:address_line1_placeholder")}
                            register={register}
                            isNumber={true}
                            disabled={false}
                          />
                        </FormRowHorizontal>
                        <FormRowHorizontal
                          label={t("land:ownership_type")}
                          error=""
                          name="OwnershipTypeId"
                          errorClasses=""
                          labelClasses={labelClasses}
                        >
                          <select
                            className="border-gray-300 border px-2 py-[6px] font-sans text-sm font-normal outline outline-0 transition-all focus:placeholder-opacity-0 focus:border-customBlue  focus:outline-0 text-gray-800  dark:text-gray-200 dark:bg-slate-800appearance-none
                           bg-white dark:bg-gray-800  divide-y divide-gray-200
                                      block w-full rounded-md   focus:outline-none  focus:shadow-outline-blue 
                                     duration-300"
                            {...register("OwnershipTypeId")} // Registering the input
                            onChange={(e) => {
                              const selectedValue = e.target.value; // Get the selected value
                              // handleOwnershipTypesChange(selectedValue); // Call your custom handler
                              setValue("OwnershipTypeId", selectedValue); // Update the form state
                            }}
                          >
                            {ownershipTypes &&
                              ownershipTypes?.map((ownershipType) => (
                                <option
                                  key={ownershipType.OwnershipTypeId}
                                  value={ownershipType.OwnershipTypeId}
                                >
                                  {ownershipType.OwnershipType}
                                </option>
                              ))}
                          </select>
                        </FormRowHorizontal>
                        <FormRowHorizontal
                          label={t("land:total_area")}
                          error=""
                          name="TotalArea"
                          errorClasses=""
                          labelClasses={labelClasses}
                        >
                          <Input
                            id="totalArea"
                            name="TotalArea"
                            type="text"
                            className={`${inputClasses} cursor-not-allowed dark:bg-slate-600 bg-transparent bg-gray-600`}
                            register={register}
                            placeholder=""
                            isNumber={true}
                            disabled={true}
                            required
                          />
                        </FormRowHorizontal>
                      </div>
                      {/*Second Column */}
                      <div className="flex-grow flex-1 -mt-1">
                        <div className="flex flex-col h-full w-full">
                          <div className="bg-white p-1 rounded shadow h-[12.5rem] min-h-64 dark:text-gray-100 dark:bg-slate-400">
                            <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-1">
                              <div className="h-[11.5rem] relative">
                                <div className="mb-1">
                                  <Input
                                    id="searchQuery"
                                    name="searchQuery"
                                    type="text"
                                    className={`${inputClasses} bg-transparent bg-gray-100 ${
                                      !errors.searchQuery &&
                                      ((touchedFields.searchQuery &&
                                        dirtyFields.searchQuery) ||
                                        watch("searchQuery")) &&
                                      "border-green-400"
                                    }`}
                                    register={register}
                                    disabled={false}
                                    placeholder={t("land:owners_placeholder")}
                                    required
                                  />
                                </div>
                                <div className="absolute top-1 right-2">
                                  {isFilteringUser && <SpinnerMini />}
                                  {!isFilteringUser && (
                                    <button
                                      className="flex items-center justify-center
                                                    font-medium text-sm                                                 
                                                    text-black   
                                                    dark:text-slate-50"
                                    >
                                      <HiOutlineSearch size={20} />
                                    </button>
                                  )}
                                </div>
                                <div className="h-40">
                                  <ul
                                    className="max-h-36 min-h-full overflow-y-auto slim-scroll border rounded-lg border-gray-600 dark:border-gray-900 shadow-sm bg-gray-50 py-1 dark:text-gray-200 dark:bg-slate-700"
                                    aria-label="Available names"
                                  >
                                    {isLoading ? (
                                      <li className="p-2 text-gray-500">
                                        Loading...
                                      </li>
                                    ) : availableOwners?.length ? (
                                      availableOwners.map((owner) => (
                                        <li
                                          key={owner.Id}
                                          className="flex justify-between hover:bg-gray-200 dark:hover:bg-gray-700 text-xs py-[2px] px-2"
                                        >
                                          {owner.Name}
                                          <button
                                            onClick={() =>
                                              onMoveToSelected(owner)
                                            }
                                            className="flex items-center justify-center p-1 max-h-5
                                                    rounded-lg font-medium text-sm transition-all
                                                    focus:outline-none focus:ring-gray-400
                                                    text-black bg-gray-300 hover:bg-gray-400 active:bg-gray-500
                                                    dark:text-slate-50 dark:hover:text-gray-900 dark:bg-gray-600 dark:hover:bg-gray-400 dark:active:bg-gray-500"
                                          >
                                            <HiOutlinePlus />
                                          </button>
                                        </li>
                                      ))
                                    ) : (
                                      <li className="p-1 text-gray-500 text-xs">
                                        {t("land:no_search_users")}
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                              <div className="h-[12.1rem]">
                                <ul
                                  className="max-h-36 min-h-full overflow-y-auto slim-scroll border rounded-lg border-gray-600 dark:border-gray-900 shadow-sm bg-gray-50 py-1 dark:text-gray-200 dark:bg-slate-700"
                                  aria-label="Selected names"
                                >
                                  {selectedOwners?.length > 0 ? (
                                    selectedOwners?.map((owner) => (
                                      <li
                                        key={owner.Id}
                                        className="flex justify-between p-2 hover:bg-gray-100 dark:hover:bg-sky-600 text-xs py-[2px] px-2"
                                      >
                                        {owner.Name}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            onMoveToArchived(owner)
                                          }
                                          className="flex items-center justify-center p-1 max-h-5
                                                    rounded-lg font-medium text-sm transition-all
                                                    focus:outline-none focus:ring-gray-400
                                                    text-black bg-gray-300 hover:bg-gray-400 active:bg-gray-500
                                                    dark:text-slate-50 dark:hover:text-gray-900 dark:bg-gray-600 dark:hover:bg-gray-400 dark:active:bg-gray-500"
                                        >
                                          <HiOutlineMinus />
                                        </button>
                                      </li>
                                    ))
                                  ) : (
                                    <li className="p-1 text-xs text-gray-500">
                                      {t("land:no_selected_users")}
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <textarea
                              id="notes"
                              // name="Notes"
                              placeholder={t("land:notes")}
                              className={`${inputClasses} ${
                                !errors.Notes &&
                                ((touchedFields.Notes && dirtyFields.Notes) ||
                                  watch("Notes")) &&
                                "border-green-400 border-l-green-400"
                              } `}
                              {...register("Notes")}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Second Row */}
                    <div className="grid grid-cols-3 gap-2 bg-white p-1 rounded shadow h-[16rem] min-h-64 dark:text-gray-100 dark:bg-slate-400">
                      <div className="bg-neutral-200 p-2 rounded shadow dark:text-gray-200 dark:bg-slate-700">
                        <div className="h-48">
                          <div className="bg-white rounded-lg">
                            <Input
                              id="areaForest"
                              name="AreaInForest"
                              type="text"
                              className={`${inputClasses} bg-transparent bg-white ${
                                !errors.AreaInForest &&
                                ((touchedFields.AreaInForest &&
                                  dirtyFields.AreaInForest) ||
                                  watch("AreaInForest")) &&
                                "border-green-400"
                              }`}
                              onBlur={handleInputBlur}
                              isNumber={true}
                              register={register}
                              disabled={false}
                              placeholder={t("land:area_forest_placeholder")}
                              required
                            />
                          </div>
                          <div className="h-[11rem] pt-2">
                            <ul
                              className="max-h-32 min-h-full overflow-y-auto slim-scroll  border rounded-lg border-gray-600 dark:border-gray-900 shadow-sm bg-gray-50 py-1 dark:text-gray-200 dark:bg-slate-700"
                              aria-label="Available names"
                            >
                              {isLoading ? (
                                <li className="p-2 text-gray-500">
                                  Loading...
                                </li>
                              ) : getValues("selectedUnits")?.filter(
                                  (unit) => unit.LandTypeId === 1
                                ).length ? (
                                getValues("selectedUnits")
                                  ?.filter((unit) => unit.LandTypeId === 1)
                                  .map((owner) => (
                                    <li
                                      key={owner.UnitId}
                                      className="flex justify-between hover:bg-gray-100  dark:hover:bg-sky-600 text-xs py-[2px] px-2"
                                    >
                                      {owner.Unit}
                                    </li>
                                  ))
                              ) : (
                                <li className="p-1 text-gray-500 text-xs">
                                  {t("land:no_forest_units")}
                                </li>
                              )}
                            </ul>
                          </div>
                          <div className="flex justify-center m-auto pt-[0.4rem] round-lg">
                            <div
                              className="px-3 py-[0.2rem] inline-flex items-center font-normal text-xs rounded-md cursor-pointer
  text-slate-100 bg-gray-800 hover:text-white hover:bg-gray-600 active:bg-gray-400 focus:ring-gray-400
  dark:text-slate-800 dark:bg-slate-300 dark:hover:text-slate-900 dark:hover:bg-slate-200 dark:active:bg-slate-100
  dark:focus:ring-gray-500 transition-all duration-150 ease-in-out"
                              onClick={() => handleTreeType(1)}
                            >
                              <span className="pr-4">
                                {t("land:btn_open_forest_unit")}
                              </span>
                              <RiMapPinAddLine size={16} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-neutral-200 p-2 rounded shadow dark:text-gray-200 dark:bg-slate-700">
                        <div className="h-48">
                          <div className="bg-white rounded-lg">
                            <Input
                              id="areaMountain"
                              name="AreaInMountain"
                              type="text"
                              className={`${inputClasses} bg-transparent bg-white ${
                                !errors.AreaInMountain &&
                                ((touchedFields.AreaInMountain &&
                                  dirtyFields.AreaInMountain) ||
                                  watch("AreaInMountain")) &&
                                "border-green-400"
                              }`}
                              onBlur={handleInputBlur}
                              register={register}
                              isNumber={true}
                              disabled={false}
                              placeholder={t("land:area_mountain_placeholder")}
                              required
                            />
                          </div>
                          <div className="h-[11rem] pt-2">
                            <ul
                              className="max-h-32 min-h-full overflow-y-auto slim-scroll  border rounded-lg border-gray-600 dark:border-gray-900 shadow-sm bg-gray-50 py-1 dark:text-gray-200 dark:bg-slate-700"
                              aria-label="Available names"
                            >
                              {isLoading ? (
                                <li className="p-2 text-gray-500">
                                  Loading...
                                </li>
                              ) : getValues("selectedUnits")?.filter(
                                  (unit) => unit.LandTypeId === 2
                                ).length ? (
                                getValues("selectedUnits")
                                  ?.filter((unit) => unit.LandTypeId === 2)
                                  .map((owner) => (
                                    <li
                                      key={owner.UnitId}
                                      className="flex justify-between hover:bg-gray-100  dark:hover:bg-sky-600 text-xs py-[2px] px-2"
                                    >
                                      {owner.Unit}
                                    </li>
                                  ))
                              ) : (
                                <li className="p-1 text-gray-500 text-xs">
                                  {t("land:no_mountain_units")}
                                </li>
                              )}
                            </ul>
                          </div>
                          <div className="flex justify-center m-auto pt-[0.4rem] round-lg">
                            <div
                              className="px-3 py-[0.2rem] inline-flex items-center font-normal text-xs rounded-md cursor-pointer
  text-slate-100 bg-gray-800 hover:text-white hover:bg-gray-600 active:bg-gray-400 focus:ring-gray-400
  dark:text-slate-800 dark:bg-slate-300 dark:hover:text-slate-900 dark:hover:bg-slate-200 dark:active:bg-slate-100
  dark:focus:ring-gray-500 transition-all duration-150 ease-in-out"
                              onClick={() => handleTreeType(2)}
                            >
                              <span className="pr-4">
                                {t("land:btn_open_mountain_unit")}
                              </span>
                              <RiMapPinAddLine size={16} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-neutral-200 p-2 rounded shadow dark:text-gray-200 dark:bg-slate-700">
                        <div className="h-48">
                          <div className="bg-white rounded-lg">
                            <Input
                              id="areaAgriculture"
                              name="AreaInAgriculture"
                              type="text"
                              className={`${inputClasses} bg-transparent bg-white ${
                                !errors.AreaInAgriculture &&
                                ((touchedFields.AreaInAgriculture &&
                                  dirtyFields.AreaInAgriculture) ||
                                  watch("AreaInAgriculture")) &&
                                "border-green-400"
                              }`}
                              onBlur={handleInputBlur}
                              register={register}
                              isNumber={true}
                              disabled={false}
                              placeholder={t(
                                "land:area_agriculture_placeholder"
                              )}
                              required
                            />
                          </div>
                          <div className="h-[11rem] pt-2">
                            <ul
                              className="max-h-32 min-h-full overflow-y-auto slim-scroll  border rounded-lg border-gray-600 dark:border-gray-900 shadow-sm bg-gray-50 py-1 dark:text-gray-200 dark:bg-slate-700"
                              aria-label="Available names"
                            >
                              {isLoading ? (
                                <li className="p-2 text-gray-500">
                                  Loading...
                                </li>
                              ) : getValues("selectedUnits")?.filter(
                                  (unit) => unit.LandTypeId === 3
                                ).length ? (
                                getValues("selectedUnits")
                                  ?.filter((unit) => unit.LandTypeId === 3)
                                  .map((owner) => (
                                    <li
                                      key={owner.UnitId}
                                      className="flex justify-between hover:bg-gray-100  dark:hover:bg-sky-600 text-xs py-[2px] px-2"
                                    >
                                      {owner.Unit}
                                    </li>
                                  ))
                              ) : (
                                <li className="p-1 text-gray-500 text-xs">
                                  {t("land:no_agriculture_units")}
                                </li>
                              )}
                            </ul>
                          </div>
                          <div className="flex justify-center m-auto pt-[0.4rem] round-lg">
                            <div
                              className="px-3 py-[0.2rem] inline-flex items-center font-normal text-xs rounded-md cursor-pointer
  text-slate-100 bg-gray-800 hover:text-white hover:bg-gray-600 active:bg-gray-400 focus:ring-gray-400
  dark:text-slate-800 dark:bg-slate-300 dark:hover:text-slate-900 dark:hover:bg-slate-200 dark:active:bg-slate-100
  dark:focus:ring-gray-500 transition-all duration-150 ease-in-out"
                              onClick={() => handleTreeType(3)}
                            >
                              <span className="pr-4">
                                {t("land:btn_open_agriculture_unit")}
                              </span>
                              <RiMapPinAddLine size={16} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex  w-1/2 justify-center m-auto mt-2">
                    <Button type="submit" disabled={false}>
                      {!isPending ? (
                        t("owner:btn_submit")
                      ) : (
                        <div className="grid grid-flow-col justify-items-end">
                          <p> {t("land:btn_submit")}</p>
                          <p>
                            <SpinnerMini />
                          </p>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
            {treeView && (
              <div className="p-6 h-[38rem] flex flex-col">
                {/* <div className="h-10 pl-6">
                <FormRowHorizontal
                  label={t("land:user_units")}
                  error=""
                  name="userUnits"
                  errorClasses=""
                  labelClasses={labelClasses}
                  width="w-60"
                >
                  <MemorizedUserUnitList />
                </FormRowHorizontal>
              </div> */}
                <div className="w-full flex justify-center gap-8">
                  <div className="group">
                    <label className={`${labelClasses} flex items-center`}>
                      {t("land:user_units")}
                      <ToolTip message={t("land:info_user_units_selection")}>
                        <FaInfoCircle className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700" />
                      </ToolTip>
                    </label>
                  </div>
                  <div className="w-64">
                    <MemorizedUserUnitList />
                  </div>
                </div>
                <div className="flex-grow mt-2 overflow-auto overflow-y-auto slim-scroll rounded-lg shadow-xl bg-gray-50  dark:bg-slate-600 p-6">
                  <MemorizedUnitTree selectionType={selectionType} />
                </div>
                <div className="h-10 mt-3">
                  <div className="flex justify-end py-1">
                    <div
                      className="px-2 py-1 inline-flex items-center font-normal text-xs bg-none rounded-sm border-none cursor-pointer text-neutral-100 hover:text-neutral-50
                              dark:text-slate-800 dark:hover:text-slate-900 bg-gray-800 hover:bg-gray-900 dark:bg-slate-200 dark:hover:bg-slate-100 active:bg-slate-300
                              dark:ring ring-gray-400 hover:ring-gray-600 dark:ring-slate-300 dark:hover:ring-slate-100 focus:outline-0 dark:focus:outline-0"
                      onClick={() => handleCloseTreeView()}
                    >
                      <span className="pr-4">
                        {t("land:btn_close_tree_view")}
                      </span>
                      <RiCloseFill size={20} />
                    </div>
                    {/* <div
                    className="px-2 py-1 inline-flex items-center font-normal text-xs bg-none rounded-sm border-none cursor-pointer text-neutral-100 hover:text-neutral-50
                              dark:text-slate-800 dark:hover:text-slate-900 bg-gray-800 hover:bg-gray-900 dark:bg-slate-200 dark:hover:bg-slate-100 active:bg-slate-300
                              dark:ring ring-gray-400 hover:ring-gray-600 dark:ring-slate-300 dark:hover:ring-slate-100 focus:outline-0"
                    onClick={() => setTreeView(false)}
                  >
                    <span className="pr-4">{t("land:btn_save_unit")}</span>
                    <RiMapPinAddLine size={20} />
                  </div> */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
export default Land;

{
  /* <Controller
                        name="searchQuery"
                        control={control}
                        render={({ field, fieldState }) => (
                          <div>
                            <input
                              type="text"
                              placeholder="Search names..."
                              {...field}
                              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                                fieldState.error ? "border-red-500" : ""
                              }`}
                              aria-label="Search for names"
                            />
                            {fieldState.error && (
                              <p className="mt-2 text-sm text-red-600">
                                {fieldState.error.message}
                              </p>
                            )}
                          </div>
                        )}
                      /> */
}
// defaultValues: {
//   searchQuery: "",
//   Municipality: "",
//   MainNo: "",
//   SubNo: "",
//   PlotNo: "",
//   AreaInForest: undefined,
//   AreaInMountain: undefined,
//   AreaInAgriculture: undefined,
//   TotalArea: undefined,
//   Notes: "",
//   selectedOwners: [],
//   availableOwners: [],
// },

// setInitialValues({
//   searchQuery: "",
//   LandId: landDetail.LandId,
//   OwnershipTypeId: landDetail.OwnershipTypeId,
//   Municipality: landDetail.Municipality,
//   MainNo: landDetail.MainNo,
//   SubNo: landDetail.SubNo,
//   PlotNo: landDetail.PlotNo,
//   AreaInForest: landDetail.AreaInForest.toString(),
//   AreaInMountain: landDetail.AreaInMountain.toString(),
//   AreaInAgriculture: landDetail.AreaInAgriculture.toString(),
//   TotalArea: landDetail.TotalArea.toString(),
//   Notes: landDetail.Notes,
//   selectedOwners: landDetail.selectedOwners,
//   selectedUnits: landDetail.selectedUnits,
//   ownershipTypes: landDetail.LandOwnershipType,
//   availableOwners: [],
// });
