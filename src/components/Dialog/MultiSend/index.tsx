import { assertIsDeliverTxSuccess, EncodeObject, StdFee } from 'cudosjs'
import { RootState } from 'store'
import { styles } from './styles'
import { ArrowBackIcon, styles as defaultStyles } from '../styles'
import BigNumber from 'bignumber.js'
import { calculateFeeFromGas, displayWorthyFee } from 'utils/helpers'
import { updateModalState } from 'store/modals'
import { Dialog as MuiDialog } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AssetsTable from 'components/AssetsTable/AssetsTable'
import { CancelRoundedIcon, ModalContainer } from '../styles'
import { initialState as initialModalState } from 'store/modals'
import { initialState as initialSendFundsState } from 'store/sendFunds'
import { Box, Button, Tooltip, Typography } from '@mui/material'
import { handleFullBalanceToPrecision } from 'utils/regexFormatting'
import { executeMsgs, getMultiSendMsgAndFees } from '../ReusableModal/helpers'
import { BalanceMap, totalAmountDue } from 'utils/multiSendTableHelper'
import MultiSendTable from './MultiSendTable'
import { updateSendFunds } from 'store/sendFunds'
import { ConnectedAddressAndNetwork, Preview, SingleUserInput } from './helperComponents'

import {
    DEFAULT_LOADING_MODAL_MSG,
    FEE_ESTIMATION_ERROR,
    GENERAL_FAILURE_MSG,
    GENERAL_FAILURE_TITLE,
    INSUFFICIENT_BALANCE,
    INSUFFICIENT_WALLET_BALANCE,
    INVALID_DATA_PROMPT_MSG,
    MULTI_SEND_TYPE_URL,
    PROPOSAL_CREATION_FAILURE_TITLE,
    PROPOSAL_CREATION_LOADING_TITLE,
    PROPOSAL_CREATION_SUCCESS_MSG,
    SINGLE_TX_PROMPT_MSG,
} from 'utils/constants'

