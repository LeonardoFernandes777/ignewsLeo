import * as prismic from '@prismicio/client';
import * as prismicNext from '@prismicio/next'

export const endpoint = 'https://ignews-rep.cdn.prismic.io/api/v2';
export const repositoryName = prismic.getRepositoryName(endpoint)


export async function createClient({
  previewData,
  req,
  ...config
}: prismicNext.CreateClientConfig = {}) {
  const client = prismic.createClient(repositoryName, config)

  prismicNext.enableAutoPreviews({ client, previewData, req })

  return client
}