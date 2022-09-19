import { styles } from './styles'
import { FetchedProposalDetailsData, MsgUpdateMember } from '..'
import { Box, Button, Popover, Typography } from '@mui/material'
import { ADD_MEMBER_TYPE_URL, DELETE_MEMBER_TYPE_URL, FAIL, SUCCESS } from 'utils/constants'
import { EXPLORER_ADDRESS_DETAILS } from 'api/endpoints'
import { formatAddress } from 'utils/helpers'
import { useCallback, useState } from 'react'
import { Member } from 'store/walletObject'
import { CopyAndFollowComponent } from 'components/Dialog/ReusableModal/helpers'

export const MembersUpdateTypes = ({ proposalDetails }: {
    proposalDetails: FetchedProposalDetailsData
}) => {
    const members: Member[] = (proposalDetails.message as MsgUpdateMember).member_updates
    const coloring: string = proposalDetails.msgType === ADD_MEMBER_TYPE_URL ? SUCCESS.color : FAIL.color
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const open = Boolean(anchorEl)
    
    const ShowMultipleMembers = useCallback(() => {
        return (
            <Box style={styles.componentHolderBox}>
                <Typography sx={{ p: 2 }}>
                    <Box style={styles.scrollablePopOver}>
                        {members.map((item, userIndex) => (
                            <Box margin={2}>
                                <Typography
                                    style={{ width: 'max-content' }}
                                    color='text.primary'
                                >
                                    {JSON.parse(item.metadata).memberName}
                                </Typography>
                                <Box style={{ width: '100%', display: 'flex' }}>
                                    <Typography
                                        fontWeight={600}
                                        variant='subtitle1'
                                        color='text.secondary'
                                    >
                                        {formatAddress(item.address, 20)}
                                    </Typography>
                                    <CopyAndFollowComponent address={item.address} />
                                </Box>
                            </Box>
                        ))}
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
                                {JSON.parse(members[0].metadata).memberName}
                            </Typography>

                        </Box>
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
                                    href={EXPLORER_ADDRESS_DETAILS(members[0].address)}
                                    target='_blank'
                                >
                                    {formatAddress(members[0].address, 30)}
                                </a>
                            </Typography>
                        </Box>
                    </Box>
            }
        </Box >
    ) : null
}
