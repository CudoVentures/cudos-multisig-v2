import SendIcon from 'assets/vectors/type-icons/send.svg'
import UnknownIcon from 'assets/vectors/type-icons/unknown.svg'
import MembersIcon from 'assets/vectors/members-icon.svg'
import ActiveSettingsIcon from 'assets/vectors/dashboard/active-settings.svg'
import YesIcon from 'assets/vectors/yes-vote-icon.svg'
import NoIcon from 'assets/vectors/no-vote-icon.svg'
import moment from 'moment'
import { ReactComponent as TwitterIcon } from 'assets/vectors/twitter.svg'
import { ReactComponent as TelegramIcon } from 'assets/vectors/telegram.svg'
import { ReactComponent as DiscordIcon } from 'assets/vectors/discord.svg'
import { ReactComponent as LinkedInIcon } from 'assets/vectors/linkedin.svg'
import { ReactComponent as MediumIcon } from 'assets/vectors/medium.svg'
import { ReactComponent as YouTubeIcon } from 'assets/vectors/youtube.svg'
import { ReactComponent as FacebookIcon } from 'assets/vectors/facebook.svg'
import { ReactComponent as SpotifyIcon } from 'assets/vectors/spotify.svg'
import KeplrLogo from 'assets/vectors/keplr-logo.svg'
import CosmostationLogo from 'assets/vectors/cosmostation-logo.svg'
import { SUPPORTED_WALLET } from 'cudosjs'
import { styles } from './styles'

// ENV
export const RPC_ADDRESS = import.meta.env.VITE_APP_RPC || process.env.VITE_APP_RPC || ""
export const API_ADDRESS = import.meta.env.VITE_APP_API || process.env.VITE_APP_API || ""
export const STAKING_URL = import.meta.env.VITE_APP_STAKING_URL || process.env.VITE_APP_STAKING_URL || ""
export const EXPLORER_PUBLIC_ADDRESS = import.meta.env.VITE_APP_EXPLORER_PUBLIC_ADDRESS || process.env.VITE_APP_EXPLORER_PUBLIC_ADDRESS || ""
export const CHAIN_NAME = import.meta.env.VITE_APP_CHAIN_NAME || process.env.VITE_APP_CHAIN_NAME || ""
export const CHAIN_ID = import.meta.env.VITE_APP_CHAIN_ID || process.env.VITE_APP_CHAIN_ID || ""
export const GAS_PRICE = import.meta.env.VITE_APP_GAS_PRICE || process.env.VITE_APP_GAS_PRICE || ""
export const GRAPHQL_URL = import.meta.env.VITE_APP_GRAPHQL_URL || process.env.VITE_APP_GRAPHQL_URL || ""
export const GRAPHQL_WS = import.meta.env.VITE_APP_GRAPHQL_WS || process.env.VITE_APP_GRAPHQL_WS || ""
export const FIREBASE_API_KEY = import.meta.env.VITE_APP_FIREBASE_API_KEY || process.env.VITE_APP_API_KEY || ""
export const FIREBASE_DOMAIN = import.meta.env.VITE_APP_FIREBASE_DOMAIN || process.env.VITE_APP_FIREBASE_DOMAIN || ""
export const FIREBASE_PROJECT_ID = import.meta.env.VITE_APP_FIREBASE_PROJECT_ID || process.env.VITE_APP_FIREBASE_PROJECT_ID || ""
export const FIREBASE_AUTH_NONCE_URL = import.meta.env.VITE_APP_FIREBASE_AUTH_NONCE_URL || process.env.VITE_APP_FIREBASE_AUTH_NONCE_URL || ""
export const FIREBASE_AUTH_VERIFY_URL = import.meta.env.VITE_APP_FIREBASE_AUTH_VERIFY_URL || process.env.VITE_APP_FIREBASE_AUTH_VERIFY_URL || ""
export const FIREBASE_ADDRESS_BOOK_COLLECTION = import.meta.env.VITE_APP_FIREBASE_ADDRESS_BOOK_COLLECTION || process.env.VITE_APP_FIREBASE_ADDRESS_BOOK_COLLECTION || ""
export const DEPLOYMENT_VERSION = import.meta.env.VITE_APP_DEPLOYMENT_VERSION || process.env.VITE_APP_DEPLOYMENT_VERSION || ""

// General config
export const ADMIN_TOKEN_DENOM = 'cudosAdmin'
export const NATIVE_TOKEN_DENOM = 'acudos'
export const CURRENCY_DISPLAY_NAME = 'CUDOS'
export const DEFAULT_META_DATA = 'default-metadata'
export const DEFAULT_MEMO = 'Created with CUDOS MultiSig'
export const DEFAULT_VOTING_WEIGHT = 1
export const DEFAULT_MULTIPLIER = 1.5
export const MINIMUM_GAS_FEE = 0.5

