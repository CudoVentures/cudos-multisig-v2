import { Tooltip, Typography } from '@mui/material'
import { styles } from '../../styles'
import Card from 'components/Card/Card'
import smallInfoIcon from 'assets/vectors/small-info-icon.svg'

const SummaryFeeDetails = () => {

    return (
        <Card style={styles.summaryCard}>
            <Typography variant="subtitle2" color="text.secondary">
                Fee for creating MultiSig wallet
                <Tooltip title='This is approximate calculation'>
                    <img style={styles.btnLogo} src={smallInfoIcon} alt="Info Icon" />
                </Tooltip>
            </Typography>
            <Typography variant="inherit" color="text.primary">
                0.00024 CUDOS
                {/* TO DO */}
            </Typography>
        </Card>
    )
}

export default SummaryFeeDetails
