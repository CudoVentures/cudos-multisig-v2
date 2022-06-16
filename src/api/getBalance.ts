/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { GET_BALANCE_URL } from './endpoints';

const getAcountBalance = async (accountAddress: string): Promise<any> => {
    const url: string = `${GET_BALANCE_URL(accountAddress)}`
    let balances: any[] = []
    return axios.get(url)
                .then(response => {
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