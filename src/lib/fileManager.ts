/**
 * entspricht der einzelnen teil Datei größe, da discord ein upload limit von 25mb hat
 * entspricht ungefähr 24.998mb da 25mb nicht funktionieren
 */
const chunkSize = 12799 / 512 * 1024 * 1024;

/**
 * teilt die einzelnen Dateien in ungefähr 25mb teil Dateien auf
 * @param fileBlob die Datei die geteilt werden soll
 */
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

/**
 * Kombiniert die einzelnen Dateien zu einer Datei wieder zusammen
 * @param fileChunks die einzelnen Teil Dateien
 */
export async function combineFileChunks(fileChunks: Blob[]): Promise<Blob> {
    return new Blob(fileChunks, {type: fileChunks[0]?.type});
}
