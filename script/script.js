(() => {
    window.isKeyDown = {};

    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;
    const SHOT_MAX_COUNT = 10;
    const ENEMY_MAX_COUNT = 

    let util = null;
    let canvas = null;
    let ctx = null;
    let scene = null;
    let startTime = null;
    let viper = null;
    let shotArray = [];
    let enemyArray = [];
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
        let i;
        // canvasの大きさを設定
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        // シーンを初期化する
        scene = new SceneManager();

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

        // 敵キャラクターを初期化する
        for(i = 0 ;i < ENEMY_MAX_COUNT ; i++){
            enemyArray[i] = new Enemy(ctx, 0, 0, 48, 48, '/image/enemy_small.png');
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

        // 同様に敵キャラクターの準備状況も確認する
        enemyArray.map((v) => {
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

    /**
     * シーンを設定する
     */
    function sceneSetting(){
        // イントロシーン
        scene.add('intro', (time) => {
            // 2s で inviteに変更
            if(time > 2.0){
                scene.use('invade');
            }
        });
        // invade シーン
        scene.add('invade', (time) =>{
            // シーンのフレーム数が 0 以外の時は即座に終了する
            if(scene.frame !== 0){return;}
            // ライフが 0 の状態の敵が見つかったら配置
            for (let i = 0 ; i < ENEMY_MAX_COUNT ; ++i){
                if(enemyArray[i].life <= 0){
                    let e = enemyArray[i];
                    // 出現場所は X が画面中央、 Y が画面上端の外側に設定する
                    e.set(CANVAS_WIDTH / 2, -e.height);
                    // 進行方向
                    e.setVector(0.0, 1.0);
                    break;
                }
            }
        });
        scene.use('invade');
    }
    /**
     *  一番最初のシーンには intro を設定する
     */
    function render() {
        // グローバルなαを必ず1.0で描画処理を開始する
        ctx.globalAlpha = 1.0;
        // 裏の画像
        util.drawRect(0, 0, canvas.width, canvas.height, '#eeeeee');
        // 経過時間の取得
        let nowTime = (Date.now() - startTime) / 1000;

        // シーンを更新する
        scene.update();

        // 自機キャラクターの状態を更新
        viper.update();

        // 敵キャラの状態の更新
        enemyArray.map((v) => {
            v.update();
        });

        // ショットの状態を更新
        shotArray.map((v) => {
            v.update();
        });

        // シングルショットの状態を更新する
        singleShotArray.map((v) => {
            v.update();
        });

        enemyArray.map((v) => {
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
