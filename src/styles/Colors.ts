import tw, { css, theme } from 'twin.macro';

export const COMMON_BG = tw`bg-common dark:bg-common_dark transition-colors`;

export const CARD_BG = tw`bg-card-primary dark:bg-card_dark-primary transition-colors`;
export const FINGY_FLOWERS_BG = tw`bg-fringy_flowers dark:bg-deep_fir transition-colors`;
export const FRENCH_PASS_BG = tw`bg-french_pass dark:bg-search_section_dark-common transition-colors`;
export const OYSTER_BAY_BG = tw`bg-oyster_bay dark:bg-dark_slate_grey transition-colors`;
export const CARD_SECONDARY_BG = tw`bg-card-secondary dark:bg-card_dark-secondary transition-colors`;
export const CHARGE_POINT_BG = tw`bg-chargestation-tariff dark:bg-chargestation-tariff_dark transition-colors`;
export const ACTIVE_PLUGS_PRIMARY = theme('colors.chargestation.activePlugsPrimary');
export const ACTIVE_PLUGS_SECONDARY = theme('colors.chargestation.activePlugsSecondary');
export const INACTIVE_PLUGS_PRIMARY = theme('colors.chargestation.inactivePlugsPrimary');
export const INACTIVE_PLUGS_SECONDARY = theme('colors.chargestation.inactivePlugsSecondary');

export const ICON_PRIMARY_BG = tw`bg-icon-primary dark:bg-icon_dark-primary transition-colors`;
export const ICON_SECONDARY_BG = tw`bg-icon-secondary dark:bg-icon_dark-secondary transition-colors`;
export const ICON_PRIMARY_TEXT = tw`text-primary dark:text-primary_dark transition-colors`;
export const ICON_PRIMARY_FILL_TEXT = tw`text-icon-primary dark:text-icon_dark-primary transition-colors`;
export const ICON_SECONDARY_TEXT = tw`text-secondary dark:text-secondary_dark transition-colors`;
export const ICON_TERTIARY_TEXT = tw`text-tertiary dark:text-tertiary_dark transition-colors`;
export const ICON_TERTIARY_CLUSTER_TEXT = tw`text-tertiary dark:text-tertiary transition-colors`;
export const ICON_BLITZ_SELECTED = tw`text-allports`;
export const ICON_BLITZ = tw`text-pattens_blue`;
export const ICON_WHITE = tw`text-white`;

export const BUTTON_PRIMARY_FILL = tw`bg-primary-common dark:bg-primary_dark-common text-white transition-colors`;
export const BUTTON_PRIMARY_OUTLINE = tw`border-primary-common dark:border-primary_dark-common text-button-common dark:text-button_dark-common border transition-colors`;
export const BUTTON_TERTIARY_FILL = tw`bg-tertiary dark:bg-tertiary_dark text-white transition-colors`;
export const BUTTON_TERTIARY_OUTLINE = tw`text-tertiary dark:text-tertiary_dark transition-colors`;
export const BUTTON_RED_FILL = tw`bg-signal-red dark:bg-signal_dark-red text-white transition-colors`;
export const BUTTON_RED_OUTLINE = tw`border-signal-red dark:border-signal_dark-red text-signal-red dark:text-signal_dark-red border transition-colors`;
export const BUTTON_PURPLE_OUTLINE = tw`border-chargestation-normal text-chargestation-normal border dark:text-chargestation-normal transition-colors`;
export const TOGGLE_CONTENT_INACTIVE = tw`bg-primary-gray dark:bg-primary_dark-gray transition-colors`;
export const TOGGLE_CONTAINER_INACTIVE = tw`bg-tertiary dark:bg-tertiary_dark transition-colors`;
export const TOGGLE_CONTAINER_ACTIVE = tw`bg-fringy_flower`;
export const TOGGLE_CONTENT_ACTIVE = tw`bg-signal-green dark:bg-signal-green transition-colors`;
export const BUTTON_GREEN_FILL = tw`bg-signal-green text-white transition-colors`;
export const BUTTON_GREEN_OUTLINE = tw`border-signal-green text-signal-green border dark:text-signal-green transition-colors`;
export const BUTTON_ORANGE_FILL = tw`bg-signal-orange text-white transition-colors`;
export const BUTTON_DEEP_MAGENTA_FILL = tw`bg-chargestation-selected text-white transition-colors`;
export const BUTTON_DEEP_MAGENTA_OUTLINE = tw`border-chargestation-selected dark:border-chargestation-selected text-chargestation-selected dark:text-chargestation-selected border transition-colors`;
export const BUTTON_DEEP_MAGENTA_OUTLINE_BOTTOM = tw`border-chargestation-selected dark:border-chargestation-selected text-chargestation-selected dark:text-chargestation-selected border-b-2 transition-colors`;
export const BUTTON_DISABLED_FILL = tw`bg-primary-gray dark:bg-primary_dark-gray text-white transition-colors`;
export const BUTTON_DISABLED_OUTLINE = tw`border-primary-gray dark:border-primary_dark-gray text-gray dark:text-gray_dark border transition-colors`;

