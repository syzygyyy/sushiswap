import { createClient, Prisma, PrismaClient } from '@sushiswap/database'
import { performance } from 'perf_hooks'

export async function whitelistPools2() {
  const productionClient = await createClient({
    datasources: {
      db: {
        url: process.env.PRODUCTION_DATABASE_URL as string,
      },
    },
  })
  const previewClient = await createClient({
    datasources: {
      db: {
        url: process.env.PREVIEW_DATABASE_URL as string,
      },
    },
  })

  try {
    const startTime = performance.now()

    await start(productionClient, previewClient)

    const endTime = performance.now()
    
  } catch (e) {
    console.error(e)
    await previewClient.$disconnect()
    await productionClient.$disconnect()
  } finally {
    await previewClient.$disconnect()
    await productionClient.$disconnect()
  }
}

async function start(productionClient: PrismaClient, previewClient: PrismaClient) {
  const approvedTokensResult = await productionClient.token.findMany({
    select: {
      id: true,
    },
    where: {
      isFeeOnTransfer: false,
      status: 'APPROVED',
    },
  })

  const approvedTokens = approvedTokensResult.map((token) => token.id)
  

  const batchSize = 10000
  let cursor = null
  const poolsToUpdate: string[] = []
  let totalCount = 0

  do {
    const requestStartTime = performance.now()
    let result = []
    if (!cursor) {
      result = await getPoolsAddresses(previewClient, approvedTokens, batchSize)
    } else {
      result = await getPoolsAddresses(previewClient, approvedTokens, batchSize, 1, { id: cursor })
    }
    cursor = result.length == batchSize ? result[result.length - 1].id : null
    totalCount += result.length

    poolsToUpdate.push(...result.map((pool) => pool.id))
    const requestEndTime = performance.now()
    if (result.length > 0) {
      
    } else {
      
    }
  } while (cursor != null)

  const updatePoolsBatchSize = 200
  let updatePoolCount = 0
  for (let i = 0; i < poolsToUpdate.length; i += updatePoolsBatchSize) {
    const batch = poolsToUpdate.slice(i, i + updatePoolsBatchSize)
    const batchToUpdate = batch.map((id) =>
      previewClient.pool.update({
        where: {
          id,
        },
        data: {
          isWhitelisted: true,
        },
      })
    )
    const poolsUpdated = await Promise.allSettled(batchToUpdate)

    
    updatePoolCount += poolsUpdated.length
  }
  
}

async function getPoolsAddresses(
  client: PrismaClient,
  approvedIds: string[],
  take: number,
  skip?: number,
  cursor?: Prisma.PoolWhereUniqueInput
) {
  const approvedTokens = await client.pool.findMany({
    take,
    skip,
    cursor,
    select: {
      id: true,
    },
    where: {
      isWhitelisted: false,
      token0Id: { in: approvedIds },
      token1Id: { in: approvedIds },
    },
  })

  return approvedTokens
}
