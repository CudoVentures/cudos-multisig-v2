import { Box, Button, Typography } from '@mui/material'
import { Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { CancelRoundedIcon, ModalContainer, styles } from './styles'
import FailureIcon from 'assets/vectors/failure.svg'
import { useNavigate } from 'react-router-dom'
import { updateModalState } from 'store/modals'
import { initialState as initialModalState } from 'store/modals'
import { initialState as initialWalletCreationState, updateWalletCreationState } from 'store/walletCreation'
import { updateWalletObjectState } from 'store/walletObject'
import { initialState as initialWalletObject } from 'store/walletObject'
import { initialState as initialSendFundsState, updateSendFunds } from 'store/sendFunds'
import {
  DUPLICATED_ADDRESS_TYPE,
  FEE_ESTIMATION_ERROR,
  PROPOSAL_CREATION_FAILURE_TYPE,
  WALLET_CORRUPTED_PROCESS_TYPE
} from 'utils/constants'

const Failure = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const clearState = async () => {
    dispatch(updateWalletCreationState({...initialWalletCreationState}))
    dispatch(updateSendFunds({ ...initialSendFundsState }))
    dispatch(updateWalletObjectState({ ...initialWalletObject }))
  }

  const clearModalState = () => {
    dispatch(updateModalState({ ...initialModalState }))
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
    switch (msgType) {

      case FEE_ESTIMATION_ERROR:
      case PROPOSAL_CREATION_FAILURE_TYPE:
      case WALLET_CORRUPTED_PROCESS_TYPE:
        clearModalState()
        goHome()
        break

      case DUPLICATED_ADDRESS_TYPE:
        clearModalState()
        dispatch(updateModalState({ openAddressBook: true }))
        localStorage.removeItem('addressBookAccountName')
        localStorage.removeItem('addressBookAccountAddress')
        break

      default:
        clearModalState()
        break
    }
  }

  const closeModal = (e: {}, reason: string) => {
    if (reason !== 'backdropClick') {
      handleModalClose()
    }
  }

  return (
    <MuiDialog
      BackdropProps={styles.defaultBackDrop}
      open={failure!}
      onClose={closeModal}
      PaperProps={styles.defaultPaperProps}
    >
      <ModalContainer sx={{ padding: '4rem' }}>
        <img src={FailureIcon} alt="failure-icon" />
        <CancelRoundedIcon onClick={handleModalClose} />
        <Box
          width='400px'
          minHeight='200px'
          display="block"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          gap={1}
        >
          <Typography
            style={{ margin: '20px 0 20px 0' }}
            variant="h4"
            fontWeight={900}
            letterSpacing={2}
          >
            {title}
          </Typography>
          {message ?
            <Typography variant="subtitle1" color="text.secondary">
              {message}
            </Typography>
            : null}
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
