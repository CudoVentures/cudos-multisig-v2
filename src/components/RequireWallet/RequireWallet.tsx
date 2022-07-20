import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { isValidCudosAddress } from 'utils/validation'

const RequireWallet = () => {
  const { selectedWallet } = useSelector((state: RootState) => state.userState)
  const location = useLocation()

  return isValidCudosAddress(selectedWallet?.walletAddress!)? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  )
}

export default RequireWallet
