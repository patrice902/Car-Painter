import BaseAPIService from "./baseAPIService";

export default class FavoriteSchemeService extends BaseAPIService {
  static getFavoriteSchemeList = async () =>
    this.requestWithAuth(`/favorite`, "GET");
  static getFavoriteSchemeListByUserID = async (userID) =>
    this.requestWithAuth(`/favorite/byUser/${userID}`, "GET");
  static getFavoriteSchemeListBySchemeID = async (schemeID) =>
    this.requestWithAuth(`/favorite/byScheme/${schemeID}`, "GET");
  static createFavoriteScheme = async (payload) =>
    this.requestWithAuth(`/favorite`, "POST", payload);
  static getFavoriteScheme = async (schemeID) =>
    this.requestWithAuth(`/favorite/${schemeID}`, "GET");
  static updateFavoriteScheme = async (schemeID, payload) =>
    this.requestWithAuth(`/favorite/${schemeID}`, "PUT", payload);
  static deleteFavoriteScheme = async (id) =>
    this.requestWithAuth(`/favorite/${id}`, "DELETE");
}
