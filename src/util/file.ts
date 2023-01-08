/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { File } from '@autonomo/common';
import { S3 } from 'aws-sdk';
import { UploadedFile } from 'express-fileupload';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export const transformAWSFileToFile = (awsFile: S3.ManagedUpload.SendData): File => {
  return {
    eTag: awsFile.ETag,
    key: awsFile.Key,
    location: awsFile.Location
  };
};

export const urlSafeFileName = (fileName: string): string => {
  return fileName
    .split('.')
    .map(str => str.replace(/[^a-z0-9]/gi, '_').toLowerCase())
    .join('.');
};

export const uploadFile = async (file: UploadedFile, path: string = null, name: string = null): Promise<File> => {
  const pathStr = path && !path.endsWith('/') ? `${path}/` : path || '';

  console.log(s3);

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${pathStr}${urlSafeFileName(name || file.name)}`,
    Body: file.data
  };

  try {
    return transformAWSFileToFile(await s3.upload(uploadParams).promise());
  } catch (err) {
    return err;
  }
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

export const generateFileNameFromDateAndIssuer = (date: Date, issuerOrClient: string): string => {
  return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(
    -2
  )}_${issuerOrClient.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
};
