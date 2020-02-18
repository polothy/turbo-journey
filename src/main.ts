import * as core from '@actions/core'
import {installer} from './installer'
import {lint, report} from './lint'

async function run(): Promise<void> {
  try {
    const failOnIssue =
      (core.getInput('failOnIssue') || 'false').toUpperCase() === 'TRUE'
    const failOnFixable =
      (core.getInput('failOnFixable') || 'false').toUpperCase() === 'TRUE'

    const version = core.getInput('version', {required: true})
    const checksum = core.getInput('checksum')
    await installer(version, checksum)

    const linter = await lint(core.getInput('args'))
    const fixable = report(linter)

    if (failOnIssue && linter.Issues) {
      core.setFailed('🔥 Failing job due to finding lint issues')
    }
    if (failOnFixable && fixable) {
      core.setFailed('🔥 Failing job due to finding auto-fixable lint issues')
    }
  } catch (error) {
    core.setFailed(`🔥 ${error.message}`)
  }
}

run()
