import { useFlowGroInit } from "hooks/useFlowGroInit";
import type { ComponentType } from "react";

const withFlowGroInit = <P extends object>(Component: ComponentType<P>) => {
  return (props: P) => {
    useFlowGroInit();
    return <Component {...props} />;
  };
};

export default withFlowGroInit;
