import { LeagueSeries } from "src/types/model";
import { LeagueSeiresWithLeague, LeagueSeriesPayload } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class LeagueSeriesService extends BaseAPIService {
  static getLeagueSeriesList = async (): Promise<LeagueSeries[]> =>
    this.requestWithAuth(`/leagueSeries`, "GET");

  static getLeagueSeriesListByUserID = async (
    userID: number
  ): Promise<LeagueSeiresWithLeague[]> =>
    this.requestWithAuth(`/leagueSeries/byUser/${userID}`, "GET");

  static createLeagueSeries = async (
    payload: LeagueSeriesPayload
  ): Promise<LeagueSeries> =>
    this.requestWithAuth(`/leagueSeries`, "POST", payload);

  static getLeagueSeries = async (id: number): Promise<LeagueSeries> =>
    this.requestWithAuth(`/leagueSeries/${id}`, "GET");

  static updateLeagueSeries = async (
    id: number,
    payload: LeagueSeriesPayload
  ): Promise<LeagueSeries> =>
    this.requestWithAuth(`/leagueSeries/${id}`, "PUT", payload);

  static deleteLeagueSeries = async (id: number) =>
    this.requestWithAuth(`/leagueSeries/${id}`, "DELETE");
}
