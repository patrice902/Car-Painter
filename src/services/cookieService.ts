import Cookies from "js-cookie";

const getQueryVariable = (variable: string) => {
  const query = decodeURIComponent(variable);
  const vars = query.split("&");
  const queryJson: { [key: string]: string } = {};
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    queryJson[pair[0]] = pair[1];
  }
  return queryJson;
};

export default class CookieService {
  static getSiteLogin = () =>
    getQueryVariable(Cookies.get("site_login_v2") ?? "");

  static setSiteLogin = (token: string) => {
    Cookies.set("site_login_v2", token, {
      domain: "tradingpaints.com",
    });
  };

  static clearSiteLogin = () => {
    Cookies.remove("site_login_v2", {
      domain: "tradingpaints.com",
    });
  };
}
