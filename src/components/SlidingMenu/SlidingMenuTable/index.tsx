import { Box, Button, Tooltip, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { styles } from './styles'
import { findOneWallet, formatAddress } from 'utils/helpers'
import { useNavigate } from 'react-router-dom'
import { cutFractions, separateDecimals, separateFractions } from 'utils/regexFormatting'
import { updatedSelectedWallet } from 'store/user'

interface tableData {
    walletName: string;
    walletAddress: string;
    walletBalance: string;
    walletDisplayBalance: string;
}

const SlidingMenuTable = () => {
    const dispatch = useDispatch()
    const { wallets, selectedWallet } = useSelector((state: RootState) => state.userState)

    function createData(
        walletName: string,
        walletAddress: string,
        walletBalance: string,
        walletDisplayBalance: string
    ): tableData {
        return {
            walletName,
            walletAddress,
            walletBalance,
            walletDisplayBalance
        };
    }

    const rows: tableData[] = [];
    if (wallets!.length > 0) {
        wallets!.forEach((wallet) =>
            rows.push(createData(
                wallet.walletName!,
                wallet.walletAddress!,
                separateDecimals(separateFractions(wallet.nativeBalance!)),
                cutFractions(separateDecimals(separateFractions(wallet.nativeBalance!)))
            ))
        )
    }

    const navigateToSelected = (walletAddress: string) => {
        const walletFound = findOneWallet(wallets!, walletAddress)
        dispatch(updatedSelectedWallet(walletFound))
    }

    return (
        <Box style={styles.summaryTableBody}>
            {rows.map((row, index) => (
                <Box
                    key={index}
                    sx={() => (styles.summaryTableRow)}
                    style={{
                        backgroundColor: row.walletAddress === selectedWallet!.walletAddress ?
                            'rgba(82, 166, 248, 0.2)' : '#28314E'
                    }}
                >
                    <Button
                        disableRipple
                        sx={styles.btnContentHolder}
                        onClick={() => navigateToSelected(row.walletAddress)}
                        style={styles.slidingMenuBtn}
                    >
                        <Box style={styles.summaryTableCell}>
                            <Tooltip title={row.walletName}>
                                <Typography
                                    color='white'
                                    style={styles.textContainer}
                                >
                                    {row.walletName}
                                </Typography>
                            </Tooltip>
                            <Tooltip title={row.walletAddress}>
                                <Typography
                                    style={{ width: '200px' }}
                                    variant="subtitle2"
                                    fontWeight={600}
                                    color={
                                        row.walletAddress === selectedWallet!.walletAddress ?
                                            "rgba(82, 166, 248, 1)" : "text.secondary"}
                                >
                                    {formatAddress(row.walletAddress, 25)}
                                </Typography>
                            </Tooltip>
                        </Box>
                        <Tooltip title={row.walletBalance}>
                            <Typography
                                color="white"
                                fontWeight={600}
                            >
                                {row.walletDisplayBalance.length > 13 ?
                                    `${formatAddress(row.walletDisplayBalance, 5)} CUDOS`
                                    :
                                    `${row.walletDisplayBalance} CUDOS`
                                }
                            </Typography>
                        </Tooltip>
                    </Button>
                </Box>
            ))}
        </Box>
    )
}

export default SlidingMenuTable
