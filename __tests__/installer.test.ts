import * as tc from '@actions/tool-cache'
import {checksumVerify, installer} from '../src/installer'
import * as path from 'path'
import * as osm from 'os'
import * as ioUtil from '@actions/io/lib/io-util'

describe('installer', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let os = {} as any

  // let inSpy: jest.SpyInstance;
  let findSpy: jest.SpyInstance
  let cnSpy: jest.SpyInstance
  // let logSpy: jest.SpyInstance;
  // let getSpy: jest.SpyInstance;
  let platSpy: jest.SpyInstance
  let archSpy: jest.SpyInstance
  let dlSpy: jest.SpyInstance
  let exSpy: jest.SpyInstance
  let cacheSpy: jest.SpyInstance
  let ioUtilSpy: jest.SpyInstance

  beforeEach(() => {
    // node 'os'
    os = {}
    platSpy = jest.spyOn(osm, 'platform')
    platSpy.mockImplementation(async () => os['platform'])
    archSpy = jest.spyOn(osm, 'arch')
    archSpy.mockImplementation(async () => os['arch'])

    // @actions/tool-cache
    findSpy = jest.spyOn(tc, 'find')
    dlSpy = jest.spyOn(tc, 'downloadTool')
    exSpy = jest.spyOn(tc, 'extractTar')
    cacheSpy = jest.spyOn(tc, 'cacheDir')
    // getSpy = jest.spyOn(im, 'getVersions');

    // @actions/io
    ioUtilSpy = jest.spyOn(ioUtil, 'exists')

    // writes
    cnSpy = jest.spyOn(process.stdout, 'write')
    // logSpy = jest.spyOn(console, 'log');
    // getSpy.mockImplementation(() => <im.IGoVersion[]>goJsonData);
    cnSpy.mockImplementation()
    // logSpy.mockImplementation(line => {
    //   // uncomment to debug
    //   // process.stderr.write('log:' + line + '\n');
    // });
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  it('finds a version in the cache and adds it to the path', async () => {
    const toolPath = path.normalize('/cache/golangci-lint/1.23.6/amd64')
    findSpy.mockImplementation(() => toolPath)
    await installer('1.23.6')

    expect(cnSpy).toHaveBeenCalledWith(`::add-path::${toolPath}${osm.EOL}`)
  })

  it('handles download error', async () => {
    os.platform = 'linux'
    os.arch = 'amd64'

    const errMsg = 'unhandled error message'

    findSpy.mockImplementation(() => '')
    dlSpy.mockImplementation(() => {
      throw new Error(errMsg)
    })

    let err = new Error()

    try {
      await installer('1.23.6')
    } catch (e) {
      err = e
    }

    expect(err.message).toBe(
      `failed to download golangci-lint v1.23.6: ${errMsg}`
    )
  })

  it('can install', async () => {
    os.platform = 'linux'
    os.arch = 'amd64'

    findSpy.mockImplementation(() => '')
    dlSpy.mockImplementation(() => '/some/temp/path')
    const toolPath = path.normalize('/cache/golangci-lint/1.23.6/amd64')
    exSpy.mockImplementation(() => '/some/other/temp/path')
    cacheSpy.mockImplementation(() => toolPath)
    ioUtilSpy.mockImplementation(async () => true)

    await installer('1.23.6')

    expect(findSpy).toHaveBeenCalled()
    expect(dlSpy).toHaveBeenCalled()
    expect(exSpy).toHaveBeenCalled()
    expect(cacheSpy).toHaveBeenCalled()
    expect(cnSpy).toHaveBeenCalledWith(`::add-path::${toolPath}${osm.EOL}`)
  })

  it('can verify checksum', async () => {
    checksumVerify(
      path.join(__dirname, 'no-issues.json'),
      '216a955944056e360a79eb228a25efaa6cc2ed49c712ac88b95d8e470d90d374'
    )
  })

  it('can fail to verify checksum', async () => {
    expect(() => {
      checksumVerify(path.join(__dirname, 'no-issues.json'), 'abc123')
    }).toThrow()
  })

  it('checksum is optional', async () => {
    checksumVerify(path.join(__dirname, 'no-issues.json'))
  })
})
