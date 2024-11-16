import { BaseAPI, FetchAPI, FetchArgs, RequiredError, FetchParamCreator, fetchData } from "@/tools/fetch"

const BASE_PATH = import.meta.env.VUE_APP_INFR_PROJECT_SERVER.replace(/\/+$/, "")

/**
 * 
 * @export
 * @interface ChangeVaultItem
 */
export interface ChangeVaultItem {
    /**
     * 
     * @type {string}
     * @memberof ChangeVaultItem
     */
    key: string;
    /**
     * 
     * @type {string}
     * @memberof ChangeVaultItem
     */
    storage_media: StorageMediaEnum;
    /**
     * 
     * @type {Array<string>}
     * @memberof ChangeVaultItem
     */
    tags: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof ChangeVaultItem
     */
    type_identity: string;
    /**
     * 
     * @type {string}
     * @memberof ChangeVaultItem
     */
    value: string;
    /**
     * 
     * @type {string}
     * @memberof ChangeVaultItem
     */
    vault_type: VaultTypeEnum;
}

/**
 * @export
 * @enum {string}
 */
export enum StorageMediaEnum {
    Local = <any>'Local',
    AWS = <any>'AWS',
    HCP = <any>'HCP',
    AzureVault = <any>'AzureVault'
}

/**
 * @export
 * @enum {string}
 */
export enum VaultTypeEnum {
    System = <any>'system',
    Common = <any>'common',
    Project = <any>'project',
    Resource = <any>'resource',
    Platform = <any>'platform'
}

/**
 * 
 * @export
 * @interface VaultView
 */
export interface VaultView {
    /**
     * 
     * @type {string}
     * @memberof VaultView
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof VaultView
     */
    key: string;
    /**
     * 
     * @type {string}
     * @memberof VaultView
     */
    mask_value: string;
    /**
     * 
     * @type {string}
     * @memberof VaultView
     */
    storage_media: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof VaultView
     */
    tags: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof VaultView
     */
    type_identity: string;
    /**
     * 
     * @type {string}
     * @memberof VaultView
     */
    vault_type: string;
}

/**
 * 
 * @export
 * @interface CreateVaultModel
 */
export interface CreateVaultModel {
    /**
     * 
     * @type {string}
     * @memberof CreateVaultModel
     */
    key: string;
    /**
     * 
     * @type {string}
     * @memberof CreateVaultModel
     */
    storage_media: StorageMediaEnum;
    /**
     * 
     * @type {Array<string>}
     * @memberof CreateVaultModel
     */
    tags: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof CreateVaultModel
     */
    type_identity: string;
    /**
     * 
     * @type {string}
     * @memberof CreateVaultModel
     */
    value: string;
    /**
     * 
     * @type {string}
     * @memberof CreateVaultModel
     */
    vault_type: VaultTypeEnum;
}

/**
 * 
 * @export
 * @interface CreateVaultsRequest
 */
export interface CreateVaultsRequest {
    /**
     * 
     * @type {boolean}
     * @memberof CreateVaultsRequest
     */
    force_insert: boolean;
    /**
     * 
     * @type {Array<CreateVaultModel>}
     * @memberof CreateVaultsRequest
     */
    vaults: Array<CreateVaultModel>;
}

/**
 * 
 * @export
 * @interface CreateVaultsResponse
 */
export interface CreateVaultsResponse {
    /**
     * 
     * @type {Array<VaultView>}
     * @memberof CreateVaultsResponse
     */
    vaults: Array<VaultView>;
}

/**
 * 
 * @export
 * @interface ChangeVaultRequest
 */
export interface ChangeVaultRequest {
    /**
     * 
     * @type {boolean}
     * @memberof ChangeVaultRequest
     */
    force_insert: boolean;
    /**
     * 
     * @type {ChangeVaultItem}
     * @memberof ChangeVaultRequest
     */
    vaultData: ChangeVaultItem;
}

/**
 * 
 * @export
 * @interface ImportVaultsRequest
 */
