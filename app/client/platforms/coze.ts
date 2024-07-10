import { COZE, REQUEST_TIMEOUT_MS } from "@/app/constant";
import { useCozeStore } from "@/app/store/coze";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@fortaine/fetch-event-source";
import { ChatOptions, getHeaders, LLMApi, LLMModel, LLMUsage } from "../api";

export class COZEApi implements LLMApi {
  extractMessage(res: any) {
    console.log("[Response] COZEApi response: ", res);

    return (
      res?.candidates?.at(0)?.content?.parts.at(0)?.text ||
      res?.error?.message ||
      ""
    );
  }
  async chat(options: ChatOptions) {
    const messages = options.messages.map((v) => ({
      role: v.role,
      content: v.content,
    }));

    const session = useCozeStore.getState().currentSession();

    const chat_history = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      content_type: "text",
    }));

    const requestPayload = {
      query: options.msg,
      conversation_id: session.id,
      user: options.user?.username,
      bot_id: session.id,
      stream: options.config.stream,
      chat_history,
      custom_variables: {
        bot_name: "小恩",
      },
    };

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
      console.log("shouldStream", shouldStream);

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

        let goingMessage = false;

        fetchEventSource(chatPath, {
          ...chatPayload,
          async onopen(res) {
            clearTimeout(requestTimeoutId);
            const contentType = res.headers.get("content-type");

            if (contentType?.startsWith("text/plain")) {
              responseText = await res.clone().text();
              return finish();
            }
          },
          onmessage(msg) {
            if (!goingMessage) goingMessage = true;

            const response = JSON.parse(msg.data);

            if (response.event === "done") {
              return finish();
            }
            const message = response.message;
            try {
              if (message.type === "answer") {
                const delta = message.content;
                if (delta) {
                  remainText = remainText + delta;
                }
              } else if (message.type === "follow_up") {
                prompts.push(message.content);
              }
            } catch (e) {
              console.error("[Request] parse error", msg.data);
            }
          },
          async onclose() {
            if (!goingMessage) {
              const e = new Error("系统异常, 请稍后重试");
              options.onError?.(e);
            } else {
              goingMessage = false;
            }
            finish();
          },
          onerror(e) {
            options.onError?.(e);
            throw e;
          },
          openWhenHidden: true,
        });
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
