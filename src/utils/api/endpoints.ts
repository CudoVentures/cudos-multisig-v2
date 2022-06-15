import { API_ADDRESS } from "../constants";

/* eslint-disable import/prefer-default-export */
export const GET_BALANCE_URL = (accountAddress: string) =>
  `${API_ADDRESS}/bank/balances/${accountAddress}`