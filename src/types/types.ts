import type {
  AccountWebhookEncoding,
  PriorityLevel,
  TransactionType,
  TxnStatus,
  UiTransactionEncoding,
  WebhookType,
} from './enums';

export type HeliusCluster = 'mainnet-beta' | 'devnet';

export interface HeliusEndpoints {
  api: string;
  rpc: string;
}

export type HeliusOptions = {
  limit?: number;
  paginationToken?: string;
};

export interface Webhook {
  webhookID: string;
  wallet: string;
  project: string;
  webhookURL: string;
  transactionTypes: TransactionType[];
  accountAddresses: string[];
  accountAddressOwners?: string[];
  webhookType?: WebhookType;
  authHeader?: string;
  txnStatus?: TxnStatus;
  encoding?: AccountWebhookEncoding;
}

export type CollectionIdentifier = {
  firstVerifiedCreators?: string[];
  verifiedCollectionAddresses?: string[];
};

export type CreateWebhookRequest = Omit<
  Webhook,
  'webhookID' | 'wallet' | 'project'
>;
export type EditWebhookRequest = Partial<
  Omit<Webhook, 'webhookID' | 'wallet' | 'project'>
>;

export interface CreateCollectionWebhookRequest extends CreateWebhookRequest {
  collectionQuery: CollectionIdentifier;
}

export interface MintlistResponse {
  result: MintlistItem[];
  paginationToken: string;
}

export type MintlistRequest = {
  query: CollectionIdentifier;
  options?: HeliusOptions;
};

export interface MintlistItem {
  mint: string;
  name: string;
}

// RWA Asset Types
interface AssetControllerAccount {
  address: string;
  mint: string;
  authority: string;
  delegate: string;
  version: number;
  closed: boolean;
}

interface DataRegistryAccount {
  address: string;
  mint: string;
  version: number;
  closed: boolean;
}

interface IdentityRegistryAccount {
  address: string;
  mint: string;
  authority: string;
  delegate: string;
  version: number;
  closed: boolean;
}

interface PolicyEngine {
  address: string;
  mint: string;
  authority: string;
  delegate: string;
  policies: string[];
  version: number;
  closed: boolean;
}

export interface FullRwaAccount {
  asset_controller?: AssetControllerAccount;
  data_registry?: DataRegistryAccount;
  identity_registry?: IdentityRegistryAccount;
  policy_engine?: PolicyEngine;
}

export interface GetPriorityFeeEstimateOptions {
  priorityLevel?: PriorityLevel;
  includeAllPriorityFeeLevels?: boolean;
  transactionEncoding?: UiTransactionEncoding;
  lookbackSlots?: number;
  recommended?: boolean;
}

export interface GetPriorityFeeEstimateRequest {
  transaction?: string;
  accountKeys?: string[];
  options?: GetPriorityFeeEstimateOptions;
}

export interface MicroLamportPriorityFeeLevels {
  min: number;
  low: number;
  medium: number;
  high: number;
  veryHigh: number;
  unsafeMax: number;
}

export interface GetPriorityFeeEstimateResponse {
  priorityFeeEstimate?: number;
  priorityFeeLevels?: MicroLamportPriorityFeeLevels;
}

export type JitoRegion = 'Default' | 'NY' | 'Amsterdam' | 'Frankfurt' | 'Tokyo';









