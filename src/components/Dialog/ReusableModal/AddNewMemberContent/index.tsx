import { RootState } from 'store'
import { styles } from '../styles'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isValidCudosAddress } from 'utils/validation'
import { useGetWalletMembersQuery } from 'graphql/types'
import { Box, Button, Input, Tooltip, Typography } from '@mui/material'
import { getMembersUpdateMsgAndFees } from '../helpers'
import { EncodeObject, StdFee } from 'cudosjs'
import { updateModalState } from 'store/modals'
import SelectFromAddressBook from './SelectFromAddressBook'

import {
    DEFAULT_VOTING_WEIGHT,
    DUPLICATED_ADDRESS_MSG,
    INVALID_DATA_PROMPT_MSG
} from 'utils/constants'
import { Member } from 'store/walletObject'

const AddNewMemberContent = ({
    propose,
    close,
}: {
    propose: (
        msgs: EncodeObject[],
        fee: StdFee,
        msgSpecificData: any) => void,
    close: () => void,
}) => {

    const dispatch = useDispatch()
    const { address, selectedWallet, addressBook, connectedLedger } = useSelector((state: RootState) => state.userState)
    const { selectFromAddressBook } = useSelector((state: RootState) => state.modalState)
    const { members } = useSelector((state: RootState) => state.walletObject)
    const [newMemberName, setNewMemberName] = useState<string>('')
    const [newMemberAddress, setNewMemberAddress] = useState<string>('')
    const walletId: number = selectedWallet!.walletID!
    const haveAddressBook: boolean = Object.keys(addressBook!).length > 0
    const { loading, error, data } = useGetWalletMembersQuery({
        variables: { id: walletId }
    })

    const oldWalletMembers: Member[] = []

    if (data) {
        for (const member of data.group_with_policy_by_pk!.group_members) {
            oldWalletMembers.push({
                metadata: member.metadata!,
                address: member.address,
                weight: DEFAULT_VOTING_WEIGHT
            })
        }
    }

    const userInWallet = (): boolean => {
        return oldWalletMembers.some(w => w.address === newMemberAddress)
    }

    const validData = (): boolean => {

        if (selectFromAddressBook && members?.length! > 0) {
            return true
        }

        if (newMemberName !== '' && isValidCudosAddress(newMemberAddress)) {
            return true
        }

        return false
    }

    const getTooltip = (): string => {
        if (!validData()) {
            return INVALID_DATA_PROMPT_MSG
        }

        if (userInWallet()) {
            return DUPLICATED_ADDRESS_MSG
        }

        return ''
    }

    const createProposal = async () => {

        const newMembers: Member[] = []
        selectFromAddressBook ?
            members?.forEach((newMember) => {
                newMembers.push({
                    address: newMember.address,
                    weight: DEFAULT_VOTING_WEIGHT,
                    metadata: newMember.metadata
                })
            }) :
            newMembers.push({
                address: newMemberAddress,
                weight: DEFAULT_VOTING_WEIGHT,
                metadata: JSON.stringify({
                    memberName: newMemberName
                })
            })

        const updatedWalletMembers = [
            ...newMembers
        ]

        const { msg, fee } = await getMembersUpdateMsgAndFees(
            updatedWalletMembers,
            walletId,
            selectedWallet?.walletAddress!,
            address!,
            connectedLedger!
        )

        const msgSpecificData = {
            members: newMembers
        }

        propose(
            [msg],
            fee,
            msgSpecificData
        )
    }

    return (
        <Box>
            {/* CONTENT */}
            {selectFromAddressBook ? <SelectFromAddressBook /> :
                <Box style={styles.contentHolder}>

                    <Box>
                        <Box style={styles.selectFromAddrBook}>
                            <Typography style={styles.typography}>Member name</Typography>
                            {haveAddressBook ?
                                <Button
                                    disableRipple
                                    style={styles.typography}
                                    onClick={() => dispatch(updateModalState({ selectFromAddressBook: true }))}
                                >
                                    Select from Address Book
                                </Button>
                                : null}
                        </Box>

                        <Input
                            disableUnderline
                            style={styles.addressInput}
                            type="text"
                            placeholder="e.g James Bond"
                            onChange={(e) => setNewMemberName(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <Typography style={{ margin: '20px 0 10px 0' }}>Account address</Typography>
                        <Input
                            disableUnderline
                            style={styles.addressInput}
                            type="text"
                            value={newMemberAddress}
                            placeholder="e.g cudos1nkf0flyugd2ut40cg4tn48sp70p2e65wse8abc"
                            onChange={(e) => setNewMemberAddress(e.target.value)}
                        />
                    </Box>
                </Box>
            }
            {/* CONTROLS */}
            <Box style={styles.controlsHolder}>
                <Box style={{ width: '40%' }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={styles.ctrlBtn}
                        onClick={() =>
                            selectFromAddressBook ?
                                dispatch(updateModalState({ selectFromAddressBook: false })) :
                                close()}
                    >
                        No, Go Back
                    </Button>
                </Box>
                <Tooltip title={getTooltip()}>
                    <Box style={{ width: '40%' }}>
                        <Button
                            disabled={!validData() || userInWallet()}
                            variant="contained"
                            color="primary"
                            sx={styles.ctrlBtn}
                            onClick={() => createProposal()}
                        >
                            Yes, Confirm
                        </Button>
                    </Box>
                </Tooltip>
            </Box>
        </Box>
    )
}

export default AddNewMemberContent
