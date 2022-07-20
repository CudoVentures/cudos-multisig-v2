import { Box, Typography } from '@mui/material'

import { 
    UNDEFINED, 
    MULTI_SEND_TYPE_URL, 
    MULTI_SEND_TYPE, 
    UNDEFINED_TYPE 
} from './constants'

const chainTxType = {
    [MULTI_SEND_TYPE_URL]: MULTI_SEND_TYPE,
    [UNDEFINED]: UNDEFINED_TYPE
}

export const TxTypeComponent = ({ type }:{ type: string }): JSX.Element => {
    let chainType: string = type
    if (!chainTxType[chainType as keyof typeof chainTxType]) {chainType = UNDEFINED}

    const icon: string = chainTxType[chainType as keyof typeof chainTxType].icon
    const text: string = chainTxType[chainType as keyof typeof chainTxType].text

    return (
        <Box style={{display: 'flex'}}>
            <img style={{marginRight:'5px'}} src={icon} alt={`${chainType} logo`}/>
            <Typography style= {{float: 'left'}} variant="subtitle2" fontWeight={600} >
                {text}
            </Typography>
        </Box>
    )
}
