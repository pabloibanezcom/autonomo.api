/* eslint-disable @typescript-eslint/no-explicit-any */
import { drive_v3, google } from 'googleapis';
import xlsx from 'node-xlsx';
import parseXlsxData from './parseXlsxData';

type DriveResponseType = 'arraybuffer' | 'blob' | 'json' | 'text' | 'stream';

const MIMETYPES = {
  FOLDER: 'application/vnd.google-apps.folder',
  JSON: 'application/json',
  SHEET: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PDF: 'application/pdf',
  IMAGE: 'image/png'
};

const xlsxParseOptions = {
  cellDates: true,
  dateNF: 'yyyy-mm-dd hh:mm:ss'
};

const initDrive = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GC_CLIENT_ID,
    process.env.GC_CLIENT_SECRET,
    process.env.GC_REDIRECT_URI
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GC_REFRESH_TOKEN });

  return google.drive({
    version: 'v3',
    auth: oauth2Client
  });
};

const getGoogleDriveData = async (): Promise<any> => {
  const drive = initDrive();
  const result = {
    businessesData: [] as any[],
    businessesSheets: {
      files: {
        data: []
      }
    }
  };

  const getFilesFromFolder = async (folderId: string): Promise<drive_v3.Schema$File[]> => {
    const res = await drive.files.list({
      corpora: 'user',
      includeItemsFromAllDrives: true,
      pageSize: 100,
      supportsAllDrives: true,
      q: `'${folderId}' in parents and trashed = false`
    });
    return res.data.files || [];
  };

  const getFileData = async (file: drive_v3.Schema$File) => {
    const getFileFromDrive = async (responseType: DriveResponseType) => {
      return new Promise((resolve, reject) => {
        drive.files
          .get(
            {
              fileId: file.id as string,
              alt: 'media'
            },
            { responseType }
          )
          .then(res => {
            resolve(responseType === 'arraybuffer' ? Buffer.from(res.data as string) : res.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    };

    const exportFileFromDrive = async (responseType: DriveResponseType, mimeType: string) => {
      return new Promise((resolve, reject) => {
        drive.files
          .export(
            {
              fileId: file.id as string,
              mimeType
            },
            { responseType }
          )
          .then(res => {
            resolve(res.data);
          })
          .catch(err => reject(err));
      });
    };

    if (file.mimeType === MIMETYPES.JSON) {
      return await getFileFromDrive('json');
    }

    if (file.mimeType === MIMETYPES.IMAGE || file.mimeType === MIMETYPES.PDF) {
      return await getFileFromDrive('arraybuffer');
    }

    if (file.mimeType === MIMETYPES.SHEET) {
      return await exportFileFromDrive('arraybuffer', file.mimeType);
    }

    return {};
  };

  const getFilesFromFiles = async (rootFolderId: string) => {
    const processFileOrFolder = async (parent: any, fileOrFolder: drive_v3.Schema$File) => {
      if (fileOrFolder.mimeType === MIMETYPES.FOLDER) {
        const folderFiles = await getFilesFromFolder(fileOrFolder.id as string);
        for (const file of folderFiles) {
          parent[fileOrFolder.name as string] = parent[fileOrFolder.name as string] || {};
          await processFileOrFolder(parent[fileOrFolder.name as string], file);
        }
      } else {
        const fileData = await getFileData(fileOrFolder);
        parent[fileOrFolder.name?.split('.')[0] as string] = { name: fileOrFolder.name, data: fileData };
      }
    };
    const rootFiles = await getFilesFromFolder(rootFolderId);
    for (const file of rootFiles) {
      await processFileOrFolder(result, file);
    }
  };

  const processBusinessSheetFiles = async () => {
    const processBusinessFile = async (business: string, file: any) => {
      const sheetFileBuffer = await getFileData({ id: file.id, mimeType: MIMETYPES.SHEET });
      const data = await parseXlsxData(
        file.template,
        xlsx.parse(sheetFileBuffer, xlsxParseOptions) as {
          name: string;
          data: any[];
        }[]
      );
      result.businessesData.push({
        business,
        fileName: file.fileName,
        template: file.template,
        data
      });
    };
    const processBusiness = async (data: { business: string; files: any[] }) => {
      for (const file of data.files) {
        await processBusinessFile(data.business, file);
      }
    };

    for (const businessData of result.businessesSheets.files.data) {
      await processBusiness(businessData);
    }
  };

  await getFilesFromFiles(process.env.GOOGLE_DRIVE_MOCK_DATA_FOLDER_ID as string);
  await processBusinessSheetFiles();
  return result;
};

export { getGoogleDriveData };
