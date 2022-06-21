import { Box, Button, Typography } from '@mui/material'
import { Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { CancelRoundedIcon, ModalContainer } from './styles'
import FailureIcon from 'assets/vectors/failure.svg'
import { useNavigate } from 'react-router-dom'
import { modalState, updateModalState } from 'store/modals'


const Failure = () => {

    const initialState: modalState = {
        title: '',
        message: '',
        loading: false,
        success: false,
        failure: false,
        dataObject: {}
      }
      
      const navigate = useNavigate()
      const dispatch = useDispatch()

    const { 
        failure, 
        title, 
        message,
        dataObject 
    } = useSelector((state: RootState) => state.modalState)

    const handleModalClose = () => {
        dispatch(updateModalState({ ...initialState }))
    }
      
    const closeModal = (ev: any, reason: string) => {
        if (reason !== 'backdropClick') {
          handleModalClose()
        }
    }

    return (
        <MuiDialog
          open={failure}
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
