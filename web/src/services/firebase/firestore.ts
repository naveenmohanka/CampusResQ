import { collection } from 'firebase/firestore';
import { db } from './config';

export const getUsersCollection = () => db ? collection(db, 'users') : null;
export const getIncidentsCollection = () => db ? collection(db, 'incidents') : null;
export const getActivityLogsCollection = () => db ? collection(db, 'activityLogs') : null;
