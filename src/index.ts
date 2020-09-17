import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

interface Secret {
  [key: string]: string
}

export const getSecrets = async (projectId: string, secretIds: string[]): Promise<Secret> => {
  const client = new SecretManagerServiceClient()
  const items: Secret = {}
  for (const secretId of secretIds) {
    const [secretName, secretVersion] = secretId.split('__')
    const name = `projects/${projectId}/secrets/${secretName}/versions/${secretVersion || 'latest'}`
    const [version] = await client.getSecretVersion({ name })
    const [accessResponse] = await client.accessSecretVersion(version)
    items[secretName] = accessResponse.payload?.data?.toString() || ''
  }
  return items
}
