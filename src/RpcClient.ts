import axios from 'axios';

import { DAS, GetPriorityFeeEstimateRequest, GetPriorityFeeEstimateResponse, } from './types';


/**
 * The beefed up RPC client from Helius SDK
 */
export class RpcClient {
  constructor(
    protected readonly url: string,
    protected readonly id?: string
  ) {}



  /**
   * Get a single asset by ID.
   * @param {DAS.GetAssetRequest | string} id - Asset ID
   * @returns {Promise<DAS.GetAssetResponse>}
   * @throws {Error}
   */
  async getAsset(
    params: DAS.GetAssetRequest | string
  ): Promise<DAS.GetAssetResponse> {
    try {
      const url = `${this.url}`;

      const response = await axios.post(
        url,
        {
          jsonrpc: '2.0',
          id: this.id,
          method: 'getAsset',
          params,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { result } = response.data;
      return result as DAS.GetAssetResponse;
    } catch (error) {
      throw new Error(`Error in getAsset: ${error}`);
    }
  }

  /**
   * Get RWA Asset by mint.
   * @param {DAS.GetRwaAssetRequest} - RWA Asset ID
   * @returns {Promise<DAS.GetRwaAssetResponse>}
   * @throws {Error}
   */
  async getRwaAsset(
    params: DAS.GetRwaAssetRequest
  ): Promise<DAS.GetRwaAssetResponse> {
    try {
      const url = `${this.url}`;
      const response = await axios.post(
        url,
        {
          jsonrpc: '2.0',
          id: this.id,
          method: 'getRwaAccountsByMint',
          params,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { result } = response.data;
      return result as DAS.GetRwaAssetResponse;
    } catch (error) {
      throw new Error(`Error in getRwaAsset: ${error}`);
    }
  }

  /**
   * Get multiple assets.
   * @returns {Promise<DAS.GetAssetResponse[]>}
   * @throws {Error}
   */
  async getAssetBatch(
    params: DAS.GetAssetBatchRequest
  ): Promise<DAS.GetAssetResponse[]> {
    try {
      const url = `${this.url}`;

      const response = await axios.post(url, {
        jsonrpc: '2.0',
        id: this.id,
        method: 'getAssetBatch',
        params, // <-- Here we directly pass the params
      });

      return response.data.result as DAS.GetAssetResponse[];
    } catch (error) {
      throw new Error(`Error in getAssetBatch: ${error}`);
    }
  }

  /**
   * Get Asset proof.
   * @returns {Promise<DAS.GetAssetProofResponse>}
   * @throws {Error}
   */
  async getAssetProof(
    params: DAS.GetAssetProofRequest
  ): Promise<DAS.GetAssetProofResponse> {
    try {
      const url = `${this.url}`;
      const response = await axios.post(url, {
        jsonrpc: '2.0',
        id: this.id,
        method: 'getAssetProof',
        params,
      });

      const { data } = response;
      return data.result as DAS.GetAssetProofResponse;
    } catch (error) {
      throw new Error(`Error in getAssetProof: ${error}`);
    }
  }

  /**
   * Get Assets By group.
   * @returns {Promise<DAS.GetAssetResponseList>}
   * @throws { Error }
   */
  async getAssetsByGroup(
    params: DAS.AssetsByGroupRequest
  ): Promise<DAS.GetAssetResponseList> {
    try {
      const url = `${this.url}`;
      const response = await axios.post(url, {
        jsonrpc: '2.0',
        id: this.id,
        method: 'getAssetsByGroup',
        params,
      });

      const { data } = response;
      return data.result as DAS.GetAssetResponseList;
    } catch (error) {
      throw new Error(`Error in getAssetsByGroup: ${error}`);
    }
  }

  /**
   * Get all assets (compressed and regular) for a public key.
   * @returns {Promise<DAS.GetAssetResponseList>}
   * @throws {Error}
   */
  async getAssetsByOwner(
    params: DAS.AssetsByOwnerRequest
  ): Promise<DAS.GetAssetResponseList> {
    try {
      const url = `${this.url}`;
      const response = await axios.post(url, {
        jsonrpc: '2.0',
        id: this.id,
        method: 'getAssetsByOwner',
        params,
      });

      const { data } = response;
      return data.result as DAS.GetAssetResponseList;
    } catch (error) {
      throw new Error(`Error in getAssetsByOwner: ${error}`);
    }
  }

  /**
   * Request assets for a given creator.
   * @returns {Promise<DAS.GetAssetResponseList>}
   * @throws {Error}
   */
  async getAssetsByCreator(
    params: DAS.AssetsByCreatorRequest
  ): Promise<DAS.GetAssetResponseList> {
    try {
      const url = `${this.url}`;
      const response = await axios.post(url, {
        jsonrpc: '2.0',
        id: this.id,
        method: 'getAssetsByCreator',
        params,
      });

      const { data } = response;
      return data.result as DAS.GetAssetResponseList;
    } catch (error) {
      throw new Error(`Error in getAssetsByCreator: ${error}`);
    }
  }

  /**
   * Get assets by authority.
   * @returns {Promise<DAS.GetAssetResponseList>}
   * @throws {Error}
   */
  async getAssetsByAuthority(
    params: DAS.AssetsByAuthorityRequest
  ): Promise<DAS.GetAssetResponseList> {
    try {
      const url = `${this.url}`;
      const response = await axios.post(url, {
        jsonrpc: '2.0',
        id: this.id,
        method: 'getAssetsByAuthority',
        params,
      });

      const { data } = response;
      return data.result as DAS.GetAssetResponseList;
    } catch (error) {
      throw new Error(`Error in getAssetsByAuthority: ${error}`);
    }
  }

  /**
   * Search Assets
   * @returns {Promise<DAS.GetAssetResponseList>}
   * @throws {Error}
   */
  async searchAssets(
    params: DAS.SearchAssetsRequest
  ): Promise<DAS.GetAssetResponseList> {
    try {
      const url = `${this.url}`;
      const response = await axios.post(url, {
        jsonrpc: '2.0',
        id: this.id,
        method: 'searchAssets',
        params,
      });

      const { data } = response;
      return data.result as DAS.GetAssetResponseList;
    } catch (error) {
      throw new Error(`Error in searchAssets: ${error}`);
    }
  }

  /**
   * Get transaction history for the asset.
   * @returns {Promise<GetSignatureForAssetResponse>}
   * @throws {Error}
   */
  async getSignaturesForAsset(
    params: DAS.GetSignaturesForAssetRequest
  ): Promise<DAS.GetSignaturesForAssetResponse> {
    try {
      const url = `${this.url}`;
      const response = await axios.post(url, {
        jsonrpc: '2.0',
        id: this.id,
        method: 'getSignaturesForAsset',
        params,
      });

      const { data } = response;
      return data.result as DAS.GetSignaturesForAssetResponse;
    } catch (error) {
      throw new Error(`Error in getSignaturesForAsset: ${error}`);
    }
  }

  /**
   * Get priority fee estimate
   * @returns {Promise<GetPriorityFeeEstimateResponse>}
   * @throws {Error}
   */
  async getPriorityFeeEstimate(
    params: GetPriorityFeeEstimateRequest
  ): Promise<GetPriorityFeeEstimateResponse> {
    try {
      const url = `${this.url}`;
      const response = await axios.post(
        url,
        {
          jsonrpc: '2.0',
          id: this.id,
          method: 'getPriorityFeeEstimate',
          params: [params],
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.error) {
        throw new Error(
          `Error fetching priority fee estimate: ${JSON.stringify(response.data.error, null, 2)}`
        );
      }

      return response.data.result as GetPriorityFeeEstimateResponse;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `Error fetching priority fee estimate: ${JSON.stringify(error.response.data, null, 2)}`
        );
      }
      throw new Error(`Error fetching priority fee estimate: ${error}`);
    }
  }






  /**
   * Send a bundle of transactions to the Jito Block Engine
   * @param {string[]} serializedTransactions - The serialized transactions in the bundle
   * @param {string} jitoApiUrl - The Jito Block Engine API URL
   * @returns {Promise<string>} - The bundle ID
   */
  async sendJitoBundle(
    serializedTransactions: string[],
    jitoApiUrl: string
  ): Promise<string> {
    const response = await axios.post(
      jitoApiUrl,
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'sendBundle',
        params: [serializedTransactions],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.data.error) {
      throw new Error(
        `Error sending bundles: ${JSON.stringify(response.data.error, null, 2)}`
      );
    }

    return response.data.result;
  }

  /**
   * Get the status of Jito bundles
   * @param {string[]} bundleIds - An array of bundle IDs to check the status for
   * @param {string} jitoApiUrl - The Jito Block Engine API URL
   * @returns {Promise<any>} - The status of the bundles
   */
  async getBundleStatuses(
    bundleIds: string[],
    jitoApiUrl: string
  ): Promise<any> {
    const response = await axios.post(
      jitoApiUrl,
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'getBundleStatuses',
        params: [bundleIds],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.data.error) {
      throw new Error(
        `Error getting bundle statuses: ${JSON.stringify(response.data.error, null, 2)}`
      );
    }

    return response.data.result;
  }


  /**
   * Get information about all the edition NFTs for a specific master NFT
   * @returns {Promise<DAS.GetNftEditionsResponse>}
   * @throws {Error}
   */
  async getNftEditions(
    params: DAS.GetNftEditionsRequest
  ): Promise<DAS.GetNftEditionsResponse> {
    try {
      const url = `${this.url}`;
      const response = await axios.post(
        url,
        {
          jsonrpc: '2.0',
          id: this.id,
          method: 'getNftEditions',
          params,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      return response.data.result as DAS.GetNftEditionsResponse;
    } catch (error) {
      throw new Error(`Error in getNftEditions: ${error}`);
    }
  }

  /**
   * Get information about all token accounts for a specific mint or a specific owner
   * @returns {Promise<DAS.GetTokenAccountsResponse>}
   * @throws {Error}
   */
  async getTokenAccounts(
    params: DAS.GetTokenAccountsRequest
  ): Promise<DAS.GetTokenAccountsResponse> {
    try {
      const url = `${this.url}`;
      const response = await axios.post(
        url,
        {
          jsonrpc: '2.0',
          id: this.id,
          method: 'getTokenAccounts',
          params,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      return response.data.result as DAS.GetTokenAccountsResponse;
    } catch (error) {
      throw new Error(`Error in getTokenAccounts: ${error}`);
    }
  }


}
