import { ZodSchema, z } from "zod";
import { Geometry } from "ol/geom";
// Custom middleware to handle XML responses
import { LandOwnershipType, Landowner } from "../services/landApi";
import { LandUnitInfo } from "../slices/landSummarySlice";

const passwordValidation = z.string().superRefine((val, ctx) => {
  if (val.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password is required",
    });
  } else if (val.length < 4) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Password must be at least 4 characters long`,
    });
  }
});

export const loginSchema = z.object({
  username: z.string().min(2, { message: "Username is required" }),
  password: passwordValidation,
});

// export const isValidParam = (param: string | undefined): param is string => {
//   return param !== undefined && !isNaN(Number(param));
// };

export const isValidParam = (param: string | undefined): boolean => {
  if (!param) return false;
  const parsedValue = parseInt(param);
  return !isNaN(parsedValue) && parsedValue > 0;
};

export const parseParams = (params: { [key: string]: string | undefined }) => {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      parseInt(value as string),
    ])
  );
};

// export const landSelectorSchema =
//   z.object({
//     municipality: z
//       .string()
//       .min(4, { message: "Municipality is required" })
//       .refine((value) => validMunicipalities.includes(value), {
//         message: "Invalid municipality. Please select a valid option.",
//       }),
//     mainNo: z.number().min(1, { message: "Main Number Required is required" }),
//     subNo: z.number().min(1, { message: "Sub Number Required is required" }),
//     plotNo: z.number(),
//   });

export type TLoginSchema = z.infer<typeof loginSchema>;
//export type TLandSelectorSchema = z.infer<typeof landSelectorSchema>;

// // Zod schema for form validation
// export const ownerSchema = z.object({
//   FullName: z.string().min(1, "Name is required"),
//   Email: z.string().min(1, "Name is required"),
//   AddressCity: z.string().email("Invalid email"),
//   AddressLine1: z.number().min(1, "Age must be a positive number"),
//   AddressLine2: z.number().min(1, "Age must be a positive number"),
//   BankAccountNo: z.number().min(1, "Age must be a positive number"),
//   Notes: z.number().min(1, "Age must be a positive number"),
// });

//export type OwnerFormValues = z.infer<typeof ownerSchema>;

export const landOwnerSchema = z.object({
  SystemUserId: z.number(),
  FullName: z.string(),
  Email: z.string().email(),
  ContactNumber: z.string(),
  LandId: z.number().nullable().optional(),
  AddressLine1: z.string().optional(),
  AddressLine2: z.string().optional(),
  AddressCity: z.string().optional(),
  BankAccountNo: z.string().optional(),
  Notes: z.string().optional(),
});

export type ILandOwnerSchema = z.infer<typeof landOwnerSchema>;

// export interface NameOption {
//   id: string;
//   name: string;
// }

export interface ILandSchema {
  LandId: number;
  searchQuery: string;
  Municipality: string;
  MainNo: string;
  SubNo: string;
  PlotNo?: string;
  AreaInForest: string;
  AreaInMountain: string;
  AreaInAgriculture: string;
  TotalArea: string;
  Notes?: string;
  OwnershipTypeId: string;
  selectedOwners: Landowner[];
  availableOwners?: Landowner[] | undefined;
  archivedOwners?: Landowner[] | undefined;
  selectedUnits: LandUnitInfo[];
  ownershipTypes: LandOwnershipType[];
}

export interface ManageLand {
  Id: number;
  Municipality: string;
  MainNo: string;
  SubNo: string;
  PlotNo?: string;
  OwnershipTypeId: number;
  AreaInForest: number;
  AreaInMountain: number;
  AreaInAgriculture: number;
  Notes?: string;
  Landowners: Landowner[];
  ArchivedLandowners: Landowner[] | undefined;
  LandUnits: LandUnitInfo[];
  CreatedBy: number;
}

export interface MultipleLandOwner {
  IsSameMultipleLandExist: boolean;
  IsSuccess: boolean;
  IsSameLand: boolean;
  ContactPersonName: string;
}
// interface INameOption {
//   id: string;
//   name: string;
// }

export const ownerSchema: ZodSchema<Landowner> = z.object({
  Id: z.number(),
  Name: z.string(),
});

export const unitsSchema: ZodSchema<LandUnitInfo> = z.object({
  UnitId: z.number(),
  Unit: z.string(),
  LandTypeId: z.number(),
});

export const ownershipTypeSchema: ZodSchema<LandOwnershipType> = z.object({
  OwnershipTypeId: z.number(),
  OwnershipType: z.string(),
});

// export const landSchema: ZodSchema<ILandSchema> = z
//   .object({
//     searchQuery: z.string().min(3, "Enter at least 3 characters"),
//     Municipality: z.string().min(1, "Municipality is required"),
//     MainNo: z.string().min(1, "MainNo is required"),
//     SubNo: z.string().min(1, "SubNo is required"),
//     PlotNo: z.string().optional(),
//     AreaInForest: z.string()
//       .refine(
//         (val) => {
//           const parsed = parseFloat(val);
//           return !isNaN(parsed); // && parsed >= 0
//         },
//         { message: t("landSelector:invalid_number") }
//       )
//       .transform((val) => parseFloat(val)),
//     AreaInMountain: z
//       .number()
//       .nonnegative("AreaInMountain must be non-negative"),
//     AreaInAgriculture: z
//       .number()
//       .nonnegative("AreaInAgriculture must be non-negative"),
//     TotalArea: z.number().nonnegative("TotalArea must be non-negative"),
//     Notes: z.string().optional(),
//     selectedNames: z
//       .array(ownerSchema)
//       .nonempty("Available names cannot be empty"),
//     selectedUnits: z
//       .array(unitsSchema)
//       .nonempty("Available names cannot be empty"),
//     availableNames: z.array(ownerSchema),
//   })
//   .refine(
//     (data) =>
//       data.TotalArea ===
//       data.AreaInForest + data.AreaInMountain + data.AreaInAgriculture,
//     {
//       message:
//         "TotalArea must be the sum of AreaInForest, AreaInMountain, and AreaInAgriculture",
//       path: ["TotalArea"], // Path to where the error should be associated
//     }
//   );

//export type ILandSchema = z.infer<typeof landSchema>;

export interface LoginFormInputs {
  username: string;
  password: string;
}

export interface LandSelectorFormInputs {
  landId: number;
  municipality: string;
  mainNo: number;
  subNo: number;
  plotNo?: string | number | undefined;
}

export interface LandInformation {
  LandId: number;
  Municipality: string;
  MainNo: string;
  SubNo: string;
  PlotNo: string;
  OwnershipTypeId: string;
  AreaInForest: number;
  AreaInMountain: number;
  TotalArea: number;
  Notes: string;
  CreatedBy: number;
  CreatedOn: string;
  LastUpdatedBy: number;
  LastUpdatedDate: string;
  AreaInAgriculture: number;
  MunicipalityName: string;
}

export interface MapLandInformation {
  MapGeoJson: string;
  LandInformations: LandInformation;
}

export interface ErrorState {
  message: string;
  statusCode: number;
}

export interface ApiResponse {
  Message: string;
  StatusCode: number;
}

export interface LoginResponse {
  UserId: number;
  IsAdmin: boolean;
  DisplayName: string;
  Token: string;
  RefreshToken: string;
}

export interface RefreshRequest {
  UserId: number;
  Token: string;
  RefreshToken: string;
}

export interface LogoutRequest {
  UserId: number;
  Token: string;
  RefreshToken: string;
}

export interface Municipality {
  MunicipalityNo: number;
  MunicipalityName: string;
}

export interface IHoydekurveData {
  objid: number;
  objtype?: string;
  medium?: string;
  oppdateringsdato?: Date;
  malemetode?: string;
  noyaktighet?: string;
  senterlinje?: Geometry; // Geometry type
  hoyde?: number;
}

export interface IEiendomsgrense {
  Objid: number;
  Objtype?: string | null;
  Teiggrenseid: number;
  Navnerom: string;
  Versjonid?: number | null;
  Datafangstdato?: Date | null;
  Oppdateringsdato: Date;
  Datauttaksdato?: Date | null;
  Malemetode?: string | null;
  Noyaktighet?: number | null;
  Grense: Geometry; // Assuming Geometry is imported from 'ol/geom'
  Administrativgrense: string;
  Omtvistet: boolean;
  Noyaktighetsklasse: string;
  Uuidteiggrense: string;
  Folgerterrengdetalj: string;
}

export interface ITeig {
  Objid: number;
  Objtype?: string | null;
  Teigid: number;
  Navnerom: string;
  Versjonid?: number | null;
  Datafangstdato?: Date | null;
  Oppdateringsdato: Date;
  Datauttaksdato?: Date | null;
  Malemetode?: string | null;
  Noyaktighet?: number | null;
  Representasjonspunkt?: Geometry | null;
  Omrade: Geometry;
  Kommunenummer: string;
  Kommunenavn: string;
  Matrikkelnummertekst: string;
  Teigmedflerematrikkelenheter: boolean;
  Tvist: boolean;
  Uregistrertjordsameie: boolean;
  Avklarteiere?: boolean | null;
  Lagretberegnetareal?: number | null;
  Arealmerknadtekst?: string | null;
  Noyaktighetsklasseteig?: string | null;
  Uuidteig: string;
}

///1823849, 6143760

// export const xmlResponseHandler = async (response) => {
//   if (response.status === 200) {
//     const text = await response.text(); // Get the raw XML text
//     const parser = new parseString.Parser(); // Create an XML parser
//     return new Promise((resolve, reject) => {
//       parser.parseString(text, (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result); // Resolve with the parsed XML data
//         }
//       });
//     });
//   } else {
//     throw new Error("Failed to fetch XML data");
//   }
// };

// export const xmlResponseMiddleware: Middleware =
//   (store) => (next) => async (action: AnyAction) => {
//     try {
//       const response = await next(action); // Call the next middleware
//       const status = response?.status ?? 200; // Safely access the status or default to 200

//       if (status === 200) {
//         const contentType = response.headers.get("Content-Type");
//         if (contentType && contentType.includes("application/xml")) {
//           // Parse the XML response
//           const xmlText = await response.text();
//           const parsedData = parseXml(xmlText); // Implement your XML parser

//           // Modify the response object
//           return {
//             ...response,
//             data: parsedData,
//           };
//         }
//       }

//       return response;
//     } catch (error) {
//       // Handle any errors here
//       console.error("Error in xmlResponseMiddleware:", error);
//       throw error;
//     }
//   };

export type NodeData = {
  UnitID: number;
  Unit: string;
  UnitTypeID: number;
  ParentID: number;
  ReferenceID: string;
  ImgUrl: string;
  ParentUnit: string;
  ChildCount: number;
  ChildTeamsCount: number;
  IsActiveForHunting: boolean;
  IsHuntingComplete: boolean;
  IsArchived: boolean;
  IsAllowedToRegisterLands: boolean;
  IsUserOnlyOnMunicipality: boolean;
  IsHead: boolean;
  IsExporter: boolean;
  IsPriceUser: boolean;
  IsLandAssignableUser: boolean;
  IsLandOwner: boolean; ////
  IsGuest: boolean;
  IsExpanded: boolean;
  Children: NodeData[] | undefined;
};

export interface MainState {
  rootId: number;
  unitId: number;
  currentUserId: number;
}

// data.ts
export interface SubSubRow {
  id: number;
  subSubValue: string;
}

// export interface SubRow {
//   id: number;
//   subValue: string;
//   subSubRows?: SubSubRow[];
// }

export interface Row {
  id: number;
  value: string;
  subRows?: SubRow[];
}

export interface SubRow extends Row {
  subValue: string;
  subSubRows?: SubSubRow[];
}

export interface FeatureData {
  Type: string;
  Geometry: GeometryData;
  Properties: Record<string, object>;
  UuidFeatureDrawn: string;
  IconType: string;
}

export interface GeometryData {
  type: string;
  coordinates: object;
}
