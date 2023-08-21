import dotenv from 'dotenv';
import { DateTime } from 'luxon';
import { basename, resolve } from 'path';
import { ArchivalService } from './services/archival-service/ArchivalService';
import { ArchiverArchivalService } from './services/archival-service/ArchiverArchivalService';
import { ArchiveStorageService } from './services/archive-storage-service/ArchiveStorageService';
import { AwsS3ArchiveStorageService } from './services/archive-storage-service/AwsS3ArchiveStorageService';

dotenv.config();

const now = DateTime.now().toUTC().toFormat('yyyy-MM-dd_HH-mm-ss');
if (!now) throw new Error('Something went wrong getting the current datetime');

const S3_BUCKET = process.env.S3_BUCKET;
if (!S3_BUCKET) throw new Error('S3_BUCKET not set');

const archivalService: ArchivalService = new ArchiverArchivalService();
const archiveStorageService: ArchiveStorageService = new AwsS3ArchiveStorageService(S3_BUCKET);

const dir = process.argv[2];
const volumePaths = process.argv.slice(3);

const run = async () => {
    for (const volumePath of volumePaths) {
        const archivePath = resolve(dir, `${basename(volumePath)}.zip`);

        await archivalService.createArchive({ filePath: archivePath, folderName: volumePath });
        await archiveStorageService.upload({ fileName: `${now}/${basename(archivePath)}`, filePath: archivePath });
        await archivalService.cleanupArchive({ filePath: archivePath });
    }
}

run();