import * as TE from 'fp-ts/lib/TaskEither'
import pluralize from 'pluralize'
import { InitAdapterArgs } from './types'
import { SaveProjection } from '@ts-cqrs/pipelines-projection'

const parseResult = ({ _id, _version=0, _source }) => ({
  id: _id,
  version: _version,
  state: _source,
})

const parseJson = text => {
	try {
		return JSON.parse(text)
	} catch (e) {
		return text
	}
}

const buildPath = (...args) => '/' + args.join('/')

export type InitSaveProjection = (args: InitAdapterArgs) => SaveProjection
export const initSaveProjection: InitSaveProjection = ({ entityName, endpoint, signedRequest }) => ({ id, state, version }) => TE.tryCatch(
  async () => {

    const index = pluralize(entityName)
    const type = entityName

    const defaults = {
      endpoint,
      method: 'GET',
    }

    const { body } = await signedRequest({
      ...defaults,
      method: state ? 'PUT' : 'DELETE',
      path: buildPath(
        index,
        type,
        encodeURIComponent(id) + '?version_type=external&version=' + version
      ),
      body: JSON.stringify(state),
    })

    return parseJson(body)
  },
  (err) => ({
    err,
    msg: 'saveProjection: Elactic search failure',
    type: 'RemoteServerError',
  })
)
