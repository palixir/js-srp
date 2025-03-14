import { digest } from './crypto'
import { SRPInt } from './SRPInt'
import type { HashAlgorithm } from './types'
import { bufferToHex, encodeUtf8, hexToBuffer } from './utils'

export const hash = async (
  hashAlgorithm: HashAlgorithm,
  ...input: (SRPInt | string)[]
) => {
  const buffers = input.map((item) =>
    typeof item === 'string' ? encodeUtf8(item) : hexToBuffer(item.toHex()),
  )

  const combined = new Uint8Array(
    buffers.reduce((offset, item) => offset + item.byteLength, 0),
  )

  buffers.reduce((offset, item) => {
    combined.set(new Uint8Array(item), offset)
    return offset + item.byteLength
  }, 0)

  return SRPInt.fromHex(
    bufferToHex(await digest(hashAlgorithm, combined.buffer)),
  )
}
