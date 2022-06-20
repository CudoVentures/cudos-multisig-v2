import { Box, Button, Typography } from '@mui/material'
import InfoIcon from 'assets/vectors/info-icon.svg'
import KeplrLogo from 'assets/vectors/keplr-logo.svg'
import BackgroundImage from 'assets/vectors/background.svg'

import { styles } from './styles'
import { getAccountBalances } from 'utils/helpers'
import { ConnectLedger } from 'ledgers/KeplrLedger'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateModalState } from 'store/modals'
import Dialog from 'components/Dialog'

const ConnectWallet = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const connect = async () => {
    try {
      const { address } = await ConnectLedger()
      const balances = await getAccountBalances(address)
      // navigate('welcome') // TO BE IMPLEMENTED

    } catch (error: any) {
      dispatch(updateModalState({
        failure: true, 
        title: 'Login Failed ', 
        message: error.message
      }))
    }
  }

  return (
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
