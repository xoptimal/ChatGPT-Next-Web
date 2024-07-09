/**
 * API Route - List Assistants
 *
 * This API route is responsible for retrieving assistants from your account using the OpenAI API.
 * It is a simple GET request. The route fetches the assistants
 * associated with the provided api key and returns them in a structured JSON format. It's designed to
 * retrieve your assistants created using OpenAI's GPT models.
 *
 * Path: /api/listAssistants
 */

import { NextRequest, NextResponse } from 'next/server';


// Define an asynchronous POST function to handle incoming requests
export async function GET(req: NextRequest) {
  console.log("here!")
  try {

    const response = await fetch(`https://api.coze.cn/open_api/v1/space/published_bots_list?space_id=7386971530301161477`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "pat_NTnZbBqWysOYXlqrXNhfTCDhkALSezgXv2aRC90S5bdbwidXXh6DKQl0F5M4CdEW",
      },
    })
    
    // Log the list of assistants
    console.log("response", response.body)
    

    // Return the retrieved messages as a JSON response
    return NextResponse.json({ ok: true, data: response.body});
  } catch (error) {
    // Log any errors that occur during the process
    console.error(`Error occurred: ${error}`);
  }
}