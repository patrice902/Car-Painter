import { DefaultLayerData, GuideData } from "./common";
import {
  BlockedUser,
  BuilderBase,
  BuilderFont,
  BuilderLayer,
  BuilderLogo,
  BuilderOverlay,
  BuilderScheme,
  BuilderUpload,
  Car,
  CarMake,
  CarPin,
  FavoriteLogo,
  FavoriteOverlay,
  FavoriteScheme,
  FavoriteUpload,
  League,
  LeagueSeries,
  SharedScheme,
  SharedUpload,
  Team,
  User,
} from "./model";

export type AuthPayload = {
  usr: string;
  password: string;
};

export type BuilderUploadPayload = Omit<BuilderUpload, "id">;

export type TeamPayload = Omit<Team, "id">;

export type BuilderBasePayload = Omit<BuilderBase, "id">;

export type BlockedUserPayload = Omit<BlockedUser, "id">;

export type CarMakePayload = Omit<CarMake, "id">;

export type CarMakeWithBases = CarMake & { bases: BuilderBase[] };

export type CarPinPayload = Omit<CarPin, "id">;

export type SharedSchemeWithUser = SharedScheme & {
  user: User;
};

export type SharedSchemePayload = Omit<SharedScheme, "id">;

export type SharedSchemeForGetListByUserId = SharedScheme & {
  scheme: BuilderScheme & {
    sharedUsers: SharedSchemeWithUser[];
    carMake: CarMake;
    user: User;
  };
};

export type SharedSchemeForGetByID = SharedSchemeForGetListByUserId &
  SharedSchemeWithUser;

export type BuilderSchemePayload = Omit<BuilderScheme, "id">;

export type BuilderSchemeJSON = Omit<BuilderScheme, "guide_data"> & {
  guide_data: GuideData;
};

export type BuilderSchemeWithLayers = BuilderScheme & {
  layers: BuilderLayer[];
};

export type BuilderSchemeForGetList = BuilderSchemeWithLayers & {
  carMake: CarMakeWithBases;
};

export type BuilderSchemeForGetListByUserId = BuilderScheme & {
  carMake: CarMake;
  user: User;
  sharedUsers: SharedSchemeWithUser[];
  originalAuthor?: User;
  originalScheme?: BuilderScheme;
};

export type BuilderSchemeJSONForGetListByUserId = BuilderSchemeJSON & {
  carMake: CarMake;
  user: User;
  sharedUsers: SharedSchemeWithUser[];
  originalAuthor?: User;
  originalScheme?: BuilderScheme;
};

export type BuilderSchemeForGetById = BuilderScheme & {
  carMake: CarMakeWithBases;
  layers: BuilderLayer[];
  sharedUsers: SharedScheme[];
  user: User;
  lastModifier: User;
};

export type BuilderSchemeForGetByIdWithBasepaints = {
  scheme: BuilderSchemeForGetById;
  carMake: CarMakeWithBases;
  basePaints: BuilderBase[];
  layers: BuilderLayer[];
  sharedUsers: SharedScheme[];
};

export type BuilderOverlayPayload = Omit<BuilderOverlay, "id">;

export type BuilderLogoPayload = Omit<BuilderLogo, "id">;

export type LeagueSeiresWithLeague = LeagueSeries & Omit<League, "id">;

export type LeagueSeriesPayload = Omit<LeagueSeries, "id">;

export type BuilderLayerWithScheme = BuilderLayer & {
  scheme: BuilderScheme;
};

export type BuilderLayerJSON<
  T extends DefaultLayerData = DefaultLayerData
> = Omit<BuilderLayer, "layer_data"> & {
  layer_data: T;
};

export type BuilderLayerPayload = Omit<BuilderLayer, "id">;

export type BuilderFontPayload = Omit<BuilderFont, "id">;

export type FavoriteSchemePayload = Omit<FavoriteScheme, "id">;

export type FavoriteSchemeWithUser = FavoriteScheme & {
  user: User;
};

export type FavoriteSchemeForGetByID = FavoriteSchemeWithUser & {
  scheme: BuilderScheme & {
    user: User;
    carMake: CarMake;
    sharedUsers: SharedSchemeWithUser[];
  };
};

export type FavoriteSchemeForGetListByUserId = FavoriteScheme & {
  scheme: BuilderScheme & {
    user: User;
    carMake: CarMake;
    sharedUsers: SharedSchemeWithUser[];
  };
};

export type FavoriteLogoPayload = Omit<FavoriteLogo, "id">;
export type FavoriteUploadPayload = Omit<FavoriteUpload, "id">;
export type SharedUploadPayload = Omit<SharedUpload, "id">;
export type SharedUploadByCodePayload = { code: string; userID: number };

export type FavoriteOverlayPayload = Omit<FavoriteOverlay, "id">;

export type CarPayload = Omit<Car, "id">;

export type UserWithoutPassword = Omit<User, "password">;

export type UserWithBlockedList = User & {
  blockedByUsers: BlockedUser[];
  blockedUsers: BlockedUser[];
};

export type LoginResponse = {
  user: UserWithoutPassword;
  token: string;
};

export type CarRaceLeague = {
  racing: boolean;
  series_name: string;
  series_id: number;
  league_name: string;
};

export type CarRaceTeam = {
  racing: boolean;
  team_name: string;
  team_id: number;
};

export type CarRace = {
  primary: boolean;
  primary_other: boolean;
  night: boolean;
  night_other: boolean;
  number: number;
  num: string;
  leagues: CarRaceLeague[];
  teams: CarRaceTeam[];
};

export type GetCarRaceResponse = {
  status: boolean;
  output: CarRace;
};

export type DownloaderStatusResponse = {
  status: string;
  cmd: string;
  iracing: string;
};

export type UserPayload = Omit<UserWithoutPassword, "id">;
