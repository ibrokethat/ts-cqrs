import * as t from 'io-ts';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function'
import { Action } from '@ts-cqrs/pipelines-domain'
import { Recipe } from '../entity'
import { eventC, userC } from '../types'

const dataC = t.type({
  category: t.string
})

export type RecipeCategoryRemovedPayload = t.TypeOf<typeof recipeCategoryRemovedPayloadC>
export const recipeCategoryRemovedPayloadC = t.type({
  user: userC,
  data: dataC
})


export type RecipeCategoryRemoved = t.TypeOf<typeof recipeCategoryRemovedC>
export const recipeCategoryRemovedC = t.intersection([
  eventC,
  t.type({
    type: t.literal('RecipeCategoryRemoved'),
    data: dataC
  })
])

type RemoveCategory = Action<Recipe, RecipeCategoryRemovedPayload, RecipeCategoryRemoved>
export const removeCategory: RemoveCategory = ({ entityState, payload} ) =>
  pipe(
    entityState,
    O.fold(
      () => TE.left({ type: 'InvalidActionError', msg: 'Cannot remove category from recipe. Recipe does not exist' } ),
      () => TE.right([{
        at: Date.now(),
        data: payload.data,
        meta: { user: payload.user},
        type: 'RecipeCategoryRemoved',
        version: 1,
      }]),
    )
  )

