import { RootState } from 'store'
import { styles } from './styles'
import { styles as controlStyles } from '../styles'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { INVALID_DATA_PROMPT_MSG } from 'utils/constants'
import { EncodeObject, StdFee } from 'cudosjs'
import { useGetWalletSettingsQuery } from 'graphql/types'
import { ApprovalsTitleWithTooltip, getWalletDecisionPolicyUpdateMsgAndFees, getWalletMetadataUpdateMsgAndFees, VotingPeriodTitleWithTooltip } from '../helpers'
import { emptyFetchedWalletPolicies, FetchedWalletPolicies } from 'graphql/helpers'

import {
    Box,
    Button,
    FormControl,
    Input,
    MenuItem,
    Select,
    Tooltip
} from '@mui/material'
import { MsgSpecificData } from '..'

const UpdateWalletPolicies = ({
    propose,
    close,
}: {
    propose: (
        msgs: EncodeObject[],
        fee: StdFee,
        msgSpecificData: MsgSpecificData) => void,
    close: () => void,
}) => {

    const [votingPeriod, setVotingPeriod] = useState<number>(0)
    const [threshold, setThreshold] = useState<number>(0)
    const [oldData, setOldData] = useState<FetchedWalletPolicies>(emptyFetchedWalletPolicies)
    const { address, selectedWallet, connectedLedger } = useSelector((state: RootState) => state.userState)
    const walletId: number = selectedWallet!.walletID!
    const { loading, error, data } = useGetWalletSettingsQuery({
        variables: { id: walletId }
    })

    useEffect(() => {
        if (data) {
            const fetchedWallet = data.group_with_policy_by_pk!
            const votingPeriod = Math.floor(fetchedWallet.voting_period / (3600 * 24))

            setVotingPeriod(votingPeriod)
            setThreshold(fetchedWallet.threshold)
            setOldData({
                votingPeriod: votingPeriod,
                threshold: fetchedWallet.threshold
            })
        }
    }, [data])

    const validData = (): boolean => {

        // We want non empty data
        if (
            votingPeriod > 0 &&
            threshold > 0
        ) {
            // And also want at least one of the new to be different than the old data
            if (
                votingPeriod !== oldData.votingPeriod ||
                threshold !== oldData.threshold
            ) {
                return true
            }
        }
        return false
    }

    const getTooltip = (): string => {
        if (!validData()) {
            return INVALID_DATA_PROMPT_MSG
        }

        return ''
    }

    const createProposal = async () => {

        const { msg, fee } = await getWalletDecisionPolicyUpdateMsgAndFees(
            threshold,
            votingPeriod,
            selectedWallet?.walletAddress!,
            address!,
            connectedLedger!
        )

        const msgSpecificData = {
            proposedWalletSettings: {
                votingPeriod: votingPeriod,
                threshold: threshold
            }
        }

        propose(
            [msg],
            fee,
            msgSpecificData
        )
    }

    return (
        <Box style={{ width: '100%' }}>
            {/* CONTENT */}
            <Box style={styles.contentHolder}>
                <Box id='selection-holder' style={styles.selectionHolder}>
                    <Box id="approvals-holder">
                        <ApprovalsTitleWithTooltip />
                        <FormControl fullWidth style={styles.formControl}>
                            <Select
                                sx={styles.select}
                                variant='standard'
                                disableUnderline
                                value={threshold}
                                onChange={event => setThreshold(event.target.value as number)}
                            >
                                {[...Array(selectedWallet?.memberCount)].map((e, i) => {
                                    return <MenuItem value={i + 1}>{i + 1}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box id="voting-period-holder">
                        <VotingPeriodTitleWithTooltip />
                        <Input
                            disableUnderline
                            style={styles.thresholdInput}
                            type="number"
                            value={votingPeriod}
                            placeholder="in days"
                            onKeyDown={event => {
                                if (['e', 'E', '+', "-", ".", ","].includes(event.key)) {
                                    event.preventDefault()
                                }
                            }}
                            onPaste={event => { event.preventDefault() }}
                            onChange={event => setVotingPeriod(parseInt(event.target.value))}
                            className="form-control"
                        />
                    </Box>
                </Box>
            </Box>

            {/* CONTROLS */}
            <Box style={controlStyles.controlsHolder}>
                <Box style={{ width: '40%' }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={controlStyles.ctrlBtn}
                        onClick={close}
                    >
                        No, Go Back
                    </Button>
                </Box>
                <Tooltip title={getTooltip()}>
                    <Box style={{ width: '40%' }}>
                        <Button
                            disabled={!validData()}
                            variant="contained"
                            color="primary"
                            sx={controlStyles.ctrlBtn}
                            onClick={() => createProposal()}
                        >
                            Yes, Confirm
                        </Button>
                    </Box>
                </Tooltip>
            </Box>
        </Box>
    )
}

export default UpdateWalletPolicies
