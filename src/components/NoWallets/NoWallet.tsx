
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Box, Button, Typography } from '@mui/material'
import { styles } from './styles'
import noWalletLogo from 'assets/vectors/no-wallet-welcome-logo.svg'
import PlusIcon from 'assets/vectors/plus-icon.svg'

const NoWallet = () => {
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const renderStepOne = async () => {
    try {
      // REMOVING CONTENT FROM WELCOME CARD
      document.getElementById("entire-welcome-page-dissapear")!.style.opacity = '0' 
      await new Promise(resolve => setTimeout(resolve, 500))
      navigate('/create-wallet')
  
    } catch (error: any) {
      console.debug(error.message)
    }
  }
  
  return (
    <div id='welcome-no-wallet-top-info-dissapear' style={styles.contentDissapear}>
        <Box>
            <img src={noWalletLogo} alt="Welcome logo" />
        </Box>
        <Box>
            <h2 style={{marginBottom: '2px'}}>Seems like there are no connected wallets yet</h2>
        </Box>
        <Box>
            <Typography style={{marginBottom: '20px'}} variant="subtitle1" color="text.secondary">
                Create your first MultiSig wallet from the button below.
            </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => renderStepOne()}
            sx={styles.connectButton}
          >
            <img style={styles.btnLogo} src={PlusIcon} alt="Plus Icon" />
            Create wallet
          </Button>
        </Box>
    </div>
  )
}

export default NoWallet
