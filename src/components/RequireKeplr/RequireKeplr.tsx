import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

const RequireKeplr = () => {
  const { address } = useSelector((state: RootState) => state.userState)
  const location = useLocation()

  return address ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  )
}

export default RequireKeplr
