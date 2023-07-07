import { FavoriteOverlay } from "src/types/model";
import { FavoriteOverlayPayload } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class FavoriteOverlayService extends BaseAPIService {
  static getFavoriteOverlayList = async (): Promise<FavoriteOverlay[]> =>
    this.requestWithAuth(`/favorite-overlay`, "GET");

  static getFavoriteOverlayListByUserID = async (
    userID: number
  ): Promise<FavoriteOverlay[]> =>
    this.requestWithAuth(`/favorite-overlay/byUser/${userID}`, "GET");

  static getFavoriteOverlayListByOverlayID = async (
    overlayID: number
  ): Promise<FavoriteOverlay[]> =>
    this.requestWithAuth(`/favorite-overlay/byOverlay/${overlayID}`, "GET");

  static createFavoriteOverlay = async (
    payload: FavoriteOverlayPayload
  ): Promise<FavoriteOverlay> =>
    this.requestWithAuth(`/favorite-overlay`, "POST", payload);

  static getFavoriteOverlay = async (id: number): Promise<FavoriteOverlay> =>
    this.requestWithAuth(`/favorite-overlay/${id}`, "GET");

  static updateFavoriteOverlay = async (
    id: number,
    payload: FavoriteOverlayPayload
  ): Promise<FavoriteOverlay> =>
    this.requestWithAuth(`/favorite-overlay/${id}`, "PUT", payload);

  static deleteFavoriteOverlay = async (id: number) =>
    this.requestWithAuth(`/favorite-overlay/${id}`, "DELETE");
}
