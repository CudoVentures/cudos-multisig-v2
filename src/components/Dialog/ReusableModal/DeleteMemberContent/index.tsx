import { RootState } from 'store'
import { styles } from '../styles'
import { useSelector } from 'react-redux'
import { Box, Button } from '@mui/material'
import { Member } from 'store/walletObject'
import { TableData } from 'utils/tableSortingHelper'
import { DEFAULT_VOTING_WEIGHT } from 'utils/constants'
import { EncodeObject, StdFee } from 'cudosjs'
import { getMembersUpdateMsgAndFees } from '../helpers'
import { MsgSpecificData } from '..'

const DeleteMemberContent = ({
    propose,
    close,
}: {
    propose: (
        msgs: EncodeObject[],
        fee: StdFee,
        msgSpecificData: MsgSpecificData) => void,
    close: () => void,
}) => {

    const { address, selectedWallet, connectedLedger } = useSelector((state: RootState) => state.userState)
    const { dataObject } = useSelector((state: RootState) => state.modalState)
    const walletId: number = selectedWallet!.walletID!
    const memberAddress: string = dataObject!.memberAddress as string
    const walletMembers: TableData[] = dataObject!.walletMembers as TableData[]
    const membersForDeletion: Member[] = walletMembers.filter(m => m.address === memberAddress).map(m => ({
        address: m.address!,
        weight: "0",
        metadata: JSON.stringify({
            memberName: m.name
        })
    }))

    const createProposal = async () => {

        const { msg, fee } = await getMembersUpdateMsgAndFees(
            membersForDeletion,
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
