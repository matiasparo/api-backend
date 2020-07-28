import { Router } from 'express';
import { routerUserApi } from '../components/users';
import { ensureAuthenticated } from '@components/users/middleware/auth';
// import { alertsApiRouter } from '@components/alerts';
// import { routerWebPageApi, routerTourApi, productApiRouter } from '@components/business';
// import { productStatusApiRouter } from '@components/status';
// import { periodsApiRouter } from '@components/periods/api/period-api.routing';
// import { downloadsApiRouter } from '@components/downloads/api/downloads-api.routing';

const router = Router();
const apiBaseUrl = '/api/v1';

/** RUTAS API_V1 */
// router.use(`${apiBaseUrl}/periods`, periodsApiRouter);
// router.use(`${apiBaseUrl}/downloads`, ensureAuthenticated, downloadsApiRouter);
router.use(`${apiBaseUrl}/user`, routerUserApi);
// router.use(`${apiBaseUrl}/status`, ensureAuthenticated, productStatusApiRouter);

export default router;
