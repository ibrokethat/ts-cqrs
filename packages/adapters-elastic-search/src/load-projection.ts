import * as TE from 'fp-ts/lib/TaskEither'
import pluralize from 'pluralize'
import { InitAdapterArgs } from './types'
import { LoadProjection } from '@ts-cqrs/pipelines-projection'

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

export type InitLoadProjection = (args: InitAdapterArgs) => LoadProjection
export const initLoadProjection: InitLoadProjection = ({ entityName, endpoint, signedRequest }) => ({ id }) => TE.tryCatch(
  async () => {

    const index = pluralize(entityName)
    const type = entityName

    const defaults = {
      endpoint,
      method: 'GET',
    }

    const { body } = await signedRequest({
      ...defaults,
      path: buildPath(
        index,
        type,
        encodeURIComponent(id)
      ),
    })

    const data = parseJson(body)
    return parseResult(data)
  },
  (err) => ({
    err,
    msg: 'loadProjection: Elactic search failure',
    type: 'RemoteServerError',
  })
)
