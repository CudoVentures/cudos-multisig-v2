
import { Box, Typography } from '@mui/material'
import { styles } from './styles'
import { RootState } from '../../store'
import { useSelector } from 'react-redux'
import stepOneIcon from 'assets/vectors/walletCreationSteps/step-one.svg'
import stepTwoIcon from 'assets/vectors/walletCreationSteps/step-two.svg'
import stepThreeIcon from 'assets/vectors/walletCreationSteps/step-three.svg'
import stepFourIcon from 'assets/vectors/walletCreationSteps/step-four.svg'
import stepFiveIcon from 'assets/vectors/walletCreationSteps/step-five.svg'

export const FIRST_STEP = 1
export const SECOND_STEP = 2
export const THIRD_STEP = 3
export const FOURTH_STEP = 4
export const LAST_STEP = 5

const getCurrentStep = (): number => {
  const { currentStep } = useSelector((state: RootState) => state.walletCreationState)
  return currentStep
}

export const CurrentStepToStringSpan = () => {
  return <span style={styles.stepInfoStyler}>Step {getCurrentStep()}/{LAST_STEP}</span>
}

interface StepInfo {
  title: string,
  subTitle: string
}

export const CurrentStepInfo = () => {
  const stepInfos = new Map<number, StepInfo>([
    [FIRST_STEP, {
      title: "Connected Account Information",
      subTitle: "Your personal Keplr account and the Network on which you're going to create a MultiSig wallet"
    }],
    [SECOND_STEP, {
      title: "Personalise your MultiSig wallet",
      subTitle: "Give a name to your MultiSig wallet that is recognisable to all owners"
    }],
    [THIRD_STEP, {
      title: "Add members to your MultiSig wallet",
      subTitle: "The MultiSig wallet can have more than one member"
    }],
    [FOURTH_STEP, {
      title: "Approval settings",
      subTitle: "Select the number of approvals required for a transaction to be executed"
    }],
    [LAST_STEP, {
      title: "Summary",
      subTitle: "Review the filled data and finish creating the MultiSig wallet"
    }],
  ])

  const stepInfo = stepInfos.get(getCurrentStep())!

  return (
    <div>
      <Box>
        <h3 style={{ float: 'left', margin: '3px auto' }}>{stepInfo.title}</h3>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          <span style={{ float: 'left' }}>{stepInfo.subTitle}</span>
        </Typography>
      </Box>
    </div>
  )
}

export const WalletCreationProgressBar = () => {
  const stepIcons = new Map<number, string>([
    [FIRST_STEP, stepOneIcon],
    [SECOND_STEP, stepTwoIcon],
    [THIRD_STEP, stepThreeIcon],
    [FOURTH_STEP, stepFourIcon],
    [LAST_STEP, stepFiveIcon]
  ]);

  const stepIcon = stepIcons.get(getCurrentStep())

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <Box>
          <h3 style={{ margin: '0 auto' }}>MultiSig Wallet</h3>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Follow the steps to create it
          </Typography>
        </Box>
      </div>
      <div id='options'>
        <img src={stepIcon} alt="Steps" />
      </div>
    </div>
  )
}
