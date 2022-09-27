import { useCallback, useState } from 'react'
import { styles } from './styles'
import copy from 'copy-to-clipboard'
import { FetchedProposalDetailsData, MsgMultisend } from '../'
import { formatAddress } from 'utils/helpers'
import LinkIcon from 'assets/vectors/link-icon.svg'
import CopyIcon from 'assets/vectors/copy-icon.svg'
import { EXPLORER_ADDRESS_DETAILS } from 'api/endpoints'
import { denomToAlias, denomToIcon } from 'utils/helpers'
import { handleFullBalanceToPrecision } from 'utils/regexFormatting'
import { Box, Button, Tooltip, Typography, Popover } from '@mui/material'

const MultiSendType = ({ proposalDetails }: {
    proposalDetails: FetchedProposalDetailsData
}) => {

    const [copied, setCopied] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const open = Boolean(anchorEl)
    const msg = proposalDetails.message as MsgMultisend;

    // When more than 1, this will be showing in a pop-up like scrolling list all recipients 
    const ShowRecipients = useCallback(() => {
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
                        {msg.outputs.map((item, userIndex) => (
                            <Box>
                                {item.coins.map((coin, index) => (
                                    <Box style={styles.recipientsBox}>
                                        <Typography
                                            style={{ width: '50px' }}
                                            color='text.secondary'
                                        >
                                            {userIndex + 1}
                                        </Typography>

                                        <Typography
                                            width={400}
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
    }, [open])

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
            <Box style={styles.typoHolder}>
                <Typography
                    marginRight={3}
                    fontWeight={600}
                    variant='subtitle1'
                    color='text.secondary'
                >
                    Amount:
                </Typography>
                <Box style={{ display: 'inline-flex' }}>
                    {msg.inputs[0].coins.length === 1 ?
                        <Typography style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <img
                                style={{ paddingBottom: '3px', margin: '10px 10px 0 0' }}
                                src={denomToIcon[msg.inputs[0].coins[0]!.denom as keyof typeof denomToIcon]}
                            />
                            {handleFullBalanceToPrecision(
                                msg.inputs[0].coins[0]!.amount,
                                2,
                                denomToAlias[msg.inputs[0].coins[0]!.denom as keyof typeof denomToAlias])}
                        </Typography>

                        :
                        <Button
                            disableRipple
                            onClick={handleClick}
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
                    {formatAddress(msg.inputs[0].address, 30)}
                </Typography>
                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip
                        onClick={() => handleCopy(msg.inputs[0].address)}
                        title={copied ? 'Copied' : 'Copy to clipboard'}
                    >
                        <img
                            style={styles.icons}
                            src={CopyIcon}
                            alt="Copy"
                        />
                    </Tooltip>
                    <Tooltip title="Check address on explorer">
                        <a href={EXPLORER_ADDRESS_DETAILS(msg.inputs[0].address)} target='_blank'>
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
                {msg.outputs.length > 1 ?
                    <Button
                        disableRipple
                        onClick={handleClick}
                        variant="text"
                    >
                        {`${msg.outputs.length} Recipients`}
                    </Button>
                    :
                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography
                            fontWeight={600}
                            variant='subtitle1'
                            color='text.primary'
                        >
                            {formatAddress(msg.outputs[0].address, 30)}
                        </Typography>
                        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Tooltip
                                onClick={() => handleCopy(msg.outputs[0].address)}
                                title={copied ? 'Copied' : 'Copy to clipboard'}
                            >
                                <img
                                    style={styles.icons}
                                    src={CopyIcon}
                                    alt="Copy"
                                />
                            </Tooltip>
                            <Tooltip title="Check address on explorer">
                                <a href={EXPLORER_ADDRESS_DETAILS(msg.outputs[0].address)} target='_blank'>
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
