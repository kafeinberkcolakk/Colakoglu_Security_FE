import { ConfigProvider } from "antd";
import enUs from "antd/es/locale/en_US";
import trTr from "antd/es/locale/tr_TR";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes } from "react-router-dom";
import MENU_ROUTES from "routes";

const App = () => {
  const { i18n } = useTranslation();
  const antdLocale = i18n.language === "tr" ? trTr : enUs;

  return (
    <ConfigProvider locale={antdLocale} theme={{ hashed: false }}>
      <Routes>
        {MENU_ROUTES.map((route) => {
          const Element = route.element;
          return (
            <Route element={<Element />} key={route.path} path={route.path} />
          );
        })}
        <Route
          element={<Navigate replace={true} to="/flowgro/flowDesign" />}
          path="*"
        />
      </Routes>
    </ConfigProvider>
  );
};

export default App;
