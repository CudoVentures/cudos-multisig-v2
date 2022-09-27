import { Box } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { styles } from '../styles'
import SummaryTable from './SummaryTable'
import SummaryAccInfo from './SummaryAccInfo'
import SummaryFeeDetails from './SummaryFeeDetails'

const StepFive = () => {

    return (
        <Box id='step-five-holder' style={{...styles.stepFiveHolder}}>
            <Box id='left-oriented-holder'  style={{float: 'left', width: '40%', height: '100%'}}>
                <Box id='account-details-holder'>
                    <SummaryAccInfo />
                </Box>

                <Box id='fee-details-holder' style={{marginTop: '20px'}}>
                    <SummaryFeeDetails />
                </Box>
            </Box>
            
            <Box id='summary-table-holder' style={{marginLeft: '3%', float: 'right', width: '57%'}}>
                <SummaryTable />
            </Box>
        </Box>
    )
}

export default StepFive
