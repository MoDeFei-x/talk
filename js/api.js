var API = (() => {
    const BASE_URL = 'http://study.duyiedu.com';
    const TOKEN_KEY = 'token';

    function get(path) {
        const headers = {};
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(BASE_URL + path, { headers });
    }

    function post(path, bodyobj) {
        const headers = {
            'Content-Type': 'application/json',
        };
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(BASE_URL + path, {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyobj),
        })
    }


    async function reg(userInfo) {
        const resp = await post('/api/user/reg', userInfo);
        return await resp.json();
    }

    async function login(loginInfo) {
        const resp = await post('/api/user/login', loginInfo);

        const result = await resp.json();
        //将响应头中的token保存起来(localStorage)
        if (result.code === 0) {
            const token = resp.headers.get('authorization');
            localStorage.setItem(TOKEN_KEY, token);
        }

        return result;
    }

    async function exists(loginId) {
        const resp = await get('/api/user/exists?loginId=' + loginId);
        return await resp.json();
    }

    async function profile() {
        const resp = await get('/api/user/profile')
        return resp.json();
    }

    async function sendChat(content) {
        const resp = await post('/api/chat', {
            content,
        });

        return resp.json();
    }

    async function getHistory() {
        const resp = await get('/api/chat/history');
        return resp.json();
    }

    function loginOut() {
        localStorage.removeItem(TOKEN_KEY);
    }

    return {
        reg,
        login,
        exists,
        profile,
        sendChat,
        getHistory,
        loginOut
    }
})()