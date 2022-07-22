/* eslint-disable @typescript-eslint/no-explicit-any */
import { drive_v3, google } from 'googleapis';
import xlsx from 'node-xlsx';
import businessFiles from './files.json';

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

const getDataFromDriveFiles = async (): Promise<any> => {
  const drive = initDrive();

  const getDataFromFile = async (file: drive_v3.Schema$File) => {
    const response = await drive.files.get({ fileId: file.id as string, alt: 'media' }, { responseType: 'json' });
    return response.data as any;
  };

  const getFilesFromFolder = async (folderId: string) => {
    const folderData = await drive.files.list({
      corpora: 'user',
      includeItemsFromAllDrives: true,
      pageSize: 100,
      supportsAllDrives: true,
      q: `'${folderId}' in parents and trashed = false`
    });

    const mockData = {};

    if (folderData.data.files) {
      for (const file of folderData.data.files) {
        const fileMockData = await getDataFromFile(file);
        mockData[file.name?.replace('.json', '') as string] = fileMockData;
      }
    }

    return mockData;
  };

  return await getFilesFromFolder(process.env.GOOGLE_DRIVE_MOCK_FOLDER_ID as string);
};

const getBusinessFilesFromDrive = async (): Promise<any> => {
  const drive = initDrive();

  const getFileBuffer = async (fileId: string) => {
    return new Promise((resolve, reject) => {
      drive.files
        .export(
          {
            fileId,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          },
          { responseType: 'arraybuffer' }
        )
        .then(res => {
          resolve(res.data);
        })
        .catch(err => reject(err));
    });
  };

  return await Promise.all(
    businessFiles.map(async businessFilesInfo => {
      return {
        ...businessFilesInfo,
        files: await Promise.all(
          businessFilesInfo.files.map(async file => {
            const buffer = await getFileBuffer(file.id);
            return xlsx.parse(buffer, xlsxParseOptions) as {
              name: string;
              data: any[];
            }[];
          })
        )
      };
    })
  );
};

export { getDataFromDriveFiles, getBusinessFilesFromDrive };
