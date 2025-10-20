// ==UserScript==
// @name         RoX
// @version      1.4
// @match        https://www.rophim.li/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(async function() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {
            try {
                if (this._url.includes("/v1/user/info")) {
                    let data = JSON.parse(this.responseText);
                    data.result.is_vip = true;
                    data.result.role = "vip";
                    data.result.vip_expired_at = Date.now() + 10*365*24*60*60*1000;
                    data.result.coin_balance = 999999999;
                    Object.defineProperty(this, 'responseText', { value: JSON.stringify(data) });
                    Object.defineProperty(this, 'response', { value: JSON.stringify(data) });
                }
            } catch (e) {
                console.error(e);
            }
        });
        return originalSend.apply(this, arguments);
    };
})();
