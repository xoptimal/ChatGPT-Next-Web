
require("../polyfill");

import { useEffect, useState } from "react";

import styles from "./home.module.scss";

import BotIcon from "../icons/bot.svg";
import LoadingIcon from "../icons/three-dots.svg";

import dynamic from "next/dynamic";
import { ModelProvider, Path, SlotID } from "../constant";
import { ErrorBoundary } from "./error";

import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { ClientApi } from "../client/api";
import { useAppConfig } from "../store/config";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={styles["loading-content"] + " no-dark"}>
      {!props.noLogo && <BotIcon />}
      <LoadingIcon />
    </div>
  );
}

const CozeChat = dynamic(async () => (await import("./coze-chat")).CozeChat, {
  loading: () => <Loading noLogo />,
});

const CozeBots = dynamic(async () => (await import("./coze-bots")).CozeBots, {
  loading: () => <Loading noLogo />,
});

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

function Screen() {
  return (
    <div className={styles["window-content"]} id={SlotID.AppBody}>
      <Routes>
        <Route path={Path.Home} element={<CozeBots />} />
        <Route path={Path.COZE} element={<CozeChat />} />
      </Routes>
    </div>
  );
}

export function useLoadData() {
  const config = useAppConfig();

  var api: ClientApi = new ClientApi(ModelProvider.COZE);

  useEffect(() => {
    (async () => {
      const models = await api.llm.models();
      config.mergeModels(models);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function Home(props: any) {
  useLoadData();

  if (!useHasHydrated()) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Screen />
      </Router>
    </ErrorBoundary>
  );
}
