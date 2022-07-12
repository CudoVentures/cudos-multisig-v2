//@ts-nocheck
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Box, Button } from '@mui/material'
import Card from 'components/Card/Card'
import { styles } from './styles'
import Dialog from 'components/Dialog'
import { useEffect, useState } from 'react'
import Steps, { getCurrentWalletCreationStep, StepInfo, StringStep } from 'components/WalletCreationSteps'
import { useNavigate } from 'react-router-dom'
import { updateWalletCreationSteps } from 'store/walletCreation'
import StepOne from 'components/WalletCreationSteps/StepOne'
import StepTwo from 'components/WalletCreationSteps/StepTwo'
import { initialState as initialWalletObject, updateWalletObjectState } from 'store/walletObject'
import { initialState as initialModalState } from 'store/modals'
import StepThree from 'components/WalletCreationSteps/StepThree'
import StepFour from 'components/WalletCreationSteps/StepFour'
import StepFfive from 'components/WalletCreationSteps/StepFive'
import { signingClient } from 'utils/config'
import { assertIsDeliverTxSuccess, EncodeObject, GasPrice } from 'cudosjs'
import { updateModalState } from 'store/modals'
import { handleFullBalanceToPrecision } from 'utils/regexFormatting'
import { calculateFeeFromGas, enforceCustomFeesOverKeplr } from 'utils/helpers'

import { 
    DEFAULT_MEMO, 
    DEFAULT_META_DATA, 
    DEFAULT_MULTIPLIER,
    GAS_PRICE, 
    WALLET_PROCESS_FAIL_TITLE, 
    NATIVE_TOKEN_DENOM, 
    WALLET_CORRUPTED_PROCESS_TYPE, 
    GENERAL_FAILURE_MSG, 
    WALLET_CREATION_SUCCESS_MSG, 
    WALLET_CREATION_SUCCESS_TYPE, 
    WALLET_CREATION_FAILURE_TITLE, 
    WALLET_CREATION_LOADING_TITLE, 
    DEFAULT_LOADING_MODAL_MSG 
} from 'utils/constants'

