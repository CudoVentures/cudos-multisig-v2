
import { Box, Typography  } from '@mui/material'
import { styles } from './styles'
import { RootState } from '../../store'
import { useSelector } from 'react-redux'
import stepOne from 'assets/vectors/walletCreationSteps/step-one.svg'
import stepTwo from 'assets/vectors/walletCreationSteps/step-two.svg'
import stepThree from 'assets/vectors/walletCreationSteps/step-three.svg'
import stepFour from 'assets/vectors/walletCreationSteps/step-four.svg'
import stepFive from 'assets/vectors/walletCreationSteps/step-five.svg'

export const getCurrentWalletCreationStep = () => {
  const { currentStep } = useSelector((state: RootState) => state.walletCreationSteps)
  return currentStep?currentStep:'1'
}

export const StepInfo = () => {
  
  let title: string = 'Connected Account Information'
  let subTitle: string = "Your personal Keplr account and the Network on which you're going to create a MultiSig wallet."

  switch (getCurrentWalletCreationStep()){
    case '2':
      title = 'Personalise your MultiSig wallet'
      subTitle = 'Give a name to your MultiSig wallet that is recognisable to all owners'
      break
    case '3':
      title = 'Add members to your MultiSig wallet'
      subTitle = 'The MultiSig wallet can have more than one member'
      break
    case '4':
    title = 'Approval settings'
    subTitle = 'Select the number of approvals required for a transaction to be executed'
    break
    case '5':
      title = 'Summary'
      subTitle = 'Review the filled data and finish creating the MultiSig wallet'
      break
    default:
      break
  }

  return (
    <div>
      <Box>
        <h3 style={{float: 'left', margin: '3px auto'}}>{title}</h3>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          <span style={{float: 'left'}}>{subTitle}</span>
        </Typography>
      </Box>
    </div>
  )
}

export const StringStep = () => {
  return (
    <span style={styles.stepInfoStyler}>Step {getCurrentWalletCreationStep()}/5</span>
  )
}

const Steps = () => {
  let stepPic: string = stepOne
  switch (getCurrentWalletCreationStep()){
    case '2':
      stepPic = stepTwo
      break
    case '3':
      stepPic = stepThree
      break
    case '4':
      stepPic = stepFour
      break
    case '5':
      stepPic = stepFive
      break
    default:
      break
  }

  return (
    <div>
        <div style={{marginBottom: '30px'}}>
          <Box>
            <h3 style={{margin: '0 auto'}}>MultiSig Wallet</h3>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Follow the steps to create it
            </Typography>
          </Box>
        </div>
        <div id='options'>
          <img src={stepPic} alt="Steps" />
        </div>
    </div>
  )
}

export default Steps
