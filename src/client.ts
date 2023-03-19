import { io, Socket } from 'socket.io-client'
import { SearchResponse } from './search-console'
import chalk from 'chalk'
import { log } from './logger'

export class Client {
  private socket: Socket
  constructor(url: string, connectCallback?: () => void) {
    this.socket = io(url)
    this.socket.on('connect', () => {
      log('connected: Your path you must decide.\n', chalk.yellowBright)
      if (connectCallback) {
        connectCallback()
      }
    })
    this.socket.on('disconnect', () => {
      log('disconnect: The client has been disconnected, aborting process', chalk.redBright)
      process.exit(1)
    })
    this.socket.on('connect_error', () => {
      log('connect_error: An error occured while attempting to connect', chalk.redBright)
      process.exit(1)
    })
    this.socket.on('error', (error) => {
      log(`error: An unkown error has occured: ${error}`, chalk.redBright)
      process.exit(1)
    })
  }

  connect() {
    this.socket.connect()
  }

  emit(event: SearchEvent) {
    this.socket.emit(event.eventType, event.event)
  }

  registerSearchHandler(handler: (data: SearchResponse) => void) {
    this.socket.on('search', handler)
  }
}

export interface SearchEvent {
  eventType: 'search'
  event: { query: string }
}
