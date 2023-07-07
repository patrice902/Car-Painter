import { LayerTypes } from "./enum";

export type BuilderUpload = {
  id: number;
  user_id: number;
  scheme_id: string;
  file_name: string;
  legacy_mode: boolean;
};

export type Team = {
  id: number;
  iracing_id: number;
  userid: number;
  team_name: string;
};

export type BuilderBaseDataItem = {
  color: string;
  img: string;
  name: string;
};

export type BuilderBase = {
  id: number;
  base_name: string;
  car_make: number;
  base_description: string;
  base_data: string | BuilderBaseDataItem[];
  base_color: string;
  userid: number;
};

export type BlockedUser = {
  id: number;
  blocker_id: number;
  userid: number;
  date: number;
};

export type CarMake = {
  id: number;
  parent_id: number;
  is_parent: boolean;
  name: string;
  folder_directory: string;
  deleted: boolean;
  old_name: string;
  car_type: string;
  name_short: string;
  iracing_id: number;
  builder_layers: string;
  builder_logo?: string;
  builder_signature?: string;
  filter_keywords: string;
  has_ai: boolean;
  has_spec: boolean;
  template_link: string;
  total_bases: number;
  builder_layers_2048?: string;
};

export type CarPin = {
  id: number;
  car_make: number;
  userid: number;
};

export type SharedScheme = {
  id: number;
  scheme_id: number;
  user_id: number;
  editable: number;
  accepted: number;
};

export type BuilderScheme = {
  id: number;
  user_id: number;
  name: string;
  base_color: string;
  car_make: number;
  date_created: number;
  date_modified: number;
  preview_pic: boolean;
  showroom_id: number;
  base_id: number;
  finished: boolean;
  avail: boolean;
  guide_data?: string;
  last_modified_by?: number;
  legacy_mode?: boolean;
  thumbnail_updated?: number;
  finish: string;
  race_updated?: number;
  hide_spec?: boolean;
  dismiss_race_confirm?: boolean;
  last_font?: number;
  last_number?: number;
};

export type BuilderOverlay = {
  id: number;
  name: string;
  description: string;
  overlay_file: string;
  overlay_thumb: string;
  color: string;
  userid: number;
  stroke_scale: number;
  legacy_mode?: boolean;
};

export type BuilderLogo = {
  id: number;
  name: string;
  source_file: string;
  preview_file: string;
  sponsor_id: number;
  type: string;
  active: boolean;
  enable_color: boolean;
};

export type League = {
  id: number;
  iracing_id: number;
  userid: number;
  league_name: string;
  hide_decal: boolean;
};

export type LeagueSeries = {
  id: number;
  league_id: number;
  series_name: string;
  series_id: number;
  days_since: number;
};

export type BuilderLayer = {
  id: number;
  layer_type: LayerTypes;
  scheme_id: number;
  upload_id: number;
  layer_data: string;
  layer_visible: number;
  confirm: string;
  layer_order: number;
  layer_locked: number;
  time_modified: number;
};

export type BuilderFont = {
  id: number;
  font_name: string;
  font_file: string;
  font_preview: string;
};

export type FavoriteScheme = {
  id: number;
  scheme_id: number;
  user_id: number;
};

export type FavoriteLogo = {
  id: number;
  logo_id: number;
  user_id: number;
};

export type FavoriteOverlay = {
  id: number;
  overlay_id: number;
  user_id: number;
};

export type Car = {
  id: number;
  user_id: number;
  painter_id: number;
  car_make: number;
  car_file: string;
  car_pic: string;
  date_uploaded: number;
  orig_date: number;
  downloads: number;
  compressed: boolean;
  bzip: boolean;
  compare_pic: boolean;
  file_size: number;
  in_downloader: boolean;
  renamed: boolean;
  saved: boolean;
  allow_copy: boolean;
  copy_id: number;
  copy_date: Date;
  family_friendly: boolean;
  last_renew: number;
  in_gallery: boolean;
  series_id: number;
  decal_stamp: boolean;
  decal_layer: boolean;
  spec_layer: boolean;
  night: boolean;
  number: boolean;
  car_number: string;
  builder_id: number;
  builder_update: boolean;
  team_id: number;
  avail: boolean;
  fs_updated: boolean;
  color1: string;
  color2: string;
  color3: string;
  needs_update: boolean;
  pic_updated: boolean;
};

export type User = {
  drivername: string;
  update_name: boolean;
  clubname: string;
  password: string;
  approved: boolean;
  email: string;
  email_paypal: string;
  dpic: string;
  dpic_temp: string;
  setup_dpic: string;
  rb_pic: string;
  id: number;
  regdate: number;
  last_login: number;
  downloader_login: number;
  last_ip: string;
  confirmation: string;
  is_admin: boolean;
  is_online: number;
  list_permissions: string;
  racebrush_rank: string;
  last_page: string;
  account_type: string;
  expire_date: number;
  mb_uploaded: number;
  mb_downloaded: number;
  mb_uploaded_today: number;
  mb_downloaded_today: number;
  cars_uploaded: number;
  cars_downloaded: number;
  cars_downloaded_today: number;
  is_beta: boolean;
  downloader_key: string;
  package_id: number;
  shorten_name: boolean;
  allow_painter: boolean;
  oval_road: string;
  website_url: string;
  user_bio: string;
  allow_pm: boolean;
  accepting_work: boolean;
  twitter_name: string;
  facebook_name: string;
  instagram_name: string;
  twitch_name: string;
  youtube_name: string;
  staff_member: boolean;
  notify_pm: boolean;
  notify_download: boolean;
  notify_use: boolean;
  notify_bookmark: boolean;
  notify_updates: boolean;
  notify_tips: boolean;
  notify_surveys: boolean;
  notify_following: boolean;
  notify_following_upload: boolean;
  notify_request: boolean;
  notify_comments: boolean;
  notify_reply: boolean;
  notify_builder_share: boolean;
  help_showroom: boolean;
  help_resources: boolean;
  help_dashboard: boolean;
  help_builder: boolean;
  dashboard_tour: boolean;
  active: boolean;
  donated: boolean;
  met_staff: boolean;
  helper_badge: boolean;
  beta_badge: boolean;
  pro_user: boolean;
  sub_active: boolean;
  sub_cancel: number;
  pro_ban: boolean;
  pro_expire: number;
  pro_signup: number;
  pro_fails: number;
  pro_next_attempt: number;
  real_driver: boolean;
  subscription_id: string;
  charter_member: boolean;
  builder_schemes: number;
  tour1: boolean;
  tour2: boolean;
  april_fools: boolean;
  data_loss: boolean;
  follow_cnt: number;
  on_beta: boolean;
  showroom_ban: boolean;
  comment_ban: boolean;
  update_notification: boolean;
  showroom_replace: boolean;
  user_notes: string;
  iracing_active: boolean;
  iracing_reg: string;
  report_ban: boolean;
  site_ban: boolean;
  follow_award: number;
  fav_award: number;
};
