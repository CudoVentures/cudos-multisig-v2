import { Box } from '@mui/material'
import Card from 'components/Card/Card'
import { styles } from './styles'

const Dashboard = () => {

    return (
        <Box>
            <Box style={{display: 'flex', width: '100%', height: '240px'}}>
                <Card style={{width: '50%', margin: '10px 10px 10px 0px'}}>
                    Account information
                </Card>
                <Card style={{width: '50%', margin: '10px 0px 10px 10px'}}>
                    Balance & assets
                </Card>
            </Box>

            <Card style={{display: 'flex', width: '100%', height: '274px', marginTop: '10px'}}>
                recent transactions
            </Card>

        </Box>
    )
}

export default Dashboard
