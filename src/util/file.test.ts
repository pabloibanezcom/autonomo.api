import { S3 } from 'aws-sdk';
import { transformAWSFileToFile, urlSafeFileName } from './file';

describe('file', () => {
  describe('transformAWSFileToFile', () => {
    const awsFile: S3.ManagedUpload.SendData = {
      Location: 's3://autonomo-dev/pabloibanez/images/companies/amazon.png',
      ETag: 'c846237b2103e909db3d32f4b8591124',
      Bucket: 'autonomo-dev',
      Key: 'pabloibanez/images/companies/amazon.png'
    };

    test('transforms AWS SE file into File', () => {
      const file = transformAWSFileToFile(awsFile);
      expect(file).toStrictEqual({
        eTag: 'c846237b2103e909db3d32f4b8591124',
        key: 'pabloibanez/images/companies/amazon.png',
        location: 's3://autonomo-dev/pabloibanez/images/companies/amazon.png'
      });
    });
  });

  describe('urlSafeFileName', () => {
    test('transforms file name to be url safe', () => {
      const safeFileName = urlSafeFileName('this is a file name$.png');
      expect(safeFileName).toBe('this_is_a_file_name_.png');
    });
  });
});
