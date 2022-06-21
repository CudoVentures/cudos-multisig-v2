//@ts-nocheck
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Box, Typography, Button } from '@mui/material'
import Card from 'components/Card/Card'
import { styles } from './styles'
import NoWallet from 'components/NoWallets/NoWallet'
import addressBookIcon from 'assets/vectors/address-book-icon.svg'

const Welcome = () => {
  
  const { wallets } = useSelector((state: RootState) => state.userState)
  const userHaveWallets = wallets.length > 0
  
  const renderStepOne = async () => {
    try {
      // REMOVING CONTENT FROM RIGHT CARD
      document.getElementById("content-dissapear").style.opacity = '0'

      // RESIZING RIGHT CARD
      document.getElementById("resizable-card-right").style.justifyContent = 'center'
      document.getElementById("resizable-card-right").style.flexDirection = 'column'
      document.getElementById("resizable-card-right").style.display = 'flex'
      document.getElementById("resizable-card-right").style.textAlign = 'center'
      document.getElementById("resizable-card-right").style.width = '1030px'
      document.getElementById("resizable-card-right").style.height = '600px'
      
      // RESIZING LEFT CARD
      document.getElementById("resizable-card-left").style.display = 'flex'
      document.getElementById("resizable-card-left").style.justifyContent = 'center'
      document.getElementById("resizable-card-left").style.width = '240px'
      document.getElementById("resizable-card-left").style.textAlign = 'center'
      document.getElementById("resizable-card-left").style.height = '600px'
      document.getElementById("resizable-card-left").style.pading = '0 40px'
      document.getElementById("resizable-card-left").style.marginRight = '40px'

      await new Promise(resolve => setTimeout(resolve, 1000))
      // navigate('/') TO DO

    } catch (error: any) {
      console.debug(error.message)
    }
  }

  return (
    <Box style={styles.holder}>
      <div>
        <Box style={{margin: '10px'}}>
          <h2 style={{margin: '0'}}>Welcome to CUDOS MultiSig Wallet!</h2>
          <Typography variant="subtitle2" color="text.secondary">
            CUDOS MultiSig Wallet is a digital wallet that is controlled by one or multiple owners.
          </Typography>
        </Box>
        
        {/* ////////// */}

        <Card id='resizable-card-left' style={styles.leftSteps} children={undefined}></Card>
        
        {/* ////////// */}

        <Card id='resizable-card-right' style={styles.Card}>
          {userHaveWallets?
            null
            ////// TO BE IMPLEMENTED ///////
          :
          <Box style={{display: 'grid', height: '100%'}}>
            <div style={{display: 'flex', justifyContent: "flex-end", width: '100%'}}>
              <Button disableRipple style={styles.addressBookBtn} onClick={() => alert("Address book")}>
                <img style={styles.addressBookIcon} src={addressBookIcon} alt="Address Book Logo" />
                Address Book
              </Button>
            </div>
            <NoWallet />
          </Box>

          }
        </Card>
      </div> 
    </Box>
  )
}

export default Welcome
