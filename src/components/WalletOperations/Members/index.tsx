import { styles } from './styles'
import { RootState } from 'store'
import Dialog from 'components/Dialog'
import Card from 'components/Card/Card'
import { updateModalState } from 'store/modals'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetWalletMembersQuery } from 'graphql/types'
import MembersTable from './MembersTable'
import { AddressBookBtn, DownloadToCsvBtn } from 'utils/wrappers'
import { TableData } from 'utils/tableSortingHelper'

const Members = () => {

    const dispatch = useDispatch()
    const { selectedWallet } = useSelector((state: RootState) => state.userState)
    const walletId: number = selectedWallet!.walletID!
    const { loading, error, data } = useGetWalletMembersQuery({
        variables: { id: walletId }
    })
    const walletMembers: TableData[] = []

    if (data) {
        for (const member of data.group_with_policy_by_pk!.group_members) {
            const metaData = JSON.parse(member.metadata!)
            walletMembers.push({
                name: metaData.memberName,
                address: member.address
            })
        }
    }

    const handleAddressBookOpen = () => {
        dispatch(updateModalState({ openAddressBook: true }))
    }

    return (
        <Box style={styles.boxHolder}>
            <Dialog />
            {loading ? <CircularProgress /> :
                <Card style={styles.cardHolder}>
                    <Box style={{ float: 'right' }}>
                        <AddressBookBtn onClickProp={handleAddressBookOpen} />
                        <DownloadToCsvBtn CsvData={walletMembers} />
                    </Box>
                    <Box style={styles.adressCounterHolder}>
                        <Typography
                            fontWeight={600}
                            color={'text.secondary'}
                            variant='subtitle1'
                        >
                            ADDRESSES
                        </Typography>
                        <Box style={styles.blueCountDisplayer}>{walletMembers.length}</Box>
                    </Box>
                    <Box>
                        <MembersTable fetchedData={walletMembers} />
                    </Box>
                </Card>}
        </Box>
    )
}

export default Members
