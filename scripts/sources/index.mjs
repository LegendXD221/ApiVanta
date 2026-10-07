import * as apisGuru from "./apis-guru.mjs";
import * as publicApis from "./public-apis.mjs";
import * as publicLists from "./public-api-lists.mjs";
import * as communityDirectory from "./community-directory.mjs";
import * as featuredFree from "./featured-free.mjs";

export const sources={
  "apis-guru":apisGuru,
  "public-apis":publicApis,
  "public-api-lists":publicLists,
  "community-public-apis":communityDirectory,
  "featured-free":featuredFree
};
