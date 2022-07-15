import * as t from 'io-ts'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { ProjectionPipelineError } from './types'

type DecodeProjectionArgs<Projection> = {
  projection: unknown,
  projectionC: t.Type<Projection, unknown>
}
type DecodeProjection = <Projection>(args: DecodeProjectionArgs<Projection>) => E.Either<ProjectionPipelineError, Projection>

export const decodeProjection: DecodeProjection = ({ projection, projectionC }) =>
  pipe(projectionC.decode(projection), E.mapLeft(() => ({type: 'InvalidProjectionError', msg: ''})))
