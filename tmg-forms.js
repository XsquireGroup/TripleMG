/* TMG form handling. The only setting to change is TMG_API_BASE (see DEPLOY-STEPS). */
var TMG_API_BASE = 'https://tmg-api-04b7d1.azurewebsites.net/api';
var TMG_PHONE = '513-346-0894';

var TMGForms = (function () {
  function connected() { return TMG_API_BASE.indexOf('REPLACE-WITH') === -1; }

  function fail(msg) {
    return { ok: false, message: msg || ('Something went wrong. Please call us at ' + TMG_PHONE + '.') };
  }

  function handle(res) {
    if (res.ok) return { ok: true };
    return res.json().then(function (d) {
      var msg = (d && d.errors && d.errors.join(' ')) || (d && d.error);
      return fail(msg);
    }, function () { return fail(); });
  }

  function post(path, options) {
    if (!connected()) {
      return Promise.resolve(fail('Online submissions are not switched on yet. Please call us at ' + TMG_PHONE + '.'));
    }
    return fetch(TMG_API_BASE + path, options).then(handle, function () { return fail(); });
  }

  return {
    sendJson: function (path, data) {
      return post(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    },
    sendForm: function (path, formData) {
      return post(path, { method: 'POST', body: formData });
    },
    /* Like sendJson, but also hands back the server's reply (used for the terms signature). */
    sendJsonData: function (path, data) {
      if (!connected()) {
        return Promise.resolve(fail('Online signing is not switched on yet. Please call us at ' + TMG_PHONE + '.'));
      }
      return fetch(TMG_API_BASE + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        return res.json().then(function (d) {
          if (res.ok) return { ok: true, data: d };
          return fail((d && d.errors && d.errors.join(' ')) || (d && d.error));
        }, function () { return res.ok ? { ok: true, data: {} } : fail(); });
      }, function () { return fail(); });
    }
  };
})();
