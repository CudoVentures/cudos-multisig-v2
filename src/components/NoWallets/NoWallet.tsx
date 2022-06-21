
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Box, Button, Typography } from '@mui/material'
import { styles } from './styles'
import noWalletLogo from 'assets/vectors/no-wallet-welcome-logo.svg'
import PlusIcon from '../../assets/vectors/plus-icon.svg'

const NoWallet = () => {
  
  return (
    <div id='content-dissapear' style={styles.contentDissapear}>
        <Box>
            <img src={noWalletLogo} alt="Welcome logo" />
        </Box>
        <Box>
            <h2 style={{marginBottom: '2px'}}>Seems like there are no connected accounts yet</h2>
        </Box>
        <Box>
            <Typography style={{marginBottom: '20px'}} variant="subtitle1" color="text.secondary">
                Create your first MultiSig account from the button below.
            </Typography>
        </Box>
        <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => alert("Create account")}
              sx={styles.connectButton}
            >
              <img style={styles.btnLogo} src={PlusIcon} alt="Plus Icon" />
              Create account
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => alert("Add existing account")}
              sx={styles.connectButton}
            >
              Add existing account
            </Button>
        </Box>
    </div>
  )
}

export default NoWallet
