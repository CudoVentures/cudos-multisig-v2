
import { Box, Button, Typography } from '@mui/material'
import { styles } from './styles'
import { useDispatch } from 'react-redux'
import { emptyWallet, updateSelectedWallet } from 'store/user'
import { useNavigate } from 'react-router-dom'
import SlidingMenuTable from '../SlidingMenuTable'

const SlidingSwitchMenu = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const goToWalletCreation = () => {
        navigate('/create-wallet')
        dispatch(updateSelectedWallet(emptyWallet))
    }

    return (
        <Box style={styles.menuHolder}>
            <Box style={styles.contentHolder}>
                <Box style={styles.header}>
                    <Typography style={styles.switchAccount} fontWeight={700} variant='inherit'>
                        Switch account
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => goToWalletCreation()}
                        sx={styles.addWalletBtn}
                    >
                        Add New Wallet
                    </Button>
                </Box>
                <SlidingMenuTable />
            </Box>
        </Box>
    )
}

export default SlidingSwitchMenu
