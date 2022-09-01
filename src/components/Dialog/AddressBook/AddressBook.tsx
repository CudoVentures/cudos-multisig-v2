import { RootState } from 'store'
import { styles as defaultStyles } from '../styles'
import NoAddress from './NoAddress'
import AddressEdit from './AddressEdit'
import Card from 'components/Card/Card'
import AddressInput from './AddressInput'
import { updateModalState } from 'store/modals'
import AddressBookTable from './AddressBookTable'
import AddAddressButtons from './AddAddressButtons'
import { useDispatch, useSelector } from 'react-redux'
import { initialState as initialModalState } from 'store/modals'
import { Box, Typography, Dialog as MuiDialog } from '@mui/material'
import { CancelRoundedIcon, ModalContainer, styles } from '../styles'
import ExclamationMark from 'assets/vectors/yellow-exclamation-mark.svg'

const AddressBook = () => {

    const dispatch = useDispatch()
    const {
        openAddressBook,
        addNewAddress,
        editAddressBookRecord
    } = useSelector((state: RootState) => state.modalState)

    const { addressBook } = useSelector((state: RootState) => state.userState)
    const { currentStep } = useSelector((state: RootState) => state.walletCreationState)
    let addressesInAddressBook: number = 0

    if (addressBook) {
        addressesInAddressBook = Object.keys(addressBook).length
    }

    const userHaveAddressBook: boolean = addressesInAddressBook > 0

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
            BackdropProps={defaultStyles.defaultBackDrop}
            open={openAddressBook!}
            onClose={closeModal}
            PaperProps={defaultStyles.defaultPaperProps}
        >
            <ModalContainer sx={{ padding: '30px', height: 'max-content' }}>
                <CancelRoundedIcon onClick={handleModalClose} />
                <div style={{ flexDirection: "column", ...styles.infoHolder }}>
                    <div>
                        <Typography style={{ marginBottom: '3px', marginRight: '10px', float: 'left' }} variant="h6" fontWeight={900} letterSpacing={2}>
                            {currentStep === 3 ? "Add New Address" : "Address Book"}
                        </Typography>
                        {userHaveAddressBook && currentStep !== 3 ?
                            <div style={styles.btn}>
                                {addressesInAddressBook}
                            </div>
                            : null}
                    </div>
                    <Typography style={{ float: 'left' }} variant="subtitle2" color="text.secondary">
                        {
                            currentStep === 3 ? "Fill the information about the new member you want to add" :
                                addNewAddress ? "Here you can add new account to your address book" :
                                    editAddressBookRecord ? "Here you can edit the chosen record from your address book" :
                                        "Here is a list of all your addresses"
                        }
                    </Typography>
                </div>
                <Box
                    width='650px'
                    height='250px'
                    display="block"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                    gap={1}>
                    <div>
                        {addNewAddress ? <AddressInput />
                            : editAddressBookRecord ? <AddressEdit />
                                : userHaveAddressBook ? <AddressBookTable />
                                    : <NoAddress />}
                    </div>
                </Box>
                {currentStep === 3 ?
                    <Card id='connected-account-alert-info-card' style={styles.alertInfo}>
                        <img style={{ margin: '0 15px 0 5px' }} src={ExclamationMark} alt="Exclamation-mark-icon" />
                        <Typography style={{ fontSize: '14px', color: '#F5B95E' }}>
                            The new address will be automatically added to Address Book.
                        </Typography>
                    </Card> : null}
                <AddAddressButtons />
            </ModalContainer>
        </MuiDialog>
    )
}

export default AddressBook
