import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { OpenInNewRounded as OpenInNewRoundedIcon } from '@mui/icons-material'
import { EXPLORER_ADDRESS_DETAILS, TX_HASH_DETAILS } from 'api/endpoints'
import { formatAddress } from 'utils/helpers'
import ArrowIcon from 'assets/vectors/arrow-right.svg'
import { styles } from './styles'
import { MULTI_SEND_TYPE_URL } from 'utils/constants'

interface SuccessData {
  from: string,
  to: string,
  amount: string,
  txHash: string,
  txFee: string,
}

const BankSendTypeSuccess = () => {

  const { dataObject, msgType } = useSelector((state: RootState) => state.modalState)
  const successData: SuccessData = new Object(dataObject) as SuccessData;
  const multiTx: boolean = msgType === MULTI_SEND_TYPE_URL ? true : false

  return (
    <Box style={styles.contentHolder} gap={2}>
      <Box style={styles.fromToHolder}>
        <Box>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            From
          </Typography>
          <Typography variant="body2">
            <a
              style={styles.links}
              href={EXPLORER_ADDRESS_DETAILS(successData.from)}
              target='_blank'
            >
              {formatAddress(successData.from, 10)}
            </a>
          </Typography>
        </Box>
        <img src={ArrowIcon} alt="arrow-icon" />
        <Box>
          <Typography color="text.secondary" variant="body2">
            To
          </Typography>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2">
              {multiTx ? `${successData.to} recipients` :
                <a
                  style={styles.links}
                  href={EXPLORER_ADDRESS_DETAILS(successData.to)}
                  target='_blank'
                >
                  {formatAddress(successData.to, 10)}
                </a>}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {multiTx ? "Total Amount" : "Amount"}
        </Typography>
        <Typography variant="body2">
          {successData.amount}
        </Typography>
      </Box>
      <Divider />
      <Box display="flex" alignItems="center" gap={1} padding="0.5rem 0">
        <Typography variant="body2">Fee</Typography>
        <Typography
          variant="body2"
          color="primary.main"
          fontWeight={700}
          letterSpacing={1}
          sx={{ marginLeft: 'auto' }}
        >
          {successData.txFee}
        </Typography>
      </Box>
      <Divider />
      <Box>
        <Typography variant="body2">Transaction</Typography>
        <Tooltip title="Go to Explorer">
          <a href={TX_HASH_DETAILS(successData.txHash)} target='_blank'>
            <Stack
              marginBottom='20px'
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

export default BankSendTypeSuccess
