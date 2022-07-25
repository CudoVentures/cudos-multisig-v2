//@ts-nocheck
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { RootState } from 'store'
import { styles } from './styles'
import Card from 'components/Card/Card'
import { formatAddress, formatDateTime } from 'utils/helpers'
import { Pagination, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { updateModalState } from 'store/modals'
import { COLORS_DARK_THEME } from 'theme/colors'
import { useDispatch, useSelector } from 'react-redux'
import { TxTypeComponent } from 'utils/TxTypeHandler'
import MembersIcon from 'assets/vectors/members-icon.svg'
import { useGetWalletProposalDetailsSubscription } from 'graphql/types'
import TypeDetailsHandlerComponent from './TypeDetailsHandlerComponent'
import { EXPLORER_ADDRESS_DETAILS, TX_HASH_DETAILS } from 'api/endpoints'
import BluePlusIcon from 'assets/vectors/proposalDetails/blue-plus-icon.svg'
import HollowGrayIcon from 'assets/vectors/proposalDetails/hollow-gray-icon.svg'
import RedRejectedIcon from 'assets/vectors/proposalDetails/red-rejected-icon.svg'
import { determineStatus, getExpirationTime, isExpired, ProposalStatusComponent } from 'utils/proposalStatusHandler'
import BluePositiveCheckIcon from 'assets/vectors/proposalDetails/blue-positive-check-icon.svg'

import {
    Box,
    Button,
    CircularProgress,
    Tooltip,
    Typography,
} from '@mui/material'

import {
    NO_TX_HASH_MSG,
    PROPOSAL_STATUS_SUBMITTED,
    VOTE_OPTIONS_MAPPING,
    PROPOSAL_STATUS_ACCEPTED,
    VOTE_OPTION_NO,
    VOTE_OPTION_YES,
    PROPOSAL_STATUS_SUBMITTED_AND_USER_VOTED,
    PROPOSAL_EXECUTOR_RESULT_SUCCESS,
    PROPOSAL_OPTION_EXECUTE,
    PROPOSAL_STATUS_REJECTED,
    PROPOSAL_EXECUTOR_RESULT_FAILURE,
    PROPOSAL_STATUS_ABORTED
} from 'utils/constants'

export interface FetchedProposalDetailsData {
    message: any;
    msgType: string;
    txHash: string;
    votes: Vote[];
    status: string;
    isVotable: boolean;
    proposer: string;
    expirationDate: string;
    haveComments: boolean;
    submissionTime: string;
    threshold: number;
    totalMembers: number;
    executor: string;
    executionTime: string;
}

interface Voter {
    address: string;
    name: string
}

interface Vote {
    comments: string;
    voteOption: string;
    submitTime: string;
    voter: Voter;
}

const ProposalDetails = ({ proposalID }: { proposalID: number }) => {

    const dispatch = useDispatch()
    const { address } = useSelector((state: RootState) => state.userState)
    const { loading, error, data } = useGetWalletProposalDetailsSubscription({
        variables: { id: proposalID }
    })

    let proposalDetails: FetchedProposalDetailsData = {
        message: undefined,
        votes: [],
        msgType: '',
        txHash: '',
        status: '',
        isVotable: false,
        proposer: '',
        expirationDate: '',
        haveComments: false,
        submissionTime: '',
        threshold: 0,
        totalMembers: 0,
        executor: '',
        executionTime: ''
    }

    if (data) {
        const proposal = data.group_proposal_by_pk
        const proposalTimeStamp: string = proposal?.block.timestamp
        const txHash: string = proposal?.transaction_hash ? proposal?.transaction_hash : NO_TX_HASH_MSG
        const proposalMessage = proposal?.messages[0] ? proposal?.messages[0] : null
        const msgType: string = proposalMessage["@type"]
        const status: string = determineStatus(address!, proposal)
        const expirationTime: string = getExpirationTime(proposal)
        const threshold: number = proposal?.group_with_policy.threshold!
        const totalMembers: number = proposal?.group_with_policy.group_members.length!
        const proposer: string = proposal?.proposer!
        const votes: Vote[] = []
        let isHavingComments: boolean = false

        for (const vote of proposal?.group_proposal_votes!) {
            const currentVote: Vote = {
                comments: vote.vote_metadata!,
                voteOption: vote.vote_option,
                submitTime: vote.submit_time,
                voter: {
                    address: vote.group_member?.address!,
                    name: JSON.parse(vote.group_member?.metadata!).memberName
                }
            }
            if (currentVote.comments !== '') {
                isHavingComments = true
            }
            votes.push(currentVote)
        }

        proposalDetails = {
            message: proposalMessage,
            votes: votes,
            msgType: msgType,
            txHash: txHash,
            status: status,
            isVotable: (status === PROPOSAL_STATUS_SUBMITTED),
            proposer: proposer,
            expirationDate: expirationTime,
            haveComments: isHavingComments,
            submissionTime: formatDateTime(proposalTimeStamp),
            threshold: threshold,
            totalMembers: totalMembers,
            executor: proposal?.executor!,
            executionTime: formatDateTime(proposal?.execution_time)
        }
    }

    const openVotingModal = (option: string) => {
        dispatch(updateModalState({
            dataObject: {
                proposalID: proposalID,
                option: option
            },
            openVotingModal: true
        }))
    }

    return (
        <Box sx={styles.modalContainer}>
            {loading ? <CircularProgress /> :
                <Box style={{ width: '100%' }}>
                    <Box style={{ width: '100%' }}>

                        {/* LEFT CONTAINER*/}
                        <Box style={styles.leftContainerBox}>
                            <div style={styles.separatingBorder}></div>
                            <Typography fontWeight={700} variant='h6'>
                                Transaction Details
                            </Typography>
                            <Box style={{ margin: '15px 0' }}>
                                <ProposalStatusComponent status={proposalDetails.status} />
                            </Box>
                            <Box style={{ display: 'inline-flex', alignItems: 'center' }}>
                                <Typography
                                    marginRight={6}
                                    fontWeight={600}
                                    variant='subtitle1'
                                    color='text.secondary'
                                >
                                    Type:
                                </Typography>
                                <TxTypeComponent type={proposalDetails.msgType} />
                            </Box>

                            {/* SOMEWHAT CONFIGURABLE CONTENT CONTAINER FOR PROBABLY DIFFERENT MSG TYPES */}
                            <TypeDetailsHandlerComponent proposalDetails={proposalDetails} />

                            <Box style={{ margin: '20px 0', display: 'flex' }}>
                                <Box style={styles.displayFlexStart}>
                                    <Typography
                                        marginRight={3}
                                        fontWeight={600}
                                        variant='subtitle1'
                                        color='text.secondary'
                                    >
                                        Transaction Hash
                                    </Typography>
                                    <Typography>
                                        {proposalDetails.txHash === NO_TX_HASH_MSG ? proposalDetails.txHash :
                                            <a
                                                style={{ textDecoration: 'none' }}
                                                href={TX_HASH_DETAILS(proposalDetails.txHash)}
                                                target='_blank'
                                            >
                                                <Tooltip title={proposalDetails.txHash}>
                                                    <div style={{ color: COLORS_DARK_THEME.PRIMARY_BLUE }} >
                                                        {formatAddress(proposalDetails.txHash, 9)}
                                                    </div>
                                                </Tooltip>
                                            </a>
                                        }
                                    </Typography>
                                </Box>
                                <Box style={styles.displayFlexStart}>
                                    <Typography
                                        marginRight={3}
                                        fontWeight={600}
                                        variant='subtitle1'
                                        color='text.secondary'
                                    >
                                        Proposal ID
                                    </Typography>
                                    <Typography>
                                        {proposalID}
                                    </Typography>
                                </Box>
                                <Box style={styles.displayFlexStart}>
                                    <Typography
                                        marginRight={6}
                                        fontWeight={600}
                                        variant='subtitle1'
                                        color='text.secondary'
                                    >
                                        Created by
                                    </Typography>
                                    <Typography>
                                        <a
                                            style={{ color: COLORS_DARK_THEME.PRIMARY_BLUE, textDecoration: 'none' }}
                                            href={EXPLORER_ADDRESS_DETAILS(proposalDetails.proposer)}
                                            target='_blank'
                                        >
                                            {formatAddress(proposalDetails.proposer, 15)}
                                        </a>
                                    </Typography>
                                </Box>
                            </Box>
                            <Box style={styles.displayFlexStart}>
                                <Typography fontWeight={700} variant='h5'>
                                    Comments
                                </Typography>
                                <Card style={styles.swiperCard}>
                                    {proposalDetails.haveComments ?
                                        <Swiper
                                            modules={[Pagination, Mousewheel]}
                                            mousewheel
                                            spaceBetween={10}
                                            slidesPerView={1}
                                            style={{ height: '140px' }}
                                            pagination={{ clickable: true }}
                                        >
                                            {proposalDetails.votes.map((vote) => {
                                                if (vote.comments !== '') {
                                                    return (
                                                        <SwiperSlide>
                                                            <Box style={{ ...styles.displayFlexStart, marginTop: '15px' }}>
                                                                <Typography>
                                                                    <a style={{
                                                                        color: COLORS_DARK_THEME.PRIMARY_BLUE,
                                                                        textDecoration: 'none'
                                                                    }}
                                                                        href={EXPLORER_ADDRESS_DETAILS(proposalDetails.proposer)}
                                                                        target='_blank'>
                                                                        {`${formatAddress(vote.voter.address, 15)} (${vote.voter.name})`}
                                                                    </a>
                                                                </Typography>
                                                                <Typography variant='subtitle1'>
                                                                    {vote.comments}
                                                                </Typography>
                                                            </Box>
                                                        </SwiperSlide>
                                                    )
                                                }
                                            })}
                                        </Swiper>
                                        :
                                        <Box style={{ ...styles.displayFlexStart, width: '420px  ' }}>
                                            <Typography
                                                marginTop={2}
                                                fontWeight={600}
                                                variant='subtitle1'
                                                color='text.secondary'
                                            >
                                                It seems there are no comments
                                            </Typography>
                                        </Box>}
                                </Card>
                            </Box>
                        </Box>

                        {/* RIGHT CONTAINER*/}
                        <Box>
                            <Box style={styles.expirationHolder}>
                                <Typography
                                    marginRight={1}
                                    fontWeight={700}
                                    variant='subtitle2'
                                    color='text.secondary'
                                >
                                    {`Voting ${isExpired(proposalDetails.expirationDate) ? 'ended' : 'ends'} on `}
                                </Typography>
                                <Typography variant='subtitle1' color='text.primary'>
                                    {proposalDetails.expirationDate}
                                </Typography>
                            </Box>
                            <Box style={styles.vertialStepsHolder}>
                                <div style={styles.verticalLineSteps}>
                                    <img
                                        style={{
                                            position: 'absolute',
                                            top: '-2px',
                                            left: '-8.5px'
                                        }}
                                        src={BluePlusIcon}
                                        alt="Progress Icon"
                                    />
                                    <Box
                                        style={{
                                            position: 'absolute',
                                            top: '-6px',
                                            display: 'flex'
                                        }}>
                                        <Typography
                                            style={{ margin: '0 15px 0 25px' }}
                                            fontWeight={600}
                                        >
                                            Created
                                        </Typography>
                                        <Typography
                                            fontWeight={500}
                                            color='text.secondary'
                                        >
                                            {proposalDetails.submissionTime}
                                        </Typography>
                                    </Box>

                                    <img
                                        style={{ position: 'absolute', top: '40px', left: '-8px' }}
                                        src={
                                            proposalDetails.status === PROPOSAL_STATUS_ACCEPTED ||
                                                proposalDetails.status === PROPOSAL_EXECUTOR_RESULT_FAILURE ||
                                                proposalDetails.status === PROPOSAL_EXECUTOR_RESULT_SUCCESS ? BluePositiveCheckIcon :
                                                proposalDetails.status === PROPOSAL_STATUS_REJECTED ? RedRejectedIcon
                                                    : HollowGrayIcon
                                        }
                                        alt="Progress Icon"
                                    />
                                    <Box style={{ position: 'absolute', top: '34px', display: 'flex' }}>
                                        <Typography
                                            color={proposalDetails.votes.length > 0 ? 'inherit' : 'text.secondary'}
                                            style={{ margin: '0 15px 0 25px' }}
                                            fontWeight={600}
                                        >
                                            Voted
                                        </Typography>
                                        <img style={{ width: '20px' }} src={MembersIcon} alt="Members Icon" />
                                        <Typography
                                            style={{ margin: '0 10px' }}
                                            variant="inherit"
                                            color="text.secondary"
                                        >
                                            {`${proposalDetails.votes.length} of ${proposalDetails.totalMembers}`}
                                        </Typography>
                                    </Box>
                                    <Box style={styles.votersBox}>
                                        {
                                            proposalDetails.votes.map((vote) => {
                                                return (
                                                    <Box style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography color={VOTE_OPTIONS_MAPPING[vote.voteOption].color}>
                                                            {`${formatAddress(vote.voter.address, 10)} (${vote.voter.name})`}

                                                        </Typography>
                                                        <img src={VOTE_OPTIONS_MAPPING[vote.voteOption].icon} />
                                                    </Box>
                                                )
                                            })
                                        }
                                    </Box>
                                    {
                                        proposalDetails.votes.length < proposalDetails.threshold ?
                                            <Box style={styles.approvalNeededInfoBox}>
                                                <Typography color={COLORS_DARK_THEME.PRIMARY_BLUE}>
                                                    {`${proposalDetails.threshold - proposalDetails.votes.length} more approvals ${isExpired(proposalDetails.expirationDate) ? 'were' : ""} needed`}
                                                </Typography>
                                            </Box>
                                            :
                                            null
                                    }
                                    <img
                                        style={{ position: 'absolute', top: '240px', left: '-8px' }}
                                        src={
                                            proposalDetails.status === PROPOSAL_EXECUTOR_RESULT_SUCCESS ? BluePositiveCheckIcon :
                                                proposalDetails.status === PROPOSAL_EXECUTOR_RESULT_FAILURE ? RedRejectedIcon :
                                                    HollowGrayIcon}
                                        alt="Progress Icon"
                                    />
                                    <Box style={{ position: 'absolute', top: '235px', display: 'flex' }}>
                                        <Typography
                                            color={proposalDetails.status === PROPOSAL_EXECUTOR_RESULT_SUCCESS ? 'inherit' : 'text.secondary'}
                                            style={{ margin: '0 15px 0 25px' }}
                                            fontWeight={600}
                                        >
                                            Executed
                                        </Typography>
                                    </Box>
                                    {
                                        proposalDetails.status === PROPOSAL_STATUS_REJECTED ||
                                            proposalDetails.status === PROPOSAL_EXECUTOR_RESULT_FAILURE ?
                                            <Tooltip placement='top' title={
                                                proposalDetails.status === PROPOSAL_EXECUTOR_RESULT_FAILURE ? '{Failute reason}' :
                                                    proposalDetails.status === PROPOSAL_STATUS_ABORTED ?
                                                        'It seems some of the wallet settings have changed during the active period of this proposal' : ''}>
                                                <Box style={styles.rejectedInfoBox}>
                                                    <Typography color={VOTE_OPTIONS_MAPPING[VOTE_OPTION_NO].color}>
                                                        {`Transaction ${proposalDetails.status === PROPOSAL_EXECUTOR_RESULT_FAILURE ? "failed to execute" :
                                                            proposalDetails.status === PROPOSAL_STATUS_ABORTED ? "has been aborted" : "has been rejected"}`}
                                                    </Typography>
                                                </Box>
                                            </Tooltip>
                                            : isExpired(proposalDetails.expirationDate) ?
                                                <Box style={styles.expiredInfoBox}>
                                                    <Typography>
                                                        Transaction expired
                                                    </Typography>
                                                </Box>
                                                : proposalDetails.status === PROPOSAL_EXECUTOR_RESULT_SUCCESS ?
                                                    <Box>
                                                        <Box style={styles.executedInfoAddressBox}>
                                                            <Typography marginRight={1} color={'text.secondary'}>by</Typography>
                                                            <a
                                                                style={{ color: COLORS_DARK_THEME.PRIMARY_BLUE, textDecoration: 'none' }}
                                                                href={EXPLORER_ADDRESS_DETAILS(proposalDetails.executor)}
                                                                target='_blank'
                                                            >
                                                                {formatAddress(proposalDetails.executor, 15)}
                                                            </a>
                                                        </Box>
                                                        <Box style={styles.executedInfoTimeBox}>
                                                            <Typography marginRight={1} color={'text.secondary'}>on</Typography>
                                                            <Typography>{proposalDetails.executionTime}</Typography>
                                                        </Box>
                                                    </Box>

                                                    : null
                                    }
                                </div>
                            </Box>
                        </Box>
                        {proposalDetails.status === PROPOSAL_STATUS_SUBMITTED ?
                            <Box style={styles.btnHolderBox}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={styles.votingBtns}
                                    onClick={() => openVotingModal(VOTE_OPTION_NO)}
                                >
                                    Reject
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={styles.votingBtns}
                                    onClick={() => openVotingModal(VOTE_OPTION_YES)}
                                >
                                    Approve
                                </Button>
                            </Box>
                            : proposalDetails.status === PROPOSAL_STATUS_SUBMITTED_AND_USER_VOTED ?
                                <Box style={styles.btnHolderBox}>
                                    <Button
                                        disabled
                                        variant="contained"
                                        sx={styles.executingBtn}
                                    >
                                        You already voted
                                    </Button>
                                </Box>
                                : proposalDetails.status === PROPOSAL_STATUS_ACCEPTED ||
                                    proposalDetails.status === PROPOSAL_EXECUTOR_RESULT_FAILURE ?
                                    <Box style={styles.btnHolderBox}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={styles.executingBtn}
                                            onClick={() => openVotingModal(PROPOSAL_OPTION_EXECUTE)}
                                        >
                                            {proposalDetails.status === PROPOSAL_EXECUTOR_RESULT_FAILURE ? "Retry" : "Execute"}
                                        </Button>
                                    </Box>
                                    : null
                        }
                    </Box>
                </Box>
            }
        </Box>
    )
}

export default ProposalDetails
