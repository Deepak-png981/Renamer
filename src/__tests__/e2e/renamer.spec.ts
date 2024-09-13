import execa from 'execa';
import fs from 'fs';
import path from 'path';

const testDir = './testDataForE2E';
jest.setTimeout(180000);
describe('Renamer E2E Tests', () => {
  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
      fs.writeFileSync(path.join(testDir, 'test.txt'), 'Sample content');
      fs.writeFileSync(path.join(testDir, 'test.md'), '---\ntitle: Test Title\nauthor: John Doe\n---\n# Heading 1\n## Heading 2\nThis is a test content about Node.js and Markdown.');
    }
  });

  afterEach(() => {
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
  test('renames markdown files as expected', async () => {
    const { stdout } = await execa('npx', ['ts-node', 'renamer.ts', '--path', `${testDir}\\test.md`, '--debug']);
    expect(stdout).toContain('Starting file renamer...');
    expect(stdout).toContain('Renamed test.md to');
    const files = fs.readdirSync(testDir);
    expect(files).not.toContain('test.md');
  });
});
