import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { Member, updateWalletObjectState } from 'store/walletObject'
import { convertVotingPeriodToSeconds } from 'utils/helpers'
import { styles } from '../styles'
import { ApprovalsTitleWithTooltip, VotingPeriodTitleWithTooltip } from 'components/Dialog/ReusableModal/helpers'

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

    const handleChange = (e: any) => {

        if (e.target.name === "threshold") {
            setThreshold(e.target.value)
            dispatch(updateWalletObjectState({ threshold: e.target.value }))
            return
        }

        const walletCompatibleTime = convertVotingPeriodToSeconds(e.target.value)
        dispatch(updateWalletObjectState({ votingPeriod: walletCompatibleTime }))
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
        <Box id='step-four-holder' style={{ ...styles.stepOneHolder, ...styles.stepFourHolder }}>
            <Typography style={{ color: '#999FB1', fontWeight: '700', fontSize: '14px' }}>
                Members
            </Typography>
            <div style={{ margin: '10px', fontWeight: '700', fontSize: '25px' }}>{members?.length}</div>

            <Box id='selection-holder' style={{ display: 'flex' }}>
                <div id="approvals-holder" style={{ margin: '30px' }}>
                    <ApprovalsTitleWithTooltip />
                    <FormControl fullWidth style={{ backgroundColor: '#28314E', width: 'fit-content' }}>
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
                            {members!.map((currentMember: Member, idx) => (
                                <MenuItem value={idx + 1}>{idx + 1}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div id="voting-period-holder" style={{ margin: '30px' }}>
                    <VotingPeriodTitleWithTooltip />
                    <Input
                        disableUnderline
                        style={styles.thresholdInput}
                        type="number"
                        name="selectedVotingPeriod"
                        id='selectedVotingPeriod'
                        placeholder="30 days"
                        onKeyDown={event => { if (['e', 'E', '+', "-", ".", ","].includes(event.key)) { event.preventDefault() } }}
                        onPaste={(e) => { e.preventDefault() }}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
            </Box>
        </Box>
    )
}

export default StepFour
