
import { Box, Typography  } from '@mui/material'
import { styles } from './styles'
import { RootState } from '../../store'
import { useSelector } from 'react-redux'
import stepOne from 'assets/vectors/sendFundsSteps/step-one.svg'
import stepTwo from 'assets/vectors/sendFundsSteps/step-two.svg'
import stepThree from 'assets/vectors/sendFundsSteps/step-three.svg'

export const getCurrentSendFundsStep = () => {
  const { currentStep } = useSelector((state: RootState) => state.sendFunds)
  return currentStep?currentStep:'1'
}

export const StepInfo = () => {
  
  let title: string = 'Prepare Addresses'
  let subTitle: string = "Add the addresses you want to send funds to"

  switch (getCurrentSendFundsStep()){
    case '2':
      title = 'Approve addresses for Sending'
      subTitle = 'Check if the addresses and amounts are correct'
      break
    case '3':
      title = 'Proceed with executing the proposal'
      subTitle = 'Check the details and submit proposal'
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
    <span style={styles.stepInfoStyler}>Step {getCurrentSendFundsStep()}/3</span>
  )
}

const Steps = () => {
  let stepPic: string = stepOne
  switch (getCurrentSendFundsStep()){
    case '2':
      stepPic = stepTwo
      break
    case '3':
      stepPic = stepThree
      break
    default:
      break
  }

  return (
    <div>
        <div style={{margin: '50px 0 30px 0'}}>
          <Box>
            <h3 style={{margin: '0 auto'}}>Send Funds</h3>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Creating a proposal
            </Typography>
          </Box>
        </div>
        <div id='options' style={{margin: '20% 0'}}>
          <img src={stepPic} alt="Steps" />
        </div>
    </div>
  )
}

export default Steps
