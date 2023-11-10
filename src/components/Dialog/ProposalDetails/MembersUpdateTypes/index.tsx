import { styles } from './styles'
import { FetchedProposalDetailsData, MsgUpdateMember } from '..'
import { Box, Button, Popover, Typography } from '@mui/material'
import { ADD_MEMBER_TYPE_URL, DELETE_MEMBER_TYPE_URL, FAIL, SUCCESS } from 'utils/constants'
import { EXPLORER_ADDRESS_DETAILS } from 'api/endpoints'
import { formatAddress } from 'utils/helpers'
import { useCallback, useState } from 'react'
import { Member } from 'store/walletObject'
import { CopyAndFollowComponent } from 'components/Dialog/ReusableModal/helpers'
import { RootState } from 'store'
import { useSelector } from 'react-redux'

export const MembersUpdateTypes = ({ proposalDetails }: {
    proposalDetails: FetchedProposalDetailsData
}) => {
    const { addressBook } = useSelector((state: RootState) => state.userState)
    const members: Member[] = (proposalDetails.message as MsgUpdateMember).member_updates
    const coloring: string = proposalDetails.msgType === ADD_MEMBER_TYPE_URL ? SUCCESS.color : FAIL.color
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const open = Boolean(anchorEl)

    const ShowMultipleMembers = useCallback(() => {

        return (
            <Box style={styles.componentHolderBox}>
                <Typography sx={{ p: 2 }}>
                    <Box style={styles.scrollablePopOver}>
                        {members.map((item) => {

                            const userAddress = item.address!
                            let userName = ''

                            if (!!addressBook) {
                                userName = addressBook[userAddress]
                            }
                            return (
                                <Box key={userAddress} margin={2}>
                                    {userName ?
                                        <Typography
                                            style={{ width: 'max-content' }}
                                            color='text.primary'
                                        >
                                            {userName}
                                        </Typography> : null}
                                    <Box style={{ width: '100%', display: 'flex' }}>
                                        <Typography
                                            fontWeight={600}
                                            variant='subtitle1'
                                            color='text.secondary'
                                        >
                                            {formatAddress(userAddress, 20)}
                                        </Typography>
                                        <CopyAndFollowComponent address={userAddress} />
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>
                </Typography>
            </Box>
        )
    }, [open])

    return members.length > 0 ? (
        <Box style={{ display: 'flex', flexDirection: 'column' }}>
            <Popover
                anchorReference="anchorPosition"
                anchorPosition={{ top: window.innerHeight / 3, left: window.innerWidth / 2 }}
                PaperProps={{
                    style: {
                        borderRadius: '20px'
                    },
                }}
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
            >
                <ShowMultipleMembers />
            </Popover>
            {
                members.length > 1 ?
                    <Box style={styles.typoHolder}>
                        <Typography
                            marginRight={1}
                            fontWeight={600}
                            color='text.secondary'
                        >
                            Members:
                        </Typography>
                        <Button
                            disableRipple
                            onClick={(event) => setAnchorEl(event.currentTarget)}
                            variant="text"
                        >
                            Multiple members
                        </Button>

                    </Box>
                    :
                    <Box>
                        {!!addressBook && !!members[0].address && addressBook[members[0].address] ?
                            <Box style={styles.typoHolder}>
                                <Typography
                                    marginRight={5}
                                    fontWeight={600}
                                    color='text.secondary'
                                >
                                    Name:
                                </Typography>
                                <Typography
                                    fontWeight={600}
                                    color={coloring}
                                >
                                    {addressBook[members[0].address]}
                                </Typography>

                            </Box> : null}
                        <Box style={styles.typoHolder}>
                            <Typography
                                marginRight={3}
                                fontWeight={600}
                                color='text.secondary'
                            >
                                Address:
                            </Typography>
                            <Typography
                                fontWeight={600}
                                color='text.primary'
                            >
                                <a
                                    style={{ ...styles.link, color: coloring }}
                                    href={EXPLORER_ADDRESS_DETAILS(members[0].address!)}
                                    target='_blank'
                                >
                                    {formatAddress(members[0].address!, 30)}
                                </a>
                            </Typography>
                        </Box>
                    </Box>
            }
        </Box >
    ) : null
}
