
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Box, Button, Tooltip, Typography } from '@mui/material'
import Card from 'components/Card/Card'
import { styles } from './styles'
import Dialog from 'components/Dialog'
import { useEffect, useState } from 'react'
import Steps, { getCurrentSendFundsStep, StepInfo, StringStep } from 'components/MultiSendCreationSteps'
import { useNavigate } from 'react-router-dom'
import { updateWalletCreationSteps } from 'store/walletCreation'
import { initialState as initialModalState } from 'store/modals'
import { initialState as initialSendFundsState } from 'store/sendFunds'
import { signingClient } from 'utils/config'
import { assertIsDeliverTxSuccess, Coin, EncodeObject, GasPrice, StdFee } from 'cudosjs'
import { updateModalState } from 'store/modals'
import { handleFullBalanceToPrecision } from 'utils/regexFormatting'
import { calculateFeeFromGas, enforceCustomFeesOverKeplr } from 'utils/helpers'
import { updateSendFunds } from 'store/sendFunds'
import { DynamicTable } from 'components/MultiSendCreationSteps/components/DynamicTable'
import AssetIconComponent from 'utils/assetsIconHandler'
import { BalanceMap, createArrayOfCoinsFromMapper, createArrayOfRecipients, MultiSendUser, RecipientBalances, totalAmountDue } from 'utils/multiSendTableHelper'
import BigNumber from 'bignumber.js'
import OverviewTable from 'components/MultiSendCreationSteps/components/OverviewTable'
import SignAndSubmit from 'components/MultiSendCreationSteps/components/SignAndSubmit'

import { 
    DEFAULT_MEMO, 
    DEFAULT_META_DATA, 
    DEFAULT_MULTIPLIER,
    GAS_PRICE, 
    NATIVE_TOKEN_DENOM, 
    GENERAL_FAILURE_MSG, 
    DEFAULT_LOADING_MODAL_MSG, 
    GENERAL_FAILURE_TITLE,
    FEE_ESTIMATION_ERROR,
    PROPOSAL_CREATION_LOADING_TITLE,
    PROPOSAL_CREATION_SUCCESS_TYPE,
    PROPOSAL_CREATION_SUCCESS_MSG,
    PROPOSAL_CREATION_FAILURE_TITLE,
    PROPOSAL_CREATION_FAILURE_TYPE
} from 'utils/constants'

