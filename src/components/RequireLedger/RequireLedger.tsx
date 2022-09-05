import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

const RequireLedger = () => {
  const { address, connectedLedger } = useSelector((state: RootState) => state.userState)
  const location = useLocation()

  return address && connectedLedger ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  )
}

export default RequireLedger
