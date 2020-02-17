import * as core from '@actions/core'
import {print} from './util'
import * as path from 'path'
import {installer} from './installer'

async function run(): Promise<void> {
  try {
    const version: string = core.getInput('version')
    await installer(version)

    // add problem matchers
    const matchersPath = path.join(__dirname, '..', 'matchers.json')

    print(`##[add-matcher]${matchersPath}`)
    print(
      `golangci-lint::file=src/main.ts,line=1,col=5,severity=error,code=errcheck::You have problems`
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
