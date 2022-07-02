import { Button, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { styles } from './styles'
import { formatAddress } from 'utils/helpers'
import { useNavigate } from 'react-router-dom'
import { cutFractions, separateDecimals, separateFractions } from 'utils/regexFormatting'

interface Data {
    walletName: string;
    walletAddress: string;
    walletBalance: string;
    walletDisplayBalance: string;
  }

const SlidingMenuTable = () => {
    const navigate = useNavigate()
    const { wallets, selectedWallet } = useSelector((state: RootState) => state.userState)
    
    function createData(
        walletName: string,
        walletAddress: string,
        walletBalance: string,
        walletDisplayBalance: string
        ): Data {
        return {
            walletName,
            walletAddress,
            walletBalance,
            walletDisplayBalance
        };
    }
      
    const rows: Data[] = [];
      wallets!.forEach((wallet) =>
        rows.push(createData(
            wallet.walletName!, 
            wallet.walletAddress!,
            separateDecimals(separateFractions(wallet.nativeBalance)),
            cutFractions(separateDecimals(separateFractions(wallet.nativeBalance)))
        ))
    )

    const navigateToSelected = (walletAddress: string) => {
        navigate(`/wallet/${walletAddress}`)
    }

    return (
        <TableContainer style={{width:'100%'}}>
            <Table style={{width:'100%'}} aria-label="simple table">
                <TableBody style={styles.summaryTableBody}>
                {rows.map((row) => (
                        <TableRow sx={() => (styles.summaryTableRow)} style={{ backgroundColor: row.walletAddress === selectedWallet!.walletAddress?'rgba(82, 166, 248, 0.2)':'#28314E'}}>
                             <Button 
                                disableRipple
                                sx={{
                                    ':hover': {
                                    bgcolor: 'rgba(82, 166, 248, 0.1)',
                                    },
                                    borderRadius: '10px',
                                    height: '50px',
                                    width: '100%',
                                }}
                                onClick={() => navigateToSelected(row.walletAddress)} 
                                style={styles.slidingMenuBtn}
                            >
                                <TableCell style={styles.summaryTableCell} align='left'>
                                    <Tooltip title={row.walletName}>
                                        <div style={styles.textContainer}>
                                            {row.walletName}
                                        </div>
                                    </Tooltip>
                                    <Typography style={{width: '200px'}} variant="subtitle2" fontWeight={600} color={row.walletAddress === selectedWallet!.walletAddress?"rgba(82, 166, 248, 1)":"text.secondary"}>
                                        <Tooltip title={row.walletAddress}>
                                            <div>
                                                {formatAddress(row.walletAddress, 25)}
                                            </div>
                                        </Tooltip>
                                    </Typography>
                                </TableCell>
                                <TableCell style={{width: '200px'}} align='right'>
                                    <Typography fontWeight={600}>
                                        {row.walletDisplayBalance.length > 13?
                                        <Tooltip title={row.walletBalance}>
                                        <div>
                                            {`${formatAddress(row.walletDisplayBalance, 5)} CUDOS`}
                                        </div>
                                        </Tooltip>:
                                        <Tooltip title={row.walletBalance}>
                                        <div>
                                            {`${row.walletDisplayBalance} CUDOS`}
                                        </div>
                                        </Tooltip>}
                                    </Typography>
                                </TableCell>
                            </Button>
                        </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default SlidingMenuTable
