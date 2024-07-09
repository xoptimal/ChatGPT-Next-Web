import { COZE, REQUEST_TIMEOUT_MS } from "@/app/constant";
import { useCozeStore } from "@/app/store/coze";
import {
  fetchEventSource
} from "@fortaine/fetch-event-source";
import { ChatOptions, getHeaders, LLMApi, LLMModel, LLMUsage } from "../api";

export class COZEApi implements LLMApi {
  extractMessage(res: any) {
    console.log("[Response] gemini-pro response: ", res);

    return (
      res?.candidates?.at(0)?.content?.parts.at(0)?.text ||
      res?.error?.message ||
      ""
    );
  }
  async chat(options: ChatOptions): Promise<void> {
    // const apiClient = this;
    // const messages = options.messages.map((v) => ({
    //   role: v.role.replace("assistant", "model").replace("system", "user"),
    //   parts: [{ text: v.content }],
    // }));

    // // google requires that role in neighboring messages must not be the same
    // for (let i = 0; i < messages.length - 1; ) {
    //   // Check if current and next item both have the role "model"
    //   if (messages[i].role === messages[i + 1].role) {
    //     // Concatenate the 'parts' of the current and next item
    //     messages[i].parts = messages[i].parts.concat(messages[i + 1].parts);
    //     // Remove the next item
    //     messages.splice(i + 1, 1);
    //   } else {
    //     // Move to the next item
    //     i++;
    //   }
    // }

    // const modelConfig = {
    //   ...useAppConfig.getState().modelConfig,
    //   ...useChatStore.getState().currentSession().mask.modelConfig,
    //   ...{
    //     model: options.config.model,
    //   },
    // };

    const messages = options.messages.map((v) => ({
      role: v.role,
      content: v.content,
    }));

    const session = useCozeStore.getState().currentSession();

    const chat_history = messages.map((msg) => ({
      "role": msg.role ,
      "content": msg.content,
      "content_type":"text"
    }));

    const requestPayload = {
      query: options.msg,
      conversation_id: session.id,
      user: options.user?.username,
      bot_id: session.botId,
      stream: options.config.stream,
      chat_history,
      custom_variables: {
        bot_name: "小恩",
      },
    };

    console.log("[Request] COZE payload: ", requestPayload);

    const shouldStream = !!options.config.stream;
    const controller = new AbortController();
    options.onController?.(controller);

    try {
      const chatPath = this.path(COZE.ChatPath);
      const chatPayload = {
        method: "POST",
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
        headers: getHeaders(),
      };

      console.log("chatPayload", chatPayload);

      // make a fetch request
      const requestTimeoutId = setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS,
      );

      if (shouldStream) {
        let responseText = "";
        let remainText = "";
        let finished = false;
        const prompts: string[] = [];

        // animate response to make it looks smooth
        function animateResponseText() {
          if (finished || controller.signal.aborted) {
            responseText += remainText;
            console.log("[Response Animation] finished");
            return;
          }

          if (remainText.length > 0) {
            const fetchCount = Math.max(1, Math.round(remainText.length / 60));
            const fetchText = remainText.slice(0, fetchCount);
            responseText += fetchText;
            remainText = remainText.slice(fetchCount);
            options.onUpdate?.(responseText, fetchText);
          }

          requestAnimationFrame(animateResponseText);
        }

        // start animaion
        animateResponseText();

        const finish = () => {
          if (!finished) {
            finished = true;
            options.onFinish(responseText + remainText, prompts);
          }
        };

        controller.signal.onabort = finish;

        fetchEventSource(chatPath, {
          ...chatPayload,
          async onopen(res) {
            clearTimeout(requestTimeoutId);
            const contentType = res.headers.get("content-type");
            console.log(
              "[OpenAI] request response content type: ",
              contentType,
            );

            if (contentType?.startsWith("text/plain")) {
              responseText = await res.clone().text();
              return finish();
            }

            // if (
            //   !res.ok ||
            //   !res.headers
            //     .get("content-type")
            //     ?.startsWith(EventStreamContentType) ||
            //   res.status !== 200
            // ) {
            //   const responseTexts = [responseText];
            //   let extraInfo = await res.clone().text();
            //   try {
            //     const resJson = await res.clone().json();
            //     extraInfo = prettyObject(resJson);
            //   } catch {}

            //   if (res.status === 401) {
            //     responseTexts.push(Locale.Error.Unauthorized);
            //   }

            //   if (extraInfo) {
            //     responseTexts.push(extraInfo);
            //   }

            //   responseText = responseTexts.join("\n\n");

            //   console.log('3333333333333333333333333');
            //   return finish();
            // }
          },
          onmessage(msg) {
            const response = JSON.parse(msg.data);

            if (response.event === "done") {
              return finish();
            }
            const message = response.message;
            try {
              if (message.type === "answer") {
                const delta = message.content;

                if (delta) {
                  remainText += delta;
                }
              } else if (message.type === "follow_up") {
                console.log("message.content", message.content);
                prompts.push(message.content);
              }
            } catch (e) {
              console.error("[Request] parse error", msg.data);
            }
          },
          onclose() {
            finish();
          },
          onerror(e) {
            options.onError?.(e);
            throw e;
          },
          openWhenHidden: true,
        });
      } else {
        const res = await fetch(chatPath, chatPayload);
        clearTimeout(requestTimeoutId);

        const resJson = await res.json();

        if (resJson?.promptFeedback?.blockReason) {
          // being blocked
          options.onError?.(
            new Error(
              "Message is being blocked for reason: " +
                resJson.promptFeedback.blockReason,
            ),
          );
        }
        const message = this.extractMessage(resJson);
        options.onFinish(message);
      }
    } catch (e) {
      console.log("[Request] failed to make a chat request", e);
      options.onError?.(e as Error);
    }
  }
  usage(): Promise<LLMUsage> {
    throw new Error("Method not implemented.");
  }
  async models(): Promise<LLMModel[]> {
    return [];
  }
  path(path: string): string {
    return "/api/coze/" + path;
  }
}

function ensureProperEnding(str: string) {
  if (str.startsWith("[") && !str.endsWith("]")) {
    return str + "]";
  }
  return str;
}
