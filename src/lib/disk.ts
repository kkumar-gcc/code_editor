import {Client} from "minio";
import {config} from "@/config/config";

// We are using Minio for disk
// Contributed by: https://github.com/saha-alpha9
class DiskManager {
    private readonly client: Client;
    private bucket: string;
    private region: string;
    private readonly baseUrl: string;

    constructor() {
        this.client = new Client({
            endPoint: config.disks.minio.endpoint,
            port: config.disks.minio.port,
            useSSL: false,
            accessKey: config.disks.minio.accessKey,
            secretKey: config.disks.minio.secretKey,
        });
        this.bucket = config.disks.minio.bucket;
        this.region = config.disks.minio.region;
        this.baseUrl = config.disks.minio.url;
    }

    public getBucket(){
        return this.bucket;
    }

    public setBucket(bucket: string){
        this.bucket = bucket
    }

    public getClient(){
        return this.client
    }

    public delete(file: string){
        return this.client.removeObject(this.bucket, file);
    }

    public deleteMany(files: string[]){
        return this.client.removeObjects(this.bucket, files);
    }

    public async put(file: string, content: string | Buffer, mimeType?: string) {
        try {
            const metaData = {
                'Content-Type': mimeType,
            };
            return await this.client.putObject(this.bucket, file, content, metaData);
        } catch (err) {
            console.error('Error putting file to Minio:', err);
            throw err;
        }
    }

    public async putFileAs(filePath: string, name: string){
        try {
            return await this.client.fPutObject(this.bucket, name, filePath);
        } catch (err) {
            console.error('Error putting file to Minio:', err);
            throw err;
        }
    }

    public async putFile(filePath: string){
        try {
            // Get the file name from the filePath
            const fileName = filePath.split('/').pop() || '';

            return await this.client.fPutObject(this.bucket, fileName, filePath);
        } catch (err) {
            console.error('Error putting file to Minio:', err);
            throw err;
        }
    }

    public async get(file: string): Promise<Buffer>{
        try {
            const stream = await this.client.getObject(this.bucket, file);
            let fileData = Buffer.from('');

            stream.on('data', (chunk: any) => {
                fileData = Buffer.concat([fileData, chunk]);
            });

            return new Promise((resolve, reject) => {
                stream.on('end', () => {
                    resolve(fileData);
                });

                stream.on('error', (err) => {
                    reject(err);
                });
            });
        } catch (err) {
            console.error('Error getting file from Minio:', err);
            throw err;
        }
    }

    public getStat(file: string){
        return this.client.statObject(this.bucket, file);
    }

    public size(file: string){
        return this.getStat(file).then((stat) => stat.size);
    }

    public mimeType(file: string){
        return this.getStat(file).then((stat) => stat.metaData['content-type']);
    }

    public lastModified(file: string){
        return this.getStat(file).then((stat) => stat.lastModified);
    }

    public versionId(file: string){
        return this.getStat(file).then((stat) => stat.versionId);
    }

    public exists(file: string) {
        return this.client.statObject(this.bucket, file).then(() => true).catch(() => false);
    }

    public temporaryUrl(file: string, expiry: number){
        return this.client.presignedGetObject(this.bucket, file, expiry);
    }

    public url(file: string){
        return `${this.baseUrl}/${this.bucket}/${file}`;
    }

    public path(file: string){
        return `${this.bucket}/${file}`;
    }
}

const diskManager = new DiskManager();

export default diskManager;
