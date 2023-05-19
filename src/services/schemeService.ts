import { BuilderScheme } from "src/types/model";
import {
  BuilderSchemeForGetById,
  BuilderSchemeForGetByIdWithBasepaints,
  BuilderSchemeForGetList,
  BuilderSchemeForGetListByUserId,
  BuilderSchemePayload,
  BuilderSchemeWithLayers,
} from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class SchemeService extends BaseAPIService {
  static getSchemeList = async (): Promise<BuilderSchemeForGetList[]> =>
    this.requestWithAuth(`/scheme`, "GET");

  static getSchemeListByUserID = async (
    userID: number
  ): Promise<BuilderSchemeForGetListByUserId[]> =>
    this.requestWithAuth(`/scheme/?userID=${userID}`, "GET");

  static getSchemeListByUploadID = async (
    uploadID: number
  ): Promise<BuilderScheme[]> =>
    this.requestWithAuth(`/scheme/byUpload/${uploadID}`, "GET");

  static createScheme = async (
    carMakeID: number,
    name: string,
    userID: number,
    legacy_mode: boolean
  ): Promise<BuilderSchemeForGetById> =>
    this.requestWithAuth(`/scheme`, "POST", {
      carMakeID,
      name,
      userID,
      legacy_mode,
    });

  static getScheme = async (
    schemeID: number
  ): Promise<BuilderSchemeForGetByIdWithBasepaints> =>
    this.requestWithAuth(`/scheme/${schemeID}`, "GET");

  static updateScheme = async (
    schemeID: number,
    payload: BuilderSchemePayload
  ): Promise<BuilderScheme> =>
    this.requestWithAuth(`/scheme/${schemeID}`, "PUT", payload);

  static deleteScheme = async (id: number) =>
    this.requestWithAuth(`/scheme/${id}`, "DELETE");

  static cloneScheme = async (id: number): Promise<BuilderSchemeWithLayers> =>
    this.requestWithAuth(`/scheme/clone/${id}`, "POST");

  static renewCarMakeLayers = async (
    id: number
  ): Promise<BuilderSchemeForGetById> =>
    this.requestWithAuth(`/scheme/renewCarMakeLayers/${id}`, "POST");

  static uploadThumbnail = async (
    formData: FormData
  ): Promise<BuilderSchemeForGetById> =>
    this.requestWithAuth(
      `/scheme/thumbnail`,
      "POST",
      formData,
      0,
      "multipart/form-data"
    );
}
