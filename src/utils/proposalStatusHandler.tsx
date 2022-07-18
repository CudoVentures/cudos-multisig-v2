import { Box, Typography } from '@mui/material'

import {
    OPEN_TO_APPROVE,
    PROPOSAL_EXECUTOR_RESULT_NOT_RUN,
    PROPOSAL_STATUS_ACCEPTED,
    PROPOSAL_STATUS_SUBMITTED,
    PROPOSAL_STATUS_SUBMITTED_AND_USER_VOTED,
    READY_TO_EXECUTE,
    UNDEFINED,
    UNKNOWN,
    WAITING_APPROVAL
} from './constants'

const statuses = {
    [PROPOSAL_STATUS_SUBMITTED_AND_USER_VOTED]: OPEN_TO_APPROVE,
    [PROPOSAL_STATUS_ACCEPTED]: READY_TO_EXECUTE,
    [PROPOSAL_STATUS_SUBMITTED]: WAITING_APPROVAL,
    [UNDEFINED]: UNKNOWN
}

export const isVoted = (userAddress: string, votes: any[]): boolean => {
    if (votes.length === 0) { return false }

    for (const vote of votes) {
        if (vote.voter === userAddress) { return true }
    }
    return false
}

export const determineStatus = (userAddress: string, proposal: any): string => {
    let proposalStatus: string = proposal.status
    const proposalVotes: any[] = proposal.group_proposal_votes
    const executionStatus: string = proposal.executor_result
    const proposalIsNotExecuted: boolean = isNotExecuted(executionStatus)
    const userVoted: boolean = isVoted(userAddress, proposalVotes)

    if (proposalStatus === PROPOSAL_STATUS_SUBMITTED && userVoted) {
        proposalStatus = PROPOSAL_STATUS_SUBMITTED_AND_USER_VOTED
    }

    proposalStatus = proposalIsNotExecuted ? proposalStatus : executionStatus

    return proposalStatus
}

export const isNotExecuted = (executionStatus: string): boolean => {
    return executionStatus === PROPOSAL_EXECUTOR_RESULT_NOT_RUN
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
