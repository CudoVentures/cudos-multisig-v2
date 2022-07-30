import { RootState } from 'store'
import { styles } from '../styles'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { isValidCudosAddress } from 'utils/validation'
import { useGetWalletMembersQuery } from 'graphql/types'
import { Box, Button, Input, Tooltip, Typography } from '@mui/material'
import { Member } from 'store/walletObject'

import {
    DEFAULT_VOTING_WEIGHT,
    DUPLICATED_ADDRESS_MSG,
    INVALID_DATA_PROMPT_MSG
} from 'utils/constants'

const AddNewMemberContent = ({
    propose,
    close,
}: {
    propose: (
        members: Member[],
        memberName: string,
        memberAddress: string) => void,
    close: () => void,
}) => {

    const { selectedWallet } = useSelector((state: RootState) => state.userState)
    const [newMemberName, setNewMemberName] = useState<string>('')
    const [newMemberAddress, setNewMemberAddress] = useState<string>('')
    const walletId: number = parseInt(selectedWallet!.walletID!)
    const { loading, error, data } = useGetWalletMembersQuery({
        variables: { id: walletId }
    })

    const oldWalletMembers: { metadata: string; address: string; weight: number }[] = []
    const oldWalletMembersAddresses: string[] = []

    if (data) {
        for (const member of data.group_with_policy_by_pk!.group_members) {
            oldWalletMembers.push({
                metadata: member.metadata!,
                address: member.address,
                weight: DEFAULT_VOTING_WEIGHT
            })
            oldWalletMembersAddresses.push(
                member.address
            )
        }
    }

    const userInWallet = (): boolean => {
        return oldWalletMembersAddresses.includes(newMemberAddress)
    }

    const validData = (): boolean => {
        if (newMemberName !== '' && isValidCudosAddress(newMemberAddress)) {
            return true
        }
        return false
    }

    const getTooltip = (): string => {
        if (!validData()) {
            return INVALID_DATA_PROMPT_MSG
        }

        if (validData() && userInWallet()) {
            return DUPLICATED_ADDRESS_MSG
        }
        return ''
    }

    const createProposal = async () => {

        const newMember = {
            address: newMemberAddress,
            weight: DEFAULT_VOTING_WEIGHT,
            metadata: JSON.stringify({
                memberName: newMemberName
            })
        }

        const updatedWalletMembers = [
            ...oldWalletMembers,
            newMember
        ]

        propose(
            updatedWalletMembers,
            newMemberName,
            newMemberAddress
        )
    }

    return (
        <Box>
            {/* CONTENT */}
            <Box style={styles.contentHolder}>
                <Box>
                    <Typography style={styles.typography}>Member name</Typography>
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

            {/* CONTROLS */}
            <Box style={styles.controlsHolder}>
                <Box style={{ width: '40%' }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={styles.ctrlBtn}
                        onClick={close}
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
