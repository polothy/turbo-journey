import {exec} from '@actions/exec'
import * as core from '@actions/core'
import {toolName} from './installer'
import {argStringToArray} from '@actions/exec/lib/toolrunner'
import * as os from 'os'

/**
 * Run the linter
 * @param argStr argument string to pass to the linter
 */
export async function lint(argStr: string): Promise<Linter> {
  core.info('🏃 running linter')

  const args: string[] = [
    'run',
    '--out-format',
    'json',
    '--issues-exit-code',
    '0'
  ]
  args.push(...argStringToArray(argStr))

  let output = ''

  await exec(toolName, args, {
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString()
      }
    }
  })

  // The output from the command has no newline, add one here.
  process.stdout.write(os.EOL)

  return toLinter(output)
}

/**
 * Decode json to Linter
 * @param json
 */
export function toLinter(json: string): Linter {
  return JSON.parse(json)
}

/**
 * Convert Linter to warning and error GitHub annotations
 * @param linter
 */
export function report(linter: Linter): boolean {
  if (linter.Issues === null) {
    core.info(`✅ no linter issues found!`)
    return false
  }

  core.info(`⚠️ linter found issues!`)

  let result = false
  for (const issue of linter.Issues) {
    const fixable = issue.Replacement ? ', auto-fixable' : ''
    const severity = issue.Replacement ? 'error' : 'warning'
    const message = `${issue.Text} (${issue.FromLinter}${fixable})`

    if (issue.Replacement) {
      result = true
    }

    process.stdout.write(
      `::${severity} file=${issue.Pos.Filename},line=${issue.Pos.Line},col=${issue.Pos.Column}::${message}${os.EOL}`
    )
  }
  return result
}

export interface Linter {
  Issues: Issue[] | null
  Report: Report
}

export interface Issue {
  FromLinter: string
  Text: string
  SourceLines: string[]
  Replacement: Replacement | null
  Pos: Pos
}

export interface Pos {
  Filename: string
  Offset: number
  Line: number
  Column: number
}

export interface Replacement {
  NeedOnlyDelete: boolean
  NewLines: string[]
  Inline: Inline | null
}

export interface Inline {
  StartCol: number
  Length: number
  NewString: string
}

export interface Report {
  Linters: LinterElement[]
}

export interface LinterElement {
  Name: string
  Enabled?: boolean
  EnabledByDefault?: boolean
}
