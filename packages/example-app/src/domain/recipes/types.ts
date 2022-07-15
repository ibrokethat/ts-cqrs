import * as t from 'io-ts'

export const userC = t.type({ id: t.string })
const metaC = t.type({ user: userC })

export const eventC = t.type({
  meta: metaC,
  version: t.number,
  at: t.number
})
