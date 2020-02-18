import * as fs from 'fs'
import * as path from 'path'
import {toLinter} from '../src/lint'

describe('lint', () => {
  it('decode no-issues.json', async () => {
    const content = fs.readFileSync(path.join(__dirname, 'no-issues.json'))
    const report = toLinter(content.toString())
    expect(report.Issues).toBeNull()
  })

  it('decode issues.json', async () => {
    const content = fs.readFileSync(path.join(__dirname, 'issues.json'))
    const report = toLinter(content.toString())
    expect(report.Issues).not.toBeNull()
    expect(report.Issues).toHaveLength(3)

    if (report.Issues) {
      expect(report.Issues[0]).toStrictEqual({
        FromLinter: 'errcheck',
        Text: 'Error return value of `printer` is not checked',
        SourceLines: ['\tprinter("Ba dum, tss!")'],
        Replacement: null,
        Pos: {
          Filename: 'main.go',
          Offset: 182,
          Line: 18,
          Column: 9
        }
      })
      expect(report.Issues[1]).toStrictEqual({
        FromLinter: 'deadcode',
        Text: '`unused` is unused',
        SourceLines: ['func unused() {'],
        Replacement: null,
        Pos: {
          Filename: 'main.go',
          Offset: 125,
          Line: 13,
          Column: 6
        }
      })
      expect(report.Issues[2]).toStrictEqual({
        FromLinter: 'gofmt',
        Text: 'File is not `gofmt`-ed with `-s`',
        SourceLines: ['"os"'],
        Replacement: {
          NeedOnlyDelete: false,
          NewLines: ['\t"os"'],
          Inline: null
        },
        Pos: {
          Filename: 'main.go',
          Offset: 0,
          Line: 5,
          Column: 0
        }
      })
    }
  })
})
