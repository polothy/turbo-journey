import * as core from '@actions/core'
import {installer} from './installer'
import {lint, report} from './lint'
import {getInputBoolean} from './input'

async function run(): Promise<void> {
  try {
    const version = core.getInput('version', {required: true})
    const checksum = core.getInput('checksum')
    const args = core.getInput('args')
    const failOnIssue = getInputBoolean('failOnIssue')
    const failOnFixable = getInputBoolean('failOnFixable')

    await installer(version, checksum)

    const linter = await lint(args)
    const fixable = report(linter)

    if (failOnIssue && linter.Issues) {
      core.setFailed('🔥 failing job due to finding lint issues')
    }
    if (failOnFixable && fixable) {
      core.setFailed('🔥 failing job due to finding auto-fixable lint issues')
    }
  } catch (error) {
    core.setFailed(`🔥 ${error.message}`)
  }
}

run()
