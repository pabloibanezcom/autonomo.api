/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { UploadedFile } from 'express-fileupload';
import { uploadFile } from '../../src/util/file';
import { log } from './log';

type FileDataName = {
  name: string;
  data: any;
};

const uploadFiles = async (files: any): Promise<any> => {
  const uploadedFiles: any[] = [];

  const addFileToUploadedFiles = (file: any, paths: string[], ref: string) => {
    uploadedFiles.push({
      paths,
      ref,
      file
    });
  };

  const processFolderObj = async (folderObj, parents = []) => {
    for (const [objectName, values] of Object.entries(folderObj)) {
      if ((values as FileDataName).data) {
        addFileToUploadedFiles(await uploadFile(values as UploadedFile, parents.join('/')), parents, objectName);
      } else {
        await processFolderObj(values, [...parents, objectName]);
      }
    }
  };

  await processFolderObj(files);

  log('Files uploaded to AWS S3', uploadedFiles.length);

  return uploadedFiles;
};

export { uploadFiles };
