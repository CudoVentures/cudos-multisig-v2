import { Box, Input } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateWalletObjectState } from 'store/walletObject'
import { styles } from '../styles'

const StepTwo = () => {
    
    const dispatch = useDispatch()
    const { groupMetadata } = useSelector((state: RootState) => state.walletObject)

    const handleChange = (e: any) => {
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
        <Box id='step-one-holder' style={styles.stepOneHolder}>
            <div id='wallet-name-group' style={{display: 'grid', justifyItems: 'start'}}>
                    <span style={{margin: '13px 0 10px 0'}}>Name</span>
                    <Input
                        disableUnderline
                        style={styles.addressInput}
                        type="text"
                        name="walletName"
                        value={groupMetadata?.walletName}
                        placeholder="e.g Cudos Wallet"
                        onChange={handleChange}
                    />

                    <span style={{margin: '20px 0 10px 0'}}>General information</span>
                    <textarea
                        name="generalInfo"
                        value={groupMetadata?.generalInfo}
                        placeholder="e.g This is the official wallet of CUDOS Network"
                        style={{...styles.textArea}}
                        onChange={handleChange}
                    />
            </div>
        </Box>
    )
}

export default StepTwo
