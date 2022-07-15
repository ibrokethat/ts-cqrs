import * as TE from 'fp-ts/lib/TaskEither'
import * as pluralize from 'pluralize'
import { InitAdapterArgs } from './types'
import { LoadProjection } from '@ts-cqrs/pipelines-projection'
import { signedGet } from './signed-request'

const buildPath = (...args: string[]) => '/' + args.join('/')

export type InitLoadProjection = (args: InitAdapterArgs) => LoadProjection
export const initLoadProjection: InitLoadProjection = ({ entityName, endpoint }) => ({ id }) => {
  const index = pluralize(entityName)
  const type = entityName

  return TE.tryCatch(
    async () => {
      const res = await signedGet({
        url: `https://${endpoint}/${index}/${type}/${encodeURIComponent(id)}`
      })

      const data = JSON.parse(res)
      return  {
        id: data._id,
        version: data._version,
        state: data._source,
      }
    },
    (err) => ({
      err,
      msg: 'loadProjection: Elastic search failure',
      type: 'RemoteServerError',
    })
  )
}
