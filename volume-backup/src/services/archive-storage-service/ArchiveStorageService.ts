

export type UploadOptions = {
    fileName: string
    zipData: Buffer
}

export interface ArchiveStorageService {
    upload(options: UploadOptions): Promise<void>
}