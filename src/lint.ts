import {exec} from '@actions/exec'
import * as core from '@actions/core'
import {toolName} from './installer'
import {argStringToArray} from '@actions/exec/lib/toolrunner'
import * as coreCommand from '@actions/core/lib/command'

export async function lint(argStr: string): Promise<Linter> {
  let output = ''

  const args: string[] = [
    'run',
    '--out-format',
    'json',
    '--issues-exit-code',
    '0'
  ]
  args.push(...argStringToArray(argStr))

  await exec(toolName, args, {
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString()
      }
    }
  })

  return toLinter(output)
}

export function toLinter(json: string): Linter {
  return JSON.parse(json)
}

export function report(linter: Linter): void {
  if (linter.Issues === null) {
    core.info(`✅ no linter issues found!`)
    return
  }

  core.info(`⚠️ linter found issues!`)

  for (const issue of linter.Issues) {
    const fixable = issue.Replacement ? ', auto-fixable)' : ''

    coreCommand.issueCommand(
      issue.Replacement ? 'error' : 'warning', // auto-fixable == error
      {
        file: issue.Pos.Filename,
        line: String(issue.Pos.Line),
        col: String(issue.Pos.Column)
      },
      `${issue.Text} (${issue.FromLinter}${fixable})`
    )
  }
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
