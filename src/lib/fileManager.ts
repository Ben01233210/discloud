const chunkSize = 12799 / 512 * 1024 * 1024; // ungefähr 24.998 mb

export async function splitFileIntoChunks(fileBlob: Blob): Promise<Blob[]> {
    const totalSize = fileBlob.size;
    const chunks: Blob[] = [];

    for (let start = 0; start < totalSize; start += chunkSize) {
        const end = Math.min(start + chunkSize, totalSize);
        const chunkBlob = fileBlob.slice(start, end);
        chunks.push(chunkBlob);
    }

    return chunks;
}

export async function combineFileChunks(fileChunks: Blob[]): Promise<Blob> {
    return new Blob(fileChunks, {type: fileChunks[0]?.type});
}
