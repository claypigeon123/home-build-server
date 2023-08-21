import archiver from "archiver";
import { WriteStream } from "fs";
import fs, { FileHandle } from 'fs/promises';
import { basename } from "path";
import { ArchivalService, CleanupArchiveOptions, CreateZipOptions, ReadArchiveOptions } from "./ArchivalService";


export class ArchiverArchivalService implements ArchivalService {
    async createArchive({ filePath, folderName }: CreateZipOptions) {
        const archive = archiver('zip');
        let fileHandle: FileHandle;
        let output: WriteStream;

        try {
            fileHandle = await fs.open(filePath, 'w');
            output = fileHandle.createWriteStream();
        } catch (err) {
            console.log('Error creating archive handle / write stream: ', err);
            throw err;
        }

        try {
            archive.pipe(output);
            archive.directory(folderName, false);
            await archive.finalize();

            console.log(`Archive finalized: ${basename(filePath)}`)
        } catch (err) {
            console.log('Error during populating archive: ', err);
            throw err;
        } finally {
            output.close();
            await fileHandle.close();
        }
    }

    async readArchive({ filePath }: ReadArchiveOptions) {
        try {
            return await fs.readFile(filePath);
        } catch (err) {
            console.log('Error while reading created archive: ', err);
            throw err;
        }
    }

    async cleanupArchive({ filePath }: CleanupArchiveOptions) {
        try {
            await fs.unlink(filePath);
            console.log(`Cleaned up archive ${filePath}`);
        } catch (err) {
            console.log('Could not delete temp file: ', err);
            throw err;
        }
    }
}