import { RootState } from 'store'
import { styles } from './styles'
import { updateModalState } from 'store/modals'
import { Dialog as MuiDialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowBackIcon, CancelRoundedIcon, ModalContainer } from '../styles'
import { initialState as initialModalState } from 'store/modals'
import { Box, Button, Tooltip, Typography } from '@mui/material'
import { MULTI_SEND_TYPE_URL, SINGLE_SEND_TYPE_URL } from 'utils/constants'
import { styles as defaultStyles } from '../styles'

const TransactionSelector = () => {

    const dispatch = useDispatch()
    const { transactionSelector, dataObject } = useSelector((state: RootState) => state.modalState)
    const { selectedWallet } = useSelector((state: RootState) => state.userState)
    const selectSendType: boolean = dataObject!.selectSendType as boolean

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

    const SendTypes = [
        {
            type: 'Single Send',
            coloring: "primary",
            disabled: false,
            tooltipText: 'Send funds to a single recipient',
            msgType: SINGLE_SEND_TYPE_URL
        },
        {
            type: 'Multi Send',
            coloring: "primary",
            disabled: true,
            tooltipText: 'COMING SOON - Send funds to multiple recipients',
            msgType: MULTI_SEND_TYPE_URL
        },
    ]

    const handleModalClose = () => {
        dispatch(updateModalState({ ...initialModalState }))
    }

    const closeModal = (ev: any, reason: string) => {
        if (reason !== 'backdropClick') {
            handleModalClose()
        }
    }

    const activateSelected = (selection: number) => {
        if (selection === 0) {
            dispatch(updateModalState({
                dataObject: {
                    selectSendType: true
                }
            }))
        }
    }

    const handleTxClick = (msgType: string) => {
        if (msgType === SINGLE_SEND_TYPE_URL) {

            handleModalClose()
            dispatch(updateModalState({ openSingleSendModal: true }))
            return
        }

        // TODO MultiSend TX Handling here
    }

    const goBackToSelector = () => {
        dispatch(updateModalState({
            dataObject: {
                selectSendType: false
            }
        }))
    }

    const TitleAndSubtitle = (): JSX.Element => {
        return (
            <Box>
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
            </Box>
        )
    }

    const DefaultSelection = (): JSX.Element => {
        return (
            <Box>
                <TitleAndSubtitle />
                <Box style={styles.btnHolder} gap={1}>
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
            </Box>
        )
    }

    const SelectSendType = (): JSX.Element => {
        return (
            <Box>
                <ArrowBackIcon onClick={goBackToSelector} />
                <TitleAndSubtitle />
                <Box style={styles.btnHolder} gap={1}>
                    {SendTypes.map((item, index) => (
                        <Tooltip title={item.tooltipText}>
                            <div>
                                <Button
                                    disabled={item.disabled}
                                    variant="contained"
                                    color={item.coloring as "inherit"}
                                    style={styles.TxBtns}
                                    onClick={() => handleTxClick(item.msgType)}
                                >
                                    {item.type}
                                </Button>
                            </div>
                        </Tooltip>
                    ))}
                </Box>
            </Box>
        )
    }

    return (
        <MuiDialog
            BackdropProps={defaultStyles.defaultBackDrop}
            open={transactionSelector!}
            onClose={closeModal}
            PaperProps={defaultStyles.defaultPaperProps}
        >
            <ModalContainer sx={{ padding: '30px' }}>
                <CancelRoundedIcon onClick={handleModalClose} />
                {
                    selectSendType ? <SelectSendType /> : <DefaultSelection />
                }
            </ModalContainer>
        </MuiDialog>
    )
}

export default TransactionSelector
