(async function() {

    const ws = await connectToServer();    

    ws.onmessage = (webSocketMessage) => {
        const messageBody = JSON.parse(webSocketMessage.data);
        const cursor = getOrCreateCursorFor(messageBody);
        cursor.style.transform = `translate(${messageBody.x}px, ${messageBody.y}px)`;
    };        
    
    document.body.onmousemove = (evt) => {
        const messageBody = { x: evt.clientX, y: evt.clientY };
        ws.send(JSON.stringify(messageBody));
    };
        
    async function connectToServer() {    
        const ws = new WebSocket('wss://61fc25eb-66b2-4f09-8b21-68fee9e0e03f-dev.e1-us-east-azure.choreoapis.dev/mediationproject/cursorapi/v1.0/ws');
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                if(ws.readyState === 1) {
                    clearInterval(timer);
                    resolve(ws);
                }
            }, 10);
        });   
    }

    function getOrCreateCursorFor(messageBody) {
        const sender = messageBody.sender;
        const existing = document.querySelector(`[data-sender='${sender}']`);
        if (existing) {
            return existing;
        }
        
        const template = document.getElementById('cursor');
        const cursor = template.content.firstElementChild.cloneNode(true);
        const svgPath = cursor.getElementsByTagName('path')[0];    
            
        cursor.setAttribute("data-sender", sender);
        svgPath.setAttribute('fill', `hsl(${messageBody.color}, 50%, 50%)`);    
        document.body.appendChild(cursor);

        return cursor;
    }

})();
