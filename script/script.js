(() => {
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;

    let util = null;
    let canvas = null;
    let ctx = null;
    let image = null;
    let startTime = null;
    let viperX = CANVAS_WIDTH / 2;
    let viperY = CANVAS_HEIGHT / 2;
    // 自機が登場
    let isComing = false;
    // 登場演出を開始した際のタイムスタンプ
    let comingStart = null;

    window.addEventListener('load', () => {
        util = new Canvas2DUtility(document.body.querySelector('#main_canvas'));
        canvas = util.canvas;
        ctx = util.context;

        util.imageLoader('./image/viper.png', (loadeImage) => {
            image = loadeImage;
            initialize();
            eventSetting();
            startTime = Date.now();
            render();
        });
    }, false);

    function initialize() {
        // canvasの大きさを設定
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        // 登場シーンからスタートするための設定
        isComing = true;
        comingStart = Date.now();
        viperY = CANVAS_HEIGHT;
    }

    function eventSetting() {
        window.addEventListener('keydown', (event) => {
            // 登場シーン
            if(isComing === true){return;}
            switch (event.key) {
                case 'ArrowLeft':
                    viperX -= 15;
                    break;
                case 'ArrowRight':
                    viperX += 15;
                    break;
                case 'ArrowUp':
                    viperY -= 15;
                    break;
                case 'ArrowDown':
                    viperY += 15;
                    break;
            }
        }, false);
    }

    function render() {
        // グローバルなαを必ず1.0で描画処理を開始する
        ctx.globalAlpha = 1.0;
        // 裏の画像
        util.drawRect(0, 0, canvas.width, canvas.height, '#eeeeee');
        // 経過時間の取得
        let nowTime = (Date.now() - startTime) / 1000;

        if (isComing === true){
            // 登場シーンの経過時間
            let justTime = Date.now();
            let comingTime = (justTime - comingStart) / 1000;
            viperY = CANVAS_HEIGHT - comingTime * 50;
            if(viperY <= CANVAS_HEIGHT - 100){
                isComing = false;
                viperY = CANVAS_HEIGHT - 100;
            }
            // justTimeを100で割った時余りが50より小さくなる場合半透明
            if(justTime % 100 < 50){
                ctx.globalAlpha = 0.1;
            }
        }
        ctx.drawImage(image, viperX, viperY)
        requestAnimationFrame(render);
    }
    function generateRandomInt(range) {
        let random = Math.random();
        return Math.floor(random * range);
    }

})();