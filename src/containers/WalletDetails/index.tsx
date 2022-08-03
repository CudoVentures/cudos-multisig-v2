import { Box, Button, Tooltip } from '@mui/material'
import Card from 'components/Card/Card'
import { styles } from './styles'
import Dialog from 'components/Dialog'
import { useCallback, useEffect, useRef } from 'react'
import LeftMenu from 'components/LeftMenu'
import LeftWalletSummary from 'components/LeftWalletSummary'
import { MenuSelectionInfo } from 'components/WalletOperations'
import Dashboard from 'components/WalletOperations/Dashboard'
import PlusIcon from 'assets/vectors/plus-icon.svg'
import { updateModalState } from 'store/modals'
import { initialState as initialModalState } from 'store/modals'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import Members from 'components/WalletOperations/Members'
import Transactions from 'components/WalletOperations/Transactions'
import { ADD_MEMBER_TYPE_URL } from 'utils/constants'
import Settings from 'components/WalletOperations/Settings'

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

    const handleReusableModal = (msgType: string) => {
        dispatch(updateModalState({
            openReusableModal: true,
            dataObject: {
                msgType: msgType
            }
        }))
    }

    const ContentHandler = useCallback(
        ({ menuSelection }: { menuSelection: number }): JSX.Element => {

            switch (menuSelection) {
                case 0:
                    return <Dashboard />
                case 1:
                    return <Transactions />
                case 2:
                    return <Members />
                case 3:
                    return <Settings />
                default:
                    return <></>
            }
        }, [menuSelection])

    const ButtonHandler = useCallback(
        ({ menuSelection }: { menuSelection: number }): JSX.Element => {

            if (menuSelection < 2) {
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        style={styles.topBtn}
                        onClick={handleNewTxClick}
                    >
                        <img style={styles.btnLogo} src={PlusIcon} alt="Plus Icon" />
                        New Transaction
                    </Button>
                )
            }

            if (menuSelection === 2) {
                return (
                    <Tooltip title={'Start ADD NEW MEMBER proposal'}>
                        <Button
                            variant="contained"
                            color="primary"
                            style={styles.topBtn}
                            onClick={() => handleReusableModal(ADD_MEMBER_TYPE_URL)}
                        >
                            <img style={styles.btnLogo} src={PlusIcon} alt="Plus Icon" />
                            Add New Member
                        </Button>
                    </Tooltip>
                )
            }

            return <></>
        }, [menuSelection])

    return (
        <Box ref={entireDashboardPage} style={{ ...styles.holder, ...styles.contentAppear }}>
            <Dialog />

            {/* ////LEFT CARD - STEPS////// */}
            <Card ref={resizableCardLeft} style={styles.leftSteps}>
                <div ref={leftStepsContent} style={{ ...styles.contentAppear }}>
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
                <Box ref={rightStepsContent} style={{ ...styles.contentAppear }}>
                    <Box style={{ width: '100%', justifyContent: 'space-between', alignItems: 'end', display: 'flex' }}>
                        <MenuSelectionInfo />
                        <ButtonHandler menuSelection={menuSelection} />
                    </Box>
                    <ContentHandler menuSelection={menuSelection} />
                </Box>
            </Box>
        </Box>
    )
}

export default WalletDetails
