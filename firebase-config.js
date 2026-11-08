// firebase-config.js - Supabase wrapper (drop-in replacement for Firebase)
(function(global) {
    'use strict';

    const SUPABASE_URL = 'https://dcuphubxkycrreyitnyq.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjdXBodWJ4a3ljcnJleWl0bnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NzUzOTgsImV4cCI6MjEwMTU1MTM5OH0.nPwH9SWGGvfl4CXofLS4yMNxHuFogjpf0MvcDcNUQdg';

    // Initialize Supabase
    var supabaseClient = null;
    try {
        if (window.supabase && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('[] Supabase initialized');
        } else {
            console.error('[] Supabase JS not loaded. Make sure @supabase/supabase-js is included.');
        }
    } catch(e) {
        console.error('[] Supabase init error:', e);
    }

    // ========== Auth ==========
    var _currentUser = null;
    var _authListeners = [];
    var _authReady = false;

    if (supabaseClient) {
        supabaseClient.auth.onAuthStateChange(function(event, session) {
            _currentUser = session ? session.user : null;
            if (_currentUser) {
                var next = sessionFromUser(_currentUser);
                var prev = getSession();
                if (prev && prev.role) next.role = prev.role;
                saveSession(next);
            } else {
                _session = null;
            }
            _authReady = true;
            _authListeners.forEach(function(cb) { try { cb(_currentUser); } catch(e) {} });
        });
    }

    // Session mirror is memory-only. The authoritative session is Supabase's
    // (supabase-js persists its own auth cache); this object only lets pages
    // read uid/email/role synchronously for the life of the current page.
    var SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
    var _session = null;

    function sessionFromUser(user) {
        if (!user) return null;
        var meta = user.user_metadata || {};
        return { uid: user.id, id: user.id, email: user.email || '', role: meta.role || 'applicant' };
    }

    function saveSession(sessionData) {
        _session = Object.assign({}, sessionData, { expiresAt: Date.now() + SESSION_EXPIRY_MS });
    }

    function getSession() {
        if (!_session) return null;
        if (_session.expiresAt && Date.now() > _session.expiresAt) { _session = null; return null; }
        return _session;
    }

    if (supabaseClient) {
        supabaseClient.auth.getSession().then(function(res) {
            var s = res && res.data && res.data.session;
            if (s && s.user) {
                _currentUser = s.user;
                saveSession(sessionFromUser(s.user));
            }
        }).catch(function() {});
    }

    var auth = {
        signInWithEmailAndPassword: function(email, password) {
            return supabaseClient.auth.signInWithPassword({ email: email, password: password })
                .then(function(result) {
                    if (result.error) throw result.error;
                    var user = result.data.user;
                    if (!user) throw new Error('No user returned');
                    // Always fetch role from DB, never trust client
                    return supabaseClient.from('users').select('*').eq('id', user.id).single()
                        .then(function(res) {
                            var profile = res.data;
                            // Self-heal must be AWAITED: if it is fire-and-forget the
                            // login handler redirects before the row exists, so the
                            // users table stays empty and every later write races it.
                            var heal = Promise.resolve();
                            if (!profile) {
                                // Profile row missing (e.g. the signup-time insert was
                                // blocked by RLS before the session existed). Rebuild it
                                // from the auth record so registration data like phone
                                // is not lost.
                                var meta = user.user_metadata || {};
                                profile = {
                                    id: user.id,
                                    email: email,
                                    role: 'applicant',
                                    status: 'active',
                                    name: meta.name || meta.firstName || email.split('@')[0],
                                    middleName: meta.middle_name || '',
                                    surname: meta.surname || meta.lastName || '',
                                    full_name: meta.full_name || email.split('@')[0],
                                    phone: meta.phone || ''
                                };
                                heal = Promise.resolve(supabaseClient.from('users').upsert(profile))
                                    .catch(function(e) {
                                        if (!isRlsError(e)) throw e;
                                        return dbProxyWrite('upsert', 'users', profile);
                                    })
                                    .catch(function(e) {
                                        console.warn('[Auth] Fallback profile upsert failed:', e);
                                    });
                            }
                            return heal.then(function() {
                                // Force role to be only valid values
                                var validRoles = ['applicant', 'student'];
                                var safeRole = validRoles.includes(profile.role) ? profile.role : 'applicant';
                                user.profile = profile || {};
                                user.role = safeRole;
                                return { user: user };
                            });
                        });
                });
        },

        createUserWithEmailAndPassword: function(email, password, metadata) {
            // Only allow applicant or student roles during self-registration
            var requestedRole = (metadata && metadata.role || 'applicant').trim();
            var userRole = (requestedRole === 'agent' || requestedRole === 'admin' || requestedRole === 'director') ? 'applicant' : requestedRole;
            var userName = (metadata && (metadata.firstName || metadata.name) || email.split('@')[0]).trim();
            return supabaseClient.auth.signUp({ 
                email: email, 
                password: password,
                options: {
                    data: {
                        name: userName,
                        middle_name: (metadata && metadata.middleName || '').trim(),
                        surname: (metadata && (metadata.lastName || metadata.surname) || '').trim(),
                        full_name: (userName + ' ' + (metadata && metadata.middleName || '') + ' ' + (metadata && (metadata.lastName || metadata.surname) || '')).trim().replace(/\s+/g, ' '),
                        role: userRole,
                        // Persist registration fields on the auth record so they
                        // survive even if the users-table insert is blocked by
                        // RLS while the signup session is still unauthenticated.
                        phone: ((metadata && metadata.phone) || '').trim()
                    }
                }
            })
                .then(function(result) {
                    if (result.error) throw result.error;
                    var user = result.data.user;
                    if (!user) throw new Error('No user returned');
                    var profileData = {
                        id: user.id,
                        email: email,
                        role: userRole,
                        status: 'active',
                        name: (metadata && (metadata.firstName || metadata.name) || email.split('@')[0]).trim(),
                        middleName: (metadata && metadata.middleName || '').trim(),
                        surname: (metadata && (metadata.lastName || metadata.surname) || '').trim(),
                        title: (metadata && metadata.title || '').trim(),
                        full_name: ((metadata && (metadata.firstName || metadata.name) || '') + ' ' + (metadata && metadata.middleName || '') + ' ' + (metadata && (metadata.lastName || metadata.surname) || '')).trim().replace(/\s+/g, ' ') || email.split('@')[0],
                        phone: metadata && metadata.phone || ''
                    };
                    // The auth record is already created at this point, so never
                    // fail the signup if the profile write is blocked (e.g. no
                    // session while email confirmation is pending) - the login
                    // flow rebuilds the row from auth user_metadata instead.
                    // NOTE: a Supabase query builder is thenable but has no
                    // .catch(), so wrap it in Promise.resolve() first. On an RLS
                    // failure retry through the server proxy so the row is written
                    // immediately instead of waiting for the first login.
                    return Promise.resolve(supabaseClient.from('users').upsert(profileData))
                        .catch(function(e) {
                            if (!isRlsError(e)) throw e;
                            return dbProxyWrite('upsert', 'users', profileData);
                        })
                        .catch(function(e) {
                            console.warn('[Auth] Signup profile upsert failed (will self-heal at first login):', e);
                        })
                        .then(function() {
                            user.profile = profileData;
                            user.role = userRole;
                            return { user: user };
                        });
                });
        },

        signOut: function() {
            return supabaseClient.auth.signOut();
        },

        onAuthStateChanged: function(callback) {
            _authListeners.push(callback);
            // Supabase's onAuthStateChange (line 26) already fires INITIAL_SESSION on load,
            // so no need to manually call getSession() here (avoids double callback).
            // If the initial session check has finished, fire immediately - including
            // when nobody is signed in (_currentUser === null), which signed-out pages
            // need in order to redirect without waiting on a timeout.
            if (_authReady) {
                setTimeout(function() { callback(_currentUser); }, 0);
            }
            return function() {
                _authListeners = _authListeners.filter(function(cb) { return cb !== callback; });
            };
        },

        get currentUser() { return _currentUser; },

        sendPasswordResetEmail: function(email) {
            return supabaseClient.auth.resetPasswordForEmail(email);
        }
    };

    // ========== Database Wrapper ==========
    // Wraps Supabase to match Firestore's db.collection().doc().get() API

    // Convert Unix timestamps to ISO strings for Supabase
    function convertTimestamps(obj) {
        if (!obj || typeof obj !== 'object') return obj;
        var result = Object.assign({}, obj);
        var timestampFields = ['created_at', 'updated_at', 'updatedAt', 'createdAt', 'paidAt', 'date', 'reviewedAt', 'processedAt', 'editedAt', 'dateTaken', 'uploadedAt', 'lastMessageAt', 'closingDate'];
        timestampFields.forEach(function(field) {
            if (result[field] && typeof result[field] === 'number') {
                result[field] = new Date(result[field]).toISOString();
            }
        });
        return result;
    }

    function applyReverseFieldMappings(table, data) {
        var mapping = reverseFieldMappings[table];
        if (!mapping || !data || typeof data !== 'object') return data;
        var result = Object.assign({}, data);
        Object.keys(mapping).forEach(function(dbField) {
            var appField = mapping[dbField];
            if (result[dbField] !== undefined && result[appField] === undefined) {
                result[appField] = result[dbField];
                delete result[dbField];
            }
        });
        return result;
    }

    function SupabaseDocRef(table, id) {
        this._table = table;
        this._id = id;
    }
    SupabaseDocRef.prototype.get = function() {
        var table = this._table, id = this._id;
        return supabaseClient.from(table).select('*').eq('id', id).maybeSingle()
            .then(function(result) {
                if (result.error) {
                    console.warn('[DB] get error on ' + table + '/' + id + ':', result.error);
                    return { exists: false, id: id, data: function() { return {}; }, _error: result.error, _isError: true };
                }
                var data = result.data ? applyReverseFieldMappings(table, result.data) : result.data;
                return { exists: !!data, id: id, data: function() { return data || {}; } };
            });
    };
    // RLS on the app tables blocks first inserts from the browser (there is no
    // INSERT policy for anon). When the direct write fails with a row-level
    // security / not-null error, retry it through /api/db-proxy, which verifies
    // the caller's JWT and writes with the service-role key for that user only.
    function isRlsError(e) {
        var code = e && (e.code || '');
        var msg = String((e && e.message) || '');
        return code === '42501' || code === '23502' || /row-level security|not-null constraint|permission denied/i.test(msg);
    }
    // Same-origin first (Cloudflare Pages functions), then the absolute
    // production endpoint. The absolute URL is what makes file:// and plain
    // static dev servers able to fall back to the proxy at all - relative
    // '/api/db-proxy' resolves to file:///api/db-proxy and never loads.
    var DB_PROXY_ENDPOINTS = [
        '/api/db-proxy',
        'https://app.collanduni.co.za/api/db-proxy'
    ];
    function postDbProxy(url, body) {
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        }).then(function(r) {
            var ct = (r.headers && r.headers.get && r.headers.get('content-type')) || '';
            // Non-JSON means the endpoint is not there on this host (404 page,
            // file://). Mark it retryable so the next endpoint is tried.
            if (ct.indexOf('json') === -1) {
                var e = new Error('Write proxy unavailable at ' + url);
                e.retryable = true;
                throw e;
            }
            return r.json().then(function(j) {
                if (!j || !j.ok) {
                    var e2 = new Error((j && j.error) || ('Proxy HTTP ' + r.status));
                    e2.retryable = false; // real rejection - same answer everywhere
                    throw e2;
                }
                return j;
            });
        }, function() {
            var e3 = new Error('Could not reach the write proxy at ' + url);
            e3.retryable = true;
            throw e3;
        });
    }
    function dbProxyWrite(op, table, payload) {
        return supabaseClient.auth.getSession()
            .then(function(res) {
                var token = res && res.data && res.data.session ? res.data.session.access_token : null;
                if (!token) throw new Error('Not signed in');
                var body = JSON.stringify({ table: table, op: op, payload: payload, jwt: token });
                var i = 0;
                function next() {
                    if (i >= DB_PROXY_ENDPOINTS.length) {
                        throw new Error('Write proxy unavailable on this host');
                    }
                    return postDbProxy(DB_PROXY_ENDPOINTS[i++], body).catch(function(e) {
                        if (e && e.retryable) return next();
                        throw e;
                    });
                }
                return next();
            });
    }
    SupabaseDocRef.prototype.set = function(data, options) {
        var table = this._table, id = this._id;
        var opts = options || {};
        var payload = convertTimestamps(applyFieldMappings(table, Object.assign({}, data, { id: id })));
        // users.email is NOT NULL with no default. Onboarding/profile payloads
        // often omit it, so a first-time INSERT dies with 23502 and the answers
        // never leave the device. Backfill it from the live session.
        if (table === 'users' && !payload.email) {
            var _em = (_currentUser && _currentUser.email) || '';
            if (!_em) { var _s = getSession(); _em = (_s && _s.email) || ''; }
            if (_em) payload.email = _em;
        }
        if (opts.merge) {
            // Upsert - merge with existing. PostgREST rejects the WHOLE row when
            // any key has no matching column ("Could not find the 'X' column ...
            // in the schema cache"). Strip only the named column and retry so a
            // single stale field can never blank an otherwise-valid save (e.g.
            // onboarding or the portal device-cache flush). Mirrors the retry in
            // app.js saveUserData.
            var attempt = 0;
            function tryUpsert(pl) {
                return supabaseClient.from(table).upsert(pl, { onConflict: 'id', ignoreDuplicates: false })
                    .then(function(result) {
                        if (result.error) throw result.error;
                        return { id: id };
                    })
                    .catch(function(e) {
                        var msg = (e && e.message) || '';
                        var m = msg.match(/Could not find the '([^']+)' column/);
                        if (m && pl[m[1]] !== undefined && attempt < 15) {
                            attempt++;
                            console.warn('[DB] ' + table + ': column "' + m[1] + '" missing, retrying without it.');
                            var retry = Object.assign({}, pl);
                            delete retry[m[1]];
                            return tryUpsert(retry);
                        }
                        // RLS blocks first inserts - retry through the server proxy
                        if (!isRlsError(e)) throw e;
                        return dbProxyWrite('upsert', table, pl).then(function() { return { id: id }; });
                    });
            }
            return tryUpsert(payload);
        } else {
            // Full replace - delete then insert
            return supabaseClient.from(table).delete().eq('id', id)
                .then(function() {
                    return supabaseClient.from(table).insert(payload);
                })
                .then(function(result) {
                    if (result.error) throw result.error;
                    return { id: id };
                });
        }
    };
    SupabaseDocRef.prototype.update = function(data) {
        var table = this._table, id = this._id;
        var payload = convertTimestamps(applyFieldMappings(table, data));
        return supabaseClient.from(table).update(payload).eq('id', id)
            .then(function(result) {
                if (result.error) throw result.error;
                return { id: id };
            });
    };
    SupabaseDocRef.prototype.delete = function() {
        var table = this._table, id = this._id;
        return supabaseClient.from(table).delete().eq('id', id)
            .then(function(result) {
                if (result.error) throw result.error;
            });
    };
    SupabaseDocRef.prototype.collection = function(name) {
        return new SupabaseCollection(this._table + '_' + name, this._id);
    };

    var fieldMappings = {
        notifications: { createdAt: 'date' },
        config: { createdAt: 'updated_at', updatedAt: 'updated_at' },
        activity_logs: { createdAt: 'createdAt' }
    };
    var reverseFieldMappings = {
        notifications: { date: 'createdAt' },
        config: { updated_at: 'updatedAt' }
    };

    function SupabaseQuery(table, parentUserId) {
        this._table = table;
        this._parentUserId = parentUserId;
        this._filters = [];
        this._orderField = null;
        this._orderAsc = true;
        this._limitN = null;
    }
    SupabaseQuery.prototype.where = function(field, op, value) {
        this._filters.push({ field: field, op: op, value: value });
        return this;
    };
    SupabaseQuery.prototype.orderBy = function(field, direction) {
        this._orderField = field;
        this._orderAsc = direction !== 'desc';
        return this;
    };
    SupabaseQuery.prototype.limit = function(n) {
        this._limitN = n;
        return this;
    };
    SupabaseQuery.prototype.get = function() {
        var table = this._table;
        var parentUserId = this._parentUserId;
        var filters = this._filters;
        var orderField = this._orderField;
        var orderAsc = this._orderAsc;
        var limitN = this._limitN;
        var mapping = fieldMappings[table] || {};

        function buildQuery(offset) {
            var query = supabaseClient.from(table).select('*');

            // Apply parent filter for sub-collections
            if (parentUserId) {
                query = query.eq('userId', parentUserId);
            }

            var effOrder = orderField;
            // Apply field mappings for tables with different column names
            if (effOrder && mapping[effOrder]) {
                effOrder = mapping[effOrder];
            }

            // Apply filters
            filters.forEach(function(f) {
                var mappedField = mapping[f.field] || f.field;
                switch(f.op) {
                    case '==': query = query.eq(mappedField, f.value); break;
                    case '!=': query = query.neq(mappedField, f.value); break;
                    case '>': query = query.gt(mappedField, f.value); break;
                    case '>=': query = query.gte(mappedField, f.value); break;
                    case '<': query = query.lt(mappedField, f.value); break;
                    case '<=': query = query.lte(mappedField, f.value); break;
                    case 'in': query = query.in(mappedField, f.value); break;
                    case 'array-contains': query = query.contains(mappedField, [f.value]); break;
                }
            });

            if (effOrder) {
                query = query.order(effOrder, { ascending: orderAsc });
            } else if (!limitN) {
                // Deterministic cross-page order when auto-paginating
                // (every table has an id primary key).
                query = query.order('id', { ascending: true });
            }
            if (limitN) {
                query = query.limit(limitN);
            } else if (offset) {
                query = query.range(offset, offset + 999);
            }
            return query;
        }

        function toSnapshot(rows) {
            var docs = (rows || []).map(function(row) {
                var mappedRow = applyReverseFieldMappings(table, row);
                return { id: mappedRow.id || row.id, data: function() { return mappedRow; }, exists: true };
            });
            return {
                forEach: function(cb) { docs.forEach(cb); },
                empty: docs.length === 0,
                size: docs.length,
                docs: docs
            };
        }

        function failSnapshot(result) {
            console.warn('[DB] query error on ' + table + ':', result.error);
            var errObj = result.error;
            return { forEach: function() {}, empty: true, size: 0, docs: [], _error: errObj, _isError: true };
        }

        // Explicit limit: single request, behaviour unchanged.
        if (limitN) {
            return buildQuery(0).then(function(result) {
                if (result.error) return failSnapshot(result);
                return toSnapshot(result.data);
            });
        }

        // No limit: page through in 1000-row windows so large tables
        // (users now exceeds 1000 rows) are never silently truncated.
        var all = [];
        var offset = 0;
        function next() {
            return buildQuery(offset).then(function(result) {
                if (result.error) return failSnapshot(result);
                var rows = result.data || [];
                all = all.concat(rows);
                if (rows.length < 1000 || offset >= 9000) return toSnapshot(all);
                offset += 1000;
                return next();
            });
        }
        return next();
    };

    function SupabaseCollection(name, parentUserId) {
        this._name = name;
        this._parentUserId = parentUserId || null;
    }
    SupabaseCollection.prototype.doc = function(id) {
        if (!id) id = crypto.randomUUID ? crypto.randomUUID() : ('id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
        return new SupabaseDocRef(this._name, id);
    };
    function applyFieldMappings(table, obj) {
        var mapping = fieldMappings[table] || {};
        var result = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var newKey = mapping[key] || key;
                result[newKey] = obj[key];
            }
        }
        return result;
    }

    SupabaseCollection.prototype.add = function(data) {
        var table = this._name;
        var parentUserId = this._parentUserId;
        var id = crypto.randomUUID ? crypto.randomUUID() : ('id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
        var payload = convertTimestamps(applyFieldMappings(table, Object.assign({}, data, { id: id })));
        if (parentUserId && !data.userId) {
            payload.userId = parentUserId;
        }
        return supabaseClient.from(table).insert(payload)
            .then(function(result) {
                if (result.error) throw result.error;
                return new SupabaseDocRef(table, id);
            })
            .catch(function(e) {
                // RLS blocks first inserts - retry through the server proxy.
                // Only the `users` and `documents` tables are permitted there.
                if (!isRlsError(e) || (table !== 'users' && table !== 'documents')) throw e;
                return dbProxyWrite('insert', table, payload).then(function() { return new SupabaseDocRef(table, id); });
            });
    };
    SupabaseCollection.prototype.where = function(field, op, value) {
        return new SupabaseQuery(this._name, this._parentUserId).where(field, op, value);
    };
    SupabaseCollection.prototype.orderBy = function(field, direction) {
        return new SupabaseQuery(this._name, this._parentUserId).orderBy(field, direction);
    };
    SupabaseCollection.prototype.get = function() {
        return new SupabaseQuery(this._name, this._parentUserId).get();
    };

    var db = {
        collection: function(name) {
            return new SupabaseCollection(name);
        },
        batch: function() {
            var ops = [];
            return {
                set: function(ref, data, opts) { ops.push({ type: 'set', ref: ref, data: data }); },
                update: function(ref, data) { ops.push({ type: 'update', ref: ref, data: data }); },
                delete: function(ref) { ops.push({ type: 'delete', ref: ref }); },
                commit: function() {
                    var promises = ops.map(function(op) {
                        if (op.type === 'set') {
                            return supabaseClient.from(op.ref._table).upsert(convertTimestamps(applyFieldMappings(op.ref._table, Object.assign({}, op.data, { id: op.ref._id }))), { onConflict: 'id' });
                        } else if (op.type === 'update') {
                            return supabaseClient.from(op.ref._table).update(convertTimestamps(applyFieldMappings(op.ref._table, op.data))).eq('id', op.ref._id);
                        } else if (op.type === 'delete') {
                            return supabaseClient.from(op.ref._table).delete().eq('id', op.ref._id);
                        }
                        return Promise.resolve();
                    });
                    return Promise.all(promises);
                }
            };
        }
    };

    // ========== Helpers ==========
    function invalidateCache() {}
    function getCachedDoc() { return null; }
    function setCachedDoc() {}
    function cachedDocGet(collection, docId) { return db.collection(collection).doc(docId).get(); }
    function cachedQueryGet(collection, field, op, value) { return db.collection(collection).where(field, op, value).get(); }

    // ========== Encryption Helpers ==========
    var _encKey = 'Collanduni2026Secure';

    function encryptText(text) {
        if (!text) return '';
        try {
            var result = '';
            for (var i = 0; i < text.length; i++) {
                result += String.fromCharCode(text.charCodeAt(i) ^ _encKey.charCodeAt(i % _encKey.length));
            }
            return btoa(result);
        } catch (e) { return text; }
    }

    function decryptText(encoded) {
        if (!encoded) return '';
        try {
            var text = atob(encoded);
            var result = '';
            for (var i = 0; i < text.length; i++) {
                result += String.fromCharCode(text.charCodeAt(i) ^ _encKey.charCodeAt(i % _encKey.length));
            }
            return result;
        } catch (e) { return encoded; }
    }

    // ========== File Upload (Cloudflare R2) ==========
    var R2_WORKER_URL = 'https://collanduni.collanduni.workers.dev';

    async function verifyPaystackPayment(reference) {
        try {
            var response = await fetch(R2_WORKER_URL + '/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reference: reference })
            });
            return await response.json();
        } catch (e) {
            console.warn('Payment verification error:', e);
            return { verified: false, error: e.message };
        }
    }

    async function uploadToCloudinary(file, folder) {
        if (!R2_WORKER_URL) {
            return Promise.reject(new Error('Upload service not configured.'));
        }
        var timestamp = Date.now();
        var randomStr = Math.random().toString(36).substring(2, 8);
        var ext = file.name.split('.').pop() || 'jpg';
        var path = folder ? (folder + '/' + timestamp + '_' + randomStr + '.' + ext) : (timestamp + '_' + randomStr + '.' + ext);

        var formData = new FormData();
        formData.append('file', file);
        formData.append('path', path);

        // Get auth token from Supabase session (refresh first to avoid expired tokens)
        var authHeaders = {};
        try {
            var session = await supabaseClient.auth.getSession();
            // Refresh if token expires within 5 minutes
            if (session.data && session.data.session && session.data.session.expires_at) {
                var expiresAt = session.data.session.expires_at * 1000;
                if (expiresAt - Date.now() < 5 * 60 * 1000) {
                    await supabaseClient.auth.refreshSession();
                    session = await supabaseClient.auth.getSession();
                }
            }
            if (session.data && session.data.session && session.data.session.access_token) {
                authHeaders['Authorization'] = 'Bearer ' + session.data.session.access_token;
            } else {
                // No usable Supabase session - the upload would be rejected with
                // a cryptic "Unauthorized", so fail fast with an actionable message.
                return Promise.reject(new Error('Your session has expired. Please sign out and sign in again, then retry the upload.'));
            }
        } catch (e) { console.warn('[Upload] Session refresh error:', e); }

        function doUpload(url) {
            return fetch(url, { method: 'POST', headers: authHeaders, body: formData })
                .then(function(response) {
                    if (!response.ok) {
                        return response.json().then(function(result) {
                            throw new Error(result.error || 'Upload failed (HTTP ' + response.status + ')');
                        }).catch(function(e) {
                            if (e.message) throw e;
                            throw new Error('Upload failed (HTTP ' + response.status + ')');
                        });
                    }
                    return response.json();
                })
                .then(function(result) {
                    if (!result.url) throw new Error('Upload succeeded but no URL returned.');
                    return result.url;
                });
        }

        // Try the same-origin upload endpoint first (most reliable), then fall back to the direct worker.
        return doUpload('/api/upload').catch(function() {
            return doUpload(R2_WORKER_URL);
        }).catch(function(err) {
            var msg = String((err && err.message) || err);
            if (/failed to fetch|unreachable/i.test(msg)) {
                throw new Error('Could not reach the upload service. Check your internet connection, disable ad-blockers/extensions, and try again.');
            }
            throw err;
        });
    }

    // ========== Payment Config ==========
    var PAYSTACK_MODE = 'live';
    var PAYSTACK_TEST_KEY = 'pk_test_6fd86e8d38d627059608a846a3bec20f169decc0';
    var PAYSTACK_LIVE_KEY = 'pk_live_6676da57ead3b9eb170ac1f17fbffdfe1b14ca96';
    var PAYSTACK_PUBLIC_KEY = PAYSTACK_MODE === 'test' ? PAYSTACK_TEST_KEY : PAYSTACK_LIVE_KEY;
    var APPLICATION_FEE = 60;

    // ========== Gemini AI (via /api/ai - key stays server-side) ==========
    var GEMINI_MODEL = 'gemini-3.5-flash';

    async function generateAINotification(context) {
        try {
            var prompt = 'You are Collanduni, a helpful student application assistant. Generate a short, friendly notification message (max 2 sentences) for a student based on this context: ' + context + '. Be encouraging and specific. Do not use quotes or markdown.';
            var response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: GEMINI_MODEL,
                    payload: {
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { maxOutputTokens: 600, temperature: 0.7, thinkingConfig: { thinkingBudget: 0 } }
                    }
                })
            });
            if (!response.ok) throw new Error('Gemini API error ' + response.status);
            var data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                return data.candidates[0].content.parts[0].text.trim();
            }
            return null;
        } catch (e) {
            console.warn('Gemini AI error:', e);
            return null;
        }
    }

    async function sendAINotification(userId, type, context) {
        var message = await generateAINotification(context);
        if (!message) {
            // AI unavailable - still deliver a useful template notification
            // rather than dropping it silently.
            message = 'You have a new update on your application. Open your portal to review it.';
        }
        return db.collection('notifications').add({
            userId: userId,
            title: 'AI Assistant',
            message: message,
            type: type || 'ai_recommendation',
            read: false,
            createdAt: Date.now()
        }).catch(function(e) { console.warn('Notification save error:', e); });
    }

    // ========== Atomic Sequence Numbers (invoice / receipt) ==========
    // Allocates unique sequential numbers across all clients using a
    // compare-and-swap counter stored in activity_logs (anon-writable).
    // Each counter lives in its own row keyed by a deterministic UUID
    // derived from the counter key, with the current value in the
    // `details` column and a fixed `action` marker so these rows never
    // show up in any real activity feed.
    var SEQUENCE_COUNTER_ACTIONS = ['__seq_inv', '__seq_rcp'];
    function seqCounterRowUuid(key) {
        var h1 = 0, h2 = 0, i;
        for (i = 0; i < key.length; i++) h1 = (h1 * 31 + key.charCodeAt(i)) >>> 0;
        for (i = key.length - 1; i >= 0; i--) h2 = (h2 * 131 + key.charCodeAt(i)) >>> 0;
        h1 = (h1 ^ (h1 >>> 16)) >>> 0;
        h2 = (h2 ^ (h2 >>> 16)) >>> 0;
        function hex(n, len) {
            var s = n.toString(16);
            while (s.length < len) s = '0' + s;
            return s;
        }
        return '00000000-0000-4000-8000-' + hex(h1, 8).slice(0, 6) + hex(h2, 8).slice(0, 6);
    }
    function nextSequenceNumber(prefix, scanField) {
        var year = new Date().getFullYear();
        var family = (String(prefix).split('-')[0] || '').toLowerCase();
        var rowId = seqCounterRowUuid(family + '_' + year);
        var action = '__seq_' + family;
        var step = 0;
        return supabaseClient.from('activity_logs').select('details').eq('id', rowId).maybeSingle()
            .then(function(res) {
                if (res.error) throw res.error;
                var cur = (res.data && res.data.details !== null && res.data.details !== undefined && res.data.details !== '') ? parseInt(res.data.details, 10) : null;
                if (cur !== null && !isNaN(cur)) return cur;
                // Initialize from existing rows so we never collide with legacy numbers
                return supabaseClient.from('applications').select(scanField).then(function(snap) {
                    var maxSeq = 0;
                    (snap.data || []).forEach(function(row) {
                        var v = row && row[scanField];
                        if (v && typeof v === 'string' && v.indexOf(prefix) === 0) {
                            var num = parseInt(v.substring(prefix.length), 10);
                            if (!isNaN(num) && num > maxSeq) maxSeq = num;
                        }
                    });
                    return supabaseClient.from('activity_logs').upsert(
                        { id: rowId, action: action, details: String(maxSeq), createdAt: new Date().toISOString() },
                        { onConflict: 'id' }
                    ).then(function() { return maxSeq; });
                });
            })
            .then(function(cur) {
                function increment() {
                    step++;
                    var candidate = cur + 1;
                    return supabaseClient.from('activity_logs')
                        .update({ details: String(candidate) })
                        .eq('id', rowId)
                        .eq('details', String(cur))
                        .select('details')
                        .then(function(r) {
                            if (r.error) throw r.error;
                            if (r.data && r.data.length > 0) return candidate;
                            if (step > 25) throw new Error('Unable to allocate a unique ' + prefix + ' number.');
                            return supabaseClient.from('activity_logs').select('details').eq('id', rowId).single().then(function(r2) {
                                if (r2.error) throw r2.error;
                                cur = parseInt(r2.data.details, 10);
                                if (isNaN(cur)) throw new Error('Corrupt ' + prefix + ' sequence counter.');
                                return increment();
                            });
                        });
                }
                return increment();
            })
            .then(function(seq) {
                return prefix + seq.toString().padStart(5, '0');
            });
    }

    // ========== Expose Globals ==========
    global.supabaseClient = supabaseClient;
    global.auth = auth;
    global.db = db;
    global.saveSession = saveSession;
    global.getSession = getSession;
    global.storage = null;
    global.PAYSTACK_PUBLIC_KEY = PAYSTACK_PUBLIC_KEY;
    global.APPLICATION_FEE = APPLICATION_FEE;
    global.R2_WORKER_URL = R2_WORKER_URL;
    global.uploadToCloudinary = uploadToCloudinary;
    global.verifyPaystackPayment = verifyPaystackPayment;
    global.encryptText = encryptText;
    global.decryptText = decryptText;
    global.generateAINotification = generateAINotification;
    global.sendAINotification = sendAINotification;
    global.invalidateCache = invalidateCache;
    global.getCachedDoc = getCachedDoc;
    global.setCachedDoc = setCachedDoc;
    global.cachedDocGet = cachedDocGet;
    global.cachedQueryGet = cachedQueryGet;
    global.nextSequenceNumber = nextSequenceNumber;
    global.SEQUENCE_COUNTER_ACTIONS = SEQUENCE_COUNTER_ACTIONS;
    // Backward compat
    global.firebaseAuth = auth;
    global.firebaseApp = null;
    global.firestore = null;

})(window);
