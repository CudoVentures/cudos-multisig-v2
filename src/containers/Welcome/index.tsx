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
import { initialState as initialModalState } from 'store/modals'
import { initialState as initialWalletObjectState, updateWalletObjectState } from 'store/walletObject'
import WalletsView from 'components/WalletsView/WalletsView'
import { useNavigate } from 'react-router-dom'
import PlusIcon from 'assets/vectors/plus-icon.svg'

const Welcome = () => {
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { wallets } = useSelector((state: RootState) => state.userState)
  const userHaveWallets = wallets!.length > 0

  const startCreateWalletFlow = () => {
    navigate("/create-wallet")
  }
  const handleAddressBookOpen = () => {
    dispatch(updateSteps({currentStep: ''}))
    dispatch(updateModalState({ openAddressBook: true }))
  }

  const clearState = async () => {
    localStorage.clear()
    sessionStorage.clear()
    dispatch(updateSteps({currentStep: ''}))
    dispatch(updateModalState({ ...initialModalState }))
    dispatch(updateWalletObjectState({ ...initialWalletObjectState }))
  }

  useEffect(() => {
  
    clearState()

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
        <div id='welcome-no-wallet-main-info-dissapear' style={{ alignItems: 'flex-end', display: 'flex', width:'100%',...styles.contentDissapear}}>
          <Box style={{width: '1050px', float:'left', marginBottom: '20px'}}>
            <h2 style={{margin: '0'}}>Welcome to CUDOS MultiSig Wallet!</h2>
            <Typography variant="subtitle2" color="text.secondary">
              CUDOS MultiSig Wallet is a digital wallet that is controlled by one or multiple owners.
            </Typography>
          </Box>
          {userHaveWallets?
          <Button
            variant="contained"
            color="primary"
            onClick={startCreateWalletFlow}
            sx={{marginBottom: '20px', height: '50px', float: 'right'}}
        >
            <img style={styles.btnLogo} src={PlusIcon} alt="Plus Icon" />
            Create New Wallet
          </Button>:null}
        </div>
        
        {/* ////LEFT CARD - HIDDEN////// */}
        <Card id='resizable-card-left' style={styles.leftSteps} children={undefined}></Card>
        
        {/* /////RIGHT CARD - MAIN WELCOME SCREEN///// */}
        <Card id='resizable-card-right' style={styles.Card}>
          <Box style={{ height: '100%'}}>
            <div id='welcome-address-book-dissapear' style={{display: 'flex', justifyContent: "flex-end", width: '100%', ...styles.contentDissapear}}>
              
              {userHaveWallets?
              <div style={{width: '86%', display: 'flex', alignItems: 'center'}}>
              <Typography style={{marginBottom: '3px', marginRight: '10px', float: 'left'}} variant="subtitle2" fontWeight={600} color="text.secondary" letterSpacing={2}>
                  Connected wallets to your account
              </Typography>
                <div style={styles.btn}>
                  {wallets!.length}
                </div>
              </div>:null}

              <Button disableRipple style={styles.addressBookBtn} onClick={() => handleAddressBookOpen()}>
                <img style={styles.addressBookIcon} src={addressBookIcon} alt="Address Book Logo" />
                Address Book
              </Button>
            </div>

            {userHaveWallets?<WalletsView />:<NoWallet />}

          </Box>
        </Card>
      </Box>
    </Box>
  )
}

export default Welcome
