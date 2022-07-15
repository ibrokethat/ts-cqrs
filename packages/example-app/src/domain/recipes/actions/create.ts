import * as t from 'io-ts';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function'
import { Action } from '@ts-cqrs/pipelines-domain'
import { Recipe } from '../entity'
import { eventC, userC  } from '../types'

const dataC = t.type({
  id: t.string,
  kitchenId: t.string,
  name: t.string,
  description: t.string,
  category: t.array(t.string),
  quantity: t.number,
  unit: t.string
})

export type RecipeCreatedPayload = t.TypeOf<typeof recipeCreatedPayloadC>
export const recipeCreatedPayloadC =  t.type({
  user: userC,
  data: dataC
})

export type RecipeCreated = t.TypeOf<typeof recipeCreatedC>
export const recipeCreatedC = t.intersection([
  eventC,
  t.type({
    type: t.literal('RecipeCreated'),
    data: t.intersection([
      dataC,
      t.type({ cost: t.number }),
    ])
  })
])

type CreateRecipe = Action<Recipe, RecipeCreatedPayload, RecipeCreated>
export const createRecipe: CreateRecipe = ({ entityState, payload} ) =>
  pipe(
    entityState,
    O.fold(
      () => TE.right([{
        at: Date.now(),
        data: {
          ...payload.data,
          cost: 0
        },
        meta: { user: payload.user },
        type: 'RecipeCreated',
        version: 1,
      }]),
      (recipe) => TE.left({ type: 'InvalidActionError', msg: `Cannot create recipe. Recipe with id ${recipe.id} already exists` } )
    )
  )
