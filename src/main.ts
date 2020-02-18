import * as core from '@actions/core'
import {installer} from './installer'
import {lint, report} from './lint'

async function run(): Promise<void> {
  try {
    const version: string = core.getInput('version')
    await installer(version)

    const linter = await lint(core.getInput('args'))
    report(linter)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
