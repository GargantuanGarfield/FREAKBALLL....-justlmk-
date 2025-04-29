export class Player{
    constructor(isSolid, finalBall, powerup1, powerup2, powerup3){
        this.isSolid = isSolid;
        this.finalBall = finalBall;
        this.powerup1 = powerup1;
        this.powerup2 = powerup2;
        this.powerup3 = powerup3;
    }

    setSuit(suit){
        if (suit == "solid"){
            this.isSolid = true;
        } else {
            this.isSolid = false;
        }
    }

    setPowerUp(name, num){
        switch (num){
            case 1 : this.powerup1 = name;
            case 2 : this.powerup2 = name;
            case 3 : this.powerup3 = name;
        }
    }

    getPowerUp(num){
        switch (num){
            case 1 : return this.powerup1;
            case 2 : return this.powerup2;
            case 3 : return this.powerup3;
        }
    }
}