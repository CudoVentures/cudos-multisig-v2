import { Navigate, useLocation, Outlet, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { updatedSelectedWallet } from 'store/user'

const RequireValidWallet = () => {
    const params = useParams()
    const location = useLocation()
    const wallets = useSelector((state: RootState) => state.userState.wallets)
    const dispatch = useDispatch()

    let actualWalletAddress: boolean = false
    Object.entries(wallets!).forEach(([idx, wallet]) => {
        if (wallet.walletAddress === params.walletAddress) {
            actualWalletAddress = true
            dispatch(updatedSelectedWallet(wallet))
            return
        }  
    })

  return actualWalletAddress ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  )
}

export default RequireValidWallet
