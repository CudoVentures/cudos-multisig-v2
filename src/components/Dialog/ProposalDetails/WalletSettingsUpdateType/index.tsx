import { styles } from './styles'
import { FetchedProposalDetailsData, MsgUpdateDecisionPolicy, MsgUpdateGroupMetadata } from '..'
import { Box, Typography } from '@mui/material'
import { GROUP_UPDATE_METADATA_TYPE_URL } from 'utils/constants'
import { convertSecondsToDisplay } from 'utils/helpers'
import { FetchedWalletMetadata, FetchedWalletPolicies } from 'graphql/helpers'
import InfoIcon from 'assets/vectors/info-icon.svg'
import { HtmlTooltip } from 'utils/multiSendTableHelper'
import { Fragment } from 'react'
import { COLORS_DARK_THEME } from 'theme/colors'

export const WalletSettingsUpdateType = ({ proposalDetails }: {
    proposalDetails: FetchedProposalDetailsData
}) => {

    const isDetailsType = (): boolean => {
        return proposalDetails.msgType === GROUP_UPDATE_METADATA_TYPE_URL
    }

    const PolicyContent = (): JSX.Element => {
        const msg = proposalDetails.message as MsgUpdateDecisionPolicy
        const proposalData: FetchedWalletPolicies = {
            votingPeriod: parseInt(msg.decision_policy.windows.voting_period),
            threshold: parseInt(msg.decision_policy.threshold)
        }

        return (
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
                <Box style={styles.typoHolder}>
                    <Typography
                        marginRight={6.5}
                        fontWeight={600}
                        color='text.secondary'
                    >
                        Threshold:
                    </Typography>
                    <Typography
                        fontWeight={600}
                    >
                        {proposalData.threshold}
                    </Typography>

                </Box>
                <Box style={styles.typoHolder}>
                    <Typography
                        marginRight={3}
                        fontWeight={600}
                        color='text.secondary'
                    >
                        Voting Period:
                    </Typography>
                    <Typography
                        fontWeight={600}
                        color='text.primary'
                    >
                        {convertSecondsToDisplay(proposalData.votingPeriod, 'DAYS')}
                    </Typography>
                </Box>
            </Box >
        )
    }

    const DetailsContent = (): JSX.Element => {
        const msg = proposalDetails.message as MsgUpdateGroupMetadata
        const proposalData: FetchedWalletMetadata = {
            walletName: JSON.parse(msg.metadata).groupMetadata.walletName,
            generalInfo: JSON.parse(msg.metadata).groupMetadata.generalInfo
        }

        return (
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
                <Box style={styles.typoHolder}>
                    <Typography
                        marginRight={5}
                        fontWeight={600}
                        color='text.secondary'
                    >
                        Wallet Name:
                    </Typography>
                    <Typography
                        fontWeight={600}
                    >
                        {proposalData.walletName}
                    </Typography>

                </Box>
                <Box style={styles.typoHolder}>
                    <Typography
                        marginRight={5.5}
                        fontWeight={600}
                        color='text.secondary'
                    >
                        General Info:
                    </Typography>

                    <Typography
                        fontWeight={400}
                        color='text.primary'
                    >
                        {
                            proposalData.generalInfo ?
                                <HtmlTooltip
                                    title={
                                        <Fragment>
                                            <Box style={styles.tooltip}>
                                                {proposalData.generalInfo}
                                            </Box>
                                        </Fragment>}
                                >
                                    <Typography color={COLORS_DARK_THEME.PRIMARY_BLUE}>
                                        Details
                                        {<img
                                            style={styles.infoIcon}
                                            src={InfoIcon}
                                            alt="info-icon"
                                        />}
                                    </Typography>
                                </HtmlTooltip>
                                :
                                'N/A'
                        }
                    </Typography>

                </Box>
            </Box >
        )
    }

    return isDetailsType() ? <DetailsContent /> : <PolicyContent />
}
