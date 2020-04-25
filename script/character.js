
/**
 * 座標を管理するためのクラス
 */
class Position {
   
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    set(x, y){
        if(x != null){this.x = x;}
        if(y != null){this.y = y;}
    }
}

/**
 * キャラクター管理のための基幹クラス
 */
class Character {
    constructor(ctx, x, y, w, h, life, imagePath){
        this.ctx = ctx;
        this.position = new Position(x, y);
        this.vector = new Position(0.0, -1.0)
        this.width = w;
        this.height = h;
        this.life = life;
        this.ready = false;
        this.angle = 270 * Math.PI / 180;
        this.image = new Image();
        this.image.addEventListener('load', () => {
            // 画像のロード終了時のフラグ立て
            this.ready = true;
        }, false);
        this.image.src = imagePath;
    }
    /**
     * 進行方向の設定
     * @param {number} angle 
     */
    setVector(x, y){
        this.vector.set(x, y);
    }
    
    /*
     * 進行方向を角度をもとに設定する
     */
    setVectorFromAngle(angle){
        this.angle = angle;
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);
        this.vector.set(cos, sin);
    }

    /**
     * キャラクターを描画する
     */
    draw(){
        // キャラクターの幅を考慮してオフセットする量
        let offsetX = this.width / 2;
        let offsetY = this.height / 2;
        // キャラクターの幅やオフセットする量を加味して描画する
        this.ctx.drawImage(
            this.image,
            this.position.x - offsetX,
            this.position.y - offsetY,
            this.width,
            this.height
        );
    }
    /**
     * 自身の回転量をもとに座標系を回転させる
     */
    rotationDraw(){
        // 回転前の状態の保持
        this.ctx.save();
        // 自身の位置が座標系の中心と重なるように平行移動する。
        this.ctx.translate(this.position.x, this.position.y);
        // 座標の回転
        this.ctx.rotate(this.angle - Math.PI * 1.5);

        // キャラクターの幅を考慮してオフセットsるう
        let offsetX = this.width / 2;
        let offsetY = this.height / 2;

        this.ctx.drawImage(
            this.image,
            -offsetX,
            -offsetY,
            this.width,
            this.height
        );
        // 回転前の状態に戻す
        this.ctx.restore();
    }

}

/**
 * viper クラス
 */
class Viper extends Character {
    constructor(ctx, x, y, w, h, imagePath){
        super(ctx, x, y, w, h, 0, imagePath);
        this.speed = 3;
        
        //ショットのプロパティ
        this.shotCheckCounter = 0;
        this.shotInterval = 10;

        // 登場中フラグ
        this.isComing = false;
        this.comingStart = null;
        this.comingStartPosition = null;
        this.comingEndPosition = null;

        // ショットインスタンスの配列
        this.shotArray = null;
        this.singleShotArray = null;
    }

    /**
     * 登場演出に関する設定を行う
     */
    setComing(startX, startY, endX, endY){
        // 登場中のフラグを立てる
        this.isComing = true;
        // 登場開始時のタイムスタンプを取得する
        this.comingStart = Date.now();
        // 登場開始位置に自機を移動させる
        this.position.set(startX, startY);
        // 登場開始位置を設定する
        this.comingStartPosition = new Position(startX, startY);
        // 登場終了とする座標を設定する
        this.comingEndPosition = new Position(endX, endY);
    }

    /**
     * 　ショットを設定する
     */
    setShotArray(shotArray, singleShotArray){
        this.shotArray = shotArray;
        this.singleShotArray = singleShotArray;
    }

