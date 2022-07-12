import { domainEventPipeline } from "@ts-cqrs/pipelines-domain";
import { initAppendDomainEvents, initLoadDomainEvents, InitAdapterArgs } from "@ts-cqrs/adapters-dynamodb";
import { addIngredient, recipeIngredientAddedC, recipeIngredientAddedPayloadC } from '../actions/ingredient-add'
import { getEntityState } from '../state';

export const initAddIngredientPipeline = (entityName: string, { dynamodb, tableName }: InitAdapterArgs) => domainEventPipeline({
  action: addIngredient,
  appendDomainEvents: initAppendDomainEvents({ dynamodb, tableName }),
  entityName,
  domainEventC: recipeIngredientAddedC,
  getEntityState,
  loadDomainEvents: initLoadDomainEvents({ dynamodb, tableName }),
  payloadC: recipeIngredientAddedPayloadC
})



