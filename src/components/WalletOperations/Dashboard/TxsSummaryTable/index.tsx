import { styles } from './styles'
import { RootState } from 'store'
import Dialog from 'components/Dialog'
import Card from 'components/Card/Card'
import { useSelector } from 'react-redux'
import { TX_HASH_DETAILS } from 'api/endpoints'
import { COLORS_DARK_THEME } from 'theme/colors'
import { NO_TX_HASH_MSG } from 'utils/constants'
import { determineType, TxTypeComponent } from 'utils/TxTypeHandler'
import ClockIcon from 'assets/vectors/clock-icon.svg'
import { formatAddress, formatDateTime } from 'utils/helpers'
import { useGetWalletProposalsMainSummarySubscription } from 'graphql/types'
import { determineStatus, ProposalStatusComponent } from 'utils/proposalStatusHandler'

import {
    Box,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material'


interface TableData {
    blockHeight: string;
    type: string;
    txHash: string;
    date: string;
    status: string;
}

const TxsSummaryTable = () => {

    const { address, selectedWallet } = useSelector((state: RootState) => state.userState)
    const walletId: number = parseInt(selectedWallet!.walletID!)

    const { loading, error, data } = useGetWalletProposalsMainSummarySubscription({
        variables: { id: walletId }
    })

    let tableData: TableData[] = []
    if (data) {
        for (const proposal of data.group_with_policy_by_pk!.group_proposals) {
            const txHash = proposal.transaction_hash ? proposal.transaction_hash : NO_TX_HASH_MSG
            const msgType = determineType(proposal)
            const status = determineStatus(address!, proposal)

            tableData.push({
                blockHeight: parseInt(proposal.block.height).toLocaleString(),
                type: msgType,
                txHash: txHash,
                date: formatDateTime(proposal.submit_time),
                status: status
            })
        }
    }

    return (
        <Card elevation={0} style={{ margin: '0', padding: '0' }}>
            <Dialog />
            {loading ? <CircularProgress /> :
                <TableContainer>
                    <Table style={styles.summaryTable}>
                        <TableHead style={styles.summaryTableHead}>
                            <TableRow style={styles.summaryTHRow}>
                                <TableCell
                                    align='left'
                                    style={{ ...styles.defaultSummaryTableCell, width: '110px' }}
                                >
                                    <Typography
                                        variant='subtitle2'
                                        color="text.secondary"
                                        fontWeight={600}
                                    >
                                        Block Height
                                    </Typography>
                                </TableCell>
                                <TableCell align='left' style={{ ...styles.defaultSummaryTableCell }}>
                                    <Typography
                                        variant='subtitle2'
                                        color="text.secondary"
                                        fontWeight={600}
                                    >
                                        Type
                                    </Typography>
                                </TableCell>
                                <TableCell
                                    align='left'
                                    style={{ ...styles.defaultSummaryTableCell, width: '150px' }}
                                >
                                    <Typography
                                        variant='subtitle2'
                                        color="text.secondary"
                                        fontWeight={600}
                                    >
                                        Transaction Hash
                                    </Typography>
                                </TableCell>
                                <TableCell
                                    align='left'
                                    style={{ ...styles.defaultSummaryTableCell, paddingLeft: '65px', width: '350px' }}
                                >
                                    <Typography
                                        style={{ marginLeft: '5px' }}
                                        variant='subtitle2'
                                        color="text.secondary"
                                        fontWeight={600}
                                    >
                                        Date
                                    </Typography>
                                </TableCell>
                                <TableCell
                                    align='center'
                                    style={{ ...styles.defaultSummaryTableCell, width: '110px' }}
                                >
                                    <Typography
                                        variant='subtitle2'
                                        color="text.secondary"
                                        fontWeight={600}
                                    >
                                        Status
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody style={styles.summaryTableBody}>
                            {tableData.map((row, index) => (
                                <TableRow key={index} style={styles.summaryTBRow}>
                                    <TableCell width={100} align="left">
                                        {row.blockHeight}
                                    </TableCell>
                                    <TableCell width={200} align="left">
                                        <TxTypeComponent type={row.type} />
                                    </TableCell>
                                    <TableCell style={{ color: COLORS_DARK_THEME.PRIMARY_BLUE }} width={230} align="left">
                                        {row.txHash === NO_TX_HASH_MSG ? row.txHash :
                                            <a
                                                style={{ textDecoration: 'none' }}
                                                href={TX_HASH_DETAILS(row.txHash)}
                                                target='_blank'
                                            >
                                                <Tooltip title={row.txHash}>
                                                    <div style={{ color: COLORS_DARK_THEME.PRIMARY_BLUE }} >
                                                        {formatAddress(row.txHash, 9)}
                                                    </div>
                                                </Tooltip>
                                            </a>
                                        }
                                    </TableCell>
                                    <TableCell width={285} align="left">
                                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                                            <img style={styles.clockIcon} src={ClockIcon} alt={`Clock logo`} />
                                            <Typography variant='subtitle2' color="text.secondary" fontWeight={600}>
                                                {row.date}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell width={200}>
                                        <Box style={styles.proposalStatusBox}>
                                            <ProposalStatusComponent status={row.status} />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>}
        </Card>
    )
}

export default TxsSummaryTable