export interface ImportVaultsRequest {
    /**
     * 
     * @type {string}
     * @memberof ImportVaultsRequest
     */
    storage_media: StorageMediaEnum;
    /**
     * 
     * @type {string}
     * @memberof ImportVaultsRequest
     */
    type_identity: string;
    /**
     * 
     * @type {string}
     * @memberof ImportVaultsRequest
     */
    vault_type: VaultTypeEnum;
}

/**
 * 
 * @export
 * @interface ImportVaultsResponse
 */
export interface ImportVaultsResponse {
    /**
     * 
     * @type {Array<VaultView>}
     * @memberof ImportVaultsResponse
     */
    vaults: Array<VaultView>;
}

/**
 * VaultApi - fetch parameter creator
 * @export
 */
export const VaultApiFetchParamCreator = (configuration?: any) => {
    return {
        /**
         * import vault from provider
         * @summary import vault from provider
         * @param {ImportVaultsRequest} body Request body
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ImportVaultPost(body: ImportVaultsRequest, options: any = {}): FetchArgs {
            // verify required parameter 'request' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter request was null or undefined when calling v1ImportVaultPost.')
            }
            const localVarPath = `/v1/import_vault`
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'PUT', body, options)
        },
        /**
         * get vault
         * @summary get vault
         * @param {string} [key] Key - Fuzzy Search
         * @param {string} [storageMedia] Storage Media
         * @param {Array<string>} [tags] Tags
         * @param {string} [typeIdentity] Type Identity
         * @param {string} [vaultType] Vault Type
         * @param {number} [page] Page number
         * @param {number} [size] Page size
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1VaultGet(key?: string, storageMedia?: string, tags?: Array<string>, typeIdentity?: string, vaultType?: string, page?: number, size?: number, options: any = {}): FetchArgs {
            const localVarPath = `/v1/vault`
            const queryParams: any = {};

            if (key) queryParams.key = key;
            if (storageMedia) queryParams.storageMedia = storageMedia;
            if (tags && tags.length > 0) queryParams.tags = tags.join(',');
            if (typeIdentity) queryParams.typeIdentity = typeIdentity;
            if (vaultType) queryParams.vaultType = vaultType;
            if (page !== undefined) queryParams.page = page;
            if (size !== undefined) queryParams.size = size;

            const path = new URL(BASE_PATH + localVarPath)
            path.search = new URLSearchParams(queryParams).toString()

            return FetchParamCreator(configuration).BuildFetchArgs(path, 'GET', undefined, options)
        },
        /**
         * delete vault
         * @summary delete vault
         * @param {string} id vault ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1VaultIdDelete(id: string, options: any = {}): FetchArgs {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1VaultIdDelete.');
            }
            const localVarPath = `/v1/vault/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));

            const path = new URL(BASE_PATH + localVarPath)

            return FetchParamCreator(configuration).BuildFetchArgs(path, 'DELETE', undefined, options)
        },
        /**
         * update vault
         * @summary update vault
         * @param {string} id vault ID
         * @param {ChangeVaultRequest} request Request body
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1VaultIdPut(id: string, request: ChangeVaultRequest, options: any = {}): FetchArgs {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1VaultIdPut.');
            }
            // verify required parameter 'request' is not null or undefined
            if (request === null || request === undefined) {
                throw new RequiredError('request', 'Required parameter request was null or undefined when calling v1VaultIdPut.');
            }
            const localVarPath = `/v1/vault/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));

            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'PUT', request, options)
        },
        /**
         * show vault value
         * @summary show vault value
         * @param {string} id vault ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1VaultIdShowPost(id: string, options: any = {}): FetchArgs {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1VaultIdShowPost.');
            }
            const localVarPath = `/v1/vault/{id}/show`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));

            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'POST', undefined, options)
        },
        /**
         * create vault
         * @summary create vault
         * @param {CreateVaultsRequest} request Request body
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1VaultPost(request: CreateVaultsRequest, options: any = {}): FetchArgs {
            // verify required parameter 'request' is not null or undefined
            if (request === null || request === undefined) {
                throw new RequiredError('request', 'Required parameter request was null or undefined when calling v1VaultPost.');
            }
            const localVarPath = `/v1/vault`;

            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'POST', request, options)
        },
    }
}