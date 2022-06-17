/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { GET_BALANCE_URL } from './endpoints';

const getAcountBalance = async (walletAccount: string) => {
    const url: string = `${GET_BALANCE_URL(walletAccount)}`
    return axios.get(url)
                .then(response => {
                    let balances: any[] = []
                    if (response.status === 200 && response.data.result) {
                        response.data.result.map((type: { denom: any; amount: any; }) => {
                            balances.push({
                                denom: type.denom,
                                amount: type.amount
                            })
                        })
                    }
                    return { balances }
                })
}
export default getAcountBalance