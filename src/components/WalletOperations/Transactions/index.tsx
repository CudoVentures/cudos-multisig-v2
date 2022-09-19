import moment from 'moment'
import { styles } from './styles'
import { RootState } from 'store'
import { useEffect, useState } from 'react'
import Dialog from 'components/Dialog'
import Card from 'components/Card/Card'
import { useSelector } from 'react-redux'
import { formatDateTime } from 'utils/helpers'
import { COLORS_DARK_THEME } from 'theme/colors'
import SwitchSelector from "react-switch-selector"
import TransactionsTable from './TransactionsTable'
import { determineType } from 'utils/TxTypeHandler'
import { TableData } from 'utils/tableSortingHelper'
import { determineStatus } from 'utils/proposalStatusHandler'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useGetWalletProposalsSummarySubscription } from 'graphql/types'

import {
    NO_TX_HASH_MSG,
    PROPOSAL_EXECUTOR_RESULT_SUCCESS,
    PROPOSAL_STATUS_ABORTED,
    PROPOSAL_STATUS_EXPIRED,
    PROPOSAL_STATUS_REJECTED
} from 'utils/constants'

const Transactions = () => {

    const [toggleOption, setToggleOption] = useState<number>(0)
    const { selectedWallet, address } = useSelector((state: RootState) => state.userState)
    const walletId: number = selectedWallet!.walletID!
    const { loading, error, data } = useGetWalletProposalsSummarySubscription({
        variables: { id: walletId }
    })

    const finalStatuses = [
        PROPOSAL_EXECUTOR_RESULT_SUCCESS,
        PROPOSAL_STATUS_REJECTED,
        PROPOSAL_STATUS_EXPIRED,
        PROPOSAL_STATUS_ABORTED
    ]

    let completedProposals: TableData[] = []
    let onGoingProposals: TableData[] = []

    if (data) {
        for (const proposal of data.group_with_policy_by_pk!.group_proposals) {
            const txHash = proposal.transaction_hash ? proposal.transaction_hash : NO_TX_HASH_MSG
            const msgType = determineType(proposal!.messages)
            const status = determineStatus(address!, proposal)

            const tableObject: TableData = {
                blockHeight: parseInt(proposal.block.height).toLocaleString(),
                type: msgType,
                txHash: txHash,
                date: moment(formatDateTime(proposal.submit_time)).toDate(),
                status: status,
                votesCount: proposal.group_proposal_votes.length,
                membersCount: proposal.member_count,
                proposalID: proposal.id
            }

            if (finalStatuses.includes(status)) {
                completedProposals.push(tableObject)
                continue
            }

            onGoingProposals.push(tableObject)
        }
    }

    const switchOptions = [
        {
            label: `Queue ${onGoingProposals.length}`,
            value: 0,
            selectedBackgroundColor: COLORS_DARK_THEME.PRIMARY_BLUE,
        },
        {
            label: `History ${completedProposals.length}`,
            value: 1,
            selectedBackgroundColor: COLORS_DARK_THEME.PRIMARY_BLUE
        }
    ]

    const onSwitchChange = (newValue) => {
        setToggleOption(newValue as number)
    }

    const totalProposals = completedProposals.length + onGoingProposals.length

    useEffect(() => {
        if (!loading && onGoingProposals.length === 0 && completedProposals.length > 0) {
            setToggleOption(1)
            return
        }
        setToggleOption(0)
    }, [loading])

    return (
        <Box style={styles.boxHolder}>
            <Dialog />
            <Card style={styles.cardHolder}>
                <Box style={{ float: 'right' }}>
                    <div style={{ width: 200, height: 35 }}>
                        <SwitchSelector
                            onChange={onSwitchChange}
                            forcedSelectedIndex={toggleOption}
                            options={switchOptions}
                            backgroundColor={COLORS_DARK_THEME.LIGHT_BACKGROUND}
                            fontColor={COLORS_DARK_THEME.SECONDARY_TEXT}
                        />
                    </div>
                </Box>
                <Box style={styles.adressCounterHolder}>
                    <Typography
                        fontWeight={600}
                        color={'text.secondary'}
                        variant='subtitle1'
                    >
                        TRANSACTIONS
                    </Typography>
                    <Box style={styles.blueCountDisplayer}>{totalProposals}</Box>
                </Box>
                <Box>
                    {loading ? <CircularProgress style={{ position: 'absolute', top: '250px' }} /> :
                        <TransactionsTable
                            fetchedData={toggleOption ? completedProposals : onGoingProposals}
                        />
                    }
                </Box>
            </Card>
        </Box>
    )
}

export default Transactions
