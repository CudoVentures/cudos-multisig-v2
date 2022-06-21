import { Box, Button, Typography } from '@mui/material'
import InfoIcon from 'assets/vectors/info-icon.svg'
import KeplrLogo from 'assets/vectors/keplr-logo.svg'
import BackgroundImage from 'assets/vectors/background.svg'

import { styles } from './styles'
import { checkForAdminToken, getAccountBalances, getNativeBalance } from 'utils/helpers'
import { ConnectLedger } from 'ledgers/KeplrLedger'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateModalState } from 'store/modals'
import Dialog from 'components/Dialog'
import { updateUser } from 'store/user'
import { RootState } from 'store'
import { NATIVE_TOKEN_DENOM } from 'utils/constants'
import BigNumber from 'bignumber.js'

const ConnectWallet = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { address } = useSelector((state: RootState) => state.userState)

  const connect = async () => {
    try {
      const { address } = await ConnectLedger()
      const balances = await getAccountBalances(address)
      const isAdmin = checkForAdminToken(balances)
      const nativeBalance = getNativeBalance(balances)
      
      dispatch(updateUser({ 
        address, 
        balances,
        isAdmin,
        nativeBalance }))
      navigate('welcome')

    } catch (error: any) {
      dispatch(updateModalState({
        loading: false,
        success: false,
        failure: true, 
        title: 'Login Failed ', 
        message: error.message
      }))
    }
  }

  return address ?
  (<Navigate to="/welcome" state={{ from: location }} replace />)
  : 
  (
    // Inline styles required to fix building issues established with the background img while using imported styles.
    <Box style={{
        height: '100vh', 
        width: '100vw', 
        backgroundRepeat: 'no-repeat', 
        backgroundSize: 'cover', 
        backgroundImage: 'url(' + BackgroundImage + ')'}}>
      <Dialog />
      <Box>
        <Box sx={styles.connectContainer}>
          <Box>
            <h1>Welcome to CUDOS MultiSig Wallet!</h1>
          </Box>
          <Box sx={styles.subHeaderContainer}>
            <Typography variant="subtitle1" color="text.secondary">
                CUDOS MultiSig Wallet is a digital wallet that is controlled by one or multiple owners
                <br /> 
                In order to continue you need to connect your Keplr Wallet.
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => connect()}
              sx={styles.connectButton}
            >
              <img style={styles.keplrLogo} src={KeplrLogo} alt="Keplr Logo" />
              Connect Keplr wallet
            </Button>
          </Box>
          <Box sx={styles.pluginWarning} color="primary.main">
            <img style={styles.infoIcon} src={InfoIcon} alt="Info" />
            Make sure you have Keplr plugin installed.
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ConnectWallet
