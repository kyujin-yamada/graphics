class SceneManager{
    constructor(){
        /**
         *  シーンを格納するためのオブジェクト
         */
        this.scene = {};
        /**
         * 現在のアクティブなシーン
         */
        this.activeScene = null;
        /**
         * 現在のシーンがアクティブになったら自国のタイムスタンプ
         */
        this.startTime = null;
        /**
         * 現在のシーンがアクティブになってからのシーンの実行回数
         */
        this.frame = null;
    }
    /**
     * シーンを追加する
     */
    add(name, updateFunction){
        this.scene[name] = updateFunction;
    }

    /**
     * アクティブなシーンを設定する
     */
    use(name){
        // 指定されたシーンの確認
        if(this.scene.hasOwnProperty(name) !== true){
            // 存在しなかった場合何もせず終了する。
            return;
        }
        // 名前をもとにアクティブなシーンを設定する
        this.activeScene = this.scene[name];
        // シーンをアクティブにした瞬間のタイムスタンプの設定
        this.startTime = Date.now();
        // シーンをアクティブにしたのでリセット
        this.frame = -1;
    }
    /**
     * シーンを更新する
     */
    update(){
        // シーンがアクティブになってからの経過時間
        let activeTime = (Date.now() - this.startTime) / 1000;
        // 経過時間を引数与えてupdateFunctionを呼び出す
        this.activeScene(activeTime);
        // シーンを更新したのでカウンターをインクリメントする
        ++this.frame;
    }
}