const CreateWallet = () => {
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentStep = parseInt(getCurrentWalletCreationStep())
    const { groupMetadata, members, threshold, votingPeriod, feeForCreation } = useSelector((state: RootState) => state.walletObject)
    const { address, wallets } = useSelector((state: RootState) => state.userState)
    const [msg, setMsg] = useState<EncodeObject>({typeUrl: '', value: ''})

    const clearState = async () => {
        dispatch(updateWalletCreationSteps({currentStep: ''}))
        dispatch(updateWalletObjectState({ ...initialWalletObject }))
      }

    const goHome = () => {
        clearState()
        navigate("/welcome")
    }

    const broadcasCreateWallettMsg = async () => {
        
        dispatch(updateModalState({
            loading: true,
            title: WALLET_CREATION_LOADING_TITLE,
            message: DEFAULT_LOADING_MODAL_MSG
        }))

        enforceCustomFeesOverKeplr()

        try {
            const result = await (await signingClient).signAndBroadcast(address!, [msg], feeForCreation!, DEFAULT_MEMO)
            assertIsDeliverTxSuccess(result)

            const tempFee = calculateFeeFromGas(result.gasUsed)
            const displayWorthyFee = handleFullBalanceToPrecision(tempFee, 4, 'CUDOS')

            const walletAddress = JSON.parse(result.rawLog!)[0]
                .events.find((e: any) => e.type === 'cosmos.group.v1.EventCreateGroupPolicy')
                .attributes[0].value.replaceAll('"', '')

            const dataObjectForSuccessModal = {
                walletAddress: walletAddress,
                walletName: groupMetadata?.walletName,
                txHash: result.transactionHash,
                txFee: displayWorthyFee
            }

            clearState()
            dispatch(updateModalState({
                loading: false,
                success: true,
                msgType: WALLET_CREATION_SUCCESS_TYPE,
                dataObject: dataObjectForSuccessModal,
                message: WALLET_CREATION_SUCCESS_MSG
            }))

        } catch (e: any){
            dispatch(updateModalState({
                loading: false,
                failure: true,
                title: WALLET_CREATION_FAILURE_TITLE, 
                message: GENERAL_FAILURE_MSG
            }))
            console.debug(e.message)
        }
    }

    const getCreateWalletMsgAndFees = async () => {
       return await (await signingClient).groupModule.msgCreateGroupWithPolicy(
            address!,
            members!,
            JSON.stringify(groupMetadata!),
            DEFAULT_META_DATA,
            {
                threshold: threshold!,
                votingPeriod: votingPeriod?.seconds!,
                minExecutionPeriod: 0
            },
            GasPrice.fromString(GAS_PRICE+NATIVE_TOKEN_DENOM),
            DEFAULT_MULTIPLIER,
            DEFAULT_MEMO
        )
    }

    const renderStep = (step: string) => {
        let tempStep: number = parseInt(step)
        if (tempStep < 1) {tempStep = 1}
        if (tempStep > 5) {tempStep = 5}
        const stepToSet = tempStep.toString()
        dispatch(updateWalletCreationSteps({ currentStep: stepToSet }))
      }

    const renderPreviousStep = () => {
        const stepToRender = (currentStep - 1).toString()
        renderStep(stepToRender)
    }

    const renderNextStep = async () => {

        if (currentStep === 4) {
            try {
                const { msg, fee } = await getCreateWalletMsgAndFees()
                dispatch(updateWalletObjectState({feeForCreation: fee}))
                setMsg(msg)
            } catch (error: any) {
                dispatch(updateModalState({
                    failure: true, 
                    title: WALLET_PROCESS_FAIL_TITLE,
                    msgType: WALLET_CORRUPTED_PROCESS_TYPE,
                    message: GENERAL_FAILURE_MSG
                }))
                console.debug(error.message)
            }
        }
        const stepToRender = (currentStep + 1).toString()
        renderStep(stepToRender)
    }

    useEffect(() => {
        dispatch(updateWalletCreationSteps({ currentStep: '1' }))
        dispatch(updateModalState({ ...initialModalState }))
        document.getElementById("right-card-appear")!.style.display = 'none'
        setTimeout(() => document.getElementById("entire-create-wallet-page-appear")!.style.opacity = '1', 50)
        setTimeout(() => document.getElementById("resizable-card-right")!.style.width = '950px', 100)
        setTimeout(() => document.getElementById("resizable-card-left")!.style.width = '300px', 100)
        setTimeout(() => document.getElementById("resizable-card-right")!.style.marginLeft = '40px', 100)
        setTimeout(() => document.getElementById("right-card-appear")!.style.display = 'block', 500)
        setTimeout(() => document.getElementById("left-steps-appear")!.style.opacity = '1', 600)
        setTimeout(() => document.getElementById("right-card-appear")!.style.opacity = '1', 550)
      }, [])

      let validData = 
        currentStep === 1?true:
        currentStep === 2?groupMetadata?.walletName !== '':
        currentStep === 3?members?.length! > 0:
        currentStep === 4?threshold !== 0 && votingPeriod?.seconds !== 0:
        currentStep === 5?true:
        false

    return (
        <Box id='entire-create-wallet-page-appear' style={{...styles.holder, ...styles.contentAppear}}>
            <Dialog/>
    
            {/* ////LEFT CARD - STEPS////// */}
            <Card id='resizable-card-left' style={styles.leftSteps}>
                <div id='left-steps-appear' style={{...styles.contentAppear}}>
                    <Steps />
                </div> 
            </Card>
            
            {/* /////RIGHT CARD - OPERATIONS///// */}
            <Card id='resizable-card-right' style={styles.Card}>
                <div id='right-card-appear' style={{...styles.contentAppear}}>
                    <Box id='informative-block' style={styles.informativeBlock}>
                        <StringStep />
                        <StepInfo />
                    </Box>
                    
                    <Box id='dynamic-content-holder' style={{width: '100%', height: '320px'}}>{
                        currentStep === 1?<StepOne />:
                        currentStep === 2?<StepTwo />:
                        currentStep === 3?<StepThree />:
                        currentStep === 4?<StepFour />:
                        currentStep === 5?<StepFfive />:
                        null}
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
                        <Button
                            disabled={!validData}
                            variant="contained"
                            color="primary"
                            sx={() => ({
                            float:'right',
                            width: '220px',
                            marginTop: '20px',
                            height: '50px',
                            fontWeight: 700
                            })}
                            onClick={
                                currentStep < 5?renderNextStep:
                                broadcasCreateWallettMsg}
                        >
                            {currentStep === 5?"Create":"Next Step"}
                        </Button>
                    </Box>
                </div>    
            </Card>
        </Box>
    )
}

export default CreateWallet
