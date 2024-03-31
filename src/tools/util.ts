
export const imageBitmapToCanvas = async (imageBitmap: ImageBitmap): Promise<HTMLCanvasElement> => {
    // Create an offscreen canvas
    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height)
    const offscreenContext = canvas.getContext('2d')

    // Draw the ImageBitmap onto the offscreen canvas
    offscreenContext?.drawImage(imageBitmap, 0, 0)

    // Create a visible canvas
    const visibleCanvas = document.createElement('canvas')
    visibleCanvas.width = imageBitmap.width;
    visibleCanvas.height = imageBitmap.height;

    // Get the rendering context for the visible canvas
    const visibleContext = visibleCanvas.getContext('2d')!

    visibleContext.drawImage(canvas, 0, 0)

    return visibleCanvas
}

export const ArrayChunks = <T>(items: T[], n: number) => {
    let chunks = []

    for (let i = 0; i < items.length; i += n) {
        chunks.push(items.slice(i, i + n))
    }
    return chunks
}

export const queryStringify = (query: { [x: string]: any }) => {
    const queryString = Object.keys(query)
      .map(key => `${key}=${encodeURIComponent(query[key] || '')}`)
      .join('&')
    return queryString
  }
  