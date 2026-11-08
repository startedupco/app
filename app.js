// ========== USER DATA ==========
var currentUserData = null;
var currentUserUID = null;

function getUserData() { return currentUserData; }

// Full name without doubling the surname: register stores the whole "Name/s"
// input in `name`, so `name` often already ends with `surname`.
function displayNameOf(d) {
    d = d || {};
    var n = String(d.name || '').trim();
    var s = String(d.surname || '').trim();
    if (!s) return n;
    var lowN = n.toLowerCase(), lowS = s.toLowerCase();
    if (lowN === lowS || lowN.slice(-(lowS.length + 1)) === ' ' + lowS) return n;
    return (n + ' ' + s).trim();
}

function clearUserData() {
    currentUserData = null;
    currentUserUID = null;
    invalidateCache();
}

function toInt(v) { var n = parseInt(v); return isNaN(n) ? 0 : n; }

function saveUserData(data) {
    currentUserData = data;
    var uid = currentUserUID;
    if (!uid) {
        console.warn('saveUserData: no uid set');
        return Promise.resolve();
    }

    if (typeof db === 'undefined' || !db) {
        console.warn('Database not available.');
        return Promise.reject(new Error('Database not ready'));
    }

    var doc = {};

    // Identity and privilege columns (email, role, status, plan) are owned by
    // auth/admin: the users_guard_privileges trigger discards client attempts.
    doc.name = data.name || '';
    doc.middleName = data.middleName || '';
    doc.surname = data.surname || '';
    doc.title = data.title || '';
    doc.phone = data.phone || '';

    if (data.onboardingComplete !== undefined) doc.onboardingComplete = data.onboardingComplete;
    if (data.avatarSeed !== undefined) doc.avatarSeed = data.avatarSeed;
    if (data.avatarStyle !== undefined) doc.avatarStyle = data.avatarStyle;
    // Device-free preferences - stored on the users row, cached only in memory.
    if (data.theme !== undefined) doc.theme = data.theme === 'dark' ? 'dark' : 'light';
    if (data.pushEnabled !== undefined) doc.pushEnabled = data.pushEnabled === true;
    if (data.pushSeenAt !== undefined) doc.pushSeenAt = toInt(data.pushSeenAt);
    if (data.assistantEnabled !== undefined) doc.assistantEnabled = data.assistantEnabled !== false;
    if (data.lastAiCheck !== undefined) doc.lastAiCheck = toInt(data.lastAiCheck);
    if (data.avatarSalt !== undefined) doc.avatarSalt = toInt(data.avatarSalt);
    if (data.docsReady !== undefined) doc.docsReady = data.docsReady;
    // Matches cache: rewritten by qualify.html, cleared when marks change.
    if (data.qualifyMarks !== undefined) doc.qualifyMarks = data.qualifyMarks;
    if (data.qualifyCourses !== undefined) doc.qualifyCourses = data.qualifyCourses;
    if (data.qualifyAps !== undefined) doc.qualifyAps = toInt(data.qualifyAps);
    // Onboarding extras (study preferences) - preserved so portal saves never drop them
    if (data.studyTypes !== undefined) doc.studyTypes = data.studyTypes;
    if (data.fieldOfInterest !== undefined) doc.fieldOfInterest = data.fieldOfInterest;
    if (data.needsNsfas !== undefined) doc.needsNsfas = data.needsNsfas;
    if (data.totalAps !== undefined) doc.totalAps = toInt(data.totalAps);
    if (data.avatar) doc.avatar = data.avatar;
    doc.currentStatus = data.currentStatus || '';
    doc.disability = data.disability || '';
    doc.homeLanguage = data.homeLanguage || '';
    doc.additionalLanguage = data.additionalLanguage || '';

    // Address
    doc.province = data.province || '';
    doc.city = data.city || '';
    doc.street = data.street || '';
    doc.suburb = data.suburb || '';
    doc.postalCode = data.postalCode || '';

    // Personal
    doc.gender = data.gender || '';
    doc.dob = data.dob || '';
    doc.idNumber = data.idNumber || '';
    doc.populationGroup = data.populationGroup || '';

    // Next of Kin
    doc.nokFirstName = data.nokFirstName || '';
    doc.nokLastName = data.nokLastName || '';
    doc.nokTitle = data.nokTitle || '';
    doc.nokRelationship = data.nokRelationship || '';
    doc.nokIdNumber = data.nokIdNumber || '';
    doc.nokPhone = data.nokPhone || '';
    doc.nokEmail = data.nokEmail || '';
    doc.nokMaritalStatus = data.nokMaritalStatus || '';
    doc.nokEmployment = data.nokEmployment || '';
    doc.nokEmployer = data.nokEmployer || '';
    doc.nokJobTitle = data.nokJobTitle || '';

    // Education
    doc.school = data.school || '';
    doc.grade = toInt(data.grade);
    doc.startYear = toInt(data.startYear);
    doc.completedYear = toInt(data.completedYear);
    doc.isUpgrading = data.isUpgrading === true;
    doc.isRewriting = data.isRewriting === true;

    // Marks
    doc.marks = data.marks && data.marks.length ? data.marks.map(function(s) {
        return { name: (s.name || '').trim(), percent: toInt(s.percent), level: toInt(s.level) };
    }) : [];

    // Documents are stored in the dedicated 'documents' table (see portal.html),
    // not on the users row - uploading/removal is handled there.
    void data.documents;

    // Qualifications
    doc.qualifications = data.qualifications && data.qualifications.length ? data.qualifications.map(function(q) {
        return { name: q.name || '', institution: q.institution || '', startedYear: toInt(q.startedYear), completedYear: toInt(q.completedYear) };
    }) : [];

    // Institution accounts are mirrored on the users row too (the dedicated
    // 'institution_accounts' table remains the source of truth for agents).
    doc.accounts = data.accounts || [];

    // NSFAS Cycle
    doc.nsfasCycle = data.nsfasCycle || '';

    // Bursaries
    doc.bursaries = data.bursaries || {};

    // Generate full_name from name + middleName + surname (no doubled surname)
    doc.full_name = displayNameOf({ name: ((doc.name || '') + ' ' + (doc.middleName || '')).trim(), surname: doc.surname });

    console.log('[] Saving to Supabase:', doc);

    // Save the data with merge (upsert). If the users table is missing a
    // column the app writes (e.g. avatarSeed/avatarStyle before the table is
    // migrated), PostgREST rejects the whole row ("Could not find the 'X'
    // column ... in the schema cache"). Strip ONLY the named column and retry,
    // so every other field - including avatarSeed when just avatarStyle is
    // missing - still saves. To enable full avatar sync, run once in the
    // Supabase dashboard SQL Editor:
    //   ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "avatarSeed" TEXT DEFAULT '';
    //   ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "avatarStyle" TEXT DEFAULT '';
    function doSave(payload) {
        return db.collection('users').doc(uid).set(payload, { merge: true });
    }
    var _attempt = 0;
    function trySave(payload) {
        return doSave(payload).catch(function(e) {
            var msg = (e && e.message) || String(e || '');
            var m = msg.match(/Could not find the '([^']+)' column/);
            var missing = m ? m[1] : null;
            // Keep stripping (register/onboarding once wrote onboarding, onboarded,
            // docsReady, studyTypes, fieldOfInterest, needsNsfas, totalAps, avatarStyle)
            // so one stale key can never fail the whole profile save.
            if (missing && payload[missing] !== undefined && _attempt < 12) {
                _attempt++;
                console.warn('saveUserData: column "' + missing + '" missing, retrying without it.');
                var retry = Object.assign({}, payload);
                delete retry[missing];
                return trySave(retry);
            }
            console.warn('saveUserData error:', e);
            var msg3 = 'Failed to save profile: ' + msg;
            if (typeof showCustomPopup === 'function') showCustomPopup(msg3, 'Save Error', 'error');
            return null;
        });
    }
    return trySave(doc);
}

