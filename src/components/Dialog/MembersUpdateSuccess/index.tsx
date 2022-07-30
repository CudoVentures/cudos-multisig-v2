import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { OpenInNewRounded as OpenInNewRoundedIcon } from '@mui/icons-material'
import { EXPLORER_ADDRESS_DETAILS, TX_HASH_DETAILS } from 'api/endpoints'
import { Member } from 'store/walletObject'
import { formatAddress } from 'utils/helpers'
import { DELETE_MEMBER_TYPE_URL } from 'utils/constants'

interface SuccessData {
    member: Member;
    txHash: string;
    txFee: string;
}

const MembersUpdateSuccess = () => {

    const { dataObject, msgType } = useSelector((state: RootState) => state.modalState)
    const successData: SuccessData = new Object(dataObject) as SuccessData

    return (
        <Box
            padding='20px 10px 0 10px'
            width='100%'
            display="flex"
            flexDirection="column"
            gap={2}
        >
            <Typography >
                Member to {msgType === DELETE_MEMBER_TYPE_URL ? 'Delete' : 'Add'}
            </Typography>
            <Box style={{ width: '100%', justifyContent: 'space-between', display: 'flex' }}>
                <Typography variant='subtitle1' color='text.secondary'>
                    Name
                </Typography>
                <Typography variant='subtitle1' color={"primary.main"}>
                    {successData.member.metadata}
                </Typography>
            </Box>
            <Box style={{ justifyContent: 'space-between', display: 'flex' }}>
                <Typography variant='subtitle1' color='text.secondary'>
                    Address
                </Typography>
                <Tooltip title="Open in Explorer">
                    <a href={EXPLORER_ADDRESS_DETAILS(successData.member.address)} target='_blank'>
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
                                {formatAddress(successData.member.address, 25)}
                            </Typography>
 
                        </Stack>
                    </a>
                </Tooltip>
            </Box>
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

export default MembersUpdateSuccess