const SendFundsProposal = () => {
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentStep = parseInt(getCurrentSendFundsStep())
    const { address, selectedWallet, nativeBalance } = useSelector((state: RootState) => state.userState)
    const { multisendRows } = useSelector((state: RootState) => state.sendFunds)
    const [fees, setFees] = useState<StdFee>({gas: '', amount: []})
    const [msg, setMsg] = useState<EncodeObject>({typeUrl: '', value: ''})

    const clearState = async () => {
        dispatch(updateWalletCreationSteps({ currentStep: '1' }))
        dispatch(updateSendFunds({ ...initialSendFundsState }))
    }

    const goHome = () => {
        clearState()

        if(selectedWallet) {
            navigate("/dashboard")
            return
        }

        navigate("/welcome")
    }

    const broadcastMsg = async () => {
        
        dispatch(updateModalState({
            loading: true,
            title: PROPOSAL_CREATION_LOADING_TITLE,
            message: DEFAULT_LOADING_MODAL_MSG
        }))

        enforceCustomFeesOverKeplr()

        try {
            const result = await (await signingClient).signAndBroadcast(address!, [msg], fees!, DEFAULT_MEMO)
            assertIsDeliverTxSuccess(result)

            const tempFee = calculateFeeFromGas(result.gasUsed)
            const displayWorthyFee = handleFullBalanceToPrecision(tempFee, 4, 'CUDOS')

            const dataObjectForSuccessModal = {
                txHash: result.transactionHash,
                txFee: displayWorthyFee
            }

            clearState()
            dispatch(updateModalState({
                loading: false,
                success: true,
                msgType: PROPOSAL_CREATION_SUCCESS_TYPE,
                dataObject: dataObjectForSuccessModal,
                message: PROPOSAL_CREATION_SUCCESS_MSG
            }))

        } catch (e: any){
            dispatch(updateModalState({
                loading: false,
                failure: true,
                msgType: PROPOSAL_CREATION_FAILURE_TYPE,
                title: PROPOSAL_CREATION_FAILURE_TITLE, 
                message: GENERAL_FAILURE_MSG
            }))
            console.debug(e.message)
        }
    }



    const renderStep = (step: string) => {
        let tempStep: number = parseInt(step)
        if (tempStep < 1) {tempStep = 1}
        if (tempStep > 3) {tempStep = 3}
        const stepToSet = tempStep.toString()
        dispatch(updateSendFunds({ currentStep: stepToSet }))
      }

    const renderPreviousStep = () => {
        const stepToRender = (currentStep - 1).toString()
        renderStep(stepToRender)
    }

    const getFundSendProposalMsgAndFees = async () => {
        
        const totalCoinsDue: Coin[] = createArrayOfCoinsFromMapper(totalAmountDue(multisendRows!))
        const recipients: MultiSendUser[] = createArrayOfRecipients(multisendRows!)
        const sender: MultiSendUser[] = [{
            address: selectedWallet!.walletAddress!,
            coins: totalCoinsDue
        }]

        return await (await signingClient).groupModule.msgMultiSendProposal(
            sender,
            recipients,
            selectedWallet!.walletAddress!,
            address!,
            DEFAULT_META_DATA,
            GasPrice.fromString(GAS_PRICE+NATIVE_TOKEN_DENOM),
            DEFAULT_MULTIPLIER,
            DEFAULT_MEMO
         )
    }

    const generateFundSendProposalMsgAndFees = async () => {
        try {
            const { msg, fee } = await getFundSendProposalMsgAndFees()
            dispatch(updateModalState({dataObject: {
                estimatedFee: fee
            }}))
            setMsg(msg)
            setFees(fee)

        } catch (error: any) {
            dispatch(updateModalState({
                failure: true, 
                title: GENERAL_FAILURE_TITLE,
                msgType: FEE_ESTIMATION_ERROR,
                message: GENERAL_FAILURE_MSG
            }))
            console.debug(error.message)
        }
    }

    const renderNextStep = async () => {

        if (currentStep === 2) {
           await generateFundSendProposalMsgAndFees()
        }

        const stepToRender = (currentStep + 1).toString()
        renderStep(stepToRender)
    }

    useEffect(() => {
        dispatch(updateWalletCreationSteps({ currentStep: '1' }))
        dispatch(updateModalState({ ...initialModalState }))
        dispatch(updateSendFunds({ ...initialSendFundsState }))
        document.getElementById("right-card-appear")!.style.display = 'none'
        setTimeout(() => document.getElementById("entire-create-wallet-page-appear")!.style.opacity = '1', 50)
        setTimeout(() => document.getElementById("resizable-card-right")!.style.width = '950px', 100)
        setTimeout(() => document.getElementById("resizable-card-left")!.style.width = '300px', 100)
        setTimeout(() => document.getElementById("resizable-card-right")!.style.marginLeft = '40px', 100)
        setTimeout(() => document.getElementById("right-card-appear")!.style.display = 'block', 500)
        setTimeout(() => document.getElementById("left-steps-appear")!.style.opacity = '1', 600)
        setTimeout(() => document.getElementById("right-card-appear")!.style.opacity = '1', 600)
      }, [])

    const sufficientAccountBalance = (): boolean => {
        if (!fees.amount[0]) {return false}
        return new BigNumber(fees.amount[0].amount).isLessThanOrEqualTo(nativeBalance!)
    }

    const sufficientWalletBalances = (): boolean => {
        
        if (multisendRows!.length! < 1) {return false}

        let result: boolean = true

        const balanceMapper: BalanceMap = {}
        for (const balance of selectedWallet!.walletBalances!) {
            balanceMapper[balance.denom] = new BigNumber(balance.amount)
        }

        for (const txBalance of multisendRows!) {
            
            if (!balanceMapper[txBalance.denom]) {
                result = false
                dispatch(updateModalState({
                    failure: true,
                    title: GENERAL_FAILURE_TITLE,
                    message: GENERAL_FAILURE_MSG
                }))
                console.debug('Missmatching balances')
                clearState()
                break
            }
            
            let amount: BigNumber = new BigNumber(txBalance.amount)

            switch (txBalance.denom) {
                case 'acudos':
                    amount = new BigNumber(parseFloat(txBalance.amount) * 10 ** 18)
                    break
                default:
                    break
            }
            
            balanceMapper[txBalance.denom] = balanceMapper[txBalance.denom].minus(amount)

            if (balanceMapper[txBalance.denom].isLessThan(0)) {
                result = false
                break
            }
            
        }

        return result
    }

    let validData = 
        currentStep === 1?sufficientWalletBalances():
        currentStep === 2?true:
        currentStep === 3?sufficientAccountBalance():
        false

    return (
        <Box id='entire-create-wallet-page-appear' style={{...styles.holder, ...styles.contentAppear}}>
            <Dialog/>
    
            {/* ////LEFT CARD - STEPS////// */}
            <Card id='resizable-card-left' style={styles.leftSteps}>
                <div id='left-steps-appear' style={{...styles.contentAppear}}>
                    <Steps />
                    <Box style={{width: '100%'}}>
                            <Typography style= {{marginBottom: '5px', float: 'left'}} variant="subtitle2" fontWeight={600} color="text.secondary">
                                Wallet Balances
                            </Typography>
                            <Box style={{width: '100%'}}>
                                {selectedWallet?.walletBalances?.length === 0?<AssetIconComponent denom={'noBalance'} amount={'0'}/>:
                                    selectedWallet?.walletBalances?.map((balance, idx) => (
                                    idx < 2?
                                    <AssetIconComponent denom={balance.denom} amount={balance.amount} smaller={true}/>
                                    :null
                                ))}
                            </Box>
                    </Box>
                </div> 
            </Card>
            
            {/* /////RIGHT CARD - OPERATIONS///// */}
            <Card id='resizable-card-right' style={styles.Card}>
                <div id='right-card-appear' style={{...styles.contentAppear}}>
                    <Box id='informative-block' style={styles.informativeBlock}>
                        <StringStep />
                        <StepInfo />
                    </Box>
                    
                    <Box id='dynamic-content-holder' style={{width: '100%'}}>
                        {
                            currentStep === 1? <DynamicTable />:
                            currentStep === 2? <OverviewTable />:
                            currentStep === 3? <SignAndSubmit />:
                            null
                        }
                    </Box>

                    <Box id='navigation-holder' style={{width: '100%'}}>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={() => ({
                            float:'left',
                            width: '220px',
                            marginTop: '20px',
                            height: '50px',
                            fontWeight: 700
                            })}
                            onClick={
                                currentStep === 1?goHome:
                                renderPreviousStep}>
                            {currentStep === 1?"Cancel":"Back"}
                        </Button>
                        <Tooltip title={
                            !validData && multisendRows!.length! > 0?`${currentStep===3?"Your account":"Wallet"} have insufficient balances to cover the operation`:''}>
                            <div style={{float: 'right', marginTop: '20px'}}>
                                <Button
                                    disabled={!validData}
                                    variant="contained"
                                    color="primary"
                                    sx={() => ({
                                    float:'right',
                                    width: '220px',
                                    height: '50px',
                                    fontWeight: 700
                                    })}
                                    onClick={
                                        currentStep < 3?renderNextStep:
                                        broadcastMsg}
                                >
                                    {currentStep === 3?"Propose":
                                    currentStep === 2?"Preview":
                                    "Next Step"}
                                </Button>
                            </div>
                        </Tooltip>
                    </Box>
                </div>    
            </Card>
        </Box>
    )
}

export default SendFundsProposal
