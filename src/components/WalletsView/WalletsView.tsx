import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { styles } from './styles'
import MembersIcon from 'assets/vectors/members-icon.svg'
import { useNavigate } from 'react-router-dom'
import { updatedSelectedWallet } from 'store/user'
import { findOneWallet, formatAddress } from 'utils/helpers'

import { 
    Box, 
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableRow, 
    Tooltip, 
    Typography 
} from '@mui/material'
interface tableData {
    walletName: string;
    walletAddress: string;
    membersCount: number;
  }

const WalletsView = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { wallets } = useSelector((state: RootState) => state.userState)
    
    function createTableData(
        walletName: string,
        walletAddress: string,
        membersCount: number
        ): tableData {
        return {
            walletName,
            walletAddress,
            membersCount
        }
    }

    const rows: tableData[] = []
    wallets!.forEach((wallet) =>
        rows.push(createTableData(
            wallet.walletName!, 
            wallet.walletAddress!,
            wallet.memberCount!
        ))
    )

    const openDashboard = (walletAddress: string) => {
        const wallet = findOneWallet(wallets!, walletAddress)
        dispatch(updatedSelectedWallet(wallet))
        navigate(`/dashboard`)
    }

    return (
        <TableContainer style={{width:'100%'}}>
            <Table style={{width:'100%'}} aria-label="simple table">
                <TableBody style={styles.summaryTableBody}>
                {rows.map((row) => (
                    <TableRow sx={() => (styles.summaryTableRow)}>
                        <TableCell style={styles.summaryTableCell} align='left'>
                            <Tooltip title={row.walletName}>
                                <div style={styles.textContainer}>
                                    {row.walletName}
                                </div>
                            </Tooltip>
                        </TableCell>
                        <TableCell style={{width: '580px'}} align="left">
                            <Typography style={{fontWeight:'600'}} variant="subtitle2" color="text.secondary">
                                <Tooltip title={row.walletAddress}>
                                    <div>
                                        {formatAddress(row.walletAddress, 55)}
                                    </div>
                                </Tooltip>
                            </Typography>
                        </TableCell>
                        <TableCell style={{width: '150px'}} align="left">
                            <Box style={{fontWeight: '600', display: 'flex', alignItems: 'center'}}>
                                <img src={MembersIcon} alt="Members Icon" />
                                <Typography style={{margin: '0 10px'}} variant="inherit" color="text.secondary">
                                    Members
                                </Typography>
                                {row.membersCount}
                            </Box>
                        </TableCell>
                        <TableCell align="left">
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={() => ({
                                width: '150px',
                                fontWeight: 700,
                                padding: '11px',
                                })}
                                onClick={() => openDashboard(row.walletAddress)}
                            >
                                Open Wallet
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default WalletsView
