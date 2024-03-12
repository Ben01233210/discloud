import type { RequestHandler } from "@sveltejs/kit";
import { downloadFile } from "$lib/discordFileTransfer";

export const POST: RequestHandler = async ({request}) => {
    // das ist das backend was wir leider doch brauchten :(
    // es ist dazu da die Downloads von discord zu unserem server zu leiten
    console.log(request)
    const {urls} = await request.json();
    // laed von discord die Files runter
    const file = await downloadFile(urls);

    const headers = {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="downloaded-file"'
    };
    return new Response(file, { headers });
} 
