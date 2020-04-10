(() => {
    window.isKeyDown = {};

    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;
    const SHOT_MAX_COUNT = 10;

    let util = null;
    let canvas = null;
    let ctx = null;
    let startTime = null;
    let viper = null;
    let shotArray = [];
    let singleShotArray = [];

    /**
     * do event load when loding page complete
     * ページのロードが完了したときの load イベント
     */
    window.addEventListener('load', () => {
        util = new Canvas2DUtility(document.body.querySelector('#main_canvas'));
        canvas = util.canvas;
        ctx = util.context;

        // 初期化とインスタンス
        initialize();
        loadCheck();
    }, false);

    /**
     *  初期化
     */

    function initialize() {
        // canvasの大きさを設定
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        // 登場シーンからスタートするための設定
        viper = new Viper(ctx, 0, 0, 64, 64, './image/viper.png');
        viper.setComing(
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT + 50,
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT - 100
        );

        // ショットを初期化する
        for(let i=0 ; i < SHOT_MAX_COUNT ; ++i){
            shotArray[i] = new Shot(ctx, 0, 0, 32, 32, './image/viper_shot.png');
            singleShotArray[i*2] = new Shot(ctx, 0, 0, 32, 32, './image/viper_single_shot.png');
            singleShotArray[i*2+1] = new Shot(ctx, 0, 0, 32, 32, './image/viper_single_shot.png');
        }

        viper.setShotArray(shotArray, singleShotArray);
    }

    /**
     *  インスタンスの準備が完了しているか確認する
     */
    function loadCheck(){
        let ready = true;
        ready = ready && viper.ready;
        
        // shotの準備状況 
        shotArray.map((v) => {
            ready = ready && v.ready;
        });

        // シングルショットの準備状況の確認
        singleShotArray.map((v) =>{
            ready = ready && v.ready;
        });

        // 全ての準備が完了したら進む
        if(ready === true){
            eventSetting();
            startTime = Date.now();
            render();
        }else{
            setTimeout(loadCheck, 100);
        }
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

        // 自機キャラクターの状態を更新
        viper.update();

        // ショットの状態を更新
        shotArray.map((v) => {
            v.update();
        });

        // シングルショットの状態を更新する
        singleShotArray.map((v) => {
            v.update();
        });

        requestAnimationFrame(render);
    }
    /* 特定のは二のランダム */
    function generateRandomInt(range) {
        let random = Math.random();
        return Math.floor(random * range);
    }
})();
