(() => {
    window.isKeyDown = {};
    
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;

    let util = null;
    let canvas = null;
    let ctx = null;
    let image = null;
    let startTime = null;
    let viper = null

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

    /**
     *  初期化
     */

    function initialize() {
        // canvasの大きさを設定
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        // 登場シーンからスタートするための設定
        viper = new Viper(ctx, 0, 0, 64, 64, image);
        viper.setComing(
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT + 50,
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT - 100
        );
    }
    /*
    *イベント設定
    */

    function eventSetting() {
        //　キーの押した時に呼び出されるイベント
        window.addEventListener('keydown', (event) => {
            // キーの押した状態を管理
            isKeyDown[`key_${event.key}`] = true;
        }, false);
        // キーが離された時に呼び出されるイベント
        window.addEventListener('keyup', (event) =>{
            isKeyDown[`key_${event.key}`] = false;
        }, false);
    }
/*
    描画処理
*/
    function render() {
        // グローバルなαを必ず1.0で描画処理を開始する
        ctx.globalAlpha = 1.0;
        // 裏の画像
        util.drawRect(0, 0, canvas.width, canvas.height, '#eeeeee');
        // 経過時間の取得
        let nowTime = (Date.now() - startTime) / 1000;

        viper.update();

        requestAnimationFrame(render);
    }
    /* 特定のは二のランダム */
    function generateRandomInt(range) {
        let random = Math.random();
        return Math.floor(random * range);
    }
})();