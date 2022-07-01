import { Box, Button } from '@mui/material'
import Card from 'components/Card/Card'
import { styles } from './styles'
import Dialog from 'components/Dialog'
import { Fragment, useEffect, useRef } from 'react'
import LeftMenu from './LeftMenu'
import LeftWalletSummary from './LeftWalletSummary'

const WalletDetails = () => {
    const defaultElement = document.createElement('div') as HTMLInputElement
    const resizableCardLeft = useRef<HTMLInputElement>(defaultElement)
    const resizableCardRight = useRef<HTMLInputElement>(defaultElement)
    const leftStepsContent = useRef<HTMLInputElement>(defaultElement)
    const rightStepsContent = useRef<HTMLInputElement>(defaultElement)
    const entireDashboardPage = useRef<HTMLInputElement>(defaultElement)

    useEffect(() => {
        setTimeout(() => entireDashboardPage.current.style.opacity = '1', 50)
        setTimeout(() => resizableCardRight.current.style.width = '1000px', 100)
        setTimeout(() => resizableCardLeft.current.style.width = '250px', 100)
        setTimeout(() => resizableCardRight.current.style.marginLeft = '40px', 100)
        setTimeout(() => leftStepsContent.current.style.opacity = '1', 800)
        setTimeout(() => rightStepsContent.current.style.opacity = '1', 800)
      }, [])

    return (
        <Box ref={entireDashboardPage} style={{...styles.holder, ...styles.contentAppear}}>
            <Dialog/>
    
            {/* ////LEFT CARD - STEPS////// */}
            <Card ref={resizableCardLeft}  style={styles.leftSteps}>
                <div ref={leftStepsContent} style={{...styles.contentAppear}}>
                    <LeftMenu />
                    <LeftWalletSummary 
                        resizableCardLeft={resizableCardLeft}
                        resizableCardRight={resizableCardRight}
                        leftStepsContent={leftStepsContent}
                        rightStepsContent={rightStepsContent}
                        entireDashboardPage={entireDashboardPage}
                    />
                </div> 
            </Card>
            
            {/* /////RIGHT CARD - OPERATIONS///// */}
            <Card ref={resizableCardRight} style={styles.Card}>
                <Box ref={rightStepsContent} style={{...styles.contentAppear}}>
                    <Fragment>
                        TEST TEXT
                    </Fragment>
                    <Button>
                        TEST BUTTON
                    </Button>
                </Box>
            </Card>
        </Box>
    )
}

export default WalletDetails
