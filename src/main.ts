import * as core from '@actions/core'
import * as coreCommand from '@actions/core/lib/command'
import {print} from './util'
import * as path from 'path'
import {installer} from './installer'
import {lint} from './lint'

async function run(): Promise<void> {
  try {
    const version: string = core.getInput('version')
    await installer(version)

    // Add problem matchers
    coreCommand.issueCommand(
      'add-matcher',
      {},
      path.join(__dirname, '..', 'matchers.json')
    )

    // `::error file=src/main.ts,line=1,col=5,::From Error${os.EOL}`
    coreCommand.issueCommand(
      'error',
      {
        file: 'src/main.ts',
        line: '1',
        col: '5'
      },
      'From issueCommand'
    )

    print(
      `golangci-lint::file=src/main.ts,line=1,col=5,severity=error,code=errcheck::You have problems`
    )

    const json = await lint(core.getInput('args'))
    core.info(json)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
