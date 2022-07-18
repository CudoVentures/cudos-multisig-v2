import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

const RequireWalletFunds = () => {
  const { selectedWallet } = useSelector((state: RootState) => state.userState)
  const location = useLocation()

  return selectedWallet!?.walletBalances!?.length > 0? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  )
}

export default RequireWalletFunds
