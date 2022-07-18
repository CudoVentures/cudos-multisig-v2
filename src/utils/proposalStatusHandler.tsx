import { Box, Typography } from '@mui/material'

const statuses = {
    'Waiting': {
        text: "Waiting approvals",
        color: "#E89518"
    },
}

const ProposalStatusComponent = ({ status }:{ status: string }): JSX.Element => {

    const statusText = statuses[status as keyof typeof statuses].text
    const statusColor = statuses[status as keyof typeof statuses].color

    return (
        <Box style={{display: 'flex'}}>
            <Box style={{borderRadius: '10px', padding: '5px 15px', backgroundColor: statusColor}}>
                <Typography style= {{float: 'left'}} variant="subtitle2" fontSize={12} fontWeight={600} >
                    {statusText.toUpperCase()}
                </Typography>
            </Box>
        </Box>
    )
}

export default ProposalStatusComponent
