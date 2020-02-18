import * as core from '@actions/core'
import * as coreCommand from '@actions/core/lib/command'
import * as path from 'path'
import {installer} from './installer'
import {lint, report} from './lint'

async function run(): Promise<void> {
  try {
    core.startGroup('Setup')
    const version: string = core.getInput('version')
    await installer(version)
    core.endGroup()

    // Add problem matchers
    coreCommand.issueCommand(
      'add-matcher',
      {},
      path.join(__dirname, '..', 'matchers.json')
    )

    core.startGroup('🏃 Linting')
    const linter = await lint(core.getInput('args'))
    core.endGroup

    report(linter)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
