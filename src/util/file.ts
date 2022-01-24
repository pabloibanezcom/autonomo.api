import S3 from 'aws-sdk/clients/s3';
import { UploadedFile } from 'express-fileupload';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export const uploadFile = async (
  file: UploadedFile,
  path: string = null,
  name: string = null
): Promise<S3.ManagedUpload.SendData> => {
  const pathStr = path && !path.endsWith('/') ? `${path}/` : path || '';

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${pathStr}${name || file.name}`,
    Body: file.data
  };

  return await s3.upload(uploadParams).promise();
};

export const deleteFile = async (key: string): Promise<S3.DeleteObjectOutput> => {
  const deleteParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key
  };

  return await s3.deleteObject(deleteParams).promise();
};

export const getFileNameFromKey = (key: string): string => {
  const keyElements = key.split('/');
  return keyElements[keyElements.length - 1];
};
