import { RootState } from 'store'
import { styles } from './styles'
import { styles as controlStyles } from '../styles'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { INVALID_DATA_PROMPT_MSG } from 'utils/constants'
import { EncodeObject, StdFee } from 'cudosjs'
import { useGetWalletSettingsQuery } from 'graphql/types'
import { getWalletMetadataUpdateMsgAndFees } from '../helpers'
import { emptyFetchedWalletMetadata, FetchedWalletMetadata } from 'graphql/helpers'

import {
    Box,
    Button,
    Input,
    Tooltip
} from '@mui/material'

const UpdateWalletSettings = ({
    propose,
    close,
}: {
    propose: (
        msgs: EncodeObject[],
        fee: StdFee,
        msgSpecificData: any) => void,
    close: () => void,
}) => {

    const [walletName, setWalletName] = useState<string>('')
    const [walletInfo, setWalletInfo] = useState<string>('')
    const [oldData, setOldData] = useState<FetchedWalletMetadata>(emptyFetchedWalletMetadata)
    const { address, selectedWallet, connectedLedger } = useSelector((state: RootState) => state.userState)
    const walletId: number = parseInt(selectedWallet!.walletID!)
    const { loading, error, data } = useGetWalletSettingsQuery({
        variables: { id: walletId }
    })

    useEffect(() => {
        if (data) {
            const fetchedWallet = data.group_with_policy_by_pk!
            const metaData: FetchedWalletMetadata = JSON.parse(fetchedWallet.group_metadata!)

            setWalletName(metaData.walletName)
            setWalletInfo(metaData.generalInfo)
            setOldData({
                walletName: metaData.walletName,
                generalInfo: metaData.generalInfo
            })
        }
    }, [data])

    const validData = (): boolean => {

        // We want non empty mandatory fields
        if (
            walletName !== ''
        ) {
            // And also want at least one of the new data to be different than the old data
            if (
                walletName !== oldData.walletName ||
                walletInfo !== oldData.generalInfo
            ) {
                return true
            }
        }
        return false
    }

    const getTooltip = (): string => {
        if (!validData()) {
            return INVALID_DATA_PROMPT_MSG
        }

        return ''
    }

    const createProposal = async () => {

        const updatedGroupMetadata = {
            groupMetadata: {
                walletName: walletName,
                generalInfo: walletInfo
            }
        }

        const { msg, fee } = await getWalletMetadataUpdateMsgAndFees(
            JSON.stringify(updatedGroupMetadata),
            walletId,
            selectedWallet?.walletAddress!,
            address!,
            connectedLedger!
        )

        const msgSpecificData = {
            proposedWalletSettings: {
                walletName: walletName,
                walletInfo: walletInfo
            }
        }

        propose(
            [msg],
            fee,
            msgSpecificData
        )
    }

    return (
        <Box style={{ width: '100%' }}>
            {/* CONTENT */}
            <Box style={styles.contentHolder}>

                <Box marginBottom={1} marginTop={2}>Wallet Name</Box>
                <Input
                    disableUnderline
                    style={styles.addressInput}
                    type="text"
                    name="walletName"
                    value={walletName}
                    placeholder="e.g Cudos Wallet"
                    onChange={(e) => setWalletName(e.target.value)}
                />

                <Box marginBottom={1} marginTop={2}>General Info</Box>
                <textarea
                    name="walletInfo"
                    value={walletInfo}
                    placeholder={!walletInfo ? "Your wallet have no general info" : ""}
                    style={styles.textArea}
                    onChange={(e) => setWalletInfo(e.target.value)}
                />
            </Box>

            {/* CONTROLS */}
            <Box style={controlStyles.controlsHolder}>
                <Box style={{ width: '40%' }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={controlStyles.ctrlBtn}
                        onClick={close}
                    >
                        No, Go Back
                    </Button>
                </Box>
                <Tooltip title={getTooltip()}>
                    <Box style={{ width: '40%' }}>
                        <Button
                            disabled={!validData()}
                            variant="contained"
                            color="primary"
                            sx={controlStyles.ctrlBtn}
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

export default UpdateWalletSettings
