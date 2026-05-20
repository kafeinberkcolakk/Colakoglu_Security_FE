import {
  AllProcessReport,
  CamundaUser,
  Deployment,
  FlowExecution,
  ModelerProvider,
  Modeller,
  MyTasks,
  ProcessCockpit,
  TaskDetail,
  UserReport,
} from "@shared/flowgro-ui";
import "@shared/flowgro-ui/dist/index.css";
import withFlowGroInit from "pages/flowgro/components/withFlowGroInit";

const FlowGroDeployment = withFlowGroInit(() => <Deployment />);

const FlowGroModeller = withFlowGroInit(() => (
  <ModelerProvider>
    <Modeller />
  </ModelerProvider>
));

const FlowGroMyTasks = withFlowGroInit(() => <MyTasks />);

interface FlowGroTaskDetailsProps {
  backUrl: string;
  selectedTask: unknown;
}

const FlowGroTaskDetails = withFlowGroInit(
  ({ backUrl, selectedTask }: FlowGroTaskDetailsProps) => (
    <TaskDetail backUrl={backUrl} selectedTask={selectedTask} />
  ),
);

const FlowGroProcessCockpit = withFlowGroInit(() => (
  <ProcessCockpit businessKey="flowgro" />
));

const FlowGroCamundaUser = withFlowGroInit(() => <CamundaUser />);

const FlowGroAllProcessReport = withFlowGroInit(() => <AllProcessReport />);

const FlowGroUserReport = withFlowGroInit(() => <UserReport />);

const FlowGroFlowExecution = withFlowGroInit(() => <FlowExecution />);

export {
  FlowGroAllProcessReport,
  FlowGroCamundaUser,
  FlowGroDeployment,
  FlowGroFlowExecution,
  FlowGroModeller,
  FlowGroMyTasks,
  FlowGroProcessCockpit,
  FlowGroTaskDetails,
  FlowGroUserReport,
};
