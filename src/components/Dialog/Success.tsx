import { Box, Button, Divider, Stack, Tooltip, Typography } from '@mui/material'
import { Dialog as MuiDialog } from '@mui/material'
import { OpenInNewRounded as OpenInNewRoundedIcon } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { CancelRoundedIcon, ModalContainer } from './styles'
import SuccessIcon from 'assets/vectors/success.svg'
import { modalState, updateModalState } from 'store/modals'
import { useNavigate } from 'react-router-dom'


const Success = () => {

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
        success, 
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
          open={success}
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
                You have successfully finished whatever you were doing!
              </Typography>
            </Box>
            <Box padding='0px 10px 0 10px' width='100%' display="flex" flexDirection="column" gap={2}>

              <Box>
                <Typography margin='10px 0 5px 0' color="text.secondary" variant="body2">
                  Total Recipients
                </Typography>
                <Typography variant="body2">{"Hardcoded Value"}</Typography>
              </Box>

              <Box>
                <Typography margin='10px 0 5px 0' color="text.secondary" variant="body2">
                  Total Amount
                </Typography>
                <Typography variant="body2">{"Hardcoded Value"} CUDOS</Typography>
              </Box>

              <Box>
                <Typography margin='10px 0 5px 0' color="text.secondary" variant="body2">
                  Total Transactions
                </Typography>
                <Typography variant="body2">1</Typography>
              </Box>

              <Divider />

              <Box display="flex" alignItems="center" gap={1} padding="0.5rem 0">
                <Typography variant="body2">Fee</Typography>

                <Typography
                  variant="body2"
                  color="primary.main"
                  fontWeight={700}
                  letterSpacing={1}
                  sx={{ marginLeft: 'auto' }}
                >
                  {"Hardcoded Value"} CUDOS
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="body2">Transaction</Typography>
                <Tooltip title="Go to Explorer">
                <a href={"Hardcoded Value"} target='_blank'>
                <Stack
                  marginBottom='20px'
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography
                    variant="body2"
                    color="primary.main"
                    sx={{ textDecoration: 'underline' }}
                  >
                    Transaction link
                  </Typography>
                  <OpenInNewRoundedIcon
                    fontSize="small"
                    sx={(theme) => ({
                      color: theme.palette.primary.main
                    })}
                  />
                </Stack>
                </a>
              </Tooltip>
              </Box>
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

export default Success
