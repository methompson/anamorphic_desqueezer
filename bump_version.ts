import { readFile, writeFile } from 'node:fs/promises';
import { exec } from 'node:child_process';

import { isRecord, isString } from '@metools/tcheck';
import { Command } from 'commander';
import chalk from 'chalk';
import semver from 'semver';

main().catch((error) => {
  console.error(chalk.red('Error executing version bump:'), error);
  process.exit(1);
});

async function main() {
  const program = new Command();
  program
    .name('Application Version Bumper')
    .description('Bumps the version of the application')
    .version('1.0.0');

  program
    .command('major')
    .description('Bumps the major version and sets minor and patch to 0')
    .action(async () => {
      await bumpMajorVersion();
    });

  program
    .command('minor')
    .description('Bumps the minor version and sets patch to 0')
    .action(async () => {
      await bumpMinorVersion();
    });

  program
    .command('patch')
    .description('Bumps the patch version')
    .action(async () => {
      await bumpPatchVersion();
    });

  program.parse();
}

function successMessage(newVersion: string) {
  console.log(
    chalk.bgGreen(`Successfully bumped version to ${chalk.bold(newVersion)}`),
  );
}

async function bumpPatchVersion(): Promise<void> {
  const { version, packageObject } = await getNeededData();

  const newVersion = semver.inc(version, 'patch');

  if (!newVersion) {
    throw new Error('Failed to increment patch version');
  }

  await writeDataToFile(packageObject, newVersion.toString());

  successMessage(newVersion);
}

async function bumpMinorVersion(): Promise<void> {
  const { version, packageObject } = await getNeededData();

  const newVersion = semver.inc(version, 'minor');

  if (!newVersion) {
    throw new Error('Failed to increment minor version');
  }

  await writeDataToFile(packageObject, newVersion.toString());

  successMessage(newVersion);
}

async function bumpMajorVersion(): Promise<void> {
  const { version, packageObject } = await getNeededData();

  const newVersion = semver.inc(version, 'major');

  if (!newVersion) {
    throw new Error('Failed to increment major version');
  }

  await writeDataToFile(packageObject, newVersion.toString());

  successMessage(newVersion);
}

interface GetNeededDataOutput {
  version: string;
  packageObject: Record<string, unknown>;
}

async function getNeededData(): Promise<GetNeededDataOutput> {
  const file = await readPackageFile();
  const currentVersion = file.version;

  if (!isString(currentVersion)) {
    throw new Error('Version is not a string in package.json');
  }

  // const version = splitVersion(currentVersion);

  return {
    version: currentVersion,
    packageObject: file,
  };
}

async function readPackageFile() {
  const packageJsonPath = './package.json';
  const packageJsonData = await readFile(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(packageJsonData);

  if (!isRecord(packageJson)) {
    throw new Error('Invalid package.json format');
  }

  return packageJson;
}

async function writeDataToFile(
  packageObject: Record<string, unknown>,
  version: string,
) {
  packageObject.version = version;

  await writeFile(
    './package.json',
    JSON.stringify(packageObject, null, 2) + '\n',
  );

  await regenPackageLock();
}

async function regenPackageLock() {
  return new Promise<void>((resolve, reject) => {
    exec('npm install', (error) => {
      if (error) {
        console.error(`Error regenerating package-lock.json: ${error.message}`);
        reject(error);
        return;
      }

      resolve();
    });
  });
}
