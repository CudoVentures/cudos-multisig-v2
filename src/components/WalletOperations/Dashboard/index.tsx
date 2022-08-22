import { styles } from './styles'
import { RootState } from 'store'
import Dialog from 'components/Dialog'
import Card from 'components/Card/Card'
import { CHAIN_NAME } from 'utils/constants'
import { formatAddress } from 'utils/helpers'
import { updateModalState } from 'store/modals'
import TxsSummaryTable from './TxsSummaryTable'
import { useDispatch, useSelector } from 'react-redux'
import WalletIcon from 'assets/vectors/wallet-icon.svg'
import AssetIconComponent from 'utils/assetsIconHandler'
import { Box, Button, Tooltip, Typography } from '@mui/material'
import { CopyAndFollowComponent } from 'components/Dialog/ReusableModal/helpers'

const Dashboard = ({
    setSelection
}:{
    setSelection: (index: number) => void;
}) => {

    const { selectedWallet, balances } = useSelector((state: RootState) => state.userState)
    const dispatch = useDispatch()

    const showAllAssets = () => {
        dispatch(updateModalState({
            walletRelated: true,
            openFundWallet: true,
            openAssetsTable: true
        }))
    }

    return (
        <Box>
            <Dialog />
            <Box style={styles.dashboardBoxHolder}>
                <Card style={styles.upperLeftCardHolder}>
                    <Typography style={{ marginBottom: '15px'}} variant="subtitle1" fontWeight={600} color="text.secondary">
                        ACCOUNT INFORMATION
                    </Typography>
                    <Box style={{width: '100%'}}>
                        <Box style={styles.formattedAddressHolder}>
                            <img src={WalletIcon} alt="wallet-icon" />
                            <Tooltip title={selectedWallet?.walletAddress!}>
                                <div style={{marginLeft: '10px'}}>
                                    {formatAddress(selectedWallet?.walletAddress!, 30)}
                                </div>
                            </Tooltip>
                           <CopyAndFollowComponent address={selectedWallet?.walletAddress!} />
                        </Box>
                    </Box>
                    <Box style={styles.upperCardBoxHolder}>
                        <Box style={styles.upperCardChildBoxHolder}>
                            <Typography style={{marginBottom: '10px'}} variant="subtitle2" fontWeight={600} color="text.secondary">
                                NETWORK
                            </Typography>
                            <Typography fontWeight={600}>
                                {CHAIN_NAME.toUpperCase()}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography style={{marginBottom: '10px'}} variant="subtitle2" fontWeight={600} color="text.secondary">
                                MEMBERS
                            </Typography>
                            <Typography fontWeight={600}>
                                {selectedWallet?.memberCount}
                            </Typography>
                        </Box>
                        <Box>
                        <Typography style={{marginBottom: '10px'}} variant="subtitle2" fontWeight={600} color="text.secondary">
                                REQ. APPROVALS
                            </Typography>
                            <Typography fontWeight={600}>
                                {`${selectedWallet?.threshold} / ${selectedWallet?.memberCount}`}
                            </Typography>
                        </Box>
                    </Box>
                </Card>
                <Card style={styles.upperRightCardHolder}>
                    <Box style={styles.upperRightBoxHolder}>
                       <div style={styles.upperRightInfoHolder}>
                            <Typography style= {{float: 'left'}} variant="subtitle1" fontWeight={600} color="text.secondary">
                                BALANCE & ASSETS
                            </Typography>
                            <Box style={styles.balanceAssetsBtnHolder}>
                                {selectedWallet!.walletBalances!.length > 2?
                                // BUTTON VISIBLE ONLY IF MORE THAN 2 ASSETS ARE PRESENT
                                <Button
                                    disableRipple
                                    variant="text"
                                    style={{textDecoration: 'none'}}
                                    onClick={showAllAssets}
                                    >
                                    <span>{"All assets"}</span>
                                </Button>:null}
                                <Button
                                    disabled={balances?.length === 0}
                                    variant="contained"
                                    color="secondary"
                                    sx={() => ({
                                    width: '130px',
                                    height: '35px',
                                    fontWeight: 700
                                    })}
                                    onClick={() => dispatch(updateModalState({ openFundWallet: true }))}
                                >
                                    Fund wallet
                                </Button>
                            </Box>
                        </div>
                        <Box style={{height: '125px', width: '100%'}}>
                            {selectedWallet?.walletBalances?.length === 0?<AssetIconComponent denom={'noBalance'} amount={'0'}/>:
                                selectedWallet?.walletBalances?.map((balance, idx) => (
                                idx < 2?
                                <AssetIconComponent denom={balance.denom} amount={balance.amount}/>
                                :null
                            ))}
                        </Box>
                    </Box>
                </Card>
            </Box>
            <Card style={styles.lowerCardHolder}>
                <Box style={styles.lowerBoxHolder}>
                    <Typography style={{ marginBottom: '15px'}} variant="subtitle1" fontWeight={600} color="text.secondary">
                            RECENT TRANSACTIONS
                    </Typography>
                    <Button
                        disableRipple
                        variant="text"
                        style={{textDecoration: 'none'}}
                        onClick={() => setSelection(1)}
                        >
                        <span>{"See all"}</span>
                    </Button>
                </Box>
               <TxsSummaryTable />
            </Card>
        </Box>
    )
}

export default Dashboard
