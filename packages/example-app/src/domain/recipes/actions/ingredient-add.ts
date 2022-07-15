import * as t from 'io-ts';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function'
import { Action } from '@ts-cqrs/pipelines-domain'
import { Recipe } from '../entity'
import { eventC, userC  } from '../types'

const dataC = t.type({
  ingredientId: t.string,
  name: t.string,
  type: t.string,
  quantity: t.number,
  unit: t.string,
  cost: t.number
})

export type RecipeIngredientAddedPayload = t.TypeOf<typeof recipeIngredientAddedPayloadC>
export const recipeIngredientAddedPayloadC = t.type({
  user: userC,
  data: dataC
})

export type RecipeIngredientAdded = t.TypeOf<typeof recipeIngredientAddedC>
export const recipeIngredientAddedC = t.intersection([
  eventC,
  t.type({
    type: t.literal('RecipeIngredientAdded'),
    data: dataC
  })
])

type AddIngredient = Action<Recipe, RecipeIngredientAddedPayload, RecipeIngredientAdded>
export const addIngredient: AddIngredient = ({ entityState, payload} ) =>
  pipe(
    entityState,
    O.fold(
      () => TE.left({ type: 'InvalidActionError', msg: `Cannot add ingredient to recipe. Recipe does not exist` } ),
      (recipe) =>
        pipe(
          O.of(recipe.ingredients.find(ingredient => ingredient.ingredientId === payload.data.ingredientId)),
          O.fold(
            () => TE.right([{
              at: Date.now(),
              data: payload.data,
              meta: { user: payload.user },
              type: 'RecipeIngredientAdded',
              version: 1,
            }]),
            () => TE.left({ type: 'InvalidActionError', msg: 'Cannot add ingredient to recipe. Ingedient already exists in recipe' } )
          )
        )
    )
  )

