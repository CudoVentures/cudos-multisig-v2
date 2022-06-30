import { Button, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { styles } from '../styles'
import { updateModalState } from 'store/modals'
import PlusIcon from 'assets/vectors/plus-icon.svg'
import UploadFromCsv from 'assets/vectors/csv-upload.svg'
import DownloadToCsv from 'assets/vectors/csv-download.svg'
import React, { useEffect, useState } from 'react'
import { isValidCudosAddress } from 'utils/validation'
import { updateUser } from 'store/user'
import { RootState } from 'store'
import { getCurrentStep } from 'components/Steps'
import { initialState as initialModalState } from 'store/modals'
import { CSVLink } from "react-csv"
import { FILE_ERROR_MSG, FILE_ERROR_TITLE } from 'utils/constants'

const AddAddressButtons = () => {
    const dispatch = useDispatch()
    const [userName, setUserName] = useState('')
    const [userAddress, setUserAddress] = useState('')
    const { addNewAddress } = useSelector((state: RootState) => state.modalState)
    const { addressBook } = useSelector((state: RootState) => state.userState)
    const currentStep = parseInt(getCurrentStep())
    
    let fileReader: any
    let invdalidData: boolean = false

    const handleModalClose = () => {
        dispatch(updateModalState({ ...initialModalState }))
    }
      
    const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
        ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 'max-content',
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
        },
    }))

    const handleFileRead = (e: any) => {
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
                name === '' )
                { 
                    invdalidData = true
                    break 
                }

            // Avoiding duplicates by keeping the address as unique key-constraint
            txBatch = {...txBatch, [address]: name}
        }
        
        if (invdalidData) {
            dispatch(updateModalState({
                failure: true, 
                title: FILE_ERROR_TITLE, 
                message: FILE_ERROR_MSG
            }))
        } else {
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

    const handleAddNewAddress = () => {
        switch(true) {
            case addNewAddress:
                dispatch(updateUser({
                    addressBook: {...addressBook, [userAddress]: userName}
                }))
                localStorage.removeItem('addressBookAccountName')
                localStorage.removeItem('addressBookAccountAddress')
                dispatch(updateModalState({ addNewAddress: false }))
                if (currentStep === 3) { handleModalClose() }
                break

            default:
                dispatch(updateModalState({ addNewAddress: true }))
        }
    }

    const handleBackToAddressBook = () => {
        dispatch(updateModalState({
            addNewAddress: false
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
    Object.entries(addressBook!).forEach(
        ([address, name]) => CsvData.push([
            name,
            address
        ])
    )
    
    const validInput = isValidCudosAddress(userAddress) && userName !== ''
    return (
        <div>
            {addNewAddress?
            <div style={{display: "flex", alignItems: "flex-start"}}>
                <div style={{display: 'flex', height: '80px', alignItems: "flex-end"}}>
                <Button
                    variant="contained"
                    color="secondary"
                    sx={() => ({
                    width: '220px',
                    height: '50px',
                    marginRight: '10px',
                    fontWeight: 700
                    })}
                    onClick={currentStep === 3?handleModalClose:handleBackToAddressBook}
                >
                     {currentStep === 3?"Close":"Back to Address Book"}
                </Button>
                <Tooltip title={validInput?"":"Please provide valid name and address"}>
                    <div className='tooltip-base'>
                        <Button
                            disabled={!validInput}
                            variant="contained"
                            color="primary"
                            sx={() => ({
                            marginLeft: '10px',
                            width: '220px',
                            height: '50px',
                            fontWeight: 700
                            })}
                            onClick={handleAddNewAddress}
                        >
                            <img style={styles.btnLogo} src={PlusIcon} alt="Plus Icon" />
                            {currentStep === 3?"Add address":"Add to Address Book"}
                        </Button>
                    </div>
                </Tooltip>
                </div>
                <div id="clear-fix" style={{marginBottom: '108.5px'}}></div>
            </div>
        :
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
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
            <div id='csv-btns-holder' style={{display: 'flex'}}>
                <HtmlTooltip
                    style={{marginTop: '10px'}}
                    title={
                        <React.Fragment>
                        <Typography color="inherit">CSV file format</Typography>
                        <em>{"<name>"}</em><b>{','}</b> <em>{"<address>"}</em><br/>
                        <em>{"<name>"}</em><b>{','}</b> <em>{"<address>"}</em><br/>
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
                    style={{marginTop:'10px',...styles.csvBtn}}
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
