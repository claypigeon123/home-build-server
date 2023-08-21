

export type CreateZipOptions = {
    filePath: string
    folderName: string
}

export type ReadArchiveOptions = {
    filePath: string
}

export type CleanupArchiveOptions = {
    filePath: string
}

export interface ArchivalService {
    createArchive(options: CreateZipOptions): Promise<void>

    readArchive({ filePath }: ReadArchiveOptions): Promise<Buffer>

    cleanupArchive({ filePath }: CleanupArchiveOptions): Promise<void>
}