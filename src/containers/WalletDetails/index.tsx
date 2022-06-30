import { Box } from '@mui/material'
import Card from 'components/Card/Card'
import { styles } from './styles'
import Dialog from 'components/Dialog'
import { useEffect } from 'react'
import LeftMenu from './LeftMenu'
import LeftWalletSummary from './LeftWalletSummary'

const WalletDetails = () => {

    useEffect(() => {
        setTimeout(() => document.getElementById("entire-create-wallet-page-appear")!.style.opacity = '1', 50)
        setTimeout(() => document.getElementById("resizable-card-right")!.style.width = '1000px', 100)
        setTimeout(() => document.getElementById("resizable-card-left")!.style.width = '250px', 100)
        setTimeout(() => document.getElementById("resizable-card-right")!.style.marginLeft = '40px', 100)
        setTimeout(() => document.getElementById("left-steps-appear")!.style.opacity = '1', 800)
        setTimeout(() => document.getElementById("right-card-appear")!.style.opacity = '1', 800)
      }, [])

    return (
        <Box id='entire-create-wallet-page-appear' style={{...styles.holder, ...styles.contentAppear}}>
            <Dialog/>
    
            {/* ////LEFT CARD - STEPS////// */}
            <Card id='resizable-card-left' style={styles.leftSteps}>
                <div id='left-steps-appear' style={{...styles.contentAppear}}>
                    <LeftMenu />
                    <LeftWalletSummary />
                </div> 
            </Card>
            
            {/* /////RIGHT CARD - OPERATIONS///// */}
            <Card id='resizable-card-right' style={styles.Card}>
                <div id='right-card-appear' style={{...styles.contentAppear}}>
                
                </div>
            </Card>
        </Box>
    )
}

export default WalletDetails
