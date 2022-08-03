import { RootState } from 'store'
import { styles } from './styles'
import { updateModalState } from 'store/modals'
import { Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { CancelRoundedIcon, ModalContainer } from '../styles'
import { initialState as initialModalState } from 'store/modals'
import { Menu, MenuItem, Box, Button, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { MULTI_SEND_TYPE_URL, SINGLE_SEND_TYPE_URL } from 'utils/constants'
import { ComingSoonWrapper } from 'utils/wrappers'

const TransactionSelector = () => {

    const dispatch = useDispatch()
    const { transactionSelector } = useSelector((state: RootState) => state.modalState)
    const { selectedWallet } = useSelector((state: RootState) => state.userState)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const TxTypes = [
        {
            type: 'Send Funds',
            coloring: "primary",
            disabled: selectedWallet!.walletBalances!.length > 0 ? false : true,
            tooltipText: selectedWallet!.walletBalances!.length > 0 ? '' : 'It seems the chosen wallet have no balances'
        },
        {
            type: 'Send NFTs',
            coloring: "primary",
            disabled: true,
            tooltipText: 'Coming soon'
        },
        {
            type: 'Contract Interaction',
            coloring: "secondary",
            disabled: true,
            tooltipText: 'Coming soon'
        },
    ]

    const openTxMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleModalClose = () => {
        dispatch(updateModalState({ ...initialModalState }))
    }

    const closeModal = (ev: any, reason: string) => {
        if (reason !== 'backdropClick') {
            handleModalClose()
        }
    }

    const activateSelected = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, selection: number) => {
        if (selection === 0) {
            openTxMenu(event)
        }
    }

    const handleTxClick = (msgType: string) => {
        setAnchorEl(null)
        // TODO Implement Tx Type handling
    }

    return (
        <MuiDialog
            open={transactionSelector!}
            onClose={closeModal}
            PaperProps={styles.dialogPaperProps}
        >
            <ModalContainer sx={{ padding: '30px' }}>
                <CancelRoundedIcon onClick={handleModalClose} />
                <Typography
                    variant="h5"
                    fontWeight={900}
                    lineHeight={2}
                    letterSpacing={2}
                >
                    Create MultiSig Transaction
                </Typography>

                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    fontWeight={600}
                    letterSpacing={1}
                >
                    Choose the transaction type you’d like to execute
                </Typography>

                <Box style={styles.btnHolder} gap={1}>
                    {TxTypes.map((item, index) => (
                        <Tooltip title={item.tooltipText}>
                            <div>
                                <Button
                                    disabled={item.disabled}
                                    variant="contained"
                                    color={item.coloring as "inherit"}
                                    style={styles.TxBtns}
                                    onClick={(e) => activateSelected(e, index)}
                                >
                                    {item.type}
                                </Button>
                            </div>
                        </Tooltip>
                    ))}
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={styles.menuProps}
                    MenuListProps={styles.menuListProps}
                >
                    <ComingSoonWrapper>
                        <MenuItem disabled onClick={() => handleTxClick(SINGLE_SEND_TYPE_URL)}>Single Transaction</MenuItem>
                        <MenuItem disabled onClick={() => handleTxClick(MULTI_SEND_TYPE_URL)}>Multi Transaction</MenuItem>
                    </ComingSoonWrapper>
                </Menu>
            </ModalContainer>
        </MuiDialog>
    )
}

export default TransactionSelector
