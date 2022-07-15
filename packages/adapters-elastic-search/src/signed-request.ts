import axios from 'axios'
import { aws4Interceptor } from 'aws4-axios'
import { defaultProvider } from '@aws-sdk/credential-provider-node'

axios.interceptors.request.use(
  async () => aws4Interceptor(
    {
    // region: 'us-east-1',
    service: 'es'
    },
    await defaultProvider()()
  )
)

type SignedGetArgs = { url: string }
type SignedGet = (args: SignedGetArgs) => Promise<string>
export const signedGet: SignedGet = async ({ url })  => {
  const res = await axios.get<unknown, string>(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return res
}

type SignedPutArgs = { url: string, data: string }
type SignedPut = (args: SignedPutArgs) => Promise<string>
export const signedPut: SignedPut = async ({ url, data })  => {
  const res = await axios.put<unknown, string>(url, {
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return res
}

type SignedDeleteArgs = { url: string, data: string }
type SignedDelete = (args: SignedDeleteArgs) => Promise<string>
export const signedDelete: SignedDelete = async ({ url, data })  => {
  const res = await axios.delete<unknown, string>(url, {
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return res
}
