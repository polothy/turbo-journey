import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as sys from './system'
import {exec} from '@actions/exec'

export const toolName = 'golangci-lint'

export async function installer(version: string): Promise<void> {
  // Check for cached installation
  let toolPath: string = tc.find(toolName, version)

  if (!toolPath) {
    toolPath = await download(version)
    core.debug(`${toolName} is cached under ${toolPath}`)
  }

  exec('ls', ['-al', toolPath])

  // Add to $PATH env var
  core.addPath(toolPath)
}

async function download(version: string): Promise<string> {
  const arch = sys.getArch()
  const platform = sys.getPlatform()

  const downloadUrl = `https://github.com/golangci/golangci-lint/releases/download/v${version}/golangci-lint-${version}-${platform}-${arch}.tar.gz`
  // const checksumUrl = `https://github.com/golangci/golangci-lint/releases/download/v${version}/golangci-lint-${version}-checksums.txt`
  let downloadPath = ''

  core.info(`⬇️ Downloading ${downloadUrl}...`)

  try {
    downloadPath = await tc.downloadTool(downloadUrl)
  } catch (err) {
    core.debug(err)

    throw new Error(
      `failed to download ${toolName} v${version}: ${err.message}`
    )
  }

  // TODO: download checksums and verify: https://github.com/golangci/golangci-lint/blob/master/install.sh
  // See crypto.createHash at https://nodejs.org/api/crypto.html to hash a file.

  core.info(`📦 Extracting ${toolName}@v${version}...`)

  const extractPath = await tc.extractTar(downloadPath)
  return await tc.cacheDir(extractPath, toolName, version)
}
