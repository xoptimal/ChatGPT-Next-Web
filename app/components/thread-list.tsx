import BrainIcon from "@/app/icons/brain.svg";
import { listAssistants } from "@/app/services/api";
import { useAssistantStore } from "@/app/store/assistant";
import { useEffect } from "react";
import styles from "./home.module.scss";

export interface StoredAssistant {
  name: string | null;
  description?: string | null;
  instructions?: string | null;
  id: string | null;
  threadId?: string | null;
}

export interface LocalStoredAssistant {
  assistantName?: string | null;
  assistantDescription?: string | null;
  assistantId: string | null;
  threadId?: string | null;
}

interface AssistantListProps {
  narrow?: boolean;
  selectedIndex: number;
  onClick: (assistant: StoredAssistant, index: number) => void;
  clickAssistant: boolean;
  init: (has: boolean) => void;
}

export default function ThreadList(props: AssistantListProps) {
  const assistantStore = useAssistantStore();
  const maxInitialFetchedAssistants = 100;

  async function fetchInitialAssistantList() {
    try {
      const res = await listAssistants(maxInitialFetchedAssistants);
      //  添加到Store
      assistantStore.setSessions(res.assistants);
      //  通知
      props.init(res.assistants.length > 0);
    } catch (e) {
      console.log("e", e);
    }
  }

  useEffect(() => {
    fetchInitialAssistantList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {assistantStore.sessions.map((assistant, index) => (
        <div
          key={assistant.id}
          className={`${styles["chat-item"]} ${
            props.clickAssistant &&
            props.selectedIndex == index &&
            styles["chat-item-selected"]
          }`}
          onClickCapture={() => {
            props.onClick(assistant, index);
          }}
        >
          {props.narrow ? (
            <div className={styles["chat-item-narrow"]}>
              <div className={styles["chat-item-avatar"] + " no-dark"}>
                <BrainIcon />
              </div>
            </div>
          ) : (
            <>
              <div className={styles["chat-item-title"]}>{assistant.name}</div>
              {/*  <div className={styles["chat-item-info"]}>
                                {assistant.instructions}
                            </div>*/}
              {/* <div
                                className={`${styles["chat-item-button"]} ${styles2["icon-button"]}`}
                                onClickCapture={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                <ConnectionIcon/>
                            </div>*/}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
