import { BuilderLogo } from "src/types/model";
import { BuilderLogoPayload } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class LogoService extends BaseAPIService {
  static getLogoList = async (): Promise<BuilderLogo[]> =>
    this.requestWithAuth(`/logo`, "GET");

  static getLogoByID = async (id: number): Promise<BuilderLogo> =>
    this.requestWithAuth(`/logo/${id}`, "GET");

  static createLogo = async (
    payload: BuilderLogoPayload
  ): Promise<BuilderLogo> => this.requestWithAuth(`/logo`, "POST", payload);

  static updateLogo = async (
    id: number,
    payload: BuilderLogoPayload
  ): Promise<BuilderLogo> =>
    this.requestWithAuth(`/logo/${id}`, "PUT", payload);

  static deleteLogo = async (id: number) =>
    this.requestWithAuth(`/logo/${id}`, "DELETE");

  static uploadAndCreate = async (formData: FormData): Promise<BuilderLogo> =>
    this.requestWithAuth(
      `/logo/upload-and-create`,
      "POST",
      formData,
      0,
      "multipart/form-data"
    );

  static uploadAndUpdate = async (
    id: number,
    formData: FormData
  ): Promise<BuilderLogo> =>
    this.requestWithAuth(
      `/logo/${id}/upload-and-update`,
      "PUT",
      formData,
      0,
      "multipart/form-data"
    );
}
