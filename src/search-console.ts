import * as readline from 'readline'
import { Client, SearchEvent } from './client'
import chalk from 'chalk'
import { log } from './logger'

export class SearchConsole {
  private client: Client
  private currentResultCount = 0
  constructor(client: Client) {
    this.client = client
    this.client.registerSearchHandler(this.searchEventCallback)
  }

  searchEventCallback = (data: SearchResponse) => {
    if (data.error) {
      log('\nThe greatest teacher, failure is.\n', chalk.red)
      log(data.error + '\n', chalk.redBright)
      // start new search
      this.prompt()
    } else {
      this.printResult(data)
      this.currentResultCount++
      if (this.currentResultCount === data.resultCount) {
        log('\nFound someone, you have, eh? Pass on what you have learned.\n', chalk.yellow)
        // final result in event response, prompt for new search.
        this.prompt()
      }
    }
  }

  prompt = () => {
    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    this.currentResultCount = 0
    reader.question(
      chalk.yellowBright('Search for people in a galaxy, far, far away: '),
      (query: string) => {
        const event: SearchEvent = { eventType: 'search', event: { query } }
        this.client.emit(event)
        reader.close()
      },
    )
  }

  printResult = (result: SearchResponse) => {
    log(`Character ${result.page} of ${result.resultCount}\n`, chalk.blue)
    log(`Name: ${result.name || ''}`, chalk.green)
    log(`Films: ${result.films || ''}\n`, chalk.green)
  }
}

export interface SearchResponse {
  page: number
  resultCount: number
  name: string | undefined
  films: string | undefined
  error: string | undefined
}
