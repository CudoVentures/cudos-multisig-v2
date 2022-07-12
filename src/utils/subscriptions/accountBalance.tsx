import { Tooltip } from '@mui/material'
import { RootState } from '../../store'
import { useDispatch, useSelector } from 'react-redux'
import { 
  separateFractions, 
  separateDecimals, 
  cutFractions
} from '../regexFormatting'
import { useEffect } from 'react'
import { updateUser } from '../../store/user'
import { checkForAdminToken, getAccountBalances, getNativeBalance } from 'utils/helpers'

const AccountBalance = (): JSX.Element => {

  const { address, nativeBalance, addressBook, lastLoggedAddress } = useSelector((state: RootState) => state.userState)
  const fullBalance = separateDecimals(separateFractions(nativeBalance?nativeBalance.toString():'0'))
  const displayBalance = cutFractions(fullBalance)
  const dispatch = useDispatch()
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentBalances = await getAccountBalances(address!)
        const admin = checkForAdminToken(currentBalances)
        const userBalance = getNativeBalance(currentBalances)

        dispatch(updateUser({ 
          address: address,
          lastLoggedAddress, 
          balances: currentBalances, 
          nativeBalance: userBalance, 
          isAdmin: admin,
          addressBook
        }))

      } catch (error: any) {
        console.debug(error.message)
      }
    }
    const timer = setInterval(async () => {
      await fetchData()
    }, 15000)

    return () => {
      clearInterval(timer)
    }
  }, [nativeBalance, addressBook])

  return (
    <Tooltip title={fullBalance + ' CUDOS'}>
    <div>
      <span style={{margin: '0 5px 0 10px'}}>{displayBalance}</span>
      <span>CUDOS</span>
    </div>
    </Tooltip>
  )
}

export default AccountBalance
