import { ApplyDomainEvent } from '@ts-cqrs/pipelines-domain'
import { Recipe } from '../entity'
import { RecipeCostUpdated } from '../events'

export const applyCostUpdated: ApplyDomainEvent<Recipe, RecipeCostUpdated> = (event) => (state) => ({
  ...state,
  cost: event.data.cost
})
