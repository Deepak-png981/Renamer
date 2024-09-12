import execa from 'execa';
import fs from 'fs';
import path from 'path';

const testDir = './testDataForE2E';
jest.setTimeout(180000);
describe('CLI E2E Tests', () => {
  beforeAll(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
      fs.writeFileSync(path.join(testDir, 'test.txt'), 'Sample content');
    }
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) {
      fs.readdirSync(testDir).forEach(file => fs.unlinkSync(path.join(testDir, file)));
      fs.rmdirSync(testDir);
    }
  });

  test('renames files as expected', async () => {
    const { stdout } = await execa('npx', ['ts-node', 'renamer.ts', '--path', testDir]);
    expect(stdout).toContain('Starting file renamer...');
    expect(stdout).toContain('Renamed test.txt to');
    const files = fs.readdirSync(testDir);
    expect(files).not.toContain('test.txt');
    expect(stdout).toContain('Rename operation complete.');
  });
});
