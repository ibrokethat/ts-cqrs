import * as t from 'io-ts'

import { recipeCategoryAddedC, RecipeCategoryAdded } from './actions/category-add'
import { recipeCategoryRemovedC, RecipeCategoryRemoved } from './actions/category-remove'
import { recipeCreatedC, RecipeCreated } from './actions/create'
import { recipeCostUpdatedC, RecipeCostUpdated } from './actions/cost-update'
import { recipeIngredientAddedC, RecipeIngredientAdded } from './actions/ingredient-add'
import { recipeIngredientRemovedC, RecipeIngredientRemoved } from './actions/ingredient-remove'
import { recipeIngredientUpdatedC, RecipeIngredientUpdated } from './actions/ingredient-update'

export { recipeCategoryAddedC, RecipeCategoryAdded }
export { recipeCategoryRemovedC, RecipeCategoryRemoved }
export { recipeCreatedC, RecipeCreated }
export { recipeCostUpdatedC, RecipeCostUpdated }
export { recipeIngredientAddedC, RecipeIngredientAdded }
export { recipeIngredientRemovedC, RecipeIngredientRemoved }
export { recipeIngredientUpdatedC, RecipeIngredientUpdated }

export type RecipeEvents = t.TypeOf<typeof recipeEventsC>
export const recipeEventsC = t.union([
  recipeCategoryAddedC,
  recipeCategoryRemovedC,
  recipeCreatedC,
  recipeCostUpdatedC,
  recipeIngredientAddedC,
  recipeIngredientRemovedC,
  recipeIngredientUpdatedC
])
