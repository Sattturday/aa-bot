import { Router } from 'express';
import { authMiddleware } from './authMiddleware';
import { validateAuth } from './authController';
import * as groups from './groupsController';
import * as messages from './messagesController';
import * as urls from './urlsController';
import * as settings from './settingsController';
import * as admins from './adminsController';
import * as users from './usersController';

const router = Router();

// Public endpoints (no auth)
router.post('/auth/validate', validateAuth);
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// All routes below require auth
router.use(authMiddleware);

// Groups
router.get('/groups', groups.listGroups);
router.get('/groups/:id', groups.getGroup);
router.post('/groups', groups.createGroup);
router.put('/groups/:id', groups.updateGroup);
router.delete('/groups/:id', groups.deleteGroup);
router.put('/groups/:id/schedules', groups.replaceSchedules);

// Messages
router.get('/messages', messages.listMessages);
router.put('/messages/:key', messages.updateMessage);

// URLs
router.get('/urls', urls.listUrls);
router.put('/urls/:key', urls.updateUrl);

// Settings
router.get('/settings', settings.listSettings);
router.put('/settings/:key', settings.updateSetting);

// Admins
router.get('/admins', admins.listAdmins);
router.post('/admins', admins.addAdmin);
router.delete('/admins/:telegram_id', admins.removeAdmin);

// Users & Stats
router.get('/users', users.listUsers);
router.get('/users/:telegram_id/actions', users.getUserActions);
router.get('/stats', users.getStats);

export default router;
