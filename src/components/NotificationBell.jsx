import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { notificationApi } from '../services/api';
import { enablePushNotifications } from '../services/firebase';
export default function NotificationBell() {
  const [items, setItems] = useState([]); const [open, setOpen] = useState(false);
  const load = () => notificationApi.list().then(setItems).catch(() => {});
  useEffect(() => { load(); const timer = setInterval(load, 30000); return () => clearInterval(timer); }, []);
  const unread = items.filter((item) => !item.readAt).length;
  const markRead = async (item) => { if (!item.readAt) { await notificationApi.read(item._id); setItems(items.map((x) => x._id === item._id ? { ...x, readAt: new Date().toISOString() } : x)); } };
  const enablePush = async () => { try { await enablePushNotifications(() => load()); } catch { /* Notification history remains available if push setup is incomplete. */ } };
  return <div className="notification-bell"><button className="btn-icon" onClick={() => { setOpen(!open); enablePush(); }} aria-label="Notifications"><Bell size={19} />{unread > 0 && <span className="notification-count">{unread}</span>}</button>{open && <div className="notification-menu"><div className="notification-title">Notifications <CheckCheck size={16} /></div>{items.length ? items.map((item) => <button key={item._id} className={`notification-item ${item.readAt ? '' : 'unread'}`} onClick={() => markRead(item)}><b>{item.title}</b><span>{item.body}</span><small>{new Date(item.createdAt).toLocaleString()}</small></button>) : <p className="notification-empty">No notifications yet.</p>}</div>}</div>;
}
