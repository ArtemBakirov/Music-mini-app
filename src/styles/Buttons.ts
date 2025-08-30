import tw, { TwStyle } from 'twin.macro';

import {
  BUTTON_DISABLED_FILL,
  BUTTON_DISABLED_OUTLINE,
  BUTTON_PRIMARY_FILL,
  BUTTON_PRIMARY_OUTLINE,
  BUTTON_TERTIARY_OUTLINE,
} from './Colors';

const BASE_STYLE = [
  tw`rounded-medium pointer-events-auto antialiased font-body font-semibold text-sm text-center not-italic 
tracking-wide flex items-center justify-center z-index[1]`,
  tw`focus:outline-none`,
];

export type BaseButtonProps = {
  fullWidth?: boolean;
  outline?: boolean;
  outlineBlue?: boolean;
  disabled?: boolean;
  px?: 4 | 5.5;
  height?: 10 | 8;
};

type InternalBaseButtonProps = BaseButtonProps & {
  filledStyle?: TwStyle;
  outlineStyle?: TwStyle;
};

export const BaseButtonsStyles = ({
  outline,
  fullWidth,
  filledStyle,
  outlineStyle,
  disabled,
  px,
  height = 10,
}: InternalBaseButtonProps): (TwStyle | undefined | boolean)[] => [
  ...BASE_STYLE,
  height === 10 && tw`h-10`,
  height === 8 && tw`h-8`,
  !outline && filledStyle,
  outline && outlineStyle,
  fullWidth && tw`w-full`,
  disabled && tw`cursor-not-allowed`,
  disabled && !outline && BUTTON_DISABLED_FILL,
  disabled && outline && BUTTON_DISABLED_OUTLINE,
  px === 4 && tw`px-4`,
  px === 5.5 && tw`px-5.5`,
];

export type ButtonProps = {
  isPrimary?: boolean;
  isSecondary?: boolean;
  isTertiary?: boolean;
  isSmall?: boolean;
  fullWidth?: boolean;
  outline?: boolean;
  disabled?: boolean;
};

export const ButtonsStyles = ({
  isPrimary,
  outline,
  fullWidth,
  isTertiary,
  disabled,
}: ButtonProps): (TwStyle | undefined | boolean)[] => [
  ...BASE_STYLE,
  tw`h-10`,
  disabled && BUTTON_DISABLED_FILL,
  isPrimary && !outline && BUTTON_PRIMARY_FILL,
  isPrimary && outline && BUTTON_PRIMARY_OUTLINE,
  isTertiary && outline && BUTTON_TERTIARY_OUTLINE,
  fullWidth && tw`w-full`,
];
