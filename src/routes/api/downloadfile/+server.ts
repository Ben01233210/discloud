import type { RequestHandler } from "@sveltejs/kit";
import { downloadFile } from "$lib/discordFileTransfer";

export const POST: RequestHandler = async ({request}) => {
    console.log(request)
    const {urls} = await request.json();

    const file = await downloadFile(urls)

    const headers = {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="downloaded-file"'
    };
    return new Response(file, { headers });
} 
