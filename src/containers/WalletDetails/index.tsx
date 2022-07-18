import { Box, Button } from '@mui/material'
import Card from 'components/Card/Card'
import { styles } from './styles'
import Dialog from 'components/Dialog'
import { useEffect, useRef } from 'react'
import LeftMenu from 'components/LeftMenu'
import LeftWalletSummary from 'components/LeftWalletSummary'
import { MenuSelectionInfo } from 'components/WalletOperations'
import Dashboard from 'components/WalletOperations/Dashboard'
import PlusIcon from 'assets/vectors/plus-icon.svg'
import { updateModalState } from 'store/modals'
import { initialState as initialModalState } from 'store/modals'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'

const WalletDetails = () => {
    const dispatch = useDispatch()
    const defaultElement = document.createElement('div') as HTMLInputElement
    const resizableCardLeft = useRef<HTMLInputElement>(defaultElement)
    const resizableCardRight = useRef<HTMLInputElement>(defaultElement)
    const leftStepsContent = useRef<HTMLInputElement>(defaultElement)
    const rightStepsContent = useRef<HTMLInputElement>(defaultElement)
    const entireDashboardPage = useRef<HTMLInputElement>(defaultElement)
    const { menuSelection } = useSelector((state: RootState) => state.menu)

    useEffect(() => {
        dispatch(updateModalState({ loading: true, loadingType: true }))
        setTimeout(() => dispatch(updateModalState({ ...initialModalState })), 500)
        setTimeout(() => resizableCardLeft.current.style.opacity = '1', 400)
      }, [])

    const handleNewTxClick = () => {
        dispatch(updateModalState({ transactionSelector: true }))
    }

    return (
        <Box ref={entireDashboardPage} style={{...styles.holder, ...styles.contentAppear}}>
            <Dialog/>
    
            {/* ////LEFT CARD - STEPS////// */}
            <Card ref={resizableCardLeft}  style={styles.leftSteps}>
                <div ref={leftStepsContent} style={{...styles.contentAppear}}>
                    <LeftMenu 
                        rightStepsContent={rightStepsContent}
                    />
                    <LeftWalletSummary 
                        resizableCardRight={resizableCardRight}
                    />
                </div> 
            </Card>
            
            {/* /////RIGHT CARD - OPERATIONS///// */}
            <Box ref={resizableCardRight} style={styles.Card}>
                <Box ref={rightStepsContent} style={{...styles.contentAppear}}>
                    
                    <Box style={{width: '100%', justifyContent: 'space-between', alignItems: 'end', display: 'flex'}}>
                        <MenuSelectionInfo />
                        <Button
                            variant="contained"
                            color="primary"
                            style={{width: '210px', height: '45px'}}
                            onClick={handleNewTxClick}
                        >
                            <img style={styles.btnLogo} src={PlusIcon} alt="Plus Icon" />
                            New Transaction
                        </Button>
                    </Box>
                    {
                        menuSelection === 0? <Dashboard />
                        :
                        null
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default WalletDetails
