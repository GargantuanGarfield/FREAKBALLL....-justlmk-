import { balls } from './physics.js';

const EFFECT_DURATION = 1; // Duration in turns
const EFFECT_CHANCE = 0.35; // 35% chance of an effect occurring

export const EFFECTS = {
    GAY_MODE: 'GAY_MODE',
    BUMPER_WALLS: 'BUMPER_WALLS',
    HARD_MODE: 'HARD_MODE',
    STICKY_MODE: 'STICKY_MODE',
    BIG_BALLS: 'BIG_BALLS',
    BOMB: 'BOMB',
    NONE: 'NONE'
};

export class EffectManager {
    constructor() {
        this.currentEffect = EFFECTS.NONE;
        this.turnsRemaining = 0;
        this.originalBallColors = [];
        this.originalFriction = 0.98;
        this.originalCueBallRadius = 10;
        this.bumperHits = 0;
        this.maxBumperHits = 5;
        this.effectMessage = document.createElement('div');
        this.setupEffectMessage();
    }

    setupEffectMessage() {
        this.effectMessage = document.createElement('img');
        this.effectMessage.id = 'effect-message';
        this.effectMessage.style.position = 'fixed';
        this.effectMessage.style.top = '50%';
        this.effectMessage.style.left = '50%';
        this.effectMessage.style.transform = 'translate(-50%, -50%) scale(0.8)';
        this.effectMessage.style.opacity = '0';
        this.effectMessage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        this.effectMessage.style.width = '800px';
        this.effectMessage.style.height = 'auto';
        this.effectMessage.style.zIndex = '9999';
        this.effectMessage.style.display = 'none';
        this.effectMessage.draggable = 'false';
        document.body.appendChild(this.effectMessage);
    }
    
    

    rollForEffect() {
        if (this.turnsRemaining > 0) {
            this.turnsRemaining--;
            if (this.turnsRemaining === 0) {
                this.endCurrentEffect();
            }
            return false; // No new effect while one is active
        }

        if (Math.random() < EFFECT_CHANCE) {
            const effects = Object.values(EFFECTS).filter(effect => effect !== EFFECTS.NONE);
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            this.activateEffect(randomEffect);
            return true;
        }
        return false;
    }

    activateEffect(effectType) {
        this.endCurrentEffect(); // End any current effect first
        this.currentEffect = effectType;
        this.turnsRemaining = EFFECT_DURATION;
        
        switch (effectType) {
            case EFFECTS.GAY_MODE:
                this.activateGayMode();
                break;
            case EFFECTS.BUMPER_WALLS:
                this.activateBumperWalls();
                break;
            case EFFECTS.HARD_MODE:
                this.activateHardMode();
                break;
            case EFFECTS.STICKY_MODE:
                this.activateStickyMode();
                break;
            case EFFECTS.BIG_BALLS:
                this.activateBigBalls();
                break;
            case EFFECTS.BOMB:
                this.activateBomb();
                break;
        }

        this.showEffectMessage(effectType);
    }

    endCurrentEffect() {
        switch (this.currentEffect) {
            case EFFECTS.GAY_MODE:
                this.deactivateGayMode();
                break;
            case EFFECTS.BUMPER_WALLS:
                this.deactivateBumperWalls();
                break;
            case EFFECTS.HARD_MODE:
                this.deactivateHardMode();
                break;
            case EFFECTS.STICKY_MODE:
                this.deactivateStickyMode();
                break;
            case EFFECTS.BIG_BALLS:
                this.deactivateBigBalls();
                break;
        }
        this.currentEffect = EFFECTS.NONE;
        this.hideEffectMessage();
    }

