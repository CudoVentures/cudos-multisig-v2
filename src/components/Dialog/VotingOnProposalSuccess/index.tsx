import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { OpenInNewRounded as OpenInNewRoundedIcon } from '@mui/icons-material'
import { TX_HASH_DETAILS } from 'api/endpoints'
import { PROPOSAL_OPTION_EXECUTE, VOTE_OPTION_YES } from 'utils/constants'

interface SuccessData {
    proposalID: string,
    txHash: string,
    txFee: string,
    votingOption: string
}

const VotingOnProposalSuccess = () => {

    const { dataObject } = useSelector((state: RootState) => state.modalState)
    const successData: SuccessData = new Object(dataObject) as SuccessData

    return (
        <Box
            padding='20px 10px 0 10px'
            width='100%'
            display="flex"
            flexDirection="column"
            gap={2}
        >
            <Box style={{ justifyContent: 'space-between', display: 'flex' }}>
                <Typography variant='subtitle1'>
                    Proposal ID
                </Typography>
                <Typography variant='subtitle1' color={"primary.main"}>
                    {successData.proposalID}
                </Typography>
            </Box>
            {
                successData.votingOption !== PROPOSAL_OPTION_EXECUTE ?
                    <Box style={{ justifyContent: 'space-between', display: 'flex' }}>
                        <Typography variant='subtitle1'>
                            Your vote
                        </Typography>
                        <Typography variant='subtitle1' color={"primary.main"}>
                            {successData.votingOption === VOTE_OPTION_YES ? "APPROVE" : "REJECT"}
                        </Typography>
                    </Box> : null
            }
            <Divider />
            <Box display="flex" alignItems="center" gap={1} padding="0.5rem 0">
                <Typography variant="body2">Fee</Typography>

                <Typography
                    variant="body2"
                    color="primary.main"
                    fontWeight={700}
                    letterSpacing={1}
                    sx={{ marginLeft: 'auto' }}
                >
                    {successData.txFee}
                </Typography>
            </Box>
            <Divider />
            <Box>
                <Typography variant="body2">Transaction</Typography>
                <Tooltip title="Go to Explorer">
                    <a href={TX_HASH_DETAILS(successData.txHash)} target='_blank'>
                        <Stack
                            marginBottom='20px'
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ cursor: 'pointer' }}
                        >
                            <Typography
                                variant="body2"
                                color="primary.main"
                                sx={{ textDecoration: 'underline' }}
                            >
                                Transaction link
                            </Typography>
                            <OpenInNewRoundedIcon
                                fontSize="small"
                                sx={(theme) => ({
                                    color: theme.palette.primary.main
                                })}
                            />
                        </Stack>
                    </a>
                </Tooltip>
            </Box>
        </Box>
    )
}

export default VotingOnProposalSuccess
