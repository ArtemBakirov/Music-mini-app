import { css, Global } from '@emotion/react';

import { SCROLLBARS } from './Colors';

const globalStyles = css`
  & * {
    scrollbar-width: auto;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: none;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${SCROLLBARS};
    border-radius: 6px;
  }

  @media (prefers-color-scheme: dark) {
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    textarea:-webkit-autofill,
    textarea:-webkit-autofill:hover,
    textarea:-webkit-autofill:focus,
    select:-webkit-autofill,
    select:-webkit-autofill:hover,
    select:-webkit-autofill:focus {
      border: 1px solid transparent;
      -webkit-box-shadow: 0 0 0px 1000px #2e3945 inset;
      transition: background-color 5000s ease-in-out 0s;
      -webkit-text-fill-color: #dddddd;
    }
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    border: 1px solid transparent;
    -webkit-box-shadow: 0 0 0px 1000px transparent inset;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const GlobalStyles = (): React.ReactElement => <Global styles={globalStyles} />;

export default GlobalStyles;
