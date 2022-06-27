import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Box, Typography, Button } from '@mui/material'
import Card from 'components/Card/Card'
import { styles } from './styles'
import NoWallet from 'components/NoWallets/NoWallet'
import addressBookIcon from 'assets/vectors/small-address-book-icon.svg'
import { updateModalState } from 'store/modals'
import Dialog from 'components/Dialog'
import { useEffect } from 'react'
import { updateSteps } from 'store/steps'

const Welcome = () => {
  
  const dispatch = useDispatch()
  const { wallets } = useSelector((state: RootState) => state.userState)
  const userHaveWallets = wallets!.length > 0

  const handleAddressBookOpen = () => {
    dispatch(updateSteps({currentStep: ''}))
    dispatch(updateModalState({ openAddressBook: true }))
  }

  useEffect(() => {
    setTimeout(() => 
        document.getElementById("entire-welcome-page-dissapear")!.style.opacity = '1', 
        200
    )
    setTimeout(() => 
        document.getElementById("welcome-no-wallet-main-info-dissapear")!.style.opacity = '1', 
        200
    )
    setTimeout(() => 
      document.getElementById("welcome-address-book-dissapear")!.style.opacity = '1', 
      200
    )
  }, [])

  return (
    <Box id="entire-welcome-page-dissapear" style={{...styles.welcomeHolder, ...styles.contentDissapear}}>
      <Box style={styles.contentHolder}>
      <Dialog />
        {/* ////TOP WELCOME INFO///// */}
        <div id='welcome-no-wallet-main-info-dissapear' style={{width:'100%',...styles.contentDissapear}}>
          <Box style={{float:'left', marginBottom: '20px'}}>
            <h2 style={{margin: '0'}}>Welcome to CUDOS MultiSig Wallet!</h2>
            <Typography variant="subtitle2" color="text.secondary">
              CUDOS MultiSig Wallet is a digital wallet that is controlled by one or multiple owners.
            </Typography>
          </Box>
        </div>
        
        {/* ////LEFT CARD - HIDDEN////// */}
        <Card id='resizable-card-left' style={styles.leftSteps} children={undefined}></Card>
        
        {/* /////RIGHT CARD - MAIN WELCOME SCREEN///// */}
        <Card id='resizable-card-right' style={styles.Card}>
          {userHaveWallets?
            null
            ////// TO BE IMPLEMENTED ///////
          :
          <Box style={{display: 'grid', height: '100%'}}>
            <div id='welcome-address-book-dissapear' style={{display: 'flex', justifyContent: "flex-end", width: '100%', ...styles.contentDissapear}}>
              <Button disableRipple style={styles.addressBookBtn} onClick={() => handleAddressBookOpen()}>
                <img style={styles.addressBookIcon} src={addressBookIcon} alt="Address Book Logo" />
                Address Book
              </Button>
            </div>
            <NoWallet />
          </Box>
          }
        </Card>
      </Box>
    </Box>
  )
}

export default Welcome