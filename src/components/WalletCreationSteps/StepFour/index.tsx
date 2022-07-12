import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { member, updateWalletObjectState, votingPeriod } from 'store/walletObject'
import { styles } from '../styles'
import ExclamationMark from 'assets/vectors/yellow-exclamation-mark.svg'
import { HtmlTooltip } from 'utils/multiSendTableHelper'

import { 
    Box, 
    FormControl, 
    Input, 
    MenuItem, 
    Select, 
    Typography 
} from '@mui/material'

const StepFour = () => {
    
    const dispatch = useDispatch()
    const [threshold, setThreshold] = useState('')
    const { members } = useSelector((state: RootState) => state.walletObject)

    const convertVotingPeriodToSeconds = (selectedVotingPeriod: number): votingPeriod => {
        return {
            seconds: selectedVotingPeriod * 24 * 60 * 60,
            nanos: 0
        }
    }
    
    const handleChange = (e: any) => {
        switch(e.target.name){
            case "threshold":
                setThreshold(e.target.value)
                dispatch(updateWalletObjectState({threshold: e.target.value}))
                break

            case "selectedVotingPeriod":
                const walletCompatibleTime = convertVotingPeriodToSeconds(e.target.value)
                dispatch(updateWalletObjectState({votingPeriod: walletCompatibleTime}))
                break

            default:
                break
        }
    }

    useEffect(() => {
        dispatch(updateWalletObjectState({
            threshold: parseInt(threshold),
            votingPeriod: {
                seconds: 0,
                nanos: 0
            }
        }))
      }, [])

    return (
        <Box id='step-four-holder' style={{...styles.stepOneHolder, ...styles.stepFourHolder}}>
            <Typography style={{color: '#999FB1', fontWeight: '700', fontSize: '14px'}}>
                Members
            </Typography>
            <div style={{margin:'10px', fontWeight: '700', fontSize: '25px'}}>{members?.length}</div>

            <Box id='selection-holder' style={{display: 'flex'}}>
                <div id="approvals-holder" style={{margin: '30px'}}>
                    <Box style={{margin:'10px 0px'}}>
                    <span>Number of approvals</span>
                        <HtmlTooltip
                            placement="top"
                            title={
                                <Fragment>
                                <Typography>Approvals</Typography>
                                <div>
                                    <span>This will be the minimum count of approvals gathered from the wallet members in order for a transaction to be executed.</span>
                                </div>
                                <small style={{color: 'orange'}}>{'*At least 1 approval is required to be selected.'}</small>
                                </Fragment>}
                        >
                            <img style={{marginLeft:'5px'}} src={ExclamationMark} alt="Exclamation-mark-icon" />
                        </HtmlTooltip>
                    </Box>
                    <FormControl fullWidth style={{backgroundColor:'#28314E', width: 'fit-content'}}>
                        <Select
                            sx={() => ({
                            width: '160px',
                            height: '55px',
                            })}
                            variant='standard'
                            disableUnderline
                            id="threshold"
                            name="threshold"
                            value={threshold}
        
                            onChange={handleChange}
                        >
                        {members!.map((currentMember: member, idx) => (
                            <MenuItem value={idx+1}>{idx+1}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </div>

                <div id="voting-period-holder" style={{margin: '30px'}}>
                <Box style={{margin:'10px 0px'}}>
                    <span>Voting Period</span>
                        <HtmlTooltip
                            placement="top"
                            title={
                                <Fragment>
                                <Typography>Voting Period</Typography>
                                <div>
                                    <span>After a transaction is proposed to the wallet members to be executed, this will be the maximum period of time for the members to express their approval or dissaproval.</span>
                                </div>
                                <small style={{color: 'orange'}}>{'*A transaction can be executed without waiting for this period to end if the minimum number of approvals is reached'}</small>
                                </Fragment>}
                        >
                            <img style={{marginLeft:'5px'}} src={ExclamationMark} alt="Exclamation-mark-icon" />
                        </HtmlTooltip>
                    </Box>
                    <Input
                    disableUnderline
                    style={styles.thresholdInput}
                    type="number"
                    name="selectedVotingPeriod"
                    id='selectedVotingPeriod'
                    placeholder="30 days"
                    onKeyDown={event => {if (['e', 'E', '+', "-", ".", ","].includes(event.key)) {event.preventDefault()}}}
                    onPaste={(e)=>{e.preventDefault()}} 
                    onChange={handleChange}
                    className="form-control"
                    />
                </div>
            </Box>
        </Box>
    )
}

export default StepFour
