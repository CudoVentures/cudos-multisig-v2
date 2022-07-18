import { Typography, TableContainer, Table, TableRow, Tooltip } from '@mui/material'
import { styles } from './styles'
import { RootState } from 'store'
import { useSelector } from 'react-redux'
import { displayTooltipDueBalances, HtmlTooltip, totalAmountDue } from 'utils/multiSendTableHelper'
import ToolTipIcon from 'assets/vectors/tooltip-icon.svg'
import AccountBalance from 'utils/subscriptions/accountBalance'
import { StdFee } from 'cudosjs'
import { handleFullBalanceToPrecision } from 'utils/regexFormatting'
import ExclamationMark from 'assets/vectors/yellow-exclamation-mark.svg'
import { convertSecondsToDisplay } from 'utils/helpers'
import { COLORS_DARK_THEME } from 'theme/colors'

interface DataObject {
    estimatedFee: StdFee
}

const SignAndSubmit = () => {

    const { multisendRows } = useSelector((state: RootState) => state.sendFunds)
    const { dataObject } = useSelector((state: RootState) => state.modalState)
    const { selectedWallet } = useSelector((state: RootState) => state.userState)
    const dataFromObject: DataObject = new Object(dataObject) as DataObject
    const StdFee: StdFee = dataFromObject.estimatedFee

    const totalRecipients: number = multisendRows!.length!
    const actualFee: string = StdFee.amount[0]?StdFee.amount[0].amount:'0'
    const displayWorthyFee: string = handleFullBalanceToPrecision(actualFee, 4, 'CUDOS')
    const votingTime: string = convertSecondsToDisplay(selectedWallet!.votingPeriod!, 'hours')

    return (
        <div id='component-holder'>
            <TableContainer style={{width: '100%'}}>
                <Table style={styles.upperTable}>
                    <TableRow style={{display: 'inline'}}>
                        <h3 style={{float: 'left'}}>Transaction Details</h3>
                    </TableRow>

                    <TableRow style={{display: 'inline'}}>
                    <Typography style={{float: 'left'}} variant="subtitle1" color="text.secondary">
                        Total Recipients
                    </Typography>
                    <span style={{float: 'right'}}>{totalRecipients}</span>
                    </TableRow>

                    <TableRow style={{display: 'inline'}}>
                        <Tooltip title={
                            `${selectedWallet?.threshold} 
                            from the ${selectedWallet?.memberCount} 
                            members should approve this proposal in order to be executed`}
                        >
                            <div>
                                <Typography style={{float: 'left'}} variant="subtitle1" color="text.secondary">
                                    Approvals / Members
                                </Typography>
                                <img style={styles.smallTooltip} src={ToolTipIcon} alt="Tooltip" />
                            </div>
                        </Tooltip>
                        <span style={{float: 'right'}}>{`${selectedWallet?.threshold} / ${selectedWallet?.memberCount}`}</span>
                    </TableRow>

                    <TableRow style={{display: 'inline'}}>
                        <Tooltip title={"When it passes the proposal expires"}>
                            <div>
                                <Typography style={{float: 'left'}} variant="subtitle1" color="text.secondary">
                                    Maximum Time for voting
                                </Typography>
                                <img style={styles.smallTooltip} src={ToolTipIcon} alt="Tooltip" />
                            </div>
                        </Tooltip>
                        <span style={{float: 'right'}}>{votingTime}</span>
                    </TableRow>

                    <TableRow style={{display: 'inline'}}>
                        <Tooltip title={"The wallet amounts required at execution time"}>
                            <div>
                                <Typography style={{float: 'left'}} variant="subtitle1" color="text.secondary">
                                    Total Amount Due
                                </Typography>
                                <img style={styles.smallTooltip} src={ToolTipIcon} alt="Tooltip" />
                            </div>
                        </Tooltip>
                        <span style={{float: 'right'}}>
                            <HtmlTooltip
                                title={<div>{displayTooltipDueBalances(totalAmountDue(multisendRows!))}</div>}
                            >
                                <img src={ExclamationMark} alt="Exclamation-mark-icon" />
                            </HtmlTooltip>
                        </span>
                    </TableRow>
                </Table>
            </TableContainer>

            <TableContainer>
                <Table style={styles.lowerTable}>
                    <TableRow style={{display: 'inline'}}>
                        <Typography style={{float: 'left'}} variant="subtitle1" color="text.secondary">
                            Your Account Balance
                        </Typography>
                        <span style={{float: 'right'}}><AccountBalance /></span>
                    </TableRow>
                    <TableRow style={{display: 'inline-flex', flexDirection: 'column'}}>
                        <div>
                            <Typography style={{float: 'left'}} variant="subtitle1" color="text.secondary">
                                Approximate fees for proposal submission
                            </Typography>
                            <span style={{color: COLORS_DARK_THEME.PRIMARY_BLUE, float: 'right'}}>{displayWorthyFee}</span>
                        </div>
                    </TableRow>
                </Table>
            </TableContainer>
        </div>
    ) 
}

export default SignAndSubmit
