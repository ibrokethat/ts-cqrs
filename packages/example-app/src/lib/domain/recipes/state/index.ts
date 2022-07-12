import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { match } from 'ts-pattern'
import { GetEntityState } from '@ts-cqrs/pipelines-domain'
import { Recipe, recipeC } from '../entity'
import * as EVENTS from '../events'
import { applyCreated } from './apply-created';
import { applyCategoryAdded } from './apply-category-added';
import { applyCategoryRemoved } from './apply-category-removed';
import { applyIngredientAdded } from './apply-ingredient-added';
import { applyIngredientRemoved } from './apply-ingredient-removed';
import { applyIngredientUpdated } from './apply-ingredient-updated';
import { applyCostUpdated } from './apply-cost-updated';

export const getEntityState: GetEntityState<Recipe, EVENTS.RecipeEvents> = ({ domainEvents }) => {

  if (!domainEvents.length) {
    return E.right(O.none)
  }

  const initialState: Partial<Recipe> = {}

  const state = domainEvents.reduce((state, event) => match(event)
    .with({type: 'RecipeCreated'} , applyCreated)
    .with({type: 'RecipeCategoryAdded'} , applyCategoryAdded)
    .with({type: 'RecipeCategoryRemoved'} , applyCategoryRemoved)
    .with({type: 'RecipeIngredientAdded'} , applyIngredientAdded)
    .with({type: 'RecipeIngredientRemoved'} , applyIngredientRemoved)
    .with({type: 'RecipeIngredientUpdated'} , applyIngredientUpdated)
    .with({type: 'RecipeCostUpdated'} , applyCostUpdated)
    .exhaustive()(state), initialState)

  return pipe(
    recipeC.decode(state),
    E.fold(
      () => E.left({ type: 'InvalidStateError', msg: 'Invalid recipe state' }),
      (recipe) => E.right(O.some(recipe))
    )
  )
}

// export const getEntityState: GetEntityState<Recipe, EVENTS.RecipeEvents> = ({ domainEvents }) =>
//   pipe(
//     domainEvents,
//     E.fromPredicate((domainEvents) => !!domainEvents.length, () => undefined),
//     E.fold(
//       () => E.right(O.none),
//       (domainEvents) => {
//         const initialState: Partial<Recipe> = {}
//         const state = domainEvents.reduce((state, event) => match(event)
//           .with({type: 'RecipeCreated'} , applyCreated)
//           .with({type: 'RecipeCategoryAdded'} , applyCategoryAdded)
//           .with({type: 'RecipeCategoryRemoved'} , applyCategoryRemoved)
//           .with({type: 'RecipeIngredientAdded'} , applyIngredientAdded)
//           .with({type: 'RecipeIngredientRemoved'} , applyIngredientRemoved)
//           .with({type: 'RecipeIngredientUpdated'} , applyIngredientUpdated)
//           .with({type: 'RecipeCostUpdated'} , applyCostUpdated)
//           .exhaustive()(state), initialState)
//         return pipe(
//           recipeC.decode(state),
//           E.fold(
//             () => E.left({ type: 'InvalidStateError', msg: 'Invalid recipe state' }),
//             (recipe) => E.right(O.some(recipe))
//           )
//         )
//       }
//     )
//   )

