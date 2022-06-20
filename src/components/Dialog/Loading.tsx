import { CircularProgress, Typography, Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from 'store'
import { modalState, updateModalState } from 'store/modals'
import { ModalContainer } from './styles'

const Loading = () => {

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
        loading, 
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
          open={loading}
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
          <ModalContainer sx={{ minWidth: '600px', minHeight:'300px', padding: '4rem' }}>
            <CircularProgress thickness={5} sx={{ borderRadius: '20px' }} />
            <Typography style={{margin: '20px 0 20px 0'}} variant="h4" fontWeight={900} letterSpacing={2}>
              Processing...
            </Typography>
            {message?
            <Typography color="primary.main" fontWeight={900} letterSpacing={1}>
            {message}
          </Typography>
            :null}
          </ModalContainer>
        </MuiDialog>
    )
}

export default Loading
