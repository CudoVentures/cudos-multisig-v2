import { Box, Typography } from '@mui/material'
import SendIcon from 'assets/vectors/action-icons/send.svg'

const icons = {
    'Send': SendIcon,
}

const ActionsIconComponent = ({ type }:{ type: string }): JSX.Element => {

    return (
        <Box style={{display: 'flex'}}>
            <img style={{marginRight:'5px'}} src={icons[type as keyof typeof icons]} alt={`${type} logo`}/>
            <Typography style= {{float: 'left'}} variant="subtitle2" fontWeight={600} >
                {type}
            </Typography>
        </Box>
    )
}

export default ActionsIconComponent