    showEffectMessage(effectType) {
        let imageSrc = '';
        let soundSrc;
    
        switch (effectType) {
            case EFFECTS.GAY_MODE:
                imageSrc = '/imgs/gay.png';
                soundSrc = '/sounds/gay.mp3';
                break;
            case EFFECTS.BUMPER_WALLS:
                imageSrc = '/imgs/boing.png';
                soundSrc = '/sounds/BumperBoing.mp3';
                break;
            case EFFECTS.HARD_MODE:
                imageSrc = '/imgs/hard.png';
                soundSrc = '/sounds/hard.mp3';
                break;
            case EFFECTS.STICKY_MODE:
                imageSrc = '/imgs/sticky.png';
                soundSrc = '/sounds/splat.mp3';
                break;
            case EFFECTS.BIG_BALLS:
                imageSrc = '/imgs/bigballs.png';
                soundSrc = '/sounds/OhMyGah.mp3';
                break;
        }
    
        this.effectMessage.src = imageSrc;
        this.effectMessage.style.display = 'block';
    
        requestAnimationFrame(() => {
            this.effectMessage.style.opacity = '1';
            this.effectMessage.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    
        // Play sound
        const effectSound = new Audio(soundSrc);
        const alarmSound  = new Audio('/sounds/alarm.mp3');
        effectSound.volume = 0.6;
        effectSound.play();
        alarmSound.play();
    
    
        // Hide after 3s with fade-out
        setTimeout(() => {
            this.effectMessage.style.opacity = '0';
            this.effectMessage.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => this.hideEffectMessage(), 500); // match transition time
        }, 3000);
    }
    
    
    hideEffectMessage() {
        this.effectMessage.style.display = 'none';
    }

    shouldShowPath() {
        return this.currentEffect !== EFFECTS.HARD_MODE;
    }

    isBumperWallsActive() {
        return this.currentEffect === EFFECTS.BUMPER_WALLS;
    }

    registerBumperHit(ball) {
        if (this.isBumperWallsActive() && this.bumperHits < this.maxBumperHits) {
            this.bumperHits++;
            const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
            const angle = Math.atan2(ball.vy, ball.vx);
            const newSpeed = speed * 1.2;
            ball.vx = Math.cos(angle) * newSpeed;
            ball.vy = Math.sin(angle) * newSpeed;
        }
    }

    resetBumperHits() {
        this.bumperHits = 0;
    }

    getFrictionFactor() {
        return this.currentEffect === EFFECTS.STICKY_MODE ? 0.94 : this.originalFriction;
    }

    activateGayMode() {
        this.originalBallColors = balls.map(ball => ({ id: ball.id, color: ball.color }));
        
        const rainbowColors = [
            '#FF0000', // Red
            '#FF7F00', // Orange
            '#FFFF00', // Yellow
            '#00FF00', // Green
            '#0000FF', // Blue
            '#4B0082', // Indigo
            '#9400D3'  // Violet
        ];
        
        balls.forEach(ball => {
            if (ball.suit !== 'cue') {
                const colorIndex = Math.floor(Math.random() * rainbowColors.length);
                ball.color = rainbowColors[colorIndex];
            }
        });
    }

    deactivateGayMode() {
        this.originalBallColors.forEach(original => {
            const ball = balls.find(b => b.id === original.id);
            if (ball) {
                ball.color = original.color;
            }
        });
    }

    activateBumperWalls() {
        this.resetBumperHits();
    }

    deactivateBumperWalls() {
        this.resetBumperHits();
    }

    activateHardMode() {
    }

    deactivateHardMode() {
    }

    activateStickyMode() {
    }

    deactivateStickyMode() {
    }

    activateBigBalls() {
        this.originalCueBallRadius = balls[0].radius;
        balls[0].radius = 170; // Make cue ball 3x larger
    }

    deactivateBigBalls() {
        balls[0].radius = this.originalCueBallRadius;
    }

    activateBomb() {
        const bombSound = new Audio('/sounds/Blackhole.wav');
        bombSound.play();
    
        const center = { x: balls[0].x, y: balls[0].y };

        balls.forEach(ball => {
            if (ball.suit !== "cue") {
                let dx = ball.x - center.x;
                let dy = ball.y - center.y;
                let dist = Math.max(Math.hypot(dx, dy), 1);

                // Push outward instead of inward
                let force = 20 * (1 - dist / 300); // increase radius if needed
                force = Math.max(force, 100); // ensure minimum push

                ball.vx += (dx / dist) * force;
                ball.vy += (dy / dist) * force;
            }
        });


        const canvas = document.getElementById('table');
        const rect = canvas.getBoundingClientRect();

        const img = document.createElement('img');
        img.src = '/imgs/explodee.gif';
        img.style.position = 'absolute';
        img.style.left = `${rect.left + center.x - 75}px`;
        img.style.top = `${rect.top + center.y - 75}px`;
        img.style.width = '150px';
        img.style.height = '150px';
        img.style.zIndex = 9998;
        img.style.opacity = '0.9';
        img.style.transition = 'opacity 0.6s ease';
        document.body.appendChild(img);

        setTimeout(() => {
            img.style.opacity = '0';
            setTimeout(() => img.remove(), 400);
        }, 200);
    }
}