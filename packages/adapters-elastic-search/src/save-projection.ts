import * as TE from 'fp-ts/lib/TaskEither'
import * as pluralize from 'pluralize'
import { InitAdapterArgs } from './types'
import { SaveProjection } from '@ts-cqrs/pipelines-projection'
import { signedPut, signedDelete } from './signed-request'

export type InitSaveProjection = (args: InitAdapterArgs) => SaveProjection
export const initSaveProjection: InitSaveProjection = ({ entityName, endpoint }) => ({ id, state, version }) => {
  const index = pluralize(entityName)
  const type = entityName

  return TE.tryCatch(
    async () => {
      const res = await (state ? signedPut : signedDelete)({
        data: JSON.stringify(state),
        url: `https://${endpoint}/${index}/${type}/${encodeURIComponent(id)}?version_type=external&version=${version}`
      })

      return JSON.parse(res)
    },
    (err) => ({
      err,
      msg: 'saveProjection: Elastic search failure',
      type: 'RemoteServerError',
    })
  )
}
