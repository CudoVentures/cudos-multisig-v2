import { useSelector } from 'react-redux'
import { Box, Card, Typography } from '@mui/material'
import { styles } from '../styles'
import KeplrLogo from 'assets/vectors/small-keplr-logo.svg'
import ExclamationMark from 'assets/vectors/yellow-exclamation-mark.svg'
import { RootState } from 'store'
import { CHAIN_NAME } from 'utils/constants'

const StepOne = () => {

  const { address } = useSelector((state: RootState) => state.userState)
  
  return (
    <Box id='step-one-holder' style={styles.stepOneHolder}>
      <Card id='connected-account-info-card' style={styles.accountInfo}>
        <Typography style={{fontWeight: '600', fontSize: '14px', color: '#636D8F'}}>
          CONNECTED ACCOUNT INFO
        </Typography>
        <Card style={styles.connectedAccountInfo}>
          <img style={{ marginRight:'10px'}} src={KeplrLogo} alt="Keprl-logo-icon" />
          <Typography>
            {address}
          </Typography>
        </Card>
        <Card style={styles.connectedAccountInfo}>
          <Typography>
            {CHAIN_NAME}
          </Typography>
        </Card>
      </Card>
      <Card id='connected-account-alert-info-card' style={styles.alertInfo}>
        <img style={{margin:'0 10px 0 20px'}} src={ExclamationMark} alt="Exclamation-mark-icon" />
        <Typography style={{color: '#F5B95E'}}>
          Keep in mind that network fee will be required in order to create the wallet.
        </Typography>
      </Card>
    </Box>
  )
}

export default StepOne
