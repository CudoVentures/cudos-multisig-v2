import { Typography } from '@mui/material'
import { styles } from '../styles'
import addressBookIcon from 'assets/vectors/large-address-book-icon.svg'

const NoAddress = () => {
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
        </div>
    )
}

export default NoAddress
