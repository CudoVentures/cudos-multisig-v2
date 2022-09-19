import { RootState } from 'store'
import Dialog from 'components/Dialog'
import Card from 'components/Card/Card'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { useGetWalletSettingsQuery } from 'graphql/types'
import { styles } from './styles'
import { convertSecondsToDisplay } from 'utils/helpers'
import { emptyFetchedWalletSettings, FetchedWalletMetadata, FetchedWalletSettings } from 'graphql/helpers'
import { GROUP_UPDATE_DECISION_POLICY_TYPE_URL, GROUP_UPDATE_METADATA_TYPE_URL } from 'utils/constants'
import { EditBtn } from 'components/Dialog/ReusableModal/helpers'

const Settings = () => {

    const { selectedWallet } = useSelector((state: RootState) => state.userState)
    const walletId: number = selectedWallet!.walletID!
    let fetchedSettings: FetchedWalletSettings = emptyFetchedWalletSettings
    const { loading, error, data } = useGetWalletSettingsQuery({
        variables: { id: walletId }
    })

    if (data) {
        const fetchedWallet = data.group_with_policy_by_pk!
        const metaData = JSON.parse(fetchedWallet.group_metadata!)
        fetchedSettings = {
            metaData: {
                walletName: metaData.walletName,
                generalInfo: metaData.generalInfo
            },
            votingPeriod: fetchedWallet.voting_period,
            threshold: fetchedWallet.threshold
        }
    }

    return (
        <Box style={styles.boxHolder}>
            <Dialog />
            {loading ? <CircularProgress /> :
                <Box style={styles.cardsHolder}>
                    <Card style={styles.defaultCard}>
                        <Box style={styles.btnHolder}>
                            <Typography style={styles.defaultTitle}>
                                WALLET DETAILS
                            </Typography>
                            < EditBtn msgType={GROUP_UPDATE_METADATA_TYPE_URL} />
                        </Box>
                        <Typography style={styles.defaultSubtitle}>
                            Your wallet name and general information.
                        </Typography>
                        <Box style={styles.infoHolder}>
                            <Typography fontWeight={500}>Wallet Name</Typography>
                            <Box style={styles.defaultInfoBox}>
                                {fetchedSettings.metaData.walletName}
                            </Box>
                        </Box>
                        <Box style={styles.infoHolder}>
                            <Typography fontWeight={500}>General Info</Typography>
                            <Typography style={styles.defaultInfoBox}>
                                {fetchedSettings.metaData.generalInfo ? fetchedSettings.metaData.generalInfo : 'N/A'}
                            </Typography>
                        </Box>
                    </Card>
                    <Box margin={1}></Box>
                    <Card style={styles.defaultCard}>
                        <Box style={styles.btnHolder}>
                            <Typography style={styles.defaultTitle}>
                                WALLET POLICIES
                            </Typography>
                            < EditBtn msgType={GROUP_UPDATE_DECISION_POLICY_TYPE_URL} />
                        </Box>
                        <Typography style={styles.defaultSubtitle}>
                            Threshold and voting time of this wallet.
                        </Typography>
                        <Box style={{ width: '100%', display: 'inline-flex' }}>
                            <Box style={styles.infoHolder}>
                                <Typography fontWeight={500}>Number of Approvals</Typography>
                                <Typography style={styles.defaultInfoBox}>
                                    {fetchedSettings.threshold}
                                </Typography>
                            </Box>
                            <Box margin={1}></Box>
                            <Box style={styles.infoHolder}>
                                <Typography fontWeight={500}>Voting Period</Typography>
                                <Typography style={styles.defaultInfoBox}>
                                    {convertSecondsToDisplay(fetchedSettings.votingPeriod, 'DAYS')}
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Box>}
        </Box>
    )
}

export default Settings
