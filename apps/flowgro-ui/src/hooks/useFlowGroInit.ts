import { initializeConfig } from "@shared/flowgro-ui";
import { useAuth } from "auth/useAuth";
import { UserInfoContext } from "context/userInfoContext";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const useFlowGroInit = () => {
  const { i18n } = useTranslation();
  const { userInfo } = useContext(UserInfoContext);
  const { keycloak } = useAuth();

  useEffect(() => {
    const username = (userInfo as { username?: string }).username;
    const token = keycloak.token;
    if (!(username && token)) {
      return;
    }
    const configBaseUrl = `${window.API_BASE_URL}/flowgro`;
    try {
      initializeConfig(configBaseUrl, i18n.language, username, token);
    } catch (error) {
      console.error("Error initializing FlowGro:", error);
    }
  }, [i18n.language, userInfo, keycloak.token]);
};
