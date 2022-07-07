import { RootState } from 'store'
import { styles } from './styles'
import { updateModalState } from 'store/modals'
import { useDispatch, useSelector } from 'react-redux'
import { Box, ClickAwayListener } from '@mui/material'
import AssetIconComponent from 'utils/assetsIconHandler'
import { CancelRoundedIcon } from 'components/Dialog/styles'

const AssetsTable = () => {

    const dispatch = useDispatch()
    const { balances } = useSelector((state: RootState) => state.userState)
    const { openFundWallet } = useSelector((state: RootState) => state.modalState)
  

    const handleModalClose = () => {
        dispatch(updateModalState({
            openAssetsTable: false,
            openFundWallet: true
        }))
    }

    return (
        <ClickAwayListener onClickAway={openFundWallet?handleModalClose:() => {}}>
            <Box style={{height: '125px', width: '100%'}}>
                {openFundWallet?<CancelRoundedIcon style={styles.customIcon} onClick={handleModalClose} />:null}
                {balances!.length === 0?<AssetIconComponent denom={'noBalance'} amount={'0'} selectable={false}/>:
                    balances!.map((balance, idx) => (
                        <AssetIconComponent denom={balance.denom} amount={balance.amount} selectable={true}/>
                ))}
            </Box>
        </ClickAwayListener>
    )
}

export default AssetsTable
