import { Box, Typography } from '@mui/material'
import { ProposalMsg } from 'components/Dialog/ProposalDetails'
import moment from 'moment'

import {
    ABORTED,
    EXPIRED,
    FAIL,
    OPEN_TO_VOTE,
    PROPOSAL_EXECUTOR_RESULT_FAILURE,
    PROPOSAL_EXECUTOR_RESULT_NOT_RUN,
    PROPOSAL_EXECUTOR_RESULT_SUCCESS,
    PROPOSAL_STATUS_ABORTED,
    PROPOSAL_STATUS_ACCEPTED,
    PROPOSAL_STATUS_EXPIRED,
    PROPOSAL_STATUS_REJECTED,
    PROPOSAL_STATUS_SUBMITTED,
    PROPOSAL_STATUS_SUBMITTED_AND_USER_VOTED,
    READY_TO_EXECUTE,
    REJECTED,
    SUCCESS,
    UNDEFINED,
    UNKNOWN,
    WAITING_VOTES
} from './constants'
import { formatDateTime } from './helpers'

const statuses = {
    [PROPOSAL_STATUS_EXPIRED]: EXPIRED,
    [PROPOSAL_EXECUTOR_RESULT_FAILURE]: FAIL,
    [PROPOSAL_STATUS_REJECTED]: REJECTED,
    [PROPOSAL_EXECUTOR_RESULT_SUCCESS]: SUCCESS,
    [PROPOSAL_STATUS_SUBMITTED_AND_USER_VOTED]: WAITING_VOTES,
    [PROPOSAL_STATUS_ACCEPTED]: READY_TO_EXECUTE,
    [PROPOSAL_STATUS_SUBMITTED]: OPEN_TO_VOTE,
    [PROPOSAL_STATUS_ABORTED]: ABORTED,
    [UNDEFINED]: UNKNOWN
}

interface  Vote {
    voter?: string | undefined | null,
    group_member?: {address: string} | undefined | null
}

interface Proposal {
    status: string,
    group_proposal_votes: Vote[],
    executor_result: string,
    group_with_policy?: { voting_period: string},
    submit_time: any,
    messages: ProposalMsg[] | undefined
}
export const getExpirationTime = (proposal: Proposal): string => {

    const votingTime: number = proposal?.group_with_policy ? parseInt(proposal?.group_with_policy.voting_period) : 0
    const proposalTimeStamp: string = formatDateTime(proposal?.submit_time)

    return moment(proposalTimeStamp)
        .add(votingTime, 'seconds')
        .format('DD MMM YYYY LTS')
        .toLocaleString()
}

export const isExpiredStatus = (status: string): boolean => {
    return status === PROPOSAL_STATUS_EXPIRED
}

export const isExpired = (expirationTime: string): boolean => {
    const currentTime: string = moment()
        .format('DD MMM YYYY LTS')
        .toLocaleString()

    return moment(expirationTime)
        .isSameOrBefore(currentTime)
}

//cudos-noded tx bank send faucet cudos1vlq80lkrgl689vgyl38nz5k2v3klypms0pwwar 9000185000000000000acudos --chain-id=cudos-local-network --gas=auto --fees=4460400000acudos
export const isVoted = (userAddress: string, votes: Vote[]): boolean => {
    return votes.some(v => (v.voter && v.voter === userAddress) || (v.group_member && v.group_member.address === userAddress))
}

export const determineStatus = (userAddress: string, proposal: Proposal): string => {
    let proposalStatus: string = proposal.status
    const proposalVotes = proposal.group_proposal_votes
    const executionStatus: string = proposal.executor_result
    const proposalIsExecuted: boolean = isExecuted(executionStatus)
    const userVoted: boolean = isVoted(userAddress, proposalVotes)
    const expired: boolean = isExpired(getExpirationTime(proposal))

    if (proposalStatus === PROPOSAL_STATUS_SUBMITTED && userVoted) {
        proposalStatus = PROPOSAL_STATUS_SUBMITTED_AND_USER_VOTED
    }

    if (proposalStatus === PROPOSAL_STATUS_SUBMITTED && expired) {
        proposalStatus = PROPOSAL_STATUS_EXPIRED
    }

    proposalStatus = proposalIsExecuted ? executionStatus : proposalStatus

    return proposalStatus
}

export const isExecuted = (executionStatus: string): boolean => {
    return executionStatus !== PROPOSAL_EXECUTOR_RESULT_NOT_RUN
}

export const ProposalStatusComponent = ({ status }: { status: string }): JSX.Element => {
    let proposalStatus: string = status
    if (!statuses[proposalStatus as keyof typeof statuses]) { proposalStatus = UNDEFINED }

    const statusText: string = statuses[proposalStatus as keyof typeof statuses].text
    const statusColor: string = statuses[proposalStatus as keyof typeof statuses].color

    return (
        <Box style={{ width: 'max-content', display: 'flex' }}>
            <Box style={{ borderRadius: '10px', padding: '5px 15px', backgroundColor: statusColor }}>
                <Typography style={{ float: 'left' }} variant="subtitle2" fontSize={12} fontWeight={600} >
                    {statusText.toUpperCase()}
                </Typography>
            </Box>
        </Box>
    )
}
