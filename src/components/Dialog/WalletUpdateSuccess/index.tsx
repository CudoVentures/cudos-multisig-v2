//@ts-nocheck
import { Box, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { GROUP_UPDATE_METADATA_TYPE_URL } from 'utils/constants'
import { HashAndFees } from '../helpers'
import { styles } from '../styles'

interface SuccessData {
    msgSpecificData: {
        proposedWalletSettings: {
            walletName: string;
            walletInfo: string;
            votingPeriod: number;
            threshold: number;
        }
    }
    txHash: string;
    txFee: string;
}

const WalletUpdateSuccess = () => {

    const { dataObject, msgType } = useSelector((state: RootState) => state.modalState)
    const successData: SuccessData = new Object(dataObject) as SuccessData

    const PolicyData = (): JSX.Element => {
        return (
            <Box>
                <Box style={styles.SuccessHolderInfoBox}>
                    <Typography variant='subtitle1' color='text.secondary'>
                        Threshold
                    </Typography>
                    <Typography variant='subtitle1' color={"primary.main"}>
                        {successData.msgSpecificData.proposedWalletSettings.threshold}
                    </Typography>
                </Box>
                <Box style={styles.SuccessHolderInfoBox}>
                    <Typography variant='subtitle1' color='text.secondary'>
                        Voting Period
                    </Typography>
                    <Typography variant='subtitle1' color={"primary.main"}>
                        {successData.msgSpecificData.proposedWalletSettings.votingPeriod} DAYS
                    </Typography>
                </Box>
            </Box>
        )
    }

    const DetailsData = (): JSX.Element => {
        return (
            <Box>
                <Box style={styles.SuccessHolderInfoBox}>
                    <Typography variant='subtitle1' color='text.secondary'>
                        Name
                    </Typography>
                    <Typography variant='subtitle1' color={"primary.main"}>
                        {successData.msgSpecificData.proposedWalletSettings.walletName}
                    </Typography>
                </Box>
                <Box style={styles.SuccessHolderInfoBox}>
                    <Typography variant='subtitle1' color='text.secondary'>
                        General Info
                    </Typography>
                    <Typography style={styles.successWalletInfoHolder} color={"primary.main"}>
                        {successData.msgSpecificData.proposedWalletSettings.walletInfo ?
                            successData.msgSpecificData.proposedWalletSettings.walletInfo : 'N/A'}
                    </Typography>
                </Box>
            </Box>
        )
    }

    return (
        <Box
            padding='20px 10px 0 10px'
            width='400px'
            display="flex"
            flexDirection="column"
        >
            <Typography marginBottom={1} textAlign={'center'}>
                Proposed Wallet {msgType === GROUP_UPDATE_METADATA_TYPE_URL ? 'Details' : 'Policies'}
            </Typography>

            {
                msgType === GROUP_UPDATE_METADATA_TYPE_URL ?
                    <DetailsData />
                    :
                    <PolicyData />
            }

            <HashAndFees
                txHash={successData.txHash}
                txFee={successData.txFee}
            />
        </Box>
    )
}

export default WalletUpdateSuccess
