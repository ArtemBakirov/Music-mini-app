import tw from "twin.macro";

export const CONTAINER_FULL = tw`h-full w-full`;
export const SCREEN_FULL = tw`h-screen w-screen overflow-hidden`;
export const HIDDEN = tw`hidden`;
export const MAIN_CARDS = tw`z-10 w-full min-height[27rem] max-height[37.5rem]! h-full`;
export const CHARGESTATION_OVERVIEW_CARDS = tw`w-full min-height[27rem] h-auto`;
export const ADDRESS_INFO_CARDS = tw`w-full min-height[12.5rem] max-height[23.4375rem]!`;
export const COLUMN_BETWEEN = tw`w-full h-full flex flex-col justify-between items-center p-4`;
export const COLUMN_AROUND = tw`flex flex-col justify-around items-center h-full w-full`;
export const REGISTRATION_CARDS_HEIGHT = tw`height[37.3rem]`;

export const Z_ZERO_STYLE = { zIndex: 0 };
export const Z_INDEX_MAIN_CONTENT = tw`z-index[12]`;
export const Z_INDEX_FILTER_POPUP = tw`z-index[14]`;
export const Z_INDEX_SELECT_CHARGESTATION = { zIndex: 9 };
export const Z_INDEX_ADDRESS_SEARCH_MARKER = { zIndex: 8 };
export const Z_INDEX_VEHICLE_LOCATION_MARKER = { zIndex: 7 };
export const Z_USER_LOCATION_MARKER_STYLE = { zIndex: 6 };
export const Z_INDEX_NORMAL_CHARGESTATION = { zIndex: 5 };
export const Z_INDEX_CLUSTER_MARKER = { zIndex: 4 };
export const MAP_MARKER_STYLES = tw`pointer-events-auto select-none cursor-pointer`;

export const SEARCH_RESULT_WIDTH = 2.318;
export const SEARCH_RESULT_HEIGHT = 3;
export const SEARCH_RESULT_SIZE = tw`width[2.318rem] height[3rem]`;

export const CARD_SEARCH_RESULT_HEIGHT = 31;
export const CARD_LIST_RESULT_HEIGHT = 29.1;
