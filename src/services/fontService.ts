import { BuilderFont } from "src/types/model";
import { BuilderFontPayload } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class FontService extends BaseAPIService {
  static getFontList = async (): Promise<BuilderFont[]> =>
    this.requestWithAuth(`/font`, "GET");

  static getFontByID = async (id: number): Promise<BuilderFont> =>
    this.requestWithAuth(`/font/${id}`, "GET");

  static createFont = async (
    payload: BuilderFontPayload
  ): Promise<BuilderFont> => this.requestWithAuth(`/font`, "POST", payload);

  static updateFont = async (
    id: number,
    payload: BuilderFontPayload
  ): Promise<BuilderFont> =>
    this.requestWithAuth(`/font/${id}`, "PUT", payload);
}
