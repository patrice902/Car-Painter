import BaseAPIService from "./baseAPIService";

export default class TeamService extends BaseAPIService {
  static getTeamList = async () => this.requestWithAuth(`/team`, "GET");
  static getTeamListByUserID = async (userID) =>
    this.requestWithAuth(`/team/byUser/${userID}`, "GET");
  static createTeam = async (payload) =>
    this.requestWithAuth(`/team`, "POST", payload);
  static getTeam = async (ID) => this.requestWithAuth(`/team/${ID}`, "GET");
  static updateTeam = async (ID, payload) =>
    this.requestWithAuth(`/team/${ID}`, "PUT", payload);
  static deleteTeam = async (id) =>
    this.requestWithAuth(`/team/${id}`, "DELETE");
}
