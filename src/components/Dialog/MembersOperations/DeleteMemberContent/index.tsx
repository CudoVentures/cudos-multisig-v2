import { RootState } from 'store'
import { styles } from '../styles'
import { useSelector } from 'react-redux'
import { Box, Button } from '@mui/material'
import { Member } from 'store/walletObject'
import { TableData } from 'utils/tableSortingHelper'
import { DEFAULT_VOTING_WEIGHT } from 'utils/constants'

const DeleteMemberContent = ({
    propose,
    close,
}: {
    propose: (
        members: Member[],
        memberName: string,
        memberAddress: string) => void,
    close: () => void,
}) => {

    const { dataObject } = useSelector((state: RootState) => state.modalState)
    const memberAddress: string = dataObject!.memberAddress as string
    const memberName: string = dataObject!.memberName as string
    const walletMembers: TableData[] = dataObject!.walletMembers as TableData[]
    const updatedWalletMembers: Member[] = []

    for (const [index, member] of walletMembers.entries()) {
        const updatedMember = {
            address: member.address!,
            weight: member.address === memberAddress ? 0 : DEFAULT_VOTING_WEIGHT,
            metadata: JSON.stringify({
                memberName: member.name
            })
        }
        updatedWalletMembers.push(updatedMember)
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
                        onClick={() => propose(
                            updatedWalletMembers,
                            memberName,
                            memberAddress
                        )}
                    >
                        Yes, Confirm
                    </Button>
                </Box>

            </Box>
        </Box>
    )
}

export default DeleteMemberContent
