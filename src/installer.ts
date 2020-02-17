import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as sys from './system'
import {existsSync} from 'fs'

export const toolName = 'golangci-lint'

export async function installer(version: string): Promise<void> {
  // Check for cached installation
  let toolPath: string = tc.find(toolName, version)

  if (!toolPath) {
    toolPath = await download(version)
    core.debug(`${toolName} is cached under ${toolPath}`)
  }

  // Add to $PATH env var
  core.addPath(toolPath)
}

async function download(version: string): Promise<string> {
  const arch = sys.getArch()
  const platform = sys.getPlatform()

  const name = `golangci-lint-${version}-${platform}-${arch}`
  const downloadUrl = `https://github.com/golangci/golangci-lint/releases/download/v${version}/${name}.tar.gz`
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

  // Bin is actually inside a folder from the tar
  if (!existsSync(`${extractPath}/${name}/${toolName}`)) {
    throw new Error(`failed to find ${toolName} v${version} in extracted path`)
  }

  return await tc.cacheDir(`${extractPath}/${name}`, toolName, version)
}
