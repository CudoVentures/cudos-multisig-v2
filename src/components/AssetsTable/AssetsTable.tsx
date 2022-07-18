import { RootState } from 'store'
import { styles } from './styles'
import { updateModalState } from 'store/modals'
import { useDispatch, useSelector } from 'react-redux'
import { Box, ClickAwayListener } from '@mui/material'
import AssetIconComponent from 'utils/assetsIconHandler'
import { CancelRoundedIcon } from 'components/Dialog/styles'

const AssetsTable = () => {

    const dispatch = useDispatch()
    const { balances, selectedWallet } = useSelector((state: RootState) => state.userState)
    const { openFundWallet, walletRelated, openAssetsTable } = useSelector((state: RootState) => state.modalState)
  
    const handleModalClose = () => {
        if (walletRelated) {
            dispatch(updateModalState({
                openFundWallet: false,
                openAssetsTable: false,
                walletRelated: false
            }))
            return
        }

        dispatch(updateModalState({
            openAssetsTable: false,
            openFundWallet: true
        }))
    }

    const balancesToWorkWith = walletRelated?selectedWallet?.walletBalances:balances
    return (
        <ClickAwayListener onClickAway={openAssetsTable?handleModalClose:() => {}}>
            <Box style={{height: '125px', width: '100%'}}>
                {openFundWallet?<CancelRoundedIcon style={styles.customIcon} onClick={handleModalClose} />:null}
                {balancesToWorkWith!.length === 0?<AssetIconComponent denom={'noBalance'} amount={'0'} selectable={false}/>:
                    balancesToWorkWith!.map((balance, idx) => (
                        <AssetIconComponent denom={balance.denom} amount={balance.amount} selectable={walletRelated?false:true}/>
                ))}
            </Box>
        </ClickAwayListener>
    )
}

export default AssetsTable