export const SUPPORTED_WALLET_LOGOS = {
    [SUPPORTED_WALLET.Keplr]: <img style={styles.keplrLogo} src={KeplrLogo} alt="Keplr Logo" />,
    [SUPPORTED_WALLET.Cosmostation]: <img style={styles.cosmostationLogo} src={CosmostationLogo} alt="Cosmostation Logo" />
}

export const FOOTER = {
    LEFT_LINKS: [
        { text: 'Terms & Conditions', url: 'https://www.cudos.org/terms-and-conditions/' },
        { text: 'Privacy Policy', url: 'https://www.cudos.org/privacy-policy' },
        { text: 'cudos.org', url: 'https://www.cudos.org/' },
        { text: `License © 2018 - ${moment().year()}`, url: 'https://www.cudos.org/' },
        { text: `${DEPLOYMENT_VERSION}`, url: `https://github.com/CudoVentures/cudos-multisig-v2/releases/tag/${DEPLOYMENT_VERSION}` }
    ],
    RIGHT_LINKS: [
        { icon: <TwitterIcon />, url: 'https://twitter.com/CUDOS_' },
        { icon: <TelegramIcon />, url: 'https://t.me/cudostelegram' },
        { icon: <DiscordIcon />, url: 'https://discord.com/invite/t397SKqf4u' },
        { icon: <LinkedInIcon />, url: 'https://www.linkedin.com/company/cudos1' },
        { icon: <MediumIcon />, url: 'https://medium.com/cudos' },
        { icon: <YouTubeIcon />, url: 'https://www.youtube.com/c/CUDOS' },
        { icon: <FacebookIcon />, url: 'https://www.facebook.com/cudos.org' },
        { icon: <SpotifyIcon />, url: 'https://open.spotify.com/show/2lZuBXJ270g7taK06tnK35' },
    ]
}

// Modal Msg Titles
export const FILE_ERROR_TITLE = 'File Error'
export const LOGIN_FAIL_TITLE = 'Login Failed'
export const WALLET_PROCESS_FAIL_TITLE = 'Process Failed!'
export const WALLET_CREATION_FAILURE_TITLE = 'Creating Failed!'
export const WALLET_FUNDING_FAILURE_TITLE = 'Funding Failed!'
export const WALLET_CREATION_LOADING_TITLE = 'Creating Wallet...'
export const PROPOSAL_CREATION_LOADING_TITLE = 'Creating Proposal...'
export const PROPOSAL_CREATION_FAILURE_TITLE = 'Proposing Failed!'
export const WALLET_FUNDING_LOADING_TITLE = 'Funding Wallet...'
export const DUPLICATED_ADDRESS_EDITING_FAILUTE_TITLE = 'Address book operation failed'
export const GENERAL_FAILURE_TITLE = 'Failure'

// Modal Msg Types
export const PROPOSAL_CREATION_SUCCESS_TYPE = 'Proposal Creation Success'
export const WALLET_CREATION_SUCCESS_TYPE = 'Wallet Creation Success'
export const WALLET_CREATION_FAILURE_TYPE = 'Wallet Creation Failure'
export const PROPOSAL_CREATION_FAILURE_TYPE = "Proposal Creation Failure"
export const WALLET_FUNDING_SUCCESS_TYPE = 'Wallet Funding Success'
export const WALLET_FUNDING_FAILURE_TYPE = 'Wallet Funding Failure'
export const WALLET_CORRUPTED_PROCESS_TYPE = 'Wallet Corrupted Process'
export const DUPLICATED_ADDRESS_TYPE = 'Duplicated address'
export const FEE_ESTIMATION_ERROR = 'Fee estimation failure'
export const PROPOSAL_VOTING_ERROR_TYPE = 'Proposal voting error'
export const PROPOSAL_VOTING_SUCCESS_TYPE = 'Proposal voting success'

// General Modal Msgs
export const NO_TX_HASH_MSG = 'Not executed yet'
export const DEFAULT_LOGIN_FAILURE_MSG = 'Seems like something went wrong. Please try again later'
export const FILE_ERROR_MSG = 'File is in wrong format or contains invalid data'
export const INVALID_DATA_PROMPT_MSG = 'Please provide valid data'
export const SINGLE_TX_PROMPT_MSG = 'Please use the "Single Send "option when only 1 recipient'
export const GENERAL_FAILURE_MSG = 'Seems like something went wrong. Try again or check your account balance.'
export const PROPOSAL_CREATION_SUCCESS_MSG = 'Proposal was successfully created!'
export const WALLET_CREATION_SUCCESS_MSG = 'Your MultiSig wallet was successfully created!'
export const WALLET_FUNDING_SUCCESS_MSG = 'Your MultiSig wallet was successfully funded!'
export const PROPOSAL_VOTING_SUCCESS_MSG = 'You have successfully voted on the proposal!'
export const PROPOSAL_EXECUTING_SUCCESS_MSG = 'You have successfully sent an execution message!'
export const UPDATING_MEMBERS_SUCCESS_MSG = 'You have successfully proposed wallet members update!'
export const DEFAULT_LOADING_MODAL_MSG = 'Waiting for transaction confirmation...'
export const DUPLICATED_ADDRESS_MSG = "It seems the address already exists"
export const INSUFFICIENT_BALANCE = 'You need to have sufficient CUDOS in your remaining balance in order to cover the required fees upon execution'
export const INSUFFICIENT_WALLET_BALANCE = 'You need to have sufficient tokens in your current wallet balances in order to cover the total due in the list'