const MultiSend = () => {

    const dispatch = useDispatch()
    const [sufficientWalletBalance, setSufficientWalletBalance] = useState<boolean>(false)
    const [sufficientAccountBalance, setSufficientAccountBalance] = useState<boolean>(false)
    const [singleLikeTx, setSingleLikeTx] = useState<boolean>(true)
    const [preview, setPreview] = useState<boolean>(false)
    const [msg, setMsg] = useState<EncodeObject>({ typeUrl: '', value: '' })
    const [fees, setFees] = useState<StdFee>({ gas: '', amount: [] })
    const { openMultiSendModal, openAssetsTable } = useSelector((state: RootState) => state.modalState)
    const { selectedWallet, address, nativeBalance, connectedLedger } = useSelector((state: RootState) => state.userState)
    const { multisendRows } = useSelector((state: RootState) => state.sendFunds)

    useEffect(() => {
        if (multisendRows!.length! < 2) {
            setSingleLikeTx(true)
            setSufficientWalletBalance(false)
            return
        }
        setSingleLikeTx(false)
        setSufficientWalletBalance(
            sufficientWalletBalances()
        )
    }, [multisendRows])

    useEffect(() => {
        if (preview && fees) {
            setSufficientAccountBalance(
                new BigNumber(fees.amount[0].amount).isLessThanOrEqualTo(nativeBalance!)
            )
            return
        }
        setSufficientAccountBalance(false)
    }, [preview])

    const clean = () => {
        setPreview(false)
        setMsg({ typeUrl: '', value: '' })
        setFees({ gas: '', amount: [] })
        dispatch(updateSendFunds({ ...initialSendFundsState }))
    }

    const handleModalClose = () => {
        clean()
        dispatch(updateModalState({ ...initialModalState }))
    }

    const closeModal = (e: {}, reason: string) => {
        if (reason !== 'backdropClick') {
            handleModalClose()
        }
    }

    const getTooltip = (): string => {

        if (multisendRows?.length! < 1) {
            return INVALID_DATA_PROMPT_MSG
        }

        if (singleLikeTx) {
            return SINGLE_TX_PROMPT_MSG
        }

        if (!preview && !sufficientWalletBalance) {
            return INSUFFICIENT_WALLET_BALANCE
        }

        if (preview && !sufficientAccountBalance) {
            return INSUFFICIENT_BALANCE
        }

        return ''
    }

    const goBack = () => {
        if (preview) {
            setPreview(false)
            return
        }

        handleModalClose()
        dispatch(updateModalState({
            transactionSelector: true,
            dataObject: {
                selectSendType: true
            }
        }))
    }

    const sufficientWalletBalances = (): boolean => {

        let result: boolean = true

        const balanceMapper: BalanceMap = {}
        for (const balance of selectedWallet!.walletBalances!) {
            balanceMapper[balance.denom] = new BigNumber(balance.amount)
        }

        for (const txBalance of multisendRows!) {

            if (!balanceMapper[txBalance.denom]) {
                result = false
                clean()
                dispatch(updateModalState({
                    failure: true,
                    title: GENERAL_FAILURE_TITLE,
                    message: GENERAL_FAILURE_MSG
                }))
                console.error('Missmatching balances')
                break
            }

            let amount: BigNumber = new BigNumber(txBalance.amount)
            if (txBalance.denom === 'acudos') {
                amount = new BigNumber(parseFloat(txBalance.amount) * 10 ** 18)
            }

            balanceMapper[txBalance.denom] = balanceMapper[txBalance.denom].minus(amount)

            if (balanceMapper[txBalance.denom].isLessThan(0)) {
                result = false
                break
            }
        }

        return result
    }

    const generateMsgAndFees = async () => {
        try {
            const { msg, fee } = await getMultiSendMsgAndFees(
                multisendRows!,
                selectedWallet?.walletAddress!,
                address!,
                connectedLedger!
            )

            setMsg(msg)
            setFees(fee)
            setPreview(true)

        } catch (error: any) {
            dispatch(updateModalState({
                failure: true,
                title: GENERAL_FAILURE_TITLE,
                msgType: FEE_ESTIMATION_ERROR,
                message: GENERAL_FAILURE_MSG
            }))

            console.error(error.message)
        }
    }

    const signAndBroadcast = async () => {

        dispatch(updateModalState({
            openSingleSendModal: false,
            loading: true,
            title: PROPOSAL_CREATION_LOADING_TITLE,
            message: DEFAULT_LOADING_MODAL_MSG
        }))

        try {
            const result = await executeMsgs(address!, [msg], fees, connectedLedger!)
            assertIsDeliverTxSuccess(result)

            const tempFee = calculateFeeFromGas(result.gasUsed)
            const displayWorthyFee = handleFullBalanceToPrecision(tempFee, 4, 'CUDOS')

            const dataObjectForSuccessModal = {
                from: selectedWallet?.walletAddress!,
                to: multisendRows?.length!,
                amount: totalAmountDue(multisendRows!),
                txHash: result.transactionHash,
                txFee: displayWorthyFee,
            }

            clean()

            dispatch(updateModalState({
                loading: false,
                success: true,
                msgType: MULTI_SEND_TYPE_URL,
                dataObject: dataObjectForSuccessModal,
                message: PROPOSAL_CREATION_SUCCESS_MSG
            }))

        } catch (error: any) {
            dispatch(updateModalState({
                loading: false,
                failure: true,
                title: PROPOSAL_CREATION_FAILURE_TITLE,
                message: GENERAL_FAILURE_MSG
            }))
            console.error(error.message)
        }
    }

    return (
        <MuiDialog
            BackdropProps={defaultStyles.defaultBackDrop}
            open={openMultiSendModal!}
            onClose={closeModal}
            PaperProps={styles.specificPaperProps}
        >
            <ModalContainer sx={{ padding: '30px' }}>
                {openAssetsTable ? <AssetsTable /> :
                    <div>
                        <ArrowBackIcon onClick={goBack} />
                        <CancelRoundedIcon onClick={handleModalClose} />
                        <Typography
                            style={styles.multiSigTitle}
                            variant="h5"
                            fontWeight={900}
                            letterSpacing={2}>

                            Send Funds: Multi
                        </Typography>
                        <ConnectedAddressAndNetwork />
                        {
                            preview ? <Preview displayWorthyFee={displayWorthyFee(fees)} /> :
                                <Box
                                    style={styles.contentHolder}
                                    gap={1}
                                >
                                    <SingleUserInput />
                                    <MultiSendTable />
                                </Box>
                        }
                        <Box style={preview ? styles.borderlessMainBtnsHolder : styles.mainBtnsHolder}>
                            <Tooltip title={getTooltip()}>
                                <div>
                                    <Button
                                        disabled={preview ? !sufficientAccountBalance : !sufficientWalletBalance}
                                        variant="contained"
                                        color="primary"
                                        sx={styles.mainBtns}
                                        onClick={preview ? signAndBroadcast : generateMsgAndFees}
                                    >
                                        {preview ? !sufficientAccountBalance ? "Insufficient funds" : "Propose" : "Transaction Summary"}
                                    </Button>
                                </div>
                            </Tooltip>
                        </Box>
                    </div>}
            </ModalContainer>
        </MuiDialog>
    )
}

export default MultiSend
