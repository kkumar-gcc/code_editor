import {Client} from "minio";

class MinioManager {
    private readonly client: Client;
    private bucket: string;
    private region: string;
    private readonly baseUrl: string;

    constructor() {
        this.client = new Client({
            endPoint: process.env.MINIO_ENDPOINT as string,
            port: parseInt(process.env.MINIO_PORT as string),
            useSSL: false,
            accessKey: process.env.MINIO_ACCESS_KEY as string,
            secretKey: process.env.MINIO_SECRET_KEY as string,
        });
        this.bucket = process.env.MINIO_BUCKET as string;
        this.region = process.env.MINIO_REGION as string;
        this.baseUrl = process.env.MINIO_URL as string;
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

    public put(file: string, content: string){
        return this.client.putObject(this.bucket, file, content);
    }

    public putFileAs(filePath: string, name: string){
        return this.client.fPutObject(this.bucket, name, filePath);
    }

    public putFile(filePath: string){
        return this.client.fPutObject(this.bucket, filePath, filePath);
    }

    public async get(file: string){
        return this.client.getObject(this.bucket, file);
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

    public exists(file: string) {

    }

    public temporaryUrl(file: string, expiry: number){
        return this.client.presignedGetObject(this.bucket, file, expiry);
    }

    public url(file: string){
        return `${this.baseUrl}/${this.bucket}/${file}`;
    }
}

const minioManager = new MinioManager();

export default minioManager;
