import withLayout from "layout/withLayout";
import {
  FlowGroAllProcessReport,
  FlowGroCamundaUser,
  FlowGroDeployment,
  FlowGroFlowExecution,
  FlowGroModeller,
  FlowGroMyTasks,
  FlowGroProcessCockpit,
  FlowGroUserReport,
} from "pages/flowgro";

interface MenuRoute {
  path: string;
  name: string;
  element: ReturnType<typeof withLayout>;
}

const MENU_ROUTES: MenuRoute[] = [
  {
    element: withLayout(<FlowGroModeller />),
    name: "FlowGro Modeller",
    path: "/flowgro/flowDesign",
  },
  {
    element: withLayout(<FlowGroDeployment />),
    name: "FlowGro Deployment",
    path: "/flowgro/deployment",
  },
  {
    element: withLayout(<FlowGroProcessCockpit />),
    name: "FlowGro Process Cockpit",
    path: "/flowgro/process-cockpit",
  },
  {
    element: withLayout(<FlowGroMyTasks />),
    name: "FlowGro My Tasks",
    path: "/flowgro/my-tasks",
  },
  {
    element: withLayout(<FlowGroFlowExecution />),
    name: "FlowGro Flow Execution",
    path: "/flowgro/flow-execution",
  },
  {
    element: withLayout(<FlowGroCamundaUser />),
    name: "FlowGro Camunda Users",
    path: "/flowgro/camunda-user",
  },
  {
    element: withLayout(<FlowGroAllProcessReport />),
    name: "FlowGro All Process Report",
    path: "/flowgro/all-process-report",
  },
  {
    element: withLayout(<FlowGroUserReport />),
    name: "FlowGro User Report",
    path: "/flowgro/user-report",
  },
];

export default MENU_ROUTES;
