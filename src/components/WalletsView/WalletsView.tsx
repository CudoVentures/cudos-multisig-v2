import { Box, Button, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { styles } from './styles'
import { formatAddress } from 'utils/helpers'
import MembersIcon from 'assets/vectors/members-icon.svg'
import { useNavigate } from 'react-router-dom'

interface Data {
    walletName: string;
    walletAddress: string;
    membersCount: number;
  }

const WalletsView = () => {
    const navigate = useNavigate()
    const { wallets } = useSelector((state: RootState) => state.userState)
    
    function createData(
        walletName: string,
        walletAddress: string,
        membersCount: number
        ): Data {
        return {
            walletName,
            walletAddress,
            membersCount
        };
    }
      
    const rows: Data[] = [];
      wallets!.forEach((wallet) =>
        rows.push(createData(
            wallet.walletName!, 
            wallet.walletAddress!,
            wallet.memberCount!
        ))
    )

    const openDashboard = (walletAddress: string) => {
        navigate(`/wallet/${walletAddress}`)
    }

    return (
        <TableContainer style={{width:'100%'}}>
            <Table style={{width:'100%'}} aria-label="simple table">
                <TableBody style={styles.summaryTableBody}>
                {rows.map((row) => (
                    <TableRow sx={() => ({
                        backgroundColor: '#28314E',
                        width: '100%',
                        borderRadius: '20px',
                        boxShadow: 5,
                        padding: '5px 25px 5px 5px',
                        margin: '8px 10px'
                      })}>
                        <TableCell style={{ fontWeight: '600', padding: '0px 10px 0px 35px', width: '310px'}} align='left'>
                            {row.walletName.length > 23?
                                <Tooltip title={row.walletName}>
                                    <div>
                                        {formatAddress(row.walletName, 5)}
                                    </div>
                                </Tooltip>
                                :row.walletName
                            }
                        </TableCell>
                        <TableCell style={{width: '600px'}} align="left">
                            <Typography style={{fontWeight:'600'}} variant="subtitle2" color="text.secondary">
                                {row.walletAddress}
                            </Typography>
                        </TableCell>
                        <TableCell style={{width: '200px'}} align="left">
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
