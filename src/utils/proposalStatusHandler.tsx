import { Box, Typography } from '@mui/material'
import moment from 'moment'

import {
    EXPIRED,
    FAIL,
    OPEN_TO_VOTE,
    PROPOSAL_EXECUTOR_RESULT_FAILURE,
    PROPOSAL_EXECUTOR_RESULT_NOT_RUN,
    PROPOSAL_EXECUTOR_RESULT_SUCCESS,
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

const statuses = {
    [PROPOSAL_STATUS_EXPIRED]: EXPIRED,
    [PROPOSAL_EXECUTOR_RESULT_FAILURE]: FAIL,
    [PROPOSAL_STATUS_REJECTED]: REJECTED,
    [PROPOSAL_EXECUTOR_RESULT_SUCCESS]: SUCCESS,
    [PROPOSAL_STATUS_SUBMITTED_AND_USER_VOTED]: WAITING_VOTES,
    [PROPOSAL_STATUS_ACCEPTED]: READY_TO_EXECUTE,
    [PROPOSAL_STATUS_SUBMITTED]: OPEN_TO_VOTE,
    [UNDEFINED]: UNKNOWN
}

export const getExpirationTime = (proposal: any): string => {

    const votingTime: number = proposal?.group_with_policy ? parseInt(proposal?.group_with_policy.voting_period) : 0
    const proposalTimeStamp: string = proposal?.block.timestamp

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

export const isVoted = (userAddress: string, votes: any[]): boolean => {
    if (votes.length === 0) {
        return false
    }

    let voterAddress: string = ''
    for (const vote of votes) {

        if (vote.voter) {
            voterAddress = vote.voter
            break
        }

        if (vote.group_member) {
            voterAddress = vote.group_member.address
            break
        }

    }

    if (voterAddress !== '' && voterAddress === userAddress) {
        return true
    }

    return false
}

export const determineStatus = (userAddress: string, proposal: any): string => {
    let proposalStatus: string = proposal.status
    const proposalVotes: any[] = proposal.group_proposal_votes
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

    proposalStatus = !proposalIsExecuted ? proposalStatus : executionStatus

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
