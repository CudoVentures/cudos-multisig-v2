import { Box } from '@mui/material'
import { useLocation } from 'react-router-dom'
import LogoHeader from 'assets/vectors/logo-header.svg'
import UserInfo from './Userinfo'
import NetworkInfo from './Networkinfo'

const Header = () => {
  const location = useLocation()

  return (
    <Box sx={location.pathname === '/' ? { padding: '1.45rem 1rem 1rem 1rem' } : { padding: '1rem 1rem 1rem 1rem' }}>
      <Box sx={{ marginBottom: '10px', alignItems: 'center', display: 'flex', flex: '1' }}>
        <a style={{ pointerEvents: location.pathname === '/' || location.pathname === '/welcome' ? 'none' : 'auto' }} href={window.location.origin}>
          <img src={LogoHeader} alt="logo" />
        </a>
        {location.pathname === '/' ? null : (
          <Box
            sx={{
              paddingLeft: '1rem',
              display: 'flex',
              justifyContent: 'flex-end',
              flex: '1'
            }}
          >
            <NetworkInfo />
            <UserInfo />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Header
