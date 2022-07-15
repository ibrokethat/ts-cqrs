
export type RemoteServerError = {
  err: unknown
  msg: string
  type: 'RemoteServerError'
}

export type InitAdapterArgs = {
  entityName: string
  endpoint: string
}
