export interface FetchedWalletMetadata {
    walletName: string;
    generalInfo: string;
}

export interface FetchedWalletPolicies {
    votingPeriod: number;
    threshold: number;
}

export interface FetchedWalletSettings extends FetchedWalletPolicies {
    metaData: FetchedWalletMetadata;
    thresholdDiscrepancy: boolean;
    updatedThreshold: number;
}

export const emptyFetchedWalletMetadata: FetchedWalletMetadata = {
    walletName: '',
    generalInfo: ''
}

export const emptyFetchedWalletPolicies: FetchedWalletPolicies = {
    votingPeriod: 0,
    threshold: 0
}

export const emptyFetchedWalletSettings: FetchedWalletSettings = {
    metaData: emptyFetchedWalletMetadata,
    thresholdDiscrepancy: false,
    updatedThreshold: 0,
    ...emptyFetchedWalletPolicies
}
