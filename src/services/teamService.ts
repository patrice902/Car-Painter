import { Team } from "src/types/model";
import { TeamPayload } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class TeamService extends BaseAPIService {
  static getTeamList = async (): Promise<Team[]> =>
    this.requestWithAuth(`/team`, "GET");

  static getTeamListByUserID = async (userID: number): Promise<Team[]> =>
    this.requestWithAuth(`/team/byUser/${userID}`, "GET");

  static createTeam = async (payload: TeamPayload): Promise<Team> =>
    this.requestWithAuth(`/team`, "POST", payload);

  static getTeam = async (id: number): Promise<Team> =>
    this.requestWithAuth(`/team/${id}`, "GET");

  static updateTeam = async (id: number, payload: TeamPayload): Promise<Team> =>
    this.requestWithAuth(`/team/${id}`, "PUT", payload);

  static deleteTeam = async (id: number) =>
    this.requestWithAuth(`/team/${id}`, "DELETE");
}
