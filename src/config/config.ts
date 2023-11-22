export const config = {
    app: {
        // don't have anything here yet
    },
    disks: {
        minio:{
            endpoint: process.env.MINIO_ENDPOINT as string,
            port: parseInt(process.env.MINIO_PORT as string),
            accessKey: process.env.MINIO_ACCESS_KEY as string,
            secretKey: process.env.MINIO_SECRET_KEY as string,
            bucket: process.env.MINIO_BUCKET as string,
            region: process.env.MINIO_REGION as string,
            url: process.env.MINIO_URL as string,
        }
    },
};
