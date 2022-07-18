import { styles } from './styles'
import { RootState } from 'store'
import { useSelector } from 'react-redux'
import { displayTooltipDueBalances, totalAmountDue } from 'utils/multiSendTableHelper'
import ExclamationMark from 'assets/vectors/yellow-exclamation-mark.svg'
import { HtmlTooltip } from 'utils/multiSendTableHelper'
import { denomToAlias } from 'utils/helpers'

import { 
    Tooltip, 
    Typography, 
    TableContainer, 
    Table, 
    TableHead, 
    TableBody, 
    TableFooter, 
    TableRow, 
    TableCell 
} from '@mui/material'

const OverviewTable = () => {

    const { multisendRows } = useSelector((state: RootState) => state.sendFunds)

    return (
        <div id='component-holder'>
                    <TableContainer id='table-container' style={styles.tableContainer}>
                        <h4 style={{marginBottom: '10px', float: "left"}}>List of recipients</h4>
                    <Table id='table'>
                        {/* TABLE HEADER */}
                        <TableHead style={{borderRadius: '10px', width: '100%', display: 'block'}}>
                            <TableRow style={{...styles.resultRow, display: 'flex', background: 'rgba(99, 109, 143, 0.2)'}}>
                                <TableCell style={{...styles.headerCells, padding: '10px 10px 10px 24px', width: '160px'}}>#</TableCell>
                                <TableCell style={{...styles.headerCells, marginRight: '40px', width: '400px'}}>Address</TableCell>
                                <TableCell style={{...styles.headerCells, padding: '0px 0px 0px 55px', textAlign: 'left', marginRight: "40px"}}>Amount</TableCell>
                            </TableRow>
                        </TableHead>

                        {/* TABLE BODY */}
                        <TableBody style={{background: '#28314E', display: 'block', height: '157px', overflow: 'scroll', padding: '5px'}}>
                            {multisendRows!.map((item, idx) => (
                                <TableRow id='auto-scrolling-table' style={{...styles.resultRow}} key={idx}>
                                    <TableCell align="left" style={{...styles.headerCells, marginLeft: '12px', width: '150px', textAlign: 'left' }} >{idx+1}</TableCell>
                                    <TableCell align="left" style={{...styles.resultCells, width: '410px', color: '#52A6F8'}}>
                                        {item.recipient}
                                    </TableCell>
                                    <TableCell style={{...styles.resultCells, display: 'inline-flex', marginRight: "10px"}}>
                                        <div style={{marginRight: '5px', textAlign: 'right', width: '80px'}}>
                                        {item.amount.length < 12?
                                        item.amount:
                                        <Tooltip title={item.amount}>
                                            <div>
                                            {item.amount.slice(0, 4 ) + '.....' + item.amount.slice(-4)}
                                            </div>
                                        </Tooltip>
                                        }
                                        </div>
                                        <span>
                                            {denomToAlias[item.denom as keyof typeof denomToAlias]}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        
                        {/* TABLE FOOTER */}
                        <TableFooter>
                                <TableRow id='footer-summary' style={styles.footerSummary}>
                                    <Typography variant="subtitle1" color="text.secondary" style={styles.footerSummaryLeft}>
                                        Total Recipients <span style={{marginLeft:'10px', color: 'white'}}>{multisendRows!.length!}</span>
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" style={styles.footerSummaryRight}>
                                        Total Amount Due
                                        <HtmlTooltip
                                            title={<div>{displayTooltipDueBalances(totalAmountDue(multisendRows!))}</div>}
                                        >
                                            <img src={ExclamationMark} alt="Exclamation-mark-icon" />
                                        </HtmlTooltip>
                                    </Typography>
                                </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div>
    ) 
}

export default OverviewTable 
