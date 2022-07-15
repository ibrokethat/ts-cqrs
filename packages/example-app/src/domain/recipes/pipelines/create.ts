import { domainEventPipeline } from "@ts-cqrs/pipelines-domain";
import { initAppendDomainEvents, initLoadDomainEvents, InitAdapterArgs } from "@ts-cqrs/adapters-dynamodb";
import { createRecipe, recipeCreatedC, recipeCreatedPayloadC } from '../actions/create'
import { getEntityState } from '../state';

export const initCreateRecipePipeline = (entityName: string, { dynamodb, tableName }: InitAdapterArgs) => domainEventPipeline({
  action: createRecipe,
  appendDomainEvents: initAppendDomainEvents({ dynamodb, tableName }),
  entityName,
  domainEventC: recipeCreatedC,
  getEntityState,
  loadDomainEvents: initLoadDomainEvents({ dynamodb, tableName }),
  payloadC: recipeCreatedPayloadC
})



