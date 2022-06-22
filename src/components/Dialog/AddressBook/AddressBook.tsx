import { Box, Button, Typography } from '@mui/material'
import { Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { CancelRoundedIcon, ModalContainer, styles } from '../styles'
import { useNavigate } from 'react-router-dom'
import { updateModalState } from 'store/modals'
import { initialState as initialModalState } from 'store/modals'
import NoAddress from './NoAddress'

const AddressBook = () => {
      
    const dispatch = useDispatch()
    const { openAddressBook } = useSelector((state: RootState) => state.modalState)
    const { addressBook } = useSelector((state: RootState) => state.userState)

    const addressesInAddressBook = Object.keys(addressBook!).length
    const userHaveAddressBook = addressesInAddressBook > 0

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
          open={openAddressBook!}
          onClose={closeModal}
          PaperProps={{
            sx: {
              background: 'transparent',
              boxShadow: 'none',
              position: 'fixed',
              overflow: 'hidden',
              borderRadius: '25px',
            }
          }}
        >
            <ModalContainer sx={{padding: '30px' }}>
                <CancelRoundedIcon onClick={handleModalClose} />
                <div style={{flexDirection: "column",...styles.infoHolder}}>
                    <div>
                    <Typography style={{marginBottom: '3px', marginRight: '10px', float: 'left'}} variant="h6" fontWeight={900} letterSpacing={2}>
                        Address Book 
                    </Typography>
                        {userHaveAddressBook?
                            <div style={styles.btn}>
                                {addressesInAddressBook}
                            </div>
                        :null}
                    </div>
                    <Typography style={{float: 'left'}} variant="subtitle2" color="text.secondary">
                        Here is a list of all your addresses
                    </Typography>
                </div>

                <Box
                    width='650px'
                    height='300px'
                    display="block"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                    gap={1}>

                    {userHaveAddressBook?
                    null
                    :
                    <NoAddress />
                    }
                </Box>
            </ModalContainer>
        </MuiDialog>
    )
}

export default AddressBook
