import { ApplyDomainEvent } from '@ts-cqrs/pipelines-domain'
import { Recipe } from '../entity'
import { RecipeCreated } from '../events'

export const applyCreated: ApplyDomainEvent<Recipe, RecipeCreated> = (event) => (state) => ({
  ...state,
  at: event.at,
  createdBy: event.meta.user.id,
  ...event.data
})
