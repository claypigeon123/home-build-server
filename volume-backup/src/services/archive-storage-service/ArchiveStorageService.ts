

export type UploadOptions = {
    fileName: string
    filePath: string
}

export interface ArchiveStorageService {
    upload(options: UploadOptions): Promise<void>
}