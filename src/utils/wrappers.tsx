
import { ReactNode } from 'react'
import { styles } from './styles'
import { CSVLink } from 'react-csv'
import { Tooltip, Button } from '@mui/material'

import DownloadToCsv from 'assets/vectors/csv-download.svg'
import addressBookIcon from 'assets/vectors/small-address-book-icon.svg'
import { TableData } from './tableSortingHelper'

export const ComingSoonWrapper = ({ children }: {children: ReactNode}): JSX.Element => {
    return (
        <Tooltip title="Coming Soon">
            <div>
                {children}
            </div>
        </Tooltip>
    )
}

export const AddressBookBtn = ({ onClickProp }: {onClickProp: Function}): JSX.Element => {
    return (
        <Button disableRipple style={styles.addressBookBtn} onClick={() => onClickProp()}>
            <img style={styles.addressBookIcon} src={addressBookIcon} alt="Address Book Logo" />
            Address Book
        </Button>
    )
}

export const DownloadToCsvBtn = ({ CsvData }: {CsvData: TableData[]}): JSX.Element => {
    return (
        <Button 
            disableRipple 
            style={styles.csvBtn}
        >
            <CSVLink
                data={CsvData}
                onClick={() => {
                    if (CsvData.length < 1) { return false}
                  }}
                filename={"MultiSig-export.csv"}
                className="btn btn-primary"
                target="_blank"
            >
                <img src={DownloadToCsv} alt="Download to CSV file" />
            </CSVLink>
        </Button>
    )
}
