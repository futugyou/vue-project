
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
