import { Box, Button, Typography } from '@mui/material'
import InfoIcon from 'assets/vectors/info-icon.svg'
import KeplrLogo from 'assets/vectors/keplr-logo.svg'
import CosmostationLogo from 'assets/vectors/cosmostation-logo.svg'
import BackgroundImage from 'assets/vectors/background.svg'
import { styles } from './styles'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateModalState } from 'store/modals'
import Dialog from 'components/Dialog'
import { updateUser } from 'store/user'
import { RootState } from 'store'
import Header from 'components/Layout/Header'
import { connectUser } from 'utils/config'

import { 
  COSMOSTATION_LEDGER, 
  DEFAULT_LOGIN_FAILURE_MSG, 
  KEPLR_LEDGER, 
  LOGIN_FAIL_TITLE 
} from 'utils/constants'

const ConnectWallet = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { address } = useSelector((state: RootState) => state.userState)

  const connect = async (ledgerType: string) => {

    try {
      dispatch(updateModalState({
        loading: true,
        loadingType: true
      }))
      const connectedUser = await connectUser(ledgerType)
      dispatch(updateUser(connectedUser))
      navigate('/welcome')

    } catch (error: any) {
      dispatch(updateModalState({
        failure: true,
        title: LOGIN_FAIL_TITLE,
        message: DEFAULT_LOGIN_FAILURE_MSG
      }))
      console.debug(error.message)

    } finally {
      dispatch(updateModalState({
        loading: false,
        loadingType: false
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
        backgroundImage: 'url(' + BackgroundImage + ')'
      }}>
        <Dialog />
        <Header />
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

            <Box gap={2} style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-evenly' }}>

              <Button
                disabled={!window.keplr}
                variant="contained"
                color="primary"
                onClick={() => connect(KEPLR_LEDGER)}
                sx={styles.connectButton}
              >
                <img
                  style={styles.keplrLogo}
                  src={KeplrLogo}
                  alt={`${KEPLR_LEDGER} logo`}
                />
                {`Connect ${KEPLR_LEDGER.toUpperCase()}`}
              </Button>
              <Button
                //@ts-ignore
                disabled={!window.cosmostation}
                variant="contained"
                color="primary"
                onClick={() => connect(COSMOSTATION_LEDGER)}
                sx={styles.connectButton}
              >
                <img
                  style={styles.cosmostationLogo}
                  src={CosmostationLogo}
                  alt={`${COSMOSTATION_LEDGER} logo`}
                />
                {`Connect ${COSMOSTATION_LEDGER.toUpperCase()}`}
              </Button>
            </Box>
            <Box sx={styles.pluginWarning} color="primary.main">
              <img style={styles.infoIcon} src={InfoIcon} alt="Info" />
              Make sure you have Keplr and/or Cosmostation plugins installed.
            </Box>
          </Box>
        </Box>
      </Box>
    )
}

export default ConnectWallet
