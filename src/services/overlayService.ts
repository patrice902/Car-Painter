import { BuilderOverlay } from "src/types/model";
import { BuilderOverlayPayload } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class OverlayService extends BaseAPIService {
  static getOverlayList = async (): Promise<BuilderOverlay[]> =>
    this.requestWithAuth(`/overlay`, "GET");

  static getOverlayByID = async (id: number): Promise<BuilderOverlay> =>
    this.requestWithAuth(`/overlay/${id}`, "GET");

  static createOverlay = async (
    payload: BuilderOverlayPayload
  ): Promise<BuilderOverlay> =>
    this.requestWithAuth(`/overlay`, "POST", payload);

  static updateOverlay = async (
    id: number,
    payload: BuilderOverlayPayload
  ): Promise<BuilderOverlay> =>
    this.requestWithAuth(`/overlay/${id}`, "PUT", payload);

  static deleteOverlay = async (id: number) =>
    this.requestWithAuth(`/overlay/${id}`, "DELETE");

  static uploadAndCreate = async (
    formData: FormData
  ): Promise<BuilderOverlay> =>
    this.requestWithAuth(
      `/overlay/upload-and-create`,
      "POST",
      formData,
      0,
      "multipart/form-data"
    );

  static uploadAndUpdate = async (
    id: number,
    formData: FormData
  ): Promise<BuilderOverlay> =>
    this.requestWithAuth(
      `/overlay/${id}/upload-and-update`,
      "PUT",
      formData,
      0,
      "multipart/form-data"
    );
}
