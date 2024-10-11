import execa from 'execa';
import fs from 'fs';
import path from 'path';

const testDir = './testDataForE2E';
jest.setTimeout(180000);
describe('Renamer E2E Tests', () => {
  beforeEach(() => {
    const ymlFilePath = path.join('testData' , 'test.yml');
    const ymlContent = fs.readFileSync(ymlFilePath, 'utf8');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
      fs.writeFileSync(path.join(testDir, 'test.txt'), 'Sample content');
      fs.writeFileSync(path.join(testDir, 'test.md'), '---\ntitle: Test Title\nauthor: John Doe\n---\n# Heading 1\n## Heading 2\nThis is a test content about Node.js and Markdown.');
      fs.writeFileSync(path.join(testDir, 'test.ts'), 'export const sum = (a: number, b: number): number => { return a + b; };');
      fs.writeFileSync(path.join(testDir, 'test.jsx'), 'import React from \'react\';\n\nconst Greeting = () => {\n  const name = "John";\n  const isMorning = true;\n\n  return (\n    <div>\n      <h1>Hello, {name}!</h1>\n      <p>Good {isMorning ? \'morning\' : \'evening\'}!</p>\n      <button onClick={() => alert(\'Welcome to React!\')}>Click Me</button>\n    </div>\n  );\n};\n\nexport default Greeting;');
      fs.writeFileSync(
        path.join(testDir, 'test.yml'),
        ymlContent
    ); 
    }
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.readdirSync(testDir).forEach(file => fs.unlinkSync(path.join(testDir, file)));
      fs.rmdirSync(testDir);
      const filePath = path.resolve(__dirname, '../../../renamed.json');
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
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
    const markdownFilePath = path.join(testDir, 'test.md');
    const { stdout } = await execa('npx', ['ts-node', 'renamer.ts', '--path', markdownFilePath, '--debug']);
    expect(stdout).toContain('Starting file renamer...');
    expect(stdout).toContain('Renamed test.md to');
    const files = fs.readdirSync(testDir);
    expect(files).not.toContain('test.md');
  });
  test('renames files using camelCase naming convention', async () => {
    const { stdout } = await execa('npx', ['ts-node', 'renamer.ts', '--path', testDir, '--nc', 'camelCase']);
    expect(stdout).toContain('Starting file renamer...');
    expect(stdout).toContain('camelCase');
    expect(stdout).toContain('Rename operation complete');
    const files = fs.readdirSync(testDir);
    files.forEach(file => {
      // Regex for camelCase format file names
      expect(file).toMatch(/^[a-z][a-zA-Z]*\.[a-z]+$/); 
    });
  });
  test('renames TypeScript files as expected', async () => {
    const tsFilePath = path.join(testDir, 'test.ts');
    const { stdout } = await execa('npx', ['ts-node', 'renamer.ts', '--path', tsFilePath, '--debug']);
    expect(stdout).toContain('Starting file renamer...');
    expect(stdout).toContain('Renamed test.ts to');
    const files = fs.readdirSync(testDir);
    expect(files).not.toContain('test.ts');
  });
  
  test('renames JSX files as expected', async () => {
    const jsxFilePath = path.join(testDir, 'test.jsx');
    const { stdout } = await execa('npx', ['ts-node', 'renamer.ts', '--path', jsxFilePath, '--debug']);
    expect(stdout).toContain('Starting file renamer...');
    expect(stdout).toContain('Renamed test.jsx to');
    const files = fs.readdirSync(testDir);
    expect(files).not.toContain('test.jsx');
  });

  test('renames YML files as expected', async () => {
    const ymlFilePath = path.join(testDir, 'test.yml');
    const { stdout } = await execa('npx', ['ts-node', 'renamer.ts', '--path', ymlFilePath, '--debug']);
    expect(stdout).toContain('Starting file renamer...');
    expect(stdout).toContain('Renamed test.yml to');
    const files = fs.readdirSync(testDir);
    expect(files).not.toContain('test.yml');
  });
  

});
