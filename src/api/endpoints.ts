/* eslint-disable import/prefer-default-export */
import { API_ADDRESS } from "../utils/constants";

export const GET_BALANCE_URL = (accountAddress: string) =>
  `${API_ADDRESS}/bank/balances/${accountAddress}`
