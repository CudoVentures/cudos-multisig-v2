import { Box, Button, Typography } from '@mui/material'
import { Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { CancelRoundedIcon, ModalContainer } from './styles'
import FailureIcon from 'assets/vectors/failure.svg'
import { useNavigate } from 'react-router-dom'
import { updateModalState } from 'store/modals'
import { initialState as initialModalState } from 'store/modals'
import { updateWalletCreationSteps } from 'store/steps'
import { updateWalletObjectState } from 'store/walletObject'
import { initialState as initialWalletObject } from 'store/walletObject'
import { DUPLICATED_ADDRESS_TYPE, WALLET_CORRUPTED_PROCESS_TYPE } from 'utils/constants'


const Failure = () => {
      
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const clearState = async () => {
      dispatch(updateWalletCreationSteps({currentStep: ''}))
      dispatch(updateWalletObjectState({ ...initialWalletObject }))
    }

    const goHome = () => {
        clearState()
        navigate("/welcome")
    }

    const { 
        failure, 
        title, 
        message,
        msgType, 
    } = useSelector((state: RootState) => state.modalState)

    const handleModalClose = () => {
      switch(msgType) {
        case WALLET_CORRUPTED_PROCESS_TYPE:
          dispatch(updateModalState({ ...initialModalState }))
          goHome()
          break

        case DUPLICATED_ADDRESS_TYPE:
          dispatch(updateModalState({ ...initialModalState }))
          dispatch(updateModalState({ openAddressBook: true }))
          localStorage.removeItem('addressBookAccountName')
          localStorage.removeItem('addressBookAccountAddress')
          break
  
        default:
          dispatch(updateModalState({ ...initialModalState }))
          break
      }
    }
      
    const closeModal = (ev: any, reason: string) => {
        if (reason !== 'backdropClick') {
          handleModalClose()
        }
    }

    return (
        <MuiDialog
          open={failure!}
          onClose={closeModal}
          PaperProps={{
            sx: {
              background: 'transparent',
              boxShadow: 'none',
              position: 'fixed',
              overflow: 'hidden',
              borderRadius: '25px'
            }
          }}
        >
          <ModalContainer sx={{ padding: '4rem' }}>
          <img src={FailureIcon} alt="failure-icon" />
          <CancelRoundedIcon onClick={handleModalClose} />
          <Box
            width='400px'
            minHeight= '200px'
            display="block"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            gap={1}
          >
            <Typography style={{margin: '20px 0 20px 0'}} variant="h4" fontWeight={900} letterSpacing={2}>
              {title}
            </Typography>
            {message?
              <Typography variant="subtitle1" color="text.secondary">
              {message}
              </Typography>
            :null}
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={() => ({
              width: '50%',
              fontWeight: 700
            })}
            onClick={handleModalClose}
          >
            Close
          </Button>
        </ModalContainer>
        </MuiDialog>
      )
}

export default Failure
