import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  QueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { ILandOwnerSchema, landOwnerSchema } from "../../lib/types";
import landApi, { OwnersState } from "../../services/landApi";
import { OwnerDetailReq } from "../../slices/landOwnersSlice";
import IconButton, { IconClasses } from "../../ui/IconButton";
import { HiOutlineXMark } from "react-icons/hi2";
import Heading from "../../ui/Heading";
import FormRowHorizontal from "../../ui/FormRowHorizontal";
import { useTranslation } from "react-i18next";
import Input from "../../ui/Input";
import { toast } from "react-toastify";
import Button from "../../ui/Button";
import SpinnerMini from "../../ui/SpinnerMini";
import { getToastOptions } from "../../lib/helpFunction";
import { useDarkMode } from "../../context/DarkModeContext";
import ConfirmToast from "../../ui/ConfirmToast";

interface OwnerProps {
  ownerDetailReq: OwnerDetailReq;
  landOwnerModalClose: () => void;
}

export const Owner: React.FC<OwnerProps> = ({
  ownerDetailReq,
  landOwnerModalClose,
}: OwnerProps) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);
  const [initialValues, setInitialValues] = useState<
    ILandOwnerSchema | undefined
  >(undefined);
  const isNewSharedLandOwnerRef = useRef<boolean>(false);

  const {
    data: landOwnerData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["owner", ownerDetailReq.SystemUserId],
    queryFn: () =>
      ownerDetailReq.LandId != 0
        ? landApi.fetchLandOwner(ownerDetailReq)
        : landApi.fetchOwnerDetail(ownerDetailReq),
    enabled: !!ownerDetailReq.LandId || !!ownerDetailReq.SystemUserId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, dirtyFields },
    watch,
  } = useForm<ILandOwnerSchema>({
    resolver: zodResolver(landOwnerSchema),
    defaultValues: landOwnerData,
    mode: "onBlur",
  });

  useEffect(() => {
    if (landOwnerData) {
      if (landOwnerData.OwnersStates && landOwnerData.OwnersStates.length > 0) {
        const selectedOwner =
          landOwnerData.OwnersStates.find((owner) => owner.IsSharedLandOwner) ||
          landOwnerData.OwnersStates[0];
        const sharedOwner = landOwnerData.OwnersStates.find(
          (owner) => owner.IsSharedLandOwner
        );
        setSelectedOwnerId(selectedOwner.SystemUserId);
        resetFormWithOwnerData(selectedOwner.SystemUserId, sharedOwner);
      } else {
        resetFormWithOwnerData(landOwnerData.SystemUserId, undefined);
      }
    }
  }, [landOwnerData]);

  const handleRemoveData = (queryKey: QueryFilters) => {
    queryClient.removeQueries(queryKey);
  };

  const resetFormWithOwnerData = async (
    systemUserId: number | null,
    sharedOwner: OwnersState | undefined
  ) => {
    if (systemUserId !== -1) {
      const ownerDetail: OwnerDetailReq = {
        LandId: ownerDetailReq.LandId,
        SystemUserId: Number(systemUserId),
      };

      if (
        systemUserId !== null &&
        systemUserId != landOwnerData?.SystemUserId
      ) {
        const userData = await queryClient.fetchQuery({
          queryKey: ["landOwner", ownerDetail.SystemUserId],
          queryFn: () => landApi.fetchOwnerDetail(ownerDetail),
        });

        reset({
          LandId: userData.LandId,
          SystemUserId: userData.SystemUserId,
          FullName: userData.FullName,
          Email: userData.Email,
          ContactNumber: userData.ContactNumber,
          AddressLine1: userData.AddressLine1,
          AddressLine2: userData.AddressLine2,
          AddressCity: userData.AddressCity,
          BankAccountNo: userData.BankAccountNo,
          Notes: userData.Notes,
        });
        if (
          userData.LandId != 0 &&
          sharedOwner &&
          userData.SystemUserId != sharedOwner.SystemUserId &&
          (userData.BankAccountNo ||
            userData.AddressLine1 ||
            userData.AddressLine2 ||
            userData.AddressCity ||
            userData.Notes)
        ) {
          toast.info(
            t("owner:msg_land_owner_details_exist", {
              landOwner: sharedOwner.FullName,
              selectedLandOwner: userData.FullName,
            }),
            {
              ...getToastOptions,
              position: "top-center",
              theme: isDarkMode ? "dark" : "light",
              style: {
                width: "350px",
                backgroundColor: isDarkMode ? "#111827" : "#f1f5f9",
                color: isDarkMode ? "#e5e7eb" : "#334155",
              },
              closeButton: true,
            }
          );
        }
      } else if (landOwnerData) {
        reset({
          LandId: landOwnerData.LandId,
          SystemUserId: landOwnerData.SystemUserId,
          FullName: landOwnerData.FullName,
          Email: landOwnerData.Email,
          ContactNumber: landOwnerData.ContactNumber,
          AddressLine1: landOwnerData.AddressLine1,
          AddressLine2: landOwnerData.AddressLine2,
          AddressCity: landOwnerData.AddressCity,
          BankAccountNo: landOwnerData.BankAccountNo,
          Notes: landOwnerData.Notes,
        });
      }
    } else {
      reset({
        LandId: 0,
        SystemUserId: -1,
        FullName: "",
        Email: "",
        ContactNumber: "",
        AddressLine1: "",
        AddressLine2: "",
        AddressCity: "",
        BankAccountNo: "",
        Notes: "",
      });
    }
  };

  const onSubmit: SubmitHandler<ILandOwnerSchema> = async (owner) => {
    toast.dismiss();
    if (initialValues) {
      const keysToCompare = [
        "AddressLine1",
        "AddressLine2",
        "AddressCity",
        "BankAccountNo",
      ] as const;

      const areValuesSame = keysToCompare.every(
        (key) => owner[key as keyof ILandOwnerSchema] === initialValues[key]
      );

      const sharedOwner = landOwnerData?.OwnersStates?.find(
        (owner) => owner.IsSharedLandOwner
      );

      isNewSharedLandOwnerRef.current =
        !sharedOwner && ownerDetailReq.LandId !== 0;

      if (sharedOwner && sharedOwner.SystemUserId > 0) {
        if (sharedOwner.SystemUserId === owner.SystemUserId) {
          mutate(owner);
        } else {
          if (areValuesSame) {
            const msg = t("owner:msg_shared_land_owner_exist_detail_same", {
              name: sharedOwner.FullName,
            });
            showConfirmationToast(owner, msg);
          } else {
            const msg = t("owner:msg_shared_land_owner_exist", {
              landOwner: sharedOwner.FullName,
              selectedLandOwner: owner.FullName,
            });
            showConfirmationToast(owner, msg);
          }
        }
      } else {
        mutate(owner);
      }
    }
  };

  const showConfirmationToast = (owner: ILandOwnerSchema, msg: string) => {
    toast.info(
      ({ closeToast }) => (
        <ConfirmToast
          onConfirm={() => {
            mutate(owner);
            closeToast();
          }}
          onCancel={() => {
            console.log("Canceled!");
            closeToast();
          }}
          message={msg}
          confirm={t("common:btn_confirm")}
          cancel={t("common:btn_cancel")}
        />
      ),
      {
        ...getToastOptions,
        position: "top-center",
        autoClose: 30000,
        theme: isDarkMode ? "dark" : "light",
        style: {
          width: "350px",
          backgroundColor: isDarkMode ? "#111827" : "#f1f5f9",
          color: isDarkMode ? "#e5e7eb" : "#334155",
        },
      }
    );
  };

  const {
    mutate,
    isPending,
    isError: postError,
    //isSuccess,
  } = useMutation({
    mutationFn: (ownerDetail: ILandOwnerSchema) =>
      landApi.saveLandOwnerDetail(ownerDetail),
    onSuccess: () => {
      const msg = isNewSharedLandOwnerRef.current
        ? t("owner:msg_new_contact_saved_successfully")
        : t("owner:msg_save_success");
      toast.success(msg, {
        ...getToastOptions,
        position: "top-center",
        theme: isDarkMode ? "dark" : "light",
        style: {
          backgroundColor: isDarkMode ? "#111827" : "#f1f5f9",
          color: isDarkMode ? "#e5e7eb" : "#334155",
        },
      });
      const invalidateKey = ["owner", "landOwner"] as QueryFilters;
      handleRemoveData(invalidateKey);
    },
    onError: () => {
      toast.error("error", {
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

  const handleOwnerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sharedOwner = landOwnerData
      ? landOwnerData.OwnersStates?.find((owner) => owner.IsSharedLandOwner)
      : undefined;

    const newOwnerId = Number(event.target.value);
    // if (newOwnerId !== sharedOwner?.SystemUserId) {
    setSelectedOwnerId(newOwnerId);
    resetFormWithOwnerData(newOwnerId, sharedOwner);
    //  }
  };

  useEffect(() => {
    //////////////////////////////////// *** need to check that this is necessary
    if (landOwnerData) {
      setInitialValues({
        LandId: landOwnerData.LandId, // or any appropriate default value
        SystemUserId: landOwnerData.SystemUserId,
        FullName: landOwnerData.FullName,
        Email: landOwnerData.Email,
        ContactNumber: landOwnerData.ContactNumber,
        AddressLine1: landOwnerData.AddressLine1,
        AddressLine2: landOwnerData.AddressLine2,
        AddressCity: landOwnerData.AddressCity,
        BankAccountNo: landOwnerData.BankAccountNo,
        Notes: landOwnerData.Notes,
      });
    }
  }, [landOwnerData]);

  useEffect(() => {
    return () => {
      const invalidateKey = ["owner", "landOwner"] as QueryFilters;
      handleRemoveData(invalidateKey);
      toast.dismiss();
    };
  }, [queryClient]);

  if (isLoading) return <p>Loading...</p>;
  if (isError || postError) return <p>Something went wrong.</p>;

  const labelClasses: string =
    "pointer-events-none flex h-full w-full select-none text-sm font-normal";
  const inputClasses: string =
    "w-full rounded-md border border-gray-300  px-2 py-1 font-sans text-sm font-normal outline outline-0 transition-all focus:placeholder-opacity-0 focus:border-customBlue  focus:outline-0 text-gray-800  dark:text-gray-200 dark:bg-slate-800";
  const errorLineClasses: string =
    "absolute left-2 top-[64px] inline-block text-rose-400 text-[11px]";
  const iconClasses: IconClasses = {
    padding_x: "px-[2px]",
  };

  return (
    <main className="h-fit fixed inset-0 flex m-auto content-center justify-center items-center z-50">
      <section
        className="rounded-lg shadow-2xl max-w-md w-full transform transition-transform duration-300 ease-in-out animate-fadeIn"
        role="dialog"
        aria-modal="true"
      >
        <div className="gap-6 block h-full min-w-max flex-wrap items-start justify-center text-neutral-800 font-light rounded-lg  shadow-2xl  bg-neutral-100 dark:text-gray-200 dark:bg-slate-700">
          <div className="flex justify-between items-center pt-3 px-3">
            <div className="flex-1 flex justify-center font-serif">
              <Heading headingElement="h4" headingTxt={t("owner:title")} />
            </div>
            <div className="h-1/2">
              <IconButton onClick={landOwnerModalClose} classes={iconClasses}>
                <HiOutlineXMark size={20} width={10} />
              </IconButton>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="p-4 md:p-6">
              {landOwnerData?.OwnersStates &&
                landOwnerData.OwnersStates.length > 0 && (
                  <div>
                    <FormRowHorizontal
                      label={t("owner:land_owner")}
                      error=""
                      name="owners"
                      message={t("owner:lbl_multiple_owner_land_owner_detail")}
                      errorClasses={errorLineClasses}
                      labelClasses={labelClasses}
                    >
                      <select
                        id="ownersList"
                        value={selectedOwnerId ?? undefined}
                        onChange={handleOwnerChange}
                        className={inputClasses}
                      >
                        <option key={-1} value={-1}>
                          {t("owner:select_land_owner")}
                        </option>
                        {landOwnerData.OwnersStates.map((owner) => (
                          <option
                            key={owner.SystemUserId}
                            value={owner.SystemUserId}
                          >
                            {owner.FullName}{" "}
                            {owner.IsSharedLandOwner ? "(Shared)" : ""}
                          </option>
                        ))}
                      </select>
                    </FormRowHorizontal>
                  </div>
                )}
              <FormRowHorizontal
                label={t("owner:full_name")}
                error=""
                name="fullName"
                errorClasses=""
                labelClasses={labelClasses}
              >
                <Input
                  id="fullName"
                  name="FullName"
                  type="text"
                  className={`${inputClasses}  bg-slate-200 dark:bg-slate-400`}
                  register={register}
                  placeholder=""
                  disabled={true}
                  required
                />
              </FormRowHorizontal>
              <FormRowHorizontal
                label={t("owner:email")}
                error=""
                name="email"
                errorClasses=""
                labelClasses={labelClasses}
              >
                <Input
                  id="email"
                  name="Email"
                  type="email"
                  className={`${inputClasses} cursor-not-allowed bg-slate-200  dark:bg-slate-400`}
                  register={register}
                  placeholder=""
                  disabled={true}
                  required
                />
              </FormRowHorizontal>
              <FormRowHorizontal
                label={t("owner:contact_number")}
                error=""
                name="contactNumber"
                errorClasses=""
                labelClasses={labelClasses}
              >
                <Input
                  id="contactNumber"
                  name="ContactNumber"
                  type="text"
                  className={`${inputClasses} cursor-not-allowed bg-slate-200  dark:bg-slate-400`}
                  register={register}
                  placeholder=""
                  disabled={true}
                />
              </FormRowHorizontal>
              <FormRowHorizontal
                label={t("owner:address_line1")}
                error=""
                name="addressLine1"
                errorClasses=""
                labelClasses={labelClasses}
              >
                <Input
                  id="addressLine1"
                  name="AddressLine1"
                  type="text"
                  className={`${inputClasses} border-l-4 bg-transparent bg-gray-100 ${
                    !errors.AddressLine1 &&
                    ((touchedFields.AddressLine1 && dirtyFields.AddressLine1) ||
                      watch("AddressLine1")) &&
                    "border-green-400 border-l-green-400"
                  } `}
                  //   placeholder={t("owner:address_line1_placeholder")}
                  register={register}
                  disabled={false}
                />
              </FormRowHorizontal>
              <FormRowHorizontal
                label={t("owner:address_line2")}
                error=""
                name="addressLine2"
                errorClasses=""
                labelClasses={labelClasses}
              >
                <Input
                  id="addressLine2"
                  name="AddressLine2"
                  type="text"
                  className={`${inputClasses} border-l-4 bg-transparent bg-gray-100 ${
                    !errors.AddressLine2 &&
                    ((touchedFields.AddressLine2 && dirtyFields.AddressLine2) ||
                      watch("AddressLine2")) &&
                    "border-green-400 border-l-green-400"
                  } `}
                  register={register}
                  disabled={false}
                />
              </FormRowHorizontal>
              <FormRowHorizontal
                label={t("owner:address_city")}
                error=""
                name="addressCity"
                errorClasses=""
                labelClasses={labelClasses}
              >
                <Input
                  id="addressCity"
                  name="AddressCity"
                  type="text"
                  className={`${inputClasses} border-l-4 bg-transparent bg-gray-100 ${
                    !errors.AddressCity &&
                    ((touchedFields.AddressCity && dirtyFields.AddressCity) ||
                      watch("AddressCity")) &&
                    "border-green-400 border-l-green-400"
                  } `}
                  //  placeholder={t("owner:address_city_placeholder")}
                  register={register}
                  disabled={false}
                />
              </FormRowHorizontal>
              <FormRowHorizontal
                label={t("owner:bank_account_no")}
                error=""
                name="bankAccountNo"
                errorClasses=""
                labelClasses={labelClasses}
              >
                <Input
                  id="bankAccountNo"
                  name="BankAccountNo"
                  type="text"
                  className={`${inputClasses} border-l-4 bg-transparent bg-gray-100 ${
                    !errors.BankAccountNo &&
                    ((touchedFields.BankAccountNo &&
                      dirtyFields.BankAccountNo) ||
                      watch("BankAccountNo")) &&
                    "border-green-400 border-l-green-400"
                  } `}
                  // placeholder={t("owner:bank_account_no_placeholder")}
                  register={register}
                  disabled={false}
                />
              </FormRowHorizontal>
              <div className="mt-3">
                <FormRowHorizontal
                  label={t("owner:notes")}
                  error=""
                  name="notes"
                  errorClasses=""
                  labelClasses={labelClasses}
                >
                  <textarea
                    id="notes"
                    //name="Notes"
                    className={`${inputClasses} border-l-4 bg-transparent bg-gray-100 ${
                      !errors.Notes &&
                      ((touchedFields.Notes && dirtyFields.Notes) ||
                        watch("Notes")) &&
                      "border-green-400 border-l-green-400"
                    } `}
                    {...register("Notes")}
                  ></textarea>
                </FormRowHorizontal>
              </div>
              <div className="flex  w-1/2 justify-center m-auto mt-5">
                <Button type="submit" disabled={false}>
                  {!isPending ? (
                    t("owner:btn_submit")
                  ) : (
                    <div className="grid grid-flow-col justify-items-end">
                      <p> {t("owner:btn_submit")}</p>
                      <p>
                        <SpinnerMini />
                      </p>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Owner;
// import { useQuery } from "@tanstack/react-query";

// import landApi, {
//   LandOwner,
//   LandOwnerRegisterDetail,
// } from "../../services/landApi";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { OwnerDetailReq } from "../../slices/landOwnersSlice";
// import { useForm } from "react-hook-form";
// import { OwnerFormValues } from "../../lib/types";

// interface OwnerProps {
//   ownerDetailReq: OwnerDetailReq;
//   landOwnerModalClose: () => void;
// }
// const Owner = ({ ownerDetailReq, landOwnerModalClose }: OwnerProps) => {
//   // Fetch data using React Query
//   const { data, isLoading, isError } = useQuery<LandOwnerRegisterDetail>(
//     ["owner", ownerDetailReq.SystemUserId],
//     () => landApi.fetchLandOwner(ownerDetailReq),
//     {
//       enabled: !!ownerDetailReq.LandId,
//       onSuccess: (data) => {
//         // Populate the form with fetched data
//         reset({
//           SystemUserId: data.SystemUserId,
//           FullName: data.FullName,
//           Email: data.Email,
//           ContactNumber: data.ContactNumber,
//           AddressLine1: data.AddressLine1,
//           AddressLine2: data.AddressLine2,
//           AddressCity: data.AddressCity,
//           BankAccountNo: data.BankAccountNo,
//           Notes: data.Notes,
//         });
//       },
//     }
//   );

//   const onSubmit = (values: OwnerFormValues) => {
//     console.log("Form submitted:", values);
//     // Handle form submission (e.g., send the updated data to the server)
//   };

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<OwnerFormValues>({
//     resolver: zodResolver(userSchema),
//   });

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Something went wrong.</p>;

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       <div>
//         <label htmlFor="name">Name</label>
//         <input id="name" {...register("name")} className="input" />
//         {errors.name && <p className="text-red-500">{errors.name.message}</p>}
//       </div>

//       <div>
//         <label htmlFor="email">Email</label>
//         <input id="email" {...register("email")} className="input" />
//         {errors.email && <p className="text-red-500">{errors.email.message}</p>}
//       </div>

//       <div>
//         <label htmlFor="age">Age</label>
//         <input id="age" type="number" {...register("age")} className="input" />
//         {errors.age && <p className="text-red-500">{errors.age.message}</p>}
//       </div>

//       <button type="submit" className="btn btn-primary">
//         Submit
//       </button>
//     </form>
//   );
// };

// export default Owner;
