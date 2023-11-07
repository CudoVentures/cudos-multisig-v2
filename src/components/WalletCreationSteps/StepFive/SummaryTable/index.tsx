import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { styles } from '../../styles'
import { formatAddress } from 'utils/helpers'
import copy from 'copy-to-clipboard'
import LinkIcon from 'assets/vectors/link-icon.svg'
import CopyIcon from 'assets/vectors/copy-icon.svg'
import ExclamationMark from 'assets/vectors/yellow-exclamation-mark.svg'
import { EXPLORER_ADDRESS_DETAILS } from 'api/endpoints'
import Card from 'components/Card/Card'

interface Data {
    name: string;
    address: string;
}

const SummaryTable = ({ displayWarning }: { displayWarning: boolean }) => {
    const { members } = useSelector((state: RootState) => state.walletObject)
    const { addressBook } = useSelector((state: RootState) => state.userState)
    const [copied, setCopied] = useState<boolean>(false)

    function createData(
        name: string,
        address: string,
    ): Data {
        return {
            name,
            address,
        };
    }

    const rows: Data[] = [];
    Object.entries(members!).forEach(([index, member]) =>
        rows.push(createData(addressBook![member.address!], member.address!))
    )

    const handleCopy = (value: string) => {
        copy(value)
        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 3000)
    }

    return (
        <Card style={{ backgroundColor: '#28314E' }}>
            <TableContainer>
                <Table style={{ backgroundColor: '#28314E', position: 'relative' }} aria-label="simple table">
                    <TableHead >
                        <TableRow >
                            <TableCell style={{ backgroundColor: 'rgba(99, 109, 143, 0.2)', padding: '10px', borderRadius: '10px' }}>Members <span style={styles.spanHolderSummary}>{members!.length}</span></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={styles.summaryTableBody}>
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name.length > 30 ?
                                        <Tooltip title={row.name}>
                                            <div>
                                                {formatAddress(row.name, 10)}
                                            </div>
                                        </Tooltip>
                                        : row.name
                                    }
                                </TableCell>

                                <TableCell align="left" style={{ color: '#7D87AA', paddingRight: '0' }}>
                                    {formatAddress(row.address, 20)}
                                </TableCell>
                                <TableCell style={{ padding: '0' }}>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Tooltip
                                            onClick={() => handleCopy(row.address)}
                                            title={copied ? 'Copied' : 'Copy to clipboard'}
                                        >
                                            <img
                                                style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                src={CopyIcon}
                                                alt="Copy"
                                            />
                                        </Tooltip>
                                        <Tooltip title="Check address on explorer">
                                            <a href={EXPLORER_ADDRESS_DETAILS(row.address)} target='_blank'>
                                                <img
                                                    style={{ marginLeft: '10px', marginTop: '3px', cursor: 'pointer' }}
                                                    src={LinkIcon}
                                                    alt="Link"
                                                />
                                            </a>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    {displayWarning ?
                        <Tooltip title="You won't be able to interact with this MultiSig when created. Please confirm">
                            <Card id='no-owner-alert-info-card' style={styles.noOwnerWarning}>
                                <img src={ExclamationMark} alt="Exclamation-mark-icon" />
                                <Typography variant='subtitle2' style={{ color: '#F5B95E' }}>
                                    Your address is missing!
                                </Typography>
                            </Card>
                        </Tooltip> : null}
                </Table>

            </TableContainer>
        </Card>
    )
}

export default SummaryTable
