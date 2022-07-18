import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { styles } from './styles'
import { formatAddress } from 'utils/helpers'
import { TX_HASH_DETAILS } from 'api/endpoints'
import Card from 'components/Card/Card'
import { COLORS_DARK_THEME } from 'theme/colors'
import ActionsIconComponent from 'utils/actionsIconHandler'
import ClockIcon from 'assets/vectors/clock-icon.svg'
import ProposalStatusComponent from 'utils/proposalStatusHandler'
import Dialog from 'components/Dialog'

interface Data {
    blockHeight: string;
    action: string;
    txHash: string;
    date: string;
    status: string
  }

const TxsSummaryTable = () => {

    // TO DO - Have to be implemented
    // const { proposals } = useSelector((state: RootState) => state.userState.selectedWallet)


    let dummyProposals: Data[] = [
        {
            blockHeight: '6,326,594',
            action: 'Send',
            txHash: 'D422864D611352A3CCEBB4F761DF4C4BE97AFCFF814D8814EEF8A767155262BD',
            date: '27 Feb 2022, 12:30 PM (UTC +2)',
            status: 'Waiting approval'
        },
        {
            blockHeight: '6,326,600',
            action: 'Send',
            txHash: 'D422864D611352A3CCEBB4F761DF4C4BE97AFCFF814D8814EEF8A767155262BD',
            date: '27 Feb 2022, 12:30 PM (UTC +2)',
            status: 'Waiting approval'
        },
        {
            blockHeight: '6,326,905',
            action: 'Send',
            txHash: 'D422864D611352A3CCEBB4F761DF4C4BE97AFCFF814D8814EEF8A767155262BD',
            date: '27 Feb 2022, 12:30 PM (UTC +2)',
            status: 'Waiting approval'
        },
    ]
      
    const rows: Data[] = [];
      Object.entries(dummyProposals!).forEach(([index, member]) =>
        rows.push(member)
    )

    return (
        <Card elevation={0} style={{margin: '0', padding: '0'}}>
            <Dialog />
            <TableContainer>
                <Table style={styles.summaryTable} aria-label="simple table">
                    <TableHead style={styles.summaryTableHead}>
                        <TableRow style={styles.summaryTHRow}>
                            <TableCell align='left' style={styles.defaultSummaryTableCell}>
                                <Typography variant='subtitle2' color="text.secondary" fontWeight={600}>
                                    Block Height
                                </Typography>
                            </TableCell>
                            <TableCell align='left' style={styles.defaultSummaryTableCell}>
                                <Typography style={{marginLeft: '15px'}} variant='subtitle2' color="text.secondary" fontWeight={600}>
                                    Action
                                </Typography>
                            </TableCell>
                            <TableCell align='left' style={{...styles.defaultSummaryTableCell, width: '200px'}}>
                                <Typography variant='subtitle2' color="text.secondary" fontWeight={600}>
                                    Transaction Hash
                                </Typography>
                            </TableCell>
                            <TableCell align='left' style={{...styles.defaultSummaryTableCell, width: '330px'}}>
                                <Typography style={{marginLeft: '5px'}} variant='subtitle2' color="text.secondary" fontWeight={600}>
                                    Date
                                </Typography>
                            </TableCell>
                            <TableCell align='center' style={{...styles.defaultSummaryTableCell, width: '170px'}}>
                                <Typography variant='subtitle2' color="text.secondary" fontWeight={600}>
                                    Status
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={styles.summaryTableBody}>
                    {rows.map((row) => (
                        <TableRow style={styles.summaryTBRow} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell style={{width: '120px'}} align="left">{row.blockHeight}</TableCell>
                            <TableCell style={{width: '120px'}} align="left">
                               <ActionsIconComponent type={'Send'} />
                            </TableCell>
                            <TableCell style={{width: '120px'}} align="left">
                                <a style={{textDecoration: 'none'}} href={TX_HASH_DETAILS(row.txHash)} target='_blank'>
                                    <Tooltip title={row.txHash}>
                                        <div style={{ color: COLORS_DARK_THEME.PRIMARY_BLUE}}>{formatAddress(row.txHash, 15)}</div>
                                    </Tooltip>
                                </a>
                            </TableCell>
                            <TableCell style={{width: '290px'}} align="left">
                                <Box style={{display: 'flex', alignItems: 'center'}}>
                                    <img style={{marginRight:'5px', width:'18px', height: '18px'}} src={ClockIcon} alt={`Clock logo`}/>
                                    <Typography variant='subtitle2' color="text.secondary" fontWeight={600}>
                                        {row.date}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <ProposalStatusComponent status={'Waiting'} />
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    )
}

export default TxsSummaryTable
