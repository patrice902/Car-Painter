import { FavoriteUpload } from "src/types/model";
import { FavoriteUploadPayload } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class FavoriteUploadService extends BaseAPIService {
  static getFavoriteUploadList = async (): Promise<FavoriteUpload[]> =>
    this.requestWithAuth(`/favorite-upload`, "GET");

  static getFavoriteUploadListByUserID = async (
    userID: number
  ): Promise<FavoriteUpload[]> =>
    this.requestWithAuth(`/favorite-upload/byUser/${userID}`, "GET");

  static getFavoriteUploadListByUploadID = async (
    UploadID: number
  ): Promise<FavoriteUpload[]> =>
    this.requestWithAuth(`/favorite-upload/byUpload/${UploadID}`, "GET");

  static createFavoriteUpload = async (
    payload: FavoriteUploadPayload
  ): Promise<FavoriteUpload> =>
    this.requestWithAuth(`/favorite-upload`, "POST", payload);

  static getFavoriteUpload = async (id: number): Promise<FavoriteUpload> =>
    this.requestWithAuth(`/favorite-upload/${id}`, "GET");

  static updateFavoriteUpload = async (
    id: number,
    payload: FavoriteUploadPayload
  ): Promise<FavoriteUpload> =>
    this.requestWithAuth(`/favorite-upload/${id}`, "PUT", payload);

  static deleteFavoriteUpload = async (id: number) =>
    this.requestWithAuth(`/favorite-upload/${id}`, "DELETE");
}
