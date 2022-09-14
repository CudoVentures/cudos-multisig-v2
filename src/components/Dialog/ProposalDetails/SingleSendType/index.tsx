import { styles } from './styles'
import { FetchedProposalDetailsData, MsgSend } from '..'
import { denomToAlias, denomToIcon } from 'utils/helpers'
import { handleFullBalanceToPrecision } from 'utils/regexFormatting'
import { Box, Typography } from '@mui/material'
import { AddressWithCopyAndFollowComponent } from 'components/Dialog/ReusableModal/helpers'

const SingleSendType = ({ proposalDetails }: {
    proposalDetails: FetchedProposalDetailsData
}) => {
    const message: MsgSend = proposalDetails.message as MsgSend
    const denom: string = denomToAlias[message.amount[0]!.denom as keyof typeof denomToAlias]
    const amount: string = message.amount[0]!.amount
    const amountToDisplay = handleFullBalanceToPrecision(amount, 2, denom)

    return (
        <Box style={{ display: 'flex', flexDirection: 'column' }}>
            <Box style={{ display: 'inline-flex' }}>
                <Typography
                    marginRight={3}
                    marginTop={1}
                    fontWeight={600}
                    variant='subtitle1'
                    color='text.secondary'
                >
                    Amount:
                </Typography>
                <Box style={{ display: 'inline-flex' }}>
                    <Typography style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <img
                            style={{ paddingBottom: '3px', margin: '10px 10px 0 0' }}
                            src={denomToIcon[message.amount[0]!.denom as keyof typeof denomToIcon]}
                        />
                        {amountToDisplay}
                    </Typography>
                </Box>
            </Box>
            <Box style={styles.typoHolder}>
                <Typography
                    marginRight={6}
                    fontWeight={600}
                    variant='subtitle1'
                    color='text.secondary'
                >
                    From:
                </Typography>
                <AddressWithCopyAndFollowComponent
                    address={message.from_address}
                />
            </Box>
            <Box style={styles.typoHolder}>
                <Typography
                    marginRight={8.5}
                    fontWeight={600}
                    variant='subtitle1'
                    color='text.secondary'
                >
                    To:
                </Typography>
                <AddressWithCopyAndFollowComponent
                    address={message.to_address}
                />
            </Box>
        </Box>
    )
}

export default SingleSendType
