import { domainEventPipeline } from '@ts-cqrs/pipelines-domain'
import { initAppendDomainEvents, initLoadDomainEvents, InitAdapterArgs } from '@ts-cqrs/adapters-dynamodb'
import { addCategory, recipeCategoryAddedC, recipeCategoryAddedPayloadC } from '../actions/category-add'
import { getEntityState } from '../state';

export const initAddCategoryPipeline = (entityName: string, { dynamodb, tableName }: InitAdapterArgs) => domainEventPipeline({
  action: addCategory,
  appendDomainEvents: initAppendDomainEvents({ dynamodb, tableName }),
  entityName,
  domainEventC: recipeCategoryAddedC,
  getEntityState,
  loadDomainEvents: initLoadDomainEvents({ dynamodb, tableName }),
  payloadC: recipeCategoryAddedPayloadC
})



