import { Box, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { styles } from '../../styles'
import Card from 'components/Card/Card'
import { convertSecondsToDisplay } from 'utils/helpers'

const SummaryAccInfo = () => {
    const { threshold, groupMetadata, votingPeriod } = useSelector((state: RootState) => state.walletObject)
    const timeForVoting = convertSecondsToDisplay(votingPeriod?.seconds!, 'days')
    
    return (
        <Card style={styles.summaryCard}>
            <Box style={styles.summaryCardBoxes}>
                <Typography variant="inherit" color="text.secondary">
                    Wallet name
                </Typography>
                <Typography variant="inherit" color="text.primary">
                    {groupMetadata?.walletName}
                </Typography>
            </Box>
            <Box style={styles.summaryCardBoxes}>
                <Typography variant="inherit" color="text.secondary">
                    Approvals required
                </Typography>
                <Typography variant="inherit" color="text.primary">
                    {threshold}
                </Typography>
            </Box>
            <Box style={styles.summaryCardBoxes}>
                <Typography variant="inherit" color="text.secondary">
                    Time for voting
                </Typography>
                <Typography variant="inherit" color="text.primary">
                    {timeForVoting}
                </Typography>
            </Box>
        </Card>
    )
}

export default SummaryAccInfo