export const DROP_OVERLAY = tw`opacity-25 bg-overlay dark:opacity-75 dark:bg-overlay_dark transition-colors`;

export const ERROR_TEXT = tw`text-signal-red dark:text-signal_dark-red transition-colors`;

export const LINK_PRIMARY_TEXT = tw`text-button-common dark:text-button_dark-common transition-colors`;
export const LINK_SECONDARY_TEXT = tw`text-secondary dark:text-secondary_dark transition-colors`;

export const INPUT_BG = tw`bg-search_input dark:bg-search_input_dark transition-colors`;

export const INPUT = [
  INPUT_BG,
  tw`text-primary dark:text-primary_dark placeholder-tertiary dark:placeholder-tertiary_dark`,
  css`
    caret-color: ${theme('colors.signal.green')};
  `,
];

export const FOOTER_BG = tw`bg-footer dark:bg-footer_dark transition-colors`;

export const DELIMITER = tw`border-primary-gray dark:border-primary_dark-gray border-opacity-60 transition-colors`;
export const DIVIDER = tw`border-primary-gray dark:border-primary_dark-gray transition-colors`;

export const CHECKBOX = tw`border-current checked:text-signal-green dark:checked:text-signal-green 
bg-transparent 
text-tertiary dark:text-tertiary_dark transition-colors`;

export const SIGNAL_GREEN = tw`text-signal-green dark:text-signal-green transition-colors`;
export const SIGNAL_GREEN_THEME = theme('colors.signal.green');
export const SIGNAL_ORANGE = tw`text-signal-orange dark:text-signal-orange transition-colors`;
export const BORDER_ORANGE = tw`border-signal-orange dark:border-signal-orange border transition-colors`;
export const SIGNAL_RED = ERROR_TEXT;

export const SIGNAL_ORANGE_THEME = theme('colors.signal.orange');

export const TYPO_PRIMARY = tw`text-primary dark:text-primary_dark transition-colors`;
export const TYPO_SECONDARY = tw`text-secondary dark:text-secondary_dark transition-colors`;
export const TYPO_TERTIARY = tw`text-tertiary dark:text-tertiary_dark transition-colors`;
export const TYPO_DISABLED = tw`text-gray dark:text-gray_dark transition-colors`;
export const TYPO_SUMMER_SKY = tw`text-summer_sky dark:text-summer_sky transition-colors`;

export const SECTION_COMMON_TEXT = tw`text-section-common dark:text-section_dark-common transition-colors`;

export const CHARGESTATION_FAST_TEXT = tw`text-chargestation-fast  dark:text-chargestation-fast transition-colors`;
export const CHARGESTATION_FAST_SECONDARY_TEXT = tw`text-chargestation-fast_second  dark:text-chargestation-fast_second transition-colors`;
export const CHARGESTATION_NORMAL_TEXT = tw`text-chargestation-normal  dark:text-chargestation-normal  transition-colors`;
export const CHARGESTATION_SLOW_TEXT = tw`text-chargestation-slow  dark:text-chargestation-slow transition-colors`;
export const CHARGESTATION_SELECTED_TEXT = tw`text-chargestation-selected  dark:text-chargestation-selected transition-colors`;
export const CHARGESTATION_NORMAL_BG = tw`bg-chargestation-normal dark:bg-chargestation-normal  transition-colors`;

export const CHARGESTATION_PHOTO_MISSING = tw`bg-primary-gray dark:bg-primary_dark-gray transition-colors`;

export const ICON_FILL_CURRENT = tw`fill-current`;
export const ICON_LILAC_BUSH_FILL = tw`text-chargestation-normal dark:text-chargestation-normal  transition-colors`;
export const ICON_SUMMER_SKY_FILL = tw`text-summer_sky dark:text-summer_sky  transition-colors`;
export const ICON_IRIS_BLUE_FILL = tw`text-chargestation-selected dark:text-chargestation-selected  transition-colors`;

export const BORDER_IRIS_BLUE = tw`border-chargestation-selected dark:border-chargestation-selected border transition-colors`;
export const BORDER_SUMMER_SKY = tw`border-summer_sky dark:border-summer_sky border transition-colors`;

export const BACKGROUND_DISABLED = tw`bg-primary-gray dark:bg-primary_dark-gray transition-colors`;
export const BACKGROUND_SUMMER_SKY = tw`bg-summer_sky dark:bg-summer_sky  transition-colors`;
export const BACKGROUND_PATTENS_BLUE_TWO = tw`bg-pattens_blue_two dark:bg-blue_whale transition-colors`;

export const BACKGROUND_WIDGET = tw`text-light_cyan dark:text-dark_slate_grey transition-colors`;

export const BATTERY_CHARGING = tw`bg-morning_glory dark:bg-morning_glory`;

export const SCROLLBARS = theme('colors.primary.gray');
export const SCROLLBARS_HOVER = theme('colors.slate_grey');
export const BORDER_WHITE = tw`border-white`;
export const OUTLINE_PURPLE = css`
  outline: 1px solid ${theme('colors.chargestation.normal')};
`;
