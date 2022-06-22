import { Button, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useDispatch } from 'react-redux'
import { styles } from '../styles'
import { updateModalState } from 'store/modals'
import PlusIcon from 'assets/vectors/plus-icon.svg'
import addressBookIcon from 'assets/vectors/large-address-book-icon.svg'
import UploadFromCsv from 'assets/vectors/csv-upload.svg'
import React from 'react'
import { isValidCudosAddress } from 'utils/validation'
import { updateUser } from 'store/user'


const NoAddress = () => {
      
    const dispatch = useDispatch()
    let fileReader: any
    let invdalidData: boolean = false
      
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
                title: 'File Error', 
                message: 'Uploaded file is in wrong format or contains invalid data'
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

    return (
        <div>
            <img style={styles.addressBookIcon} src={addressBookIcon} alt="Address Book Logo" />
            <div style={{display: "flex", flexDirection: "column"}}>
                <Typography style={{float: 'left'}} variant="h6" fontWeight={900} letterSpacing={2}>
                    Seems like there are no addresses
                </Typography>
                <Typography style={{float: 'left'}} variant="subtitle1" color="text.secondary">
                    Add new address from the button bellow
                </Typography>
            </div>
            <Button
            variant="contained"
            color="primary"
            sx={() => ({
              width: '220px',
              marginTop: '20px',
              height: '50px',
              fontWeight: 700
            })}
            // onClick={handleModalClose}
          >
            <img style={styles.btnLogo} src={PlusIcon} alt="Plus Icon" />
            Add address
          </Button>
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
          <input
            name="multiSigCsv"
            type='file'
            id='csv-file'
            accept='.csv'
            onChange={e => handleFileChosen(e)}
            hidden
            />
        </div>
    )
}

export default NoAddress
