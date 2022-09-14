import { Box, Input, Paper } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateWalletObjectState } from 'store/walletObject'
import { styles } from '../styles'

const StepTwo = () => {
    
    const dispatch = useDispatch()
    const { groupMetadata } = useSelector((state: RootState) => state.walletObject)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        switch(e.target.name){
            case "walletName":
                dispatch(updateWalletObjectState({
                    groupMetadata: {
                        walletName: e.target.value,
                        generalInfo: groupMetadata?.generalInfo
                    }
                }))
                break
            default:
                dispatch(updateWalletObjectState({
                    groupMetadata: {
                        walletName: groupMetadata?.walletName,
                        generalInfo: e.target.value
                    }
                }))
                break
        }
    }

    return (
        <Box id='step-two-holder' style={styles.stepOneHolder}>
            <div id='wallet-info-group' style={{display: 'grid', justifyItems: 'start'}}>
                <span style={{margin: '13px 0 10px 0'}}>Name</span> 
                <Paper elevation={1}>
                    <Input
                        disableUnderline
                        style={styles.addressInput}
                        type="text"
                        name="walletName"
                        value={groupMetadata?.walletName}
                        placeholder="e.g Cudos Wallet"
                        onChange={handleChange}
                    />
                </Paper>
                <span style={{margin: '20px 0 10px 0'}}>Optional wallet information</span>
                <Paper style={{height: '100px'}} elevation={1}>
                    <textarea
                        name="generalInfo"
                        value={groupMetadata?.generalInfo}
                        placeholder="e.g This is the official wallet of CUDOS Network"
                        style={{...styles.textArea}}
                        onChange={handleChange}
                    />
                </Paper>
            </div>
        </Box>
    )
}

export default StepTwo
