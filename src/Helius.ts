import {
  Webhook,
  CreateWebhookRequest,
  EditWebhookRequest,
  CreateCollectionWebhookRequest,
  MintlistRequest,
  MintlistResponse,
  MintlistItem,
  MintApiAuthority,
  HeliusCluster,
  HeliusEndpoints,
} from './types';

import axios, { type AxiosError } from 'axios';
import { getHeliusEndpoints } from './utils';
import { RpcClient } from './RpcClient';
import { mintApiAuthority } from './utils/mintApi';

/**
 * This is the base level class for interfacing with all Helius API methods.
 * @class
 */
export class Helius {
  /**
   * API key generated at dev.helius.xyz
   * @private
   */
  private readonly apiKey?: string;

  /** The cluster in which the connection endpoint belongs to */
  public readonly cluster: HeliusCluster;

  /** URL to the fullnode JSON RPC endpoint */
  public readonly endpoint: string;

  /** URL to the API and RPC endpoints */
  public readonly endpoints: HeliusEndpoints;

  /** The beefed up RPC client object from Helius SDK */
  public readonly rpc: RpcClient;

  /** The Helius Mint API authority for the cluster */
  public readonly mintApiAuthority: MintApiAuthority;

  /**
   * Initializes Helius API client with an API key
   * @constructor
   * @param apiKey - API key generated at dev.helius.xyz
   */
  constructor(
    apiKey: string,
    cluster: HeliusCluster = 'mainnet-beta',
    id: string = 'helius-sdk',
  ) {
    this.cluster = cluster;
    this.endpoints = getHeliusEndpoints(cluster);

    if (apiKey !== '') {
      this.apiKey = apiKey;
    } else {
      throw Error('either `apiKey` is required');
    }

    this.endpoint = this.endpoints.api;
    this.rpc = new RpcClient(this.endpoint, id);
    this.mintApiAuthority = mintApiAuthority(cluster);
  }
  /**
   * Retrieves a list of all webhooks associated with the current API key
   * @returns {Promise<Webhook[]>} a promise that resolves to an array of webhook objects
   * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
   */
  async getAllWebhooks(): Promise<Webhook[]> {
    try {
      const { data } = await axios.get(this.getApiEndpoint(`/v0/webhooks`));
      return data;
    } catch (err: any | AxiosError) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          `error calling getWebhooks: ${err.response?.data.error || err}`
        );
      } else {
        throw new Error(`error calling getWebhooks: ${err}`);
      }
    }
  }

  /**
   * Retrieves a single webhook by its ID, associated with the current API key
   * @param {string} webhookID - the ID of the webhook to retrieve
   * @returns {Promise<Webhook>} a promise that resolves to a webhook object
   * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
   */
  async getWebhookByID(webhookID: string): Promise<Webhook> {
    try {
      const { data } = await axios.get(
        this.getApiEndpoint(`/v0/webhooks/${webhookID}`)
      );
      return data;
    } catch (err: any | AxiosError) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          `error during getWebhookByID: ${err.response?.data.error || err}`
        );
      } else {
        throw new Error(`error during getWebhookByID: ${err}`);
      }
    }
  }

  /**
   * Creates a new webhook with the provided request
   * @param {CreateWebhookRequest} createWebhookRequest - the request object containing the webhook information
   * @returns {Promise<Webhook>} a promise that resolves to the created webhook object
   * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
   */
  async createWebhook(
    createWebhookRequest: CreateWebhookRequest
  ): Promise<Webhook> {
    try {
      const { data } = await axios.post(this.getApiEndpoint(`/v0/webhooks`), {
        ...createWebhookRequest,
      });
      return data;
    } catch (err: any | AxiosError) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          `error during createWebhook: ${err.response?.data.error || err}`
        );
      } else {
        throw new Error(`error during createWebhook: ${err}`);
      }
    }
  }

  /**
   * Deletes a webhook by its ID
   * @param {string} webhookID - the ID of the webhook to delete
   * @returns {Promise<boolean>} a promise that resolves to true if the webhook was successfully deleted, or false otherwise
   * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
   */
  async deleteWebhook(webhookID: string): Promise<boolean> {
    try {
      await axios.delete(this.getApiEndpoint(`/v0/webhooks/${webhookID}`));
      return true;
    } catch (err: any | AxiosError) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          `error during deleteWebhook: ${err.response?.data.error || err}`
        );
      } else {
        throw new Error(`error during deleteWebhook: ${err}`);
      }
    }
  }

  /**
   * Edits an existing webhook by its ID with the provided request
   * @param {string} webhookID - the ID of the webhook to edit
   * @param {EditWebhookRequest} editWebhookRequest - the request object containing the webhook information
   * @returns {Promise<Webhook>} a promise that resolves to the edited webhook object
   * @throws {Error} if there is an error calling the webhooks endpoint or if the response contains an error
   */
  async editWebhook(
    webhookID: string,
    editWebhookRequest: EditWebhookRequest
  ): Promise<Webhook> {
    try {
      const existing = await this.getWebhookByID(webhookID);
      return this._editWebhook(webhookID, existing, editWebhookRequest);
    } catch (err: any | AxiosError) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          `error during editWebhook: ${err.response?.data.error || err}`
        );
      } else {
        throw new Error(`error during editWebhook: ${err}`);
      }
    }
  }

  /**
   * Appends an array of addresses to an existing webhook by its ID
   * @param {string} webhookID - the ID of the webhook to edit
   * @param {string[]} newAccountAddresses - the array of addresses to be added to the webhook
   * @returns {Promise<Webhook>} a promise that resolves to the edited webhook object
   * @throws {Error} if there is an error calling the webhooks endpoint, if the response contains an error, or if the number of addresses exceeds 10,000
   */
  async appendAddressesToWebhook(
    webhookID: string,
    newAccountAddresses: string[]
  ): Promise<Webhook> {
    try {
      const webhook = await this.getWebhookByID(webhookID);
      const accountAddresses =
        webhook.accountAddresses.concat(newAccountAddresses);
      if (accountAddresses.length > 100_000) {
        throw new Error(
          `a single webhook cannot contain more than 100,000 addresses`
        );
      }
      const editRequest: EditWebhookRequest = { accountAddresses };
      return this._editWebhook(webhookID, webhook, editRequest);
    } catch (err: any | AxiosError) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          `error during appendAddressesToWebhook: ${
            err.response?.data.error || err
          }`
        );
      } else {
        throw new Error(`error during appendAddressesToWebhook: ${err}`);
      }
    }
  }

  /**
   * Removes an array of addresses from an existing webhook by its ID
   * @param {string} webhookID - the ID of the webhook to edit
   * @param {string[]} addressesToRemove - the array of addresses to be removed from the webhook
   * @returns {Promise<Webhook>} a promise that resolves to the edited webhook object
   * @throws {Error} if there is an error calling the webhooks endpoint, if the response contains an error
   */
  async removeAddressesFromWebhook(
    webhookID: string,
    addressesToRemove: string[]
  ): Promise<Webhook> {
    try {
      const webhook = await this.getWebhookByID(webhookID);
      // Filter out the addresses to be removed
      const accountAddresses = webhook.accountAddresses.filter(
        (address) => !addressesToRemove.includes(address)
      );
      const editRequest: EditWebhookRequest = { accountAddresses };
      return this._editWebhook(webhookID, webhook, editRequest);
    } catch (err: any | AxiosError) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          `error during removeAddressesFromWebhook: ${
            err.response?.data.error || err
          }`
        );
      } else {
        throw new Error(`error during removeAddressesFromWebhook: ${err}`);
      }
    }
  }

  async createCollectionWebhook(
    request: CreateCollectionWebhookRequest
  ): Promise<Webhook> {
    if (request?.collectionQuery == undefined) {
      throw new Error(`must provide collectionQuery object.`);
    }

    const { firstVerifiedCreators, verifiedCollectionAddresses } =
      request.collectionQuery;
    if (
      firstVerifiedCreators != undefined &&
      verifiedCollectionAddresses != undefined
    ) {
      throw new Error(
        `cannot provide both firstVerifiedCreators and verifiedCollectionAddresses. Please only provide one.`
      );
    }

    let mintlist: MintlistItem[] = [];
    let query = {};

    if (firstVerifiedCreators != undefined) {
      query = { firstVerifiedCreators };
    } else {
      // must have used verifiedCollectionAddresses
      query = { verifiedCollectionAddresses };
    }

    try {
      let mints = await this.getMintlist({
        query,
        options: {
          limit: 10000,
        },
      });
      mintlist.push(...mints.result);

      while (mints.paginationToken) {
        mints = await this.getMintlist({
          query,
          options: {
            limit: 10000,
            paginationToken: mints.paginationToken,
          },
        });
        mintlist.push(...mints.result);
      }

      const { webhookURL, transactionTypes, authHeader, webhookType } = request;
      const payload: CreateWebhookRequest = {
        webhookURL,
        accountAddresses: mintlist.map((x) => x.mint),
        transactionTypes,
      };
      if (authHeader) {
        payload['authHeader'] = authHeader;
      }
      if (webhookType) {
        payload['webhookType'] = webhookType;
      }

      return await this.createWebhook({ ...payload });
    } catch (err: any | AxiosError) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          `error during createCollectionWebhook: ${
            err.response?.data.error || err
          }`
        );
      } else {
        throw new Error(`error during createCollectionWebhook: ${err}`);
      }
    }
  }

  async getMintlist(request: MintlistRequest): Promise<MintlistResponse> {
    if (request?.query == undefined) {
      throw new Error(`must provide query object.`);
    }

    const { firstVerifiedCreators, verifiedCollectionAddresses } =
      request.query;
    if (
      firstVerifiedCreators != undefined &&
      verifiedCollectionAddresses != undefined
    ) {
      throw new Error(
        `cannot provide both firstVerifiedCreators and verifiedCollectionAddresses. Please only provide one.`
      );
    }

    try {
      const { data } = await axios.post(this.getApiEndpoint(`/v1/mintlist`), {
        ...request,
      });
      return data;
    } catch (err: any | AxiosError) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          `error during getMintlist: ${err.response?.data.error || err}`
        );
      } else {
        throw new Error(`error during getMintlist: ${err}`);
      }
    }
  }




  /**
   * Get the API endpoint for the specified path.
   * @param path - The API path to append to the base endpoint.
   * @returns The full URL to the API endpoint including the API key.
   * @throws Error if the path is not valid.
   */
  getApiEndpoint(path: string): string {
    // Check if the path starts with '/v0' or '/v1'
    if (!path.startsWith('/v0') && !path.startsWith('/v1')) {
      throw new Error(
        `Invalid API path provided: ${path}. Path must start with '/v0' or '/v1'.`
      );
    }

    if (!this.apiKey) {
      throw new Error(`API key is not set`);
    }

    // Construct and return the full API endpoint URL
    return `${this.endpoints.api}${path}?api-key=${this.apiKey}`;
  }

  private async _editWebhook(
    webhookID: string,
    existingWebhook: Webhook,
    editWebhookRequest: EditWebhookRequest
  ): Promise<Webhook> {
    const editRequest: EditWebhookRequest = {
      webhookURL: editWebhookRequest.webhookURL ?? existingWebhook.webhookURL,
      transactionTypes:
        editWebhookRequest.transactionTypes ?? existingWebhook.transactionTypes,
      accountAddresses:
        editWebhookRequest.accountAddresses ?? existingWebhook.accountAddresses,
      accountAddressOwners:
        editWebhookRequest.accountAddressOwners ??
        existingWebhook.accountAddressOwners,
      webhookType:
        editWebhookRequest.webhookType ?? existingWebhook.webhookType,
      authHeader: editWebhookRequest.authHeader ?? existingWebhook.authHeader,
      txnStatus: editWebhookRequest.txnStatus ?? existingWebhook.txnStatus,
      encoding: editWebhookRequest.encoding ?? existingWebhook.encoding,
    };

    const { data } = await axios.put(
      this.getApiEndpoint(`/v0/webhooks/${webhookID}`),
      editRequest
    );
    return data;
  }


}
