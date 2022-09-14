import { RootState } from 'store'
import { styles } from '../styles'
import { useSelector } from 'react-redux'
import { Box, Button } from '@mui/material'
import { Member } from 'store/walletObject'
import { TableData } from 'utils/tableSortingHelper'
import { DEFAULT_VOTING_WEIGHT } from 'utils/constants'
import { EncodeObject, StdFee } from 'cudosjs'
import { getMembersUpdateMsgAndFees } from '../helpers'

const DeleteMemberContent = ({
    propose,
    close,
}: {
    propose: (
        msgs: EncodeObject[],
        fee: StdFee,
        msgSpecificData: any) => void,
    close: () => void,
}) => {

    const { address, selectedWallet, connectedLedger } = useSelector((state: RootState) => state.userState)
    const { dataObject } = useSelector((state: RootState) => state.modalState)
    const walletId: number = selectedWallet!.walletID!
    const memberAddress: string = dataObject!.memberAddress as string
    const walletMembers: TableData[] = dataObject!.walletMembers as TableData[]
    const updatedWalletMembers: Member[] = []
    const membersForDeletion: Member[] = []

    for (const [index, member] of walletMembers.entries()) {
        const updatedMember = {
            address: member.address!,
            weight: member.address === memberAddress ? 0 : DEFAULT_VOTING_WEIGHT,
            metadata: JSON.stringify({
                memberName: member.name
            })
        }
        updatedWalletMembers.push(updatedMember)
        if (updatedMember.weight === 0) {
            membersForDeletion.push(updatedMember)
        }
    }

    const createProposal = async () => {

        const { msg, fee } = await getMembersUpdateMsgAndFees(
            updatedWalletMembers,
            walletId,
            selectedWallet?.walletAddress!,
            address!,
            connectedLedger!
        )

        const msgSpecificData = {
            members: membersForDeletion
        }

        propose(
            [msg],
            fee,
            msgSpecificData
        )
    }

    return (
        <Box style={{ width: '100%' }}>
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
                <Box style={{ width: '40%' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={styles.ctrlBtn}
                        onClick={() => createProposal()}
                    >
                        Yes, Confirm
                    </Button>
                </Box>

            </Box>
        </Box>
    )
}

export default DeleteMemberContent