function toast(m, t) {
    t = t || 'info';
    var c = document.getElementById('toastContainer');
    if (!c) {
        c = document.createElement('div');
        c.id = 'toastContainer';
        document.body.appendChild(c);
    }
    // Bottom-center toaster (always enforce positioning, even if the container already exists)
    c.style.cssText = 'position:fixed;bottom:1.25rem;left:50%;transform:translateX(-50%);z-index:99999;display:flex;flex-direction:column;align-items:center;gap:0.5rem;width:100%;max-width:min(92vw,440px);pointer-events:none;';
    if (!window.__toastKeyframes) {
        var s = document.createElement('style');
        s.textContent = '@keyframes toastUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}';
        document.head.appendChild(s);
        window.__toastKeyframes = true;
    }
    var d = document.createElement('div');
    d.style.cssText = 'pointer-events:auto;padding:0.75rem 1.5rem;border-radius:999px;color:#fff;font-size:14px;font-weight:500;line-height:1.4;text-align:center;max-width:100%;box-shadow:0 6px 20px rgba(0,0,0,0.18);animation:toastUp 0.25s ease;';
    if (t === 'success') d.style.background = '#16a34a';
    else if (t === 'error') d.style.background = '#ef4444';
    else if (t === 'warning') d.style.background = '#d97706';
    else d.style.background = '#374151';
    d.textContent = m;
    c.appendChild(d);
    setTimeout(function() { d.style.opacity = '0'; d.style.transition = 'opacity 0.3s'; setTimeout(function() { if (d.parentNode) d.remove(); }, 300); }, 4000);
}

