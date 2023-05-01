import { DownloaderStatusResponse } from "src/types/query";

import BaseAPIService from "./baseAPIService";

export default class DownloaderService extends BaseAPIService {
  static getDownloaderStatus = async (): Promise<DownloaderStatusResponse> =>
    this.directRequest(`http://localhost:34034/?cmd=updateprogress`, "GET");

  static submitSimPreview = async (
    schemeID: number,
    isCustomNumber: number,
    payload: FormData
  ) =>
    this.directRequest(
      `http://localhost:34034/?cmd=updatescheme&cid=${schemeID}&num=${isCustomNumber}`,
      "POST",
      payload,
      0,
      "multipart/form-data"
    );
}