    /**
     * キャラクターの状態を更新し描画を行う
     */
    update(){
        // 現時点のタイムスタンプを取得する
        let justTime = Date.now();

        // 登場シーンかどうかに応じて処理を振り分ける
        if(this.isComing === true){
            // 登場シーンが始まってからの経過時間
            let comingTime = (justTime - this.comingStart) / 1000;
            // 登場中は時間が経つほど上に向かって進む
            let y = this.comingStartPosition.y - comingTime * 50;
            // 一定の位置まで移動したら登場シーンを終了する
            if(y <= this.comingEndPosition.y){
                this.isComing = false;        // 登場シーンフラグを下ろす
                y = this.comingEndPosition.y; // 行き過ぎの可能性もあるので位置を再設定
            }
            // 求めた Y 座標を自機に設定する
            this.position.set(this.position.x, y);

            // 自機の登場演出時は点滅させる
            if(justTime % 100 < 50){
                this.ctx.globalAlpha = 0.5;
            }
        }else{
            // キーの押下状態を調べて挙動を変える
            if(window.isKeyDown.key_ArrowLeft === true){
                this.position.x -= this.speed; // アローキーの左
            }
            if(window.isKeyDown.key_ArrowRight === true){
                this.position.x += this.speed; // アローキーの右
            }
            if(window.isKeyDown.key_ArrowUp === true){
                this.position.y -= this.speed; // アローキーの上
            }
            if(window.isKeyDown.key_ArrowDown === true){
                this.position.y += this.speed; // アローキーの下
            }
            // 移動後の位置が画面外へ出ていないか確認して修正する
            let canvasWidth = this.ctx.canvas.width;
            let canvasHeight = this.ctx.canvas.height;
            let tx = Math.min(Math.max(this.position.x, 0), canvasWidth);
            let ty = Math.min(Math.max(this.position.y, 0), canvasHeight);
            this.position.set(tx, ty);

            // ショットの生成
            if(window.isKeyDown.key_z === true) {
                // ショットチェック用カウンターが 0 以上ならショットを生成できる
                if(this.shotCheckCounter >= 0){
                    let i;
                    for(i = 0 ; i < this.shotArray.length ; ++i){
                        // ショットチェック用カウンタが 0 以上ならショットを生成できる
                        if(this.shotArray[i].life <= 0){
                             this.shotArray[i].set(this.position.x, this.position.y);
                            // インターバル
                            this.shotCheckCounter = -this.shotInterval;
                            break;
                        }
                    }
                    // シングルショット　二個をワンセットで生成し左右に振り分ける
                    for(i = 0 ; i < this.singleShotArray.length ; i+= 2){
                        if(this.singleShotArray[i].life <= 0 && this.singleShotArray[i+1].life <= 0){
                            // まうえの方向から左右に傾いたラジアン
                            let radCW = 280 * Math.PI / 180;
                            let radCCW = 260 * Math.PI / 180;

                            // 自機キャラクターの座標にショットを生成
                            this.singleShotArray[i].set(this.position.x, this.position.y);
                            this.singleShotArray[i].setVectorFromAngle(radCW);
                            this.singleShotArray[i+1].set(this.position.x, this.position.y);
                            this.singleShotArray[i+1].setVectorFromAngle(radCCW);
                            // ショットを生成したのでインターバルを設定する
                            this.shotCheckCounter = -this.shotInterval;
                            break;
                        }
                    }
                }
            }
            ++this.shotCheckCounter;
       }
       
        // 自機キャラクターを描画する
        this.draw();

        // 念の為グローバルなアルファの状態を元に戻す
        this.ctx.globalAlpha = 1.0;
    }
}
 /*
 　* 敵キャラクラス
*/
class Enemy extends Character {
    constructor(ctx, x, y, w, h, imagePath){
        // 継承元の初期化
        super(ctx, x, y, w, h, 0, imagePath);

        this.speed = 3;
    }
    /**
     * 敵の配置
     */
    set(x, y, life = 1){
        // 開始位置に敵移動
        this.position.set(x, y);
        this.life = life;
    }

    /**
     * キャラクターの状態を更新し描画を行う
     */
    update(){
        if(this.life<=0){return;}
        // 画面外はライフ0
        if(this.position.y - this.height > this.ctx.canvas.height){
            this.life = 0;
        }
        // 進行方向へ移動
        this.position.x += this.vector.x * this.speed;
        this.position.y += this.vector.y * this.speed;

        // 描画
        this.draw();
    }
}

/*
 * Shot クラス
 */
class Shot extends Character {
    constructor(ctx, x, y, w, h, imagePath){
        super(ctx, x, y, w, h, 0, imagePath);

        // 自身の移動スピード
        this.speed = 7;
        
        // shotの進行方向
        this.vector = new Position(0.0, -1.0);
    }
    // shotを配置する
    set(x, y){
        this.position.set(x, y);
        this.life = 1;
    }

    // ショットの進行方向を設定する
    setVector(x, y){
        this.vector.set(x, y);
    }

    update(){
        if(this.life <= 0){return ;}
        if(this.position.y + this.height < 0){
            this.life = 0;
        }

        // shotの移動
        this.position.x += this.vector.x * this.speed;
        this.position.y += this.vector.y * this.speed;

        // 描画
        this.rotationDraw();
    }
}