import { RootState } from 'store'
import { styles } from './styles'
import { updateModalState } from 'store/modals'
import { Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { CancelRoundedIcon, ModalContainer } from '../styles'
import { initialState as initialModalState } from 'store/modals'
import { Box, Button, Tooltip, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const TransactionSelector = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { transactionSelector } = useSelector((state: RootState) => state.modalState)
    const { selectedWallet } = useSelector((state: RootState) => state.userState)

    const handleModalClose = () => {
        dispatch(updateModalState({ ...initialModalState }))
    }
      
    const closeModal = (ev: any, reason: string) => {
        if (reason !== 'backdropClick') {
          handleModalClose()
        }
    }

    const TxTypes = [
        { 
            type: 'Send Funds', 
            coloring: "primary", 
            disabled: selectedWallet!.walletBalances!.length > 0?false:true,
            tooltipText: selectedWallet!.walletBalances!.length > 0?'':'It seems the chosen wallet have no balances'
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

    const activateSelected = (selection: number) => {
        switch(selection) {
            case 0:
                handleModalClose()
                navigate("/send-funds")
                break

            default:
                break
        }
    }

    return (
        <MuiDialog
            open={transactionSelector!}
            onClose={closeModal}
            PaperProps={{
                sx: {
                background: 'transparent',
                width: '100%',
                height: 'min-content',
                boxShadow: 'none',
                position: 'absolute',
                top: '1%',
                overflow: 'hidden',
                borderRadius: '25px'
                }
            }}
        >
            <ModalContainer sx={{padding: '30px' }}>
                <CancelRoundedIcon onClick={handleModalClose} />
                <Typography
                    variant="h5" 
                    fontWeight={900} 
                    lineHeight={2} 
                    letterSpacing={2}>
                    Create MultiSig Transaction
                </Typography>

                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    fontWeight={600}
                    letterSpacing={1}>
                    Choose the transaction type you’d like to execute
                </Typography>

                <Box
                    marginTop='40px'
                    width='100%'
                    height='100%'
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                    gap={1}
                >
                    {TxTypes.map((item, index) => (
                        <Tooltip title={item.tooltipText}>
                            <div>
                                <Button
                                disabled={item.disabled}
                                variant="contained"
                                color={item.coloring as "inherit"}
                                style={styles.TxBtns}
                                onClick={() => activateSelected(index)}
                                >
                                {item.type}
                            </Button>
                        </div>
                        </Tooltip>
                    ))}
                </Box>
            </ModalContainer>
        </MuiDialog>
    )
}

export default TransactionSelector
