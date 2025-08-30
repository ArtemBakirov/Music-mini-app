// src/views/Views.styles.tsx
import tw, { styled } from "twin.macro";
import {
  FOOTER_BG,
  Z_INDEX_MAIN_CONTENT,
  Z_INDEX_SELECT_CHARGESTATION,
} from "../styles";

// If you have a Common container, keep the composition pattern:
export const FirstContentColumn = styled.div(() => [tw`h-full`]);

export const SecondContentColumn = styled.div(() => [
  tw`h-full absolute top-0 bottom-0 py-8 big:static big:py-0`,
  Z_INDEX_MAIN_CONTENT,
]);

export const ContentColumnContainer = styled.div(() => [
  tw`flex justify-between overflow-hidden items-stretch flex-nowrap`,
]);

export const FirstContainer = styled.div(() => [
  tw`flex flex-col gap-5 w-full flex-1 h-full`,
]);

export const SecondContainer = styled.div(() => [
  tw`w-full contents`,
  Z_INDEX_SELECT_CHARGESTATION,
]);

export const FooterWrapper = styled.div(() => [
  tw`h-6 w-full shadow`,
  FOOTER_BG,
]);
