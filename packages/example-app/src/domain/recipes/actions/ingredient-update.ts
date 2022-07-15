import * as t from 'io-ts';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function'
import { Action } from '@ts-cqrs/pipelines-domain'
import { Recipe } from '../entity'
import { eventC, userC  } from '../types'

const dataC = t.type({
  ingredientId: t.string,
  quantity: t.number,
  unit: t.string,
  cost: t.number
})


export type RecipeIngredientUpdatedPayload = t.TypeOf<typeof recipeIngredientUpdatedPayloadC>
export const recipeIngredientUpdatedPayloadC = t.type({
  user: userC,
  data: dataC
})

export type RecipeIngredientUpdated = t.TypeOf<typeof recipeIngredientUpdatedC>
export const recipeIngredientUpdatedC = t.intersection([
  eventC,
  t.type({
    type: t.literal('RecipeIngredientUpdated'),
    data: dataC
  })
])

type UpdateIngredient= Action<Recipe, RecipeIngredientUpdatedPayload, RecipeIngredientUpdated>
export const updateIngredient: UpdateIngredient = ({ entityState, payload} ) =>
  pipe(
    entityState,
    O.fold(
      () => TE.left({ type: 'InvalidActionError', msg: `Cannot update ingredient in recipe. Recipe does not exist` } ),
      (recipe) =>
        pipe(
          O.of(recipe.ingredients.find(ingredient => ingredient.ingredientId === payload.data.ingredientId)),
          O.fold(
            () => TE.left({ type: 'InvalidActionError', msg: 'Cannot update ingredient in recipe. Ingedient does not exist in recipe' } ),
            () => TE.right([{
              at: Date.now(),
              data: payload.data,
              meta: { user: payload.user },
              type: 'RecipeIngredientUpdated',
              version: 1,
            }]),
          )
        )
    )
  )
