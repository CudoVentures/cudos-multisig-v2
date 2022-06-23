import { CircularProgress, Typography, Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateModalState } from 'store/modals'
import { ModalContainer } from './styles'
import { initialState as initialModalState } from 'store/modals'

const Loading = () => {
      
    const dispatch = useDispatch()

    const { 
        loading,
        message
    } = useSelector((state: RootState) => state.modalState)

    const handleModalClose = () => {
        dispatch(updateModalState({ ...initialModalState }))
    }
      
    const closeModal = (ev: any, reason: string) => {
        if (reason !== 'backdropClick') {
          handleModalClose()
        }
    }

    return (
        <MuiDialog
          open={loading!}
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
