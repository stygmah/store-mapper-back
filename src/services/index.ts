import userRoutes from "./users/routes";
import establishmentsMapRoutes from "./establishmentsMap/routes";
import establishmentsRoutes from "./establishments/routes";
import themesRoutes from "./mapThemes/routes";
import fileTransferRoutes from "./fileTransfer/routes";

export default [
    ...userRoutes, 
    ...establishmentsMapRoutes, 
    ...establishmentsRoutes, 
    ...themesRoutes,
    ...fileTransferRoutes
];