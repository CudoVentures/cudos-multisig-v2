import { Box, Input, Paper } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateWalletObjectState } from 'store/walletObject'
import { styles } from '../styles'

const StepTwo = () => {
    
    const dispatch = useDispatch()
    const { groupMetadata } = useSelector((state: RootState) => state.walletObject)

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
        if (event.target.name === 'walletName') {
            dispatch(updateWalletObjectState({
                groupMetadata: {
                    walletName: event.target.value,
                    generalInfo: groupMetadata?.generalInfo
                }
            }))
            
            return
        }
        
        dispatch(updateWalletObjectState({
            groupMetadata: {
                walletName: groupMetadata?.walletName,
                generalInfo: event.target.value
            }
        }))
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
