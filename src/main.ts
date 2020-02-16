import * as core from '@actions/core'
import {wait} from './wait'
import * as path from 'path'

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`)

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())

    // add problem matchers
    const matchersPath = path.join(__dirname, '..', 'matchers.json')
    console.log(`::[add-matcher]::${matchersPath}`)
    console.log(
      `golangci-lint::file=src/main.ts,line=1,col=5,severity=error,code=errcheck::You have problems`
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
