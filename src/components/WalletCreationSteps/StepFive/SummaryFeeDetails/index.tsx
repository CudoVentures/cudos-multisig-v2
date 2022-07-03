import { Tooltip, Typography } from '@mui/material'
import { styles } from '../../styles'
import Card from 'components/Card/Card'
import smallInfoIcon from 'assets/vectors/small-info-icon.svg'
import { RootState } from 'store'
import { useSelector } from 'react-redux'
import { BigNumber } from 'bignumber.js'
import { cutTrailingZeroes, separateDecimals, separateFractions } from 'utils/regexFormatting'

const SummaryFeeDetails = () => {

    const { feeForCreation } = useSelector((state: RootState) => state.walletObject)
    const tempFee = new BigNumber(feeForCreation!.amount[0]?feeForCreation!.amount[0].amount:'0')
    // X.XX CUDOS format
    const displayWorthyFee = cutTrailingZeroes(separateDecimals(separateFractions(tempFee.valueOf())))

    return (
        <Card style={styles.summaryCard}>
            <Typography variant="subtitle2" color="text.secondary">
                Fee for creating MultiSig wallet
                <Tooltip title='This is approximate calculation'>
                    <img style={styles.btnLogo} src={smallInfoIcon} alt="Info Icon" />
                </Tooltip>
            </Typography>
            <Typography variant="inherit" color="text.primary">
                {displayWorthyFee + ' CUDOS'}
            </Typography>
        </Card>
    )
}

export default SummaryFeeDetails
