import { Box, Button, Typography } from '@mui/material'
import { Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { CancelRoundedIcon, ModalContainer } from './styles'
import SuccessIcon from 'assets/vectors/success.svg'
import { initialState as initialModalState, updateModalState } from 'store/modals'
import { WALLET_CREATION_SUCCESS } from 'utils/constants'
import WalletCreationSuccess from './WalletCreationSuccess'
import { useNavigate } from 'react-router-dom'


const Success = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { 
        success, 
        message,
        msgType,
    } = useSelector((state: RootState) => state.modalState)

    let contentComponent: JSX.Element = (<div></div>)
    let navPath: string = ""

    switch(msgType) {
      case WALLET_CREATION_SUCCESS:
        contentComponent = <WalletCreationSuccess />
        navPath = '/welcome'
        break

      default:
        break
    }

    const handleModalClose = () => {
        dispatch(updateModalState({ ...initialModalState }))
        navigate(navPath)
    }
      
    const closeModal = (ev: any, reason: string) => {
        if (reason !== 'backdropClick') {
          handleModalClose()
        }
    }

    return (
        <MuiDialog
          open={success!}
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
            <img src={SuccessIcon} alt="success-icon" />
            <CancelRoundedIcon onClick={handleModalClose} />
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              <Typography variant="h4" fontWeight={900} letterSpacing={2}>
                Success!
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {message}
              </Typography>
            </Box>
            {contentComponent}
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

export default Success
