import { CompanyProvider } from "../AuthContext/CompanyContext";
import TopNavbar from "./TopNavbar";

const PanelLayout = ({ children }) => (
  <>
   <CompanyProvider>
    <TopNavbar />
    <div className="panel-content">{children}</div>
    </CompanyProvider>
  </>
);
export default PanelLayout;