import { Button, Tooltip, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { styles } from './styles'
import { updateModalState } from 'store/modals'
import PlusIcon from 'assets/vectors/plus-icon.svg'
import UploadFromCsv from 'assets/vectors/csv-upload.svg'
import DownloadToCsv from 'assets/vectors/csv-download.svg'
import React, { useEffect, useState } from 'react'
import { isValidCudosAddress } from 'utils/validation'
import { updateUser, AddressBook } from 'store/user'
import { RootState } from 'store'
import { getCurrentWalletCreationStep } from 'components/WalletCreationSteps'
import { initialState as initialModalState } from 'store/modals'
import { CSVLink } from "react-csv"
import { HtmlTooltip } from 'utils/multiSendTableHelper'
import { Firebase } from 'utils/firebase'
import { getKeplrAddress } from 'ledgers/KeplrLedger'
import {
    DUPLICATED_ADDRESS_EDITING_FAILUTE_TITLE,
    DUPLICATED_ADDRESS_MSG,
    DUPLICATED_ADDRESS_TYPE,
    FILE_ERROR_MSG,
    FILE_ERROR_TITLE,
    INVALID_DATA_PROMPT_MSG
} from 'utils/constants'

interface DataObject {
    index: number,
    address?: string
}

const AddAddressButtons = () => {
    const dispatch = useDispatch()
    const [userName, setUserName] = useState('')
    const [userAddress, setUserAddress] = useState('')
    const { addNewAddress, editAddressBookRecord, dataObject } = useSelector((state: RootState) => state.modalState)
    const { addressBook } = useSelector((state: RootState) => state.userState)
    const currentStep = parseInt(getCurrentWalletCreationStep())
    const dataFromObject: DataObject = new Object(dataObject) as DataObject

    let fileReader: any
    let invdalidData: boolean = false

    const handleModalClose = () => {
        dispatch(updateModalState({ ...initialModalState }))
    }

    const handleFileRead = async (e: any) => {
        const content = fileReader.result.split('\n')

        let txBatch = {}
        for (let line of content) {
            line = line.trim()
            line = line.replaceAll('"', '')
            line = line.replaceAll("'", "")
            if (line.length === 0) { invdalidData = true; break }

            const columns = line.split(',')
            if (columns.length !== 2) { invdalidData = true; break }

            const name = columns[0].trim()
            const address = columns[1].trim()
            if (
                address === undefined ||
                address === '' ||
                !isValidCudosAddress(address) ||
                name === undefined ||
                name === '') {
                invdalidData = true
                break
            }

            txBatch = { ...txBatch, [address]: name }
        }

        if (invdalidData) {
            dispatch(updateModalState({
                failure: true,
                title: FILE_ERROR_TITLE,
                message: FILE_ERROR_MSG
            }))
        } else {
            const address = await getKeplrAddress();
            await Firebase.saveAddressBook(address, txBatch);
            dispatch(updateUser({ addressBook: txBatch }))
        }
    }

    const handleFileChosen = (e: any) => {
        let file = e.target.files[0]
        fileReader = new FileReader()
        fileReader.onloadend = handleFileRead
        fileReader.readAsText(file)
        e.target.value = ''
    }

    const handleCsvClick = () => {
        document.getElementById("csv-file")?.click()
    }

    const handleAddNewAddress = async () => {
        let fail: boolean = false
<<<<<<< HEAD
        let oldRecordIndex: number = 0
        let tempBook: AddressBook = {}
        let updatedBook: AddressBook = {}
=======
>>>>>>> cudos-dev

        if (addNewAddress) {
            for (const address of Object.keys(addressBook!)) {
                if (address === userAddress) {
                    fail = true
                    break
                }
            }

            if (!fail) {
                const newAddressBook = { ...addressBook, [userAddress]: userName };
                const address = await getKeplrAddress();
                await Firebase.saveAddressBook(address, newAddressBook);
                dispatch(updateUser({ addressBook: newAddressBook }))
                localStorage.removeItem('addressBookAccountName')
                localStorage.removeItem('addressBookAccountAddress')
                dispatch(updateModalState({ addNewAddress: false }))
                if (currentStep === 3) { handleModalClose() }
                return
            }
        }

        if (editAddressBookRecord) {

            let updatedAddressBook: addressBook = {}
            const oldAddressBook: addressBook = { ...addressBook! }

            //This is the address a change is proposed to
            const oldAddressToDiscard: string = dataFromObject.address!

            //This is the proposed change
            const newRecord = {
                address: userAddress,
                name: userName
            }

            // Make sure the updated book only keeps records not subject of the change.
            for (const [addressToKeep, name] of Object.entries(oldAddressBook)) {
                if (addressToKeep !== oldAddressToDiscard) {
                    updatedAddressBook[addressToKeep] = name
                }
            }

            // If the updated book contains the newly proposed change, it is a NO GO
            // as you can't edit one record to become equal to another record.
            if (updatedAddressBook[newRecord.address]) {
                fail = true
            }

            // Finally, the updated book + the proposed change
            if (!fail) {
<<<<<<< HEAD
                const newAddressBook = { ...updatedBook, [userAddress]: userName };
                const address = await getKeplrAddress();
                await Firebase.saveAddressBook(address, newAddressBook);
                dispatch(updateUser({ addressBook: newAddressBook }))
=======
                dispatch(updateUser({
                    addressBook: {
                        ...updatedAddressBook,
                        [newRecord.address]: newRecord.name
                    }
                }))
>>>>>>> cudos-dev
                dispatch(updateModalState({ editAddressBookRecord: false }))
                return
            }
        }

        if (fail) {
            dispatch(updateModalState({
                failure: true,
                msgType: DUPLICATED_ADDRESS_TYPE,
                title: DUPLICATED_ADDRESS_EDITING_FAILUTE_TITLE,
                message: DUPLICATED_ADDRESS_MSG,
            }))
            return
        }

        dispatch(updateModalState({ addNewAddress: true }))
    }

    const handleBackToAddressBook = () => {
        dispatch(updateModalState({
            addNewAddress: false,
            editAddressBookRecord: false
        }))
    }

    useEffect(() => {
        function checkUserData() {
            const userName = localStorage.getItem('addressBookAccountName')
            const userAddress = localStorage.getItem('addressBookAccountAddress')

            if (userName) { setUserName(userName) } else { setUserName('') }
            if (userAddress) { setUserAddress(userAddress) } else { setUserAddress('') }
        }

        window.addEventListener('storage', checkUserData)

        return () => {
            window.removeEventListener('storage', checkUserData)
        }
    }, [])

    const CsvData: any[] = []
    if (addressBook) {
        Object.entries(addressBook!).forEach(
            ([address, name]) => CsvData.push([
                name,
                address
            ])
        )
    }

    const validInput = isValidCudosAddress(userAddress) && userName !== ''
    return (
        <div>
            {addNewAddress ?
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                    <div style={styles.btnHolder}>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={styles.leftOrientedBtn}
                            onClick={currentStep === 3 ? handleModalClose : handleBackToAddressBook}
                        >
                            {currentStep === 3 ? "Close" : "Back to Address Book"}
                        </Button>
                        <Tooltip title={validInput ? "" : INVALID_DATA_PROMPT_MSG}>
                            <div className='tooltip-base'>
                                <Button
                                    disabled={!validInput}
                                    variant="contained"
                                    color="primary"
                                    sx={styles.rightOrientedBtn}
                                    onClick={handleAddNewAddress}
                                >
                                    <img style={styles.btnLogo} src={PlusIcon} alt="Plus Icon" />
                                    {currentStep === 3 ? "Add address" : "Add to Address Book"}
                                </Button>
                            </div>
                        </Tooltip>
                    </div>
                    <div id="clear-fix" style={{ marginBottom: '108.5px' }}></div>
                </div>
                :
                editAddressBookRecord ?
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                        <div style={styles.btnHolder}>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={styles.leftOrientedBtn}
                                onClick={currentStep === 3 ? handleModalClose : handleBackToAddressBook}
                            >
                                {currentStep === 3 ? "Close" : "Back to Address Book"}
                            </Button>
                            <Tooltip title={validInput ? "" : INVALID_DATA_PROMPT_MSG}>
                                <div className='tooltip-base'>
                                    <Button
                                        disabled={!validInput}
                                        variant="contained"
                                        color="primary"
                                        sx={styles.rightOrientedBtn}
                                        onClick={handleAddNewAddress}
                                    >
                                        <img style={styles.btnLogo} src={PlusIcon} alt="Plus Icon" />
                                        Confirm change
                                    </Button>
                                </div>
                            </Tooltip>
                        </div>
                        <div id="clear-fix" style={{ marginBottom: '108.5px' }}></div>
                    </div>
                    :
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={() => ({
                                width: '220px',
                                marginTop: '20px',
                                height: '50px',
                                fontWeight: 700
                            })}
                            onClick={handleAddNewAddress}
                        >
                            <img style={styles.btnLogo} src={PlusIcon} alt="Plus Icon" />
                            Add New Address
                        </Button>
                        <div id='csv-btns-holder' style={{ display: 'flex' }}>
                            <HtmlTooltip
                                style={{ marginTop: '10px' }}
                                title={
                                    <React.Fragment>
                                        <Typography color="inherit">CSV file format</Typography>
                                        <em>{"<name>"}</em><b>{','}</b> <em>{"<address>"}</em><br />
                                        <em>{"<name>"}</em><b>{','}</b> <em>{"<address>"}</em><br />
                                        <small>{'*Each pair should be comma separated and on a new line.'}</small>
                                    </React.Fragment>}
                            >
                                <div className='tooltip-base'>
                                    <Button
                                        disableRipple
                                        style={styles.csvBtn}
                                        onClick={handleCsvClick}
                                    >
                                        <img src={UploadFromCsv} alt="Upload from CSV file" />
                                    </Button>
                                </div>
                            </HtmlTooltip>
                            <Button
                                disableRipple
                                style={{ marginTop: '10px', ...styles.csvBtn }}
                            >
                                <CSVLink
                                    data={CsvData}
                                    filename={"MultiSig-address-book.csv"}
                                    className="btn btn-primary"
                                    target="_blank"
                                >
                                    <img src={DownloadToCsv} alt="Download to CSV file" />
                                </CSVLink>
                            </Button>
                        </div>
                        <input
                            name="multiSigCsv"
                            type='file'
                            id='csv-file'
                            accept='.csv'
                            onChange={e => handleFileChosen(e)}
                            hidden
                        />
                    </div>}
        </div>
    )
}

export default AddAddressButtons
