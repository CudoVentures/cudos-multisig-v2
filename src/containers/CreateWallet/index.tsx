import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Box, Button } from '@mui/material'
import Card from 'components/Card/Card'
import { styles } from './styles'
import Dialog from 'components/Dialog'
import { useEffect, useState } from 'react'
import Steps, { getCurrentStep, StepInfo, StringStep } from 'components/Steps'
import { useNavigate } from 'react-router-dom'
import { updateSteps } from 'store/steps'
import StepOne from 'components/Steps/StepOne'
import StepTwo from 'components/Steps/StepTwo'
import { initialState as initialWalletObject, updateWalletObjectState } from 'store/walletObject'
import StepThree from 'components/Steps/StepThree'
import StepFour from 'components/Steps/StepFour'
import StepFfive from 'components/Steps/StepFive'
import { signingClient } from 'utils/config'
import { DEFAULT_MEMO, DEFAULT_META_DATA, DEFAULT_MULTIPLIER, GAS_PRICE, WALLET_PROCESS_FAIL_TITLE, NATIVE_TOKEN_DENOM, WALLET_CORRUPTED_PROCESS_TYPE, WALLET_CREATION_FAILURE_MSG, WALLET_CREATION_FAILURE_TYPE, WALLET_CREATION_SUCCESS_MSG, WALLET_CREATION_SUCCESS_TYPE, WALLET_CREATION_FAILURE_TITLE, WALLET_CREATION_LOADING_TITLE, DEFAULT_LOADING_MODAL_MSG } from 'utils/constants'
import { assertIsDeliverTxSuccess, EncodeObject, GasPrice } from 'cudosjs'
import { updateModalState } from 'store/modals'
import { updateUser, wallet } from 'store/user'
import { BigNumber } from 'bignumber.js'
import { cutTrailingZeroes, separateDecimals, separateFractions } from 'utils/regexFormatting'
import { checkForAdminToken, getAccountBalances, getNativeBalance } from 'utils/helpers'

const CreateWallet = () => {
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentStep = parseInt(getCurrentStep())
    const { groupMetadata, members, threshold, votingPeriod, feeForCreation } = useSelector((state: RootState) => state.walletObject)
    const { address, wallets } = useSelector((state: RootState) => state.userState)
    const [msg, setMsg] = useState<EncodeObject>({typeUrl: '', value: ''})

    const clearState = async () => {
        dispatch(updateSteps({currentStep: ''}))
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

        window.keplr.defaultOptions = {
            sign: {
                preferNoSetFee: true,
            }
          }

        try {
            const result = await (await signingClient).signAndBroadcast(address!, [msg], feeForCreation!, DEFAULT_MEMO)
            assertIsDeliverTxSuccess(result)

            // Highly doubtfull that the user is charged the actual gasUsed. 
            // I'd say it is always charged with gasWanted, but anyways...
            const tempFee = new BigNumber(GAS_PRICE).multipliedBy(new BigNumber(result.gasUsed)).valueOf()
            const displayWorthyFee = cutTrailingZeroes(separateDecimals(separateFractions(tempFee.valueOf())))
            
            const walletID = JSON.parse(result.rawLog!)[0]
            .events.find((e: any) => e.type === 'cosmos.group.v1.EventCreateGroup')
            .attributes[0].value.replaceAll('"', '')

            const walletAddress = JSON.parse(result.rawLog!)[0]
            .events.find((e: any) => e.type === 'cosmos.group.v1.EventCreateGroupPolicy')
            .attributes[0].value.replaceAll('"', '')

            const walletBalances = await getAccountBalances(walletAddress)
            const admin = checkForAdminToken(walletBalances)
            const nativeBalance = getNativeBalance(walletBalances)

            const dataObjectForSuccessModal = {
                walletAddress: walletAddress,
                walletName: groupMetadata?.walletName,
                txHash: result.transactionHash,
                txFee: displayWorthyFee
            }

            const newUserWalletsState: wallet =  {
                walletID: walletID,
                walletAddress: walletAddress,
                walletName: groupMetadata?.walletName!,
                isAdmin: admin,
                members: members!,
                memberCount: members?.length!,
                threshold: threshold!,
                walletBalances: walletBalances,
                nativeBalance: nativeBalance
            }

            dispatch(updateUser({ wallets: [...wallets!, newUserWalletsState] }))

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
                message: WALLET_CREATION_FAILURE_MSG
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
            true,
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
        dispatch(updateSteps({ currentStep: stepToSet }))
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
                    message: WALLET_CREATION_FAILURE_MSG
                }))
                console.debug(error.message)
            }
        }
        const stepToRender = (currentStep + 1).toString()
        renderStep(stepToRender)
    }

    useEffect(() => {
        dispatch(updateSteps({ currentStep: '1' }))
        setTimeout(() => document.getElementById("entire-create-wallet-page-appear")!.style.opacity = '1', 50)
        setTimeout(() => document.getElementById("resizable-card-right")!.style.width = '950px', 100)
        setTimeout(() => document.getElementById("resizable-card-left")!.style.width = '300px', 100)
        setTimeout(() => document.getElementById("resizable-card-right")!.style.marginLeft = '40px', 100)
        setTimeout(() => document.getElementById("left-steps-appear")!.style.opacity = '1', 800)
        setTimeout(() => document.getElementById("right-card-appear")!.style.opacity = '1', 800)
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