function enhanceWithGemini(subject, currentMessage) {
    var prompt = 'You are a helpful admissions assistant. Improve the following message to be professional, clear, and friendly. Keep it concise (max 3 paragraphs).';
    if (subject) prompt += '\nSubject: ' + subject;
    if (currentMessage) prompt += '\nDraft message: ' + currentMessage;
    if (!currentMessage && subject) prompt += '\nPlease write a professional message about: ' + subject;
    return fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'gemini-3.5-flash',
            payload: {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 1024, temperature: 0.7, thinkingConfig: { thinkingBudget: 0 } }
            }
        })
    }).then(function(r) {
        if (!r.ok) return r.json().then(function(e) { throw new Error(e.error && e.error.message ? e.error.message : 'API error ' + r.status); });
        return r.json();
    }).then(function(data) {
        return (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts ? data.candidates[0].content.parts.map(function(p){return p.text;}).join('') : '') || '';
    });
}

function logActivity(action, details, extra) {
    if (!db) return Promise.resolve();
    var uid = currentUserUID || 'unknown';
    var d = getUserData();
    var name = ((d ? d.name : '') || '') + ' ' + ((d ? d.surname : '') || '').trim() || 'Unknown';
    var role = d ? (d.role || 'user') : 'user';
    var entry = {
        action: action, details: details || '', page: (extra && extra.page) || '',
        createdAt: Date.now(),
        userAgent: (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '',
        userName: name, userRole: role, userUid: uid
    };
    if (extra) Object.assign(entry, extra);
    return db.collection('activity_logs').add(entry).catch(function(e) { console.warn('logActivity error:', e); });
}

function getUserApplications(uid) {
    return db.collection('applications').where('userId', '==', uid).get().then(function(result) {
        var apps = [];
        result.forEach(function(doc) { var a = doc.data(); a.docId = doc.id; apps.push(a); });
        return apps;
    }).catch(function(e) { 
        console.warn('getUserApplications error:', e); 
        return []; 
    });
}

function getUserDocuments(uid) {
    return db.collection('documents').where('userId', '==', uid).get().then(function(result) {
        var docs = [];
        result.forEach(function(doc) { var d = doc.data(); d.docId = doc.id; d.type = canonicalDocType(d.type); docs.push(d); });
        return docs;
    }).catch(function(e) { 
        console.warn('getUserDocuments error:', e); 
        return []; 
    });
}

function getUserNotifications(uid) {
    return db.collection('notifications').where('userId', '==', uid).get().then(function(result) {
        var notifs = [];
        result.forEach(function(doc) { notifs.push(doc.data()); });
        return notifs;
    }).catch(function(e) { 
        console.warn('getUserNotifications error:', e); 
        return []; 
    });
}

function reloadUserData(uid) {
    currentUserUID = uid;
    if (typeof db === 'undefined' || !db) {
        console.warn('Database not initialised.');
        return Promise.resolve({});
    }

    return db.collection('users').doc(uid).get().then(function(doc) {
        var profile = doc.exists ? doc.data() : {};
        console.log('[] Loaded from Supabase:', profile);
        if (!doc.exists || !profile.role) {
            // Rebuild a missing profile from the auth record (user_metadata
            // carries registration fields like phone even when the original
            // signup-time insert was blocked by RLS).
            var authUser = (typeof auth !== 'undefined' && auth.currentUser) || null;
            var meta = (authUser && authUser.user_metadata) || {};
            profile = {
                id: uid,
                email: (authUser ? authUser.email : '') || profile.email || '',
                role: profile.role || 'applicant',
                status: profile.status || 'active',
                name: profile.name || meta.name || meta.firstName || '',
                middleName: profile.middleName || meta.middle_name || '',
                surname: profile.surname || meta.surname || meta.lastName || ''
            };
            if (!profile.phone && meta.phone) profile.phone = meta.phone;
            db.collection('users').doc(uid).set(profile, { merge: true }).catch(function(e) { 
                console.warn('[] Failed to create/fix profile:', e);
                // If upsert fails (409 conflict), try fetching existing profile
                db.collection('users').doc(uid).get().then(function(d) {
                    if (d.exists) { currentUserData = d.data(); }
                });
            });
        }

        currentUserData = profile;
        profile.applications = [];
        profile.notifications = [];
        profile.documents = [];
        profile.institutionAccounts = profile.accounts || [];

        // Wait for all related data to load before resolving
        return Promise.all([
            getUserApplications(uid).catch(function() { return []; }),
            getUserNotifications(uid).catch(function() { return []; }),
            getUserDocuments(uid).catch(function() { return []; }),
            db.collection('institution_accounts').where('userId', '==', uid).get().then(function(snap) {
                var accts = [];
                snap.forEach(function(d) {
                    var a = d.data();
                    accts.push({ institution: a.institution || '', studentNumber: a.studentNumber || '', pin: a.pin || a.password || '' });
                });
                return accts;
            }).catch(function() { return []; })
        ]).then(function(results) {
            profile.applications = results[0] || [];
            profile.notifications = results[1] || [];
            profile.documents = results[2] || [];
            // Merge institution_accounts table data with any legacy accounts from users table
            var dbAccounts = results[3] || [];
            if (dbAccounts.length > 0) {
                profile.institutionAccounts = dbAccounts;
            }
            if (typeof renderApplications === 'function') renderApplications();
            if (typeof renderNotifications === 'function') renderNotifications();
            if (typeof renderDocuments === 'function') renderDocuments();
            return profile;
        });
    }).catch(function(e) {
        console.warn('reloadUserData error:', e);
        // Mark the placeholder so the portal can show a retry screen instead of
        // mistaking a failed fetch for an incomplete profile.
        currentUserData = { role: 'applicant', applications: [], notifications: [], _loadFailed: true };
        return currentUserData;
    });
}

// ---- Push notification watcher ----
// Polls the notifications collection and raises native browser
// notifications when new ones arrive. Controlled by the users.pushEnabled
// switch in Settings -> Preferences (permission must be granted). The seen
// baseline lives in users.pushSeenAt, so it follows the account across devices.
(function () {
    var POLL_MS = 45000;
    var MAX_BATCH = 3;
    var _seenPending = null, _seenSaving = false;

    function userRow() {
        return (typeof getUserData === 'function' && getUserData()) || {};
    }

    function pushEnabled() {
        return userRow().pushEnabled !== false;
    }

    function flushSeen() {
        if (_seenPending == null) return;
        if (!currentUserUID || typeof db === 'undefined' || !db.collection) return;
        var ts = _seenPending;
        _seenPending = null;
        _seenSaving = true;
        db.collection('users').doc(currentUserUID).set({ pushSeenAt: ts }, { merge: true })
            .catch(function () {})
            .then(function () {
                _seenSaving = false;
                if (_seenPending != null) flushSeen();
            });
    }

    function saveSeen(ts) {
        var d = (typeof getUserData === 'function') ? getUserData() : null;
        if (d) d.pushSeenAt = ts;
        _seenPending = ts;
        if (!_seenSaving) flushSeen();
    }

    function tsOf(n) {
        return Number(n && (n.createdAt || n.date || n.time)) || 0;
    }

    function fireNotification(n) {
        try {
            var title = n.title || 'Collanduni';
            var body = String(n.message || '').replace(/\s+/g, ' ').trim().slice(0, 140);
            var nt = new Notification(title, {
                body: body,
                tag: 'cd-notif-' + tsOf(n),
                icon: 'favicon.svg'
            });
            nt.onclick = function () {
                try { window.focus(); } catch (e) {}
                try {
                    if (typeof showSection === 'function') showSection('notifications');
                    if (typeof renderNotifications === 'function') renderNotifications();
                } catch (e) {}
                this.close();
            };
        } catch (e) {}
    }

    function check() {
        try {
            if (!currentUserUID || typeof db === 'undefined' || !db.collection) return;
            if (typeof Notification === 'undefined') return;
            db.collection('notifications').where('userId', '==', currentUserUID).get().then(function (snap) {
                var items = [];
                snap.forEach(function (d) { items.push(d.data()); });
                if (!items.length) return;
                items.sort(function (a, b) { return tsOf(b) - tsOf(a); });
                var newest = tsOf(items[0]);
                var lastSeen = Number(userRow().pushSeenAt || 0);
                if (!lastSeen) {
                    // First run for this user: baseline silently, never dump history
                    saveSeen(newest);
                    return;
                }
                if (newest <= lastSeen) return;
                saveSeen(newest);
                var fresh = items.filter(function (n) { return tsOf(n) > lastSeen; });
                fresh.sort(function (a, b) { return tsOf(a) - tsOf(b); });
                if (pushEnabled() && Notification.permission === 'granted') {
                    fresh.slice(-MAX_BATCH).forEach(fireNotification);
                }
                // Refresh UI even if system notifications are off
                if (typeof renderNotifications === 'function') renderNotifications();
            }).catch(function () {});
        } catch (e) {}
    }

    setInterval(check, POLL_MS);
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') check();
    });
    window.checkNewNotifications = check;
})();