// TypeURLs
export const MULTI_SEND_TYPE_URL = "/cosmos.bank.v1beta1.MsgMultiSend"
export const SINGLE_SEND_TYPE_URL = "/cosmos.bank.v1beta1.MsgSend"
export const MEMBERS_UPDATE_TYPE_URL = '/cosmos.group.v1.MsgUpdateGroupMembers'
export const GROUP_UPDATE_METADATA_TYPE_URL = '/cosmos.group.v1.MsgUpdateGroupMetadata'
export const GROUP_UPDATE_DECISION_POLICY_TYPE_URL = '/cosmos.group.v1.MsgUpdateGroupPolicyDecisionPolicy'
export const ADD_MEMBER_TYPE_URL = '/custom.MsgAddGroupMember'
export const DELETE_MEMBER_TYPE_URL = '/custom.MsgDeleteGroupMember'

// Proposal statuses
export const PROPOSAL_STATUS_SUBMITTED = 'PROPOSAL_STATUS_SUBMITTED'
export const PROPOSAL_EXECUTOR_RESULT_FAILURE = 'PROPOSAL_EXECUTOR_RESULT_FAILURE'
export const PROPOSAL_STATUS_REJECTED = 'PROPOSAL_STATUS_REJECTED'
export const PROPOSAL_STATUS_SUBMITTED_AND_USER_VOTED = 'PROPOSAL_STATUS_SUBMITTED_AND_USER_VOTED'
export const PROPOSAL_EXECUTOR_RESULT_NOT_RUN = 'PROPOSAL_EXECUTOR_RESULT_NOT_RUN'
export const PROPOSAL_STATUS_ACCEPTED = 'PROPOSAL_STATUS_ACCEPTED'
export const PROPOSAL_EXECUTOR_RESULT_SUCCESS = 'PROPOSAL_EXECUTOR_RESULT_SUCCESS'
export const PROPOSAL_STATUS_EXPIRED = 'PROPOSAL_STATUS_EXPIRED'
export const PROPOSAL_STATUS_ABORTED = 'PROPOSAL_STATUS_ABORTED'
export const UNDEFINED = 'UNKNOWN'

// Proposal Coloring
export const EXPIRED = { text: 'EXPIRED', color: '#7D87AA' }
export const ABORTED = { text: 'ABORTED', color: '#7D2E61' }
export const READY_TO_EXECUTE = { text: "READY TO EXECUTE", color: "#0F71D1" }
export const FAIL = { text: 'FAIL TO EXECUTE', color: '#E8343470' }
export const REJECTED = { text: "REJECTED", color: "#EA6161" }
export const WAITING_VOTES = { text: "WAITING VOTES", color: "#E89518" }
export const OPEN_TO_VOTE = { text: "OPEN TO VOTE", color: "#9646F9" }
export const SUCCESS = { text: 'SUCCESS', color: '#65B48F' }
export const UNKNOWN = { text: "UNKNOWN", color: "#1B2031" }

// Type Mapping
export const MULTI_SEND_TYPE = { text: "Multi Send", icon: SendIcon }
export const SINGLE_SEND_TYPE = { text: "Single Send", icon: SendIcon }
export const ADD_MEMBER_TYPE = { text: "Add Member", icon: MembersIcon }
export const DELETE_MEMBER_TYPE = { text: "Delete Member", icon: MembersIcon }
export const UPDATE_WALLET_SETTINGS_TYPE = { text: "Details Update", icon: ActiveSettingsIcon }
export const UPDATE_WALLET_POLICIES_TYPE = { text: "Policy Update", icon: ActiveSettingsIcon }
export const UNDEFINED_TYPE = { text: "Unknown", icon: UnknownIcon }

// Vote Options
export const VOTE_OPTION_YES = 'VOTE_OPTION_YES'
export const VOTE_OPTION_NO = 'VOTE_OPTION_NO'

// Vote Options Color Mapping
export const VOTE_OPTIONS_MAPPING = {
    [VOTE_OPTION_YES]: { icon: YesIcon, color: '#65B48F' },
    [VOTE_OPTION_NO]: { icon: NoIcon, color: '#EA6161' }
}

//Proposal Options
export const PROPOSAL_OPTION_EXECUTE = 'PROPOSAL_OPTION_EXECUTE'

export const FORBIDDEN_SYMBOLS = ['e', 'E', '+', '-']
export const FORBIDDEN_SYMBOLS_CUDOS_ADMIN = ['e', 'E', '+', '-', ',', '.']