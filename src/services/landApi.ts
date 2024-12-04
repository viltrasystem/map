import axios, { AxiosError } from "axios";
import {
  OwnedLand,
  OwnerDetailReq,
  SharedLand,
} from "../slices/landOwnersSlice";
import { ArchiveInfo, LandUnitInfo } from "../slices/landSummarySlice";
import { ILandOwnerSchema, ManageLand, MultipleLandOwner } from "../lib/types";
import { LandDetailReq } from "../features/land/LandDetail";
import apiClient from "./apiClient";

const landApi = {
  landSummery: async (unitId: number) => {
    try {
      const response = await apiClient.get("/land/landdetail", {
        params: { unitId },
      });
      return response.data; // Assuming you want to return the data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        throw axiosError;
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  },
  landOwners: async (unitId: number) => {
    try {
      const response = await apiClient.get("/land/landowners", {
        params: { unitId },
      });
      return response.data; // Assuming you want to return the data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        throw axiosError;
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  },
  ownersLand: async (ownedLand: OwnedLand) => {
    try {
      const response = await apiClient.get("/land/ownersland", {
        params: {
          unitId: ownedLand.unitId,
          ownerUId: ownedLand.userId,
          isDnnId: ownedLand.isDnnId,
          isLandTab: ownedLand.isLandTab,
        },
      });
      return response.data; // Assuming you want to return the data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        throw axiosError;
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  },
  sharedOwnersLand: async (sharedLand: SharedLand) => {
    try {
      const response = await apiClient.get("/land/sharedownersland", {
        params: {
          unitId: sharedLand.unitId,
          landIdListStr: sharedLand.landIdListStr,
        },
      });
      return response.data; // Assuming you want to return the data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        throw axiosError;
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  },
  archiveLand: async (archiveInfo: ArchiveInfo) => {
    try {
      const response = await apiClient.post("/land/archiveLand", {
        UnitId: archiveInfo.unitId,
        LandId: archiveInfo.landId,
        DeletedBy: archiveInfo.deletedBy,
      });
      return response.data; // Assuming you want to return the data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        throw axiosError;
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  },
  fetchLandOwner: async (
    ownerDetailReq: OwnerDetailReq
  ): Promise<LandOwnerRegisterDetail> => {
    const response = await apiClient.get(`/land/owners`, {
      params: {
        systemUserId: ownerDetailReq.SystemUserId,
        landId: ownerDetailReq.LandId,
      },
    });
    return response.data;
  },
  fetchOwnerDetail: async (
    ownerDetailReq: OwnerDetailReq
  ): Promise<LandOwnerRegisterDetail> => {
    const response = await apiClient.get(`/land/ownerdetail`, {
      params: {
        systemUserId: ownerDetailReq.SystemUserId,
        landId: ownerDetailReq.LandId,
      },
    });
    return response.data;
  },
  saveLandOwnerDetail: async (
    ownerDetail: ILandOwnerSchema
  ): Promise<number> => {
    const response = await apiClient.post(`/land/ownerdetail`, {
      LandId: ownerDetail.LandId,
      SystemUserId: ownerDetail.SystemUserId,
      AddressLine1: ownerDetail.AddressLine1,
      AddressLine2: ownerDetail.AddressLine2,
      AddressCity: ownerDetail.AddressCity,
      BankAccountNo: ownerDetail.BankAccountNo,
      Notes: ownerDetail.Notes,
    });
    return response.data;
  },
  fetchFilteredNames: async (
    searchRequest: SearchRequest
  ): Promise<Landowner[]> => {
    const response = await apiClient.get(`/land/filtereduser`, {
      params: {
        filter: searchRequest.searchQuery,
        userDnnId: searchRequest.userDnnId,
        isAdmin: searchRequest.isAdmin ? 1 : 0,
      },
    });
    return response.data;
  },
  fetchLand: async (landDetailReq: LandDetailReq): Promise<LandData> => {
    const response = await apiClient.get(`/land/land`, {
      params: {
        landId: landDetailReq.LandId,
      },
    });
    const data = response.data;
    const land: LandData = {
      LandId: data.LandId,
      Municipality: data.Municipality,
      MainNo: data.MainNo,
      SubNo: data.SubNo,
      PlotNo: data.PlotNo,
      AreaInForest: data.AreaInForest,
      AreaInMountain: data.AreaInMountain,
      AreaInAgriculture: data.AreaInAgriculture,
      OwnershipTypeId: data.OwnershipTypeId,
      TotalArea:
        data.AreaInForest + data.AreaInMountain + data.AreaInAgriculture,
      Notes: data.Notes,
      LandOwners: data.LandOwners.map((owner: any) => ({
        LandOwnerId: owner.LandOwnerId,
        FullName: owner.FullName,
      })),
      LandUnits: data.LandUnits.map((unit: any) => ({
        UnitId: unit.UnitId,
        Unit: unit.Unit,
        LandTypeId: unit.LandTypeId,
      })),
      selectedOwners: data.LandOwners.map((owner: any) => ({
        Id: owner.LandOwnerId,
        Name: owner.FullName,
      })),
      selectedUnits: data.LandUnits.map((unit: any) => ({
        UnitId: unit.UnitId,
        Unit: unit.Unit,
        LandTypeId: unit.LandTypeId,
      })),
      LandOwnershipType: data.LandOwnershipTypes.map((landType: any) => ({
        OwnershipTypeId: landType.Id,
        OwnershipType: landType.OwnershipType,
      })),
      availableOwners: [],
    };
    return land;
  },
  manageLandDetail: async (
    LandDetail: ManageLand
  ): Promise<MultipleLandOwner> => {
    const response = await apiClient.post(`/land/land`, LandDetail);
    return response.data;
  },
};

export default landApi;

export type SearchRequest = {
  searchQuery: string;
  userDnnId: number;
  isAdmin: boolean;
};
export interface LandOwnerRegisterDetail {
  OwnersStates: OwnersState[] | null;
  LandId: number;
  SystemUserId: number;
  FullName: string;
  Email: string;
  ContactNumber: string;
  AddressLine1: string;
  AddressLine2: string;
  AddressCity: string;
  BankAccountNo: string;
  Notes: string;
}

export interface OwnersState {
  SystemUserId: number;
  FullName: string;
  IsSharedLandOwner: boolean;
}

export interface Landowner {
  Id: number;
  Name: string;
}

export interface LandOwnershipType {
  OwnershipTypeId: number;
  OwnershipType: string;
}

export interface LandData {
  LandId: number;
  OwnershipTypeId: string;
  Municipality: string;
  MainNo: string;
  SubNo: string;
  PlotNo: string;
  AreaInForest: string;
  AreaInMountain: string;
  AreaInAgriculture: string;
  TotalArea: string;
  Notes: string;
  LandOwners: Landowner[];
  LandUnits: LandUnitInfo[];
  selectedOwners: Landowner[];
  availableOwners: Landowner[];
  selectedUnits: LandUnitInfo[];
  LandOwnershipType: LandOwnershipType[];
}

//  type LandOwnerFormValues = {
//    SystemUserId: number;
//    FullName: string;
//    Email: string;
//    ContactNumber: string;
//    AddressLine1?: string | undefined;
//    AddressLine2?: string | undefined;
//    AddressCity?: string | undefined;
//    BankAccountNo?: string | undefined;
//    Notes?: string | undefined;
//  };
// export interface LandOwner {
//   LandOwnerId: number;
//   SystemUserId: number;
//   LandId: number;
//   ContactOwnerLandId: number;
//   DisplayName: string;
//   FullName: string;
//   Email: string;
//   ContactNumber: string;
//   IsSelected: boolean;
//   IsSharedLandOwner: boolean;
// }
