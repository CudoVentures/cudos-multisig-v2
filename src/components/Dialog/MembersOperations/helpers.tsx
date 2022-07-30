import { Box, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import { RootState } from "store"
import { COLORS_DARK_THEME } from "theme/colors"
import DeleteMemberIcon from 'assets/vectors/delete-member-icon.svg'
import { signingClient } from "utils/config"
import { EncodeObject, GasPrice, StdFee } from "cudosjs"
import { Member } from "store/walletObject"
import { styles } from "./styles"

import { 
    DEFAULT_MEMO, 
    DEFAULT_META_DATA, 
    DEFAULT_MULTIPLIER, 
    DELETE_MEMBER_TYPE_URL, 
    GAS_PRICE, 
    NATIVE_TOKEN_DENOM 
} from "utils/constants"

export const getMsgAndFees = async (
    members: Member[],
    walletId: number,
    walletAddress: string,
    signerAddress: string
): Promise<{
    msg: EncodeObject;
    fee: StdFee;
}> => {

    return (await signingClient).groupModule.msgUpdateMembersProposal(
        members,
        walletId,
        walletAddress,
        signerAddress,
        DEFAULT_META_DATA,
        GasPrice.fromString(GAS_PRICE + NATIVE_TOKEN_DENOM),
        DEFAULT_MULTIPLIER,
        DEFAULT_MEMO
    )
}

export const TitleAndSubtitle = (): JSX.Element => {

    const { dataObject } = useSelector((state: RootState) => state.modalState)
    const msgType: string = dataObject!.msgType as string

    let title: string = 'Add New Member'
    let subTitle: string | JSX.Element = 'In order to add new member fill in the information below'

    if (msgType === DELETE_MEMBER_TYPE_URL) {
        const memberName: string = dataObject!.memberName as string

        title = 'Do you want to delete?'
        subTitle = (
            <span>
                {"Are you sure you want to delete"}
                <span style={{ color: COLORS_DARK_THEME.PRIMARY_BLUE, margin: '0 5px' }}>
                    {memberName}
                </span>
                {"from the wallet? You cannot undo this action."}
            </span>
        )
    }

    return (
        <Box style={styles.titleHolder}>
            {msgType === DELETE_MEMBER_TYPE_URL ?
                <img
                    style={{ marginBottom: '10px' }}
                    src={DeleteMemberIcon}
                    alt="attention-icon"
                /> : null}

            <Typography
                textAlign={'center'}
                id='Title'
                fontWeight={700}
                variant='h5'
                color='text.primrary'
            >
                {title}
            </Typography>
            
            <Typography
                marginTop={1}
                textAlign={'center'}
                id='SubTitle'
                fontWeight={400}
                variant='subtitle1'
                color='text.secondary'
            >
                {subTitle}
            </Typography>
        </Box>
    )
}
