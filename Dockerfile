# Install dependencies only when needed
FROM node:22-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
#COPY --from=builder /app/next.config.mjs ./
#COPY --from=builder /app/public ./public
COPY --from=builder /app/out ./out
COPY --from=builder /app/package.json ./package.json
COPY server.js ./server.js

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
#COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN npm install express path

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

#CMD ["node", "server.js"]
CMD ["node", "server.js"]

####################################
# Build the docker image - MAINNET
# sudo docker build . -t dynamicstrategiesio/general:crewardcalculator
# sudo docker push dynamicstrategiesio/general:crewardcalculator

##########################
# Create Docker Container
##########################
##########################
#sudo docker run  --env-file .env -it -p 3000:3000 dynamicstrategiesio/general:crewardcalculator
