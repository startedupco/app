// logger.js - Unified logging system
(function(global) {
    'use strict';

    var LOG_TYPES = {
        ACTIVITY: 'activity',
        AUDIT: 'audit',
        AUTH: 'auth',
        APPLICATION: 'application',
        PAYMENT: 'payment',
        ERROR: 'error',
        NOTIFICATION: 'notification',
        SECURITY: 'security'
    };

    var SEVERITY = {
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'error',
        CRITICAL: 'critical'
    };

    function getDb() {
        return global.db || null;
    }

    function getUserId() {
        return global.currentUserUID || null;
    }

    function getUserAgent() {
        try { return navigator.userAgent || ''; } catch(e) { return ''; }
    }

    /**
     * Core log function
     * @param {string} type - Log type (activity, audit, auth, application, payment, error, notification, security)
     * @param {string} action - What happened (login, create, update, delete, etc.)
     * @param {object} options - { userId, targetId, targetTable, details, severity }
     */
    function log(type, action, options) {
        options = options || {};
        var db = getDb();
        if (!db) {
            console.warn('[Logger] Database not available');
            return Promise.resolve();
        }

        var entry = {
            action: type + ':' + action,
            type: type,
            details: JSON.stringify(options.details || {}),
            userId: options.userId || getUserId(),
            severity: options.severity || SEVERITY.INFO,
            targetTable: options.targetTable || '',
            targetId: options.targetId || '',
            page: options.page || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : ''),
            userName: options.userName || '',
            userRole: options.userRole || '',
            userUid: options.userUid || '',
            userAgent: options.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
            createdAt: new Date().toISOString()
        };

        var consoleMethod = entry.severity === 'error' || entry.severity === 'critical' ? 'error' 
            : entry.severity === 'warning' ? 'warn' : 'log';
        console[consoleMethod]('[' + type.toUpperCase() + ']', action, options.details || {});

        return db.collection('activity_logs').add(entry).catch(function(e) {
            console.warn('[Logger] Failed to write log:', e);
        });
    }

    // ========== Convenience Methods ==========

    // Activity Logs - user actions
    function logActivity(action, details, options) {
        return log(LOG_TYPES.ACTIVITY, action, Object.assign({ details: details || {} }, options));
    }

    // Audit Logs - admin/agent actions on data
    function logAudit(action, details, options) {
        return log(LOG_TYPES.AUDIT, action, Object.assign({ 
            details: details || {},
            severity: SEVERITY.INFO 
        }, options));
    }

    // Authentication Logs - login, logout, signup, password reset
    function logAuth(action, details, options) {
        return log(LOG_TYPES.AUTH, action, Object.assign({ 
            details: details || {},
            severity: action === 'login_failed' || action === 'signup_failed' ? SEVERITY.WARNING : SEVERITY.INFO
        }, options));
    }

    // Application Logs - application lifecycle
    function logApplication(action, details, options) {
        return log(LOG_TYPES.APPLICATION, action, Object.assign({ 
            details: details || {},
            targetTable: 'applications'
        }, options));
    }

    // Payment Logs - payment events
    function logPayment(action, details, options) {
        return log(LOG_TYPES.PAYMENT, action, Object.assign({ 
            details: details || {},
            targetTable: 'payments',
            severity: action === 'payment_failed' ? SEVERITY.ERROR : SEVERITY.INFO
        }, options));
    }

    // Error Logs - system errors
    function logError(action, details, options) {
        return log(LOG_TYPES.ERROR, action, Object.assign({ 
            details: details || {},
            severity: SEVERITY.ERROR
        }, options));
    }

    // Notification Logs - notifications sent
    function logNotification(action, details, options) {
        return log(LOG_TYPES.NOTIFICATION, action, Object.assign({ 
            details: details || {},
            targetTable: 'notifications'
        }, options));
    }

    // Security Logs - suspicious activity
    function logSecurity(action, details, options) {
        return log(LOG_TYPES.SECURITY, action, Object.assign({ 
            details: details || {},
            severity: SEVERITY.WARNING
        }, options));
    }

    // ========== Fetch Logs ==========
    function getLogs(filters) {
        filters = filters || {};
        var db = getDb();
        if (!db) return Promise.resolve([]);

        var query = db.collection('activity_logs');
        if (filters.userId) query = query.where('userId', '==', filters.userId);
        if (filters.type) {
            // Filter by type prefix in the action field (stored as "type:action")
            query = query.where('type', '==', filters.type);
        }
        query = query.orderBy('createdAt', 'desc');
        if (filters.limit) query = query.limit(filters.limit);

        return query.get().then(function(result) {
            var logs = [];
            result.forEach(function(doc) {
                var d = doc.data();
                d.id = doc.id;
                // Parse details back from JSON string if needed
                if (typeof d.details === 'string') {
                    try { d.details = JSON.parse(d.details); } catch(e) {}
                }
                // Extract clean action without type prefix for display
                if (d.action && d.action.indexOf(':') > 0) {
                    d.cleanAction = d.action.split(':').slice(1).join(':');
                } else {
                    d.cleanAction = d.action;
                }
                logs.push(d);
            });
            return logs;
        }).catch(function(e) {
            console.warn('[Logger] Failed to fetch logs:', e);
            return [];
        });
    }

    // ========== Expose Globals ==========
    global.LOG_TYPES = LOG_TYPES;
    global.SEVERITY = SEVERITY;
    global.log = log;
    global.logActivity = logActivity;
    global.logAudit = logAudit;
    global.logAuth = logAuth;
    global.logApplication = logApplication;
    global.logPayment = logPayment;
    global.logError = logError;
    global.logNotification = logNotification;
    global.logSecurity = logSecurity;
    global.getLogs = getLogs;

})(window);
