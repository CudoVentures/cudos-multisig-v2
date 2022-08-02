
import { Coin } from 'cudosjs'
import { useState } from 'react'
import { styles } from './styles'
import copy from 'copy-to-clipboard'
import { FetchedProposalDetailsData } from '../'
import { formatAddress } from 'utils/helpers'
import LinkIcon from 'assets/vectors/link-icon.svg'
import CopyIcon from 'assets/vectors/copy-icon.svg'
import { EXPLORER_ADDRESS_DETAILS } from 'api/endpoints'
import { denomToAlias, denomToIcon } from 'utils/helpers'
import { handleFullBalanceToPrecision } from 'utils/regexFormatting'
import { Box, Button, Tooltip, Typography, Popover } from '@mui/material'

interface Recipient {
    address: string;
    coins: Coin[];
}

const showAmounts = (amounts: Recipient[]) => {
    // THIS WILL NEED NODE FIX. At the moment one cannot submit Tx for mixed denoms, even if multisend
}

const MultiSendType = ({ proposalDetails }: {
    proposalDetails: FetchedProposalDetailsData
}) => {

    const [copied, setCopied] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const open = Boolean(anchorEl)

    // When more than 1, this will be showing in a pop-up like scrolling list all recipients 
    const ShowRecipients = () => {
        return (
            <Box style={styles.componentHolderBox}>
                <Typography sx={{ p: 2 }}>
                    <Typography
                        marginBottom={2}
                        fontWeight={700}
                        variant='h5'
                    >
                        Recipients
                    </Typography>
                    <Box style={{ overflow: 'scroll', maxHeight: '250px' }}>
                        {proposalDetails.message.outputs.map((item: any, userIndex: number) => (
                            <Box>
                                {item.coins.map((coin: any, index: number) => (
                                    <Box style={styles.recipientsBox}>
                                        <Typography
                                            style={{ width: '50px' }}
                                            color='text.secondary'
                                        >
                                            {userIndex + 1}
                                        </Typography>

                                        <Typography
                                            width={500}
                                            fontWeight={600}
                                            variant='subtitle1'
                                            color='text.primary'
                                        >
                                            {formatAddress(item.address, 20)}
                                        </Typography>

                                        <Tooltip
                                            onClick={() => handleCopy(item.address)}
                                            title={copied ? 'Copied' : 'Copy to clipboard'}
                                        >
                                            <img
                                                style={styles.icons}
                                                src={CopyIcon}
                                                alt="Copy"
                                            />
                                        </Tooltip>
                                        <Tooltip title="Check address on explorer">
                                            <a href={EXPLORER_ADDRESS_DETAILS(item.address)} target='_blank'>
                                                <img
                                                    style={{ paddingTop: '5px', ...styles.icons }}
                                                    src={LinkIcon}
                                                    alt="Link"
                                                />
                                            </a>
                                        </Tooltip>
                                        <Typography width={200} marginLeft={4} fontWeight={600}>
                                            {handleFullBalanceToPrecision(
                                                coin.amount! || '0', 2,
                                                denomToAlias[coin.denom as keyof typeof denomToAlias]
                                            )}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        ))}
                    </Box>
                </Typography>
            </Box>
        )
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleCopy = (value: string) => {
        copy(value)
        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 3000)
    }
    return (
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
                onClose={handleClose}
            >
                <ShowRecipients />
            </Popover>
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
                    {proposalDetails.message.inputs[0].coins.length === 1 ?
                        <Typography style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <img
                                style={{ paddingBottom: '3px', margin: '10px 10px 0 0' }}
                                src={denomToIcon[proposalDetails.message.inputs[0].coins[0]!.denom as keyof typeof denomToIcon]}
                            />
                            {handleFullBalanceToPrecision(
                                proposalDetails.message.inputs[0].coins[0]!.amount,
                                2,
                                denomToAlias[proposalDetails.message.inputs[0].coins[0]!.denom as keyof typeof denomToAlias])}
                        </Typography>

                        :
                        <Button
                            disableRipple
                            onClick={() => showAmounts(proposalDetails.message.inputs)}
                            variant="text"
                        >
                            Multiple amounts
                        </Button>
                    }
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
                <Typography
                    fontWeight={600}
                    variant='subtitle1'
                    color='text.primary'
                >
                    {formatAddress(proposalDetails.message.inputs[0].address, 30)}
                </Typography>
                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip
                        onClick={() => handleCopy(proposalDetails.message.inputs[0].address)}
                        title={copied ? 'Copied' : 'Copy to clipboard'}
                    >
                        <img
                            style={styles.icons}
                            src={CopyIcon}
                            alt="Copy"
                        />
                    </Tooltip>
                    <Tooltip title="Check address on explorer">
                        <a href={EXPLORER_ADDRESS_DETAILS(proposalDetails.message.inputs[0].address)} target='_blank'>
                            <img
                                style={{ paddingTop: '5px', ...styles.icons }}
                                src={LinkIcon}
                                alt="Link"
                            />
                        </a>
                    </Tooltip>
                </Box>
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
                {proposalDetails.message.outputs.length > 1 ?
                    <Button
                        disableRipple
                        onClick={handleClick}
                        variant="text"
                    >
                        {`${proposalDetails.message.outputs.length} Recipients`}
                    </Button>
                    :
                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography
                            fontWeight={600}
                            variant='subtitle1'
                            color='text.primary'
                        >
                            {formatAddress(proposalDetails.message.outputs[0].address, 30)}
                        </Typography>
                        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Tooltip
                                onClick={() => handleCopy(proposalDetails.message.outputs[0].address)}
                                title={copied ? 'Copied' : 'Copy to clipboard'}
                            >
                                <img
                                    style={styles.icons}
                                    src={CopyIcon}
                                    alt="Copy"
                                />
                            </Tooltip>
                            <Tooltip title="Check address on explorer">
                                <a href={EXPLORER_ADDRESS_DETAILS(proposalDetails.message.outputs[0].address)} target='_blank'>
                                    <img
                                        style={{ paddingTop: '5px', ...styles.icons }}
                                        src={LinkIcon}
                                        alt="Link"
                                    />
                                </a>
                            </Tooltip>
                        </Box>
                    </Box>
                }
            </Box>
        </Box>
    )
}

export default MultiSendType
