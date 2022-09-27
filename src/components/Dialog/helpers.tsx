import { Box, Divider, Stack, Tooltip, Typography } from "@mui/material"
import { OpenInNewRounded as OpenInNewRoundedIcon } from '@mui/icons-material'
import { TX_HASH_DETAILS } from "api/endpoints"
import { styles } from "./styles"

export const HashAndFees = ({ txHash, txFee, }: { txHash: string; txFee: string }) => {
    return (
        <Box style={{ width: '100%' }}>
            <Divider />
            <Box style={styles.SuccessHolderBox}>
                <Typography variant="body2">Fee</Typography>
                <Typography
                    variant="body2"
                    color="primary.main"
                    fontWeight={700}
                    letterSpacing={1}
                    sx={{ marginLeft: 'auto' }}
                >
                    {txFee}
                </Typography>
            </Box>
            <Divider />
            <Box style={styles.SuccessHolderBox}>
                <Typography variant="body2">Transaction</Typography>
                <Tooltip title="Go to Explorer">
                    <a href={TX_HASH_DETAILS(txHash)} target='_blank'>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ cursor: 'pointer' }}
                        >
                            <Typography
                                variant="body2"
                                color="primary.main"
                                sx={{ textDecoration: 'underline' }}
                            >
                                Transaction link
                            </Typography>
                            <OpenInNewRoundedIcon
                                fontSize="small"
                                sx={(theme) => ({
                                    color: theme.palette.primary.main
                                })}
                            />
                        </Stack>
                    </a>
                </Tooltip>
            </Box>
        </Box>
    )
}
