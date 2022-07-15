import * as t from 'io-ts'

export type Recipe = t.TypeOf<typeof recipeC>
export const recipeC = t.type({
  id: t.string,
  kitchenId: t.string,
  name: t.string,
  description: t.string,
  categories: t.array(t.string),
  quantity: t.number,
  unit: t.string,
  cost: t.number,
  ingredients: t.array(
    t.type({
      ingredientId: t.string,
      name: t.string,
      type: t.string,
      quantity: t.number,
      unit: t.string,
      cost: t.number
    })
  ),
  at: t.number,
  createdBy: t.string,
})
