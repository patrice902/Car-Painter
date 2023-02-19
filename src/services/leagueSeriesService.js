import BaseAPIService from "./baseAPIService";

export default class LeagueSeriesService extends BaseAPIService {
  static getLeagueSeriesList = async () =>
    this.requestWithAuth(`/leagueSeries`, "GET");
  static getLeagueSeriesListByUserID = async (userID) =>
    this.requestWithAuth(`/leagueSeries/byUser/${userID}`, "GET");
  static createLeagueSeries = async (payload) =>
    this.requestWithAuth(`/leagueSeries`, "POST", payload);
  static getLeagueSeries = async (ID) =>
    this.requestWithAuth(`/leagueSeries/${ID}`, "GET");
  static updateLeagueSeries = async (ID, payload) =>
    this.requestWithAuth(`/leagueSeries/${ID}`, "PUT", payload);
  static deleteLeagueSeries = async (id) =>
    this.requestWithAuth(`/leagueSeries/${id}`, "DELETE");
}
