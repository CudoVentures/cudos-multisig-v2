import { API_ADDRESS, EXPLORER_PUBLIC_ADDRESS } from "../utils/constants";

/* eslint-disable import/prefer-default-export */
export const GET_BALANCE_URL = (accountAddress: string) =>
  `${API_ADDRESS}/bank/balances/${accountAddress}`

export const EXPLORER_ADDRESS_DETAILS = (accountAddress: string) =>
  `${EXPLORER_PUBLIC_ADDRESS}/account//${accountAddress}`
