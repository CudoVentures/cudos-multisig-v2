import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Box, Button } from '@mui/material'
import Card from 'components/Card/Card'
import { styles } from './styles'
import Dialog from 'components/Dialog'
import { useEffect } from 'react'
import Steps, { getCurrentStep, StepInfo, StringStep } from 'components/Steps'
import { useNavigate } from 'react-router-dom'
import { updateSteps } from 'store/steps'
import StepOne from 'components/Steps/StepOne'
import StepTwo from 'components/Steps/StepTwo'
import { initialState as initialWalletObject, updateWalletObjectState } from 'store/walletObject'

const CreateWallet = () => {
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentStep = parseInt(getCurrentStep())
    const { groupMetadata } = useSelector((state: RootState) => state.walletObject)

    const goHome = () => {
        dispatch(updateWalletObjectState({ ...initialWalletObject }))
        navigate("/welcome")
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

    const renderNextStep = () => {
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
        currentStep === 2?groupMetadata?.walletName !== ''
        :
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
                        // currentStep === 3? <whatever/>:
                        // currentStep === 4? <whatever/>:
                        // currentStep === 5? <whatever/>:
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
                                renderPreviousStep}
                        >
                            {currentStep === 5?"Finish":"Next Step"}
                        </Button>
                    </Box>
                </div>    
            </Card>
        </Box>
    )
}

export default CreateWallet
