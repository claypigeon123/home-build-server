import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createReadStream } from "fs";
import { ArchiveStorageService, UploadOptions } from "./ArchiveStorageService";


export class AwsS3ArchiveStorageService implements ArchiveStorageService {

    private readonly bucket: string;
    private readonly s3: S3Client;

    constructor(bucket: string) {
        this.s3 = new S3Client();
        this.bucket = bucket;
    }

    async upload({ fileName, filePath }: UploadOptions) {
        console.log(`Uploading [${filePath}] archive`);

        const stream = createReadStream(filePath);

        const putObjectCommand = new PutObjectCommand({
            Key: fileName,
            Body: stream,
            Bucket: this.bucket
        });

        try {
            await this.s3.send(putObjectCommand);
            console.log(`Archive [${fileName}.zip] uploaded to S3`);
        } catch (err) {
            console.log('Upload to S3 failed: ', err);
            throw err;
        } finally {
            stream.close();
        }
    }
}