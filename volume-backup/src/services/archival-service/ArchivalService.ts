

export type CreateZipOptions = {
    filePath: string
    folderName: string
}

export type CleanupArchiveOptions = {
    filePath: string
}

export interface ArchivalService {
    createArchive(options: CreateZipOptions): Promise<void>

    cleanupArchive({ filePath }: CleanupArchiveOptions): Promise<void>
}