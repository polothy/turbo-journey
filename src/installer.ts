import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as sys from './system'
import * as ioUtil from '@actions/io/lib/io-util'
import {createHash} from 'crypto'
import * as fs from 'fs'

/**
 * The binary name
 */
export const toolName = 'golangci-lint'

/**
 * Install the tool
 * @param version the version to install
 * @param checksum optionally provide a checksum to validate the download
 */
export async function installer(
  version: string,
  checksum?: string
): Promise<void> {
  // Check for cached installation
  let toolPath: string = tc.find(toolName, version)

  if (!toolPath) {
    toolPath = await download(version, checksum)
    core.debug(`${toolName} is cached under ${toolPath}`)
  }

  // Add to $PATH env var
  core.addPath(toolPath)
}

/**
 * Actually perform the tool download and verify checksum if passed
 * @param version the version to install
 * @param checksum optionally provide a checksum to validate the download
 */
async function download(version: string, checksum?: string): Promise<string> {
  const arch = sys.getArch()
  const platform = sys.getPlatform()

  const name = `golangci-lint-${version}-${platform}-${arch}`
  const downloadUrl = `https://github.com/golangci/golangci-lint/releases/download/v${version}/${name}.tar.gz`

  let downloadPath = ''

  core.info(`⬇️ downloading ${downloadUrl}`)

  try {
    downloadPath = await tc.downloadTool(downloadUrl)
  } catch (err) {
    throw new Error(
      `failed to download ${toolName} v${version}: ${err.message}`
    )
  }

  checksumVerify(downloadPath, checksum)

  core.info(`📦 extracting ${toolName}@v${version}`)
  const extractPath = await tc.extractTar(downloadPath)

  // Bin is actually inside a folder from the tar
  if (!(await ioUtil.exists(`${extractPath}/${name}/${toolName}`))) {
    throw new Error(`failed to find ${toolName} v${version} in extracted path`)
  }

  return await tc.cacheDir(`${extractPath}/${name}`, toolName, version)
}

/**
 * Verify the file against checksum
 * @param path file path to verify
 * @param checksum optionally provide a checksum to validate the file
 */
function checksumVerify(path: string, checksum?: string): void {
  if (!checksum) {
    core.info(`⚠️ skipping checksum verify`)
    return
  }
  const content = fs.readFileSync(path)

  const hash = createHash('sha256')
  hash.update(content)

  const sum = hash.digest('hex')
  if (sum !== checksum) {
    throw new Error(
      `failed to verify checksum! Expected ${checksum} but got ${sum}`
    )
  }

  core.info(`✅ checksum verified!`)
}
