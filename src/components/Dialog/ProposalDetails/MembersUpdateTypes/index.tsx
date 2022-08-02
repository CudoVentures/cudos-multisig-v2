import { styles } from './styles'
import { FetchedProposalDetailsData } from '..'
import { Box, Typography } from '@mui/material'
import { ADD_MEMBER_TYPE_URL, FAIL, SUCCESS } from 'utils/constants'
import { EXPLORER_ADDRESS_DETAILS } from 'api/endpoints'
import { formatAddress } from 'utils/helpers'

export const MembersUpdateTypes = ({ proposalDetails }: {
    proposalDetails: FetchedProposalDetailsData
}) => {

    let memberName: string = ''
    let memberAddress: string = ''
    const coloring: string = proposalDetails.msgType === ADD_MEMBER_TYPE_URL ? SUCCESS.color : FAIL.color

    for (const [index, member] of proposalDetails.message.member_updates.entries()) {
        if (member.weight === 1) {
            const foundMember = proposalDetails.groupMembers.find(m => m.address === member.address)
            if (foundMember) {
                continue
            }
        }

        memberName = JSON.parse(member.metadata!).memberName
        memberAddress = member.address
    }

    return (
        <Box style={{ display: 'flex', flexDirection: 'column' }}>
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
                    {memberName}
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
                        href={EXPLORER_ADDRESS_DETAILS(memberAddress)}
                        target='_blank'
                    >
                        {formatAddress(memberAddress, 30)}
                    </a>
                </Typography>
            </Box>
        </Box >
    )
}
