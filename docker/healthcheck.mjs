#!/usr/bin/env node

/*
 * This script pings Pastel healthcheck endpoint and returns 0 if healthy, 1 if not.
 * Useful for containerised environments.
 */

const HOSTNAME = '127.0.0.1'
const PORT = Number(process.env.PORT ?? '3000')

const request = await fetch(`http://${HOSTNAME}:${PORT}/api/health`)
const data = await request.json()

if (data.status === 'ok') {
  process.exit(0)
} else {
  console.error('Healthcheck failed:', data)
  process.exit(1)
}
