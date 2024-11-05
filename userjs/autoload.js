function loadScript(url, timeout = 1000) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve(url);
        script.onerror = () => reject(new Error(`Failed to load script from ${url}`));
        document.head.appendChild(script);
        const timer = setTimeout(() => {
            script.onerror();
            clearTimeout(timer);
        }, timeout);
    });
}

async function loadScripts(servers, scripts, timeout = 1000) {
    let useFallback = false;

    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        let loaded = false;

        for (const server of servers) {
            if (useFallback && server !== servers[1]) continue;

            const url = `${server}/${script}`;
            try {
                const result = await Promise.race([
                    loadScript(url, timeout),
                    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout loading script from ${url}`)), timeout))
                ]);
                console.log(`Script loaded successfully from ${result}`);
                loaded = true;
                break;
            } catch (error) {
                console.error(error.message);
                if (server === servers[0]) {
                    useFallback = true;
                }
            }
        }

        if (!loaded) {
            console.error(`Failed to load script: ${script}`);
        }
    }
}

const cdnServers = ['https://cdn.jsdelivr.net/gh/cnhkbbs/jstools', 'https://cnhkbbs.github.io/jstools'];
const scriptsToLoad = ['fkQW/fkQW.js', 'showFPS/showFPS.js'];
loadScripts(cdnServers, scriptsToLoad, 1000);