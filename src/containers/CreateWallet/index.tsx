
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Box, Button } from '@mui/material'
import Card from 'components/Card/Card'
import { styles } from './styles'
import Dialog from 'components/Dialog'
import { useEffect, useState } from 'react'
import { WalletCreationProgressBar, CurrentStepInfo, CurrentStepToStringSpan, FIRST_STEP, SECOND_STEP, THIRD_STEP, FOURTH_STEP, LAST_STEP } from 'components/WalletCreationSteps'
import { useNavigate } from 'react-router-dom'
import { initialState as initialWalletCreationState, updateWalletCreationState } from 'store/walletCreation'
import StepOne from 'components/WalletCreationSteps/StepOne'
import StepTwo from 'components/WalletCreationSteps/StepTwo'
import { initialState as initialWalletObject, updateWalletObjectState } from 'store/walletObject'
import { initialState as initialModalState } from 'store/modals'
import StepThree from 'components/WalletCreationSteps/StepThree'
import StepFour from 'components/WalletCreationSteps/StepFour'
import StepFive from 'components/WalletCreationSteps/StepFive'
import { getSigningClient } from 'utils/config'
import { assertIsDeliverTxSuccess, EncodeObject, GasPrice } from 'cudosjs'
import { updateModalState } from 'store/modals'
import { handleFullBalanceToPrecision } from 'utils/regexFormatting'
import { calculateFeeFromGas } from 'utils/helpers'

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
    const { groupMetadata, members, threshold, votingPeriod, feeForCreation } = useSelector((state: RootState) => state.walletObject)
    const { address, connectedLedger } = useSelector((state: RootState) => state.userState)
    const { currentStep } = useSelector((state: RootState) => state.walletCreationState)
    const [msg, setMsg] = useState<EncodeObject>({ typeUrl: '', value: '' })

    const stepComponents = new Map<number, JSX.Element>([
        [FIRST_STEP, <StepOne />],
        [SECOND_STEP, <StepTwo />],
        [THIRD_STEP, <StepThree />],
        [FOURTH_STEP, <StepFour />],
        [LAST_STEP, <StepFive />]
    ]);

    const stepDataValidations = new Map<number, boolean | string | number | undefined>([
        [FIRST_STEP, true],
        [SECOND_STEP, groupMetadata?.walletName],
        [THIRD_STEP, members?.length!],
        [FOURTH_STEP, threshold && votingPeriod?.seconds],
        [LAST_STEP, true]
    ]);

    const clearState = async () => {
        dispatch(updateWalletCreationState({ ...initialWalletCreationState }))
        dispatch(updateWalletObjectState({ ...initialWalletObject }))
    }

    const handleOnClickBackButton = () => {
        if (currentStep === FIRST_STEP) {
            clearState()
            return navigate("/welcome")
        }

        const previousStep = currentStep - 1
        dispatch(updateWalletCreationState({ currentStep: previousStep }))
    }

    const handleOnClickNextButton = async () => {
        if (currentStep === LAST_STEP) {
            return broadcastCreateWalletMsg()
        }

        if (currentStep === FOURTH_STEP) {
            try {
                const { msg, fee } = await getCreateWalletMsgAndFees()
                dispatch(updateWalletObjectState({ feeForCreation: fee }))
                setMsg(msg)
            } catch (error: any) {
                dispatch(updateModalState({
                    failure: true,
                    title: WALLET_PROCESS_FAIL_TITLE,
                    msgType: WALLET_CORRUPTED_PROCESS_TYPE,
                    message: GENERAL_FAILURE_MSG
                }))
                console.error(error.message)
            }
        }

        const nextStep = currentStep + 1
        dispatch(updateWalletCreationState({ currentStep: nextStep }))
    }

    const broadcastCreateWalletMsg = async () => {
        dispatch(updateModalState({
            loading: true,
            title: WALLET_CREATION_LOADING_TITLE,
            message: DEFAULT_LOADING_MODAL_MSG
        }))

        try {
            const client = await getSigningClient(connectedLedger!)
            const result = await client.signAndBroadcast(address!, [msg], feeForCreation!, DEFAULT_MEMO)
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

        } catch (error: any) {
            dispatch(updateModalState({
                loading: false,
                failure: true,
                title: WALLET_CREATION_FAILURE_TITLE,
                message: GENERAL_FAILURE_MSG
            }))
            console.error(error.message)
        }
    }

    const getCreateWalletMsgAndFees = async () => {
        const client = await getSigningClient(connectedLedger!)
        return await client.groupModule.msgCreateGroupWithPolicy(
            address!,
            members!,
            JSON.stringify(groupMetadata!),
            DEFAULT_META_DATA,
            {
                threshold: threshold!,
                votingPeriod: votingPeriod?.seconds!,
                minExecutionPeriod: 0
            },
            GasPrice.fromString(GAS_PRICE + NATIVE_TOKEN_DENOM),
            DEFAULT_MULTIPLIER,
            DEFAULT_MEMO
        )
    }

    useEffect(() => {
        dispatch(updateWalletCreationState({ ...initialWalletCreationState }))
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

    return (
        <Box id='entire-create-wallet-page-appear' style={{ ...styles.holder, ...styles.contentAppear }}>
            <Dialog />

            {/* ////LEFT CARD - STEPS////// */}
            <Card id='resizable-card-left' style={styles.leftSteps}>
                <div id='left-steps-appear' style={{ ...styles.contentAppear }}>
                    <WalletCreationProgressBar />
                </div>
            </Card>

            {/* /////RIGHT CARD - OPERATIONS///// */}
            <Card id='resizable-card-right' style={styles.Card}>
                <div id='right-card-appear' style={{ ...styles.contentAppear }}>
                    <Box id='informative-block' style={styles.informativeBlock}>
                        <CurrentStepToStringSpan />
                        <CurrentStepInfo />
                    </Box>

                    <Box id='dynamic-content-holder' style={{ width: '100%', height: '320px' }}>
                        {stepComponents.get(currentStep)}
                    </Box>

                    <Box id='navigation-holder' style={{ width: '100%' }} >
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={() => ({
                                float: 'left',
                                width: '220px',
                                marginTop: '20px',
                                height: '50px',
                                fontWeight: 700
                            })}
                            onClick={handleOnClickBackButton}>
                            {currentStep === FIRST_STEP ? "Cancel" : "Back"}
                        </Button>
                        <Button
                            disabled={!stepDataValidations.get(currentStep)}
                            variant="contained"
                            color="primary"
                            sx={() => ({
                                float: 'right',
                                width: '220px',
                                marginTop: '20px',
                                height: '50px',
                                fontWeight: 700
                            })}
                            onClick={handleOnClickNextButton}
                        >
                            {currentStep === LAST_STEP ? "Create" : "Next Step"}
                        </Button>
                    </Box>
                </div>
            </Card>
        </Box>
    )
}

export default CreateWallet
