/**
 * API Route - Upload Files
 *
 * This API route is designed for initiating a chat session within an application.
 * It handles the processing and uploading of a file necessary for starting a chat session
 * with the OpenAI API. The route manages the receipt of a file through POST request,
 * temporarily saves it, and then uploads it to OpenAI, ultimately returning the
 * file ID for use in further chat-related operations.
 *
 * Path: /api/upload
 */

import {NextRequest, NextResponse} from 'next/server';
import OpenAI from "openai";

// Initialize the OpenAI client with the API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function DELETE(_: NextRequest, {params}: { params: { id: string } }) {

    const {id} = params;

    // Logging the start of the upload process
    console.log(`delete File ID :`, id);

    try {
        // Uploading the file to OpenAI
        const resp = await openai.files.del(id)

        // Respond with the file ID
        return NextResponse.json({success: true, data: resp});
    } catch (error) {
        // Log and respond to any errors during the upload process
        console.error('Error delete file:', error);
        return NextResponse.json({success: false, message: 'Error delete file'});
    }
}