const CONFIG = {
    IMAGES: [
        '06ed9efbe6cd7b89347f779a492442a7d8330e80.jpg',
        '4cc5ac0928381f30090ac0b0ef014c086f06f081.jpg',
        '5f5b601249540923aeb33a67d458d109b2de4939.jpg',
        '65afe8a88226cffcd83af2abff014a90f703ea80.jpg',
        '7f8476c551da81cba6a1ced41466d01608243154.jpg',
        '88450f0e4bfbfbed4ea64f673ef0f736aec31f13.gif',
        '9d287e638535e5dda93ce8c630c6a7efcf1b6287.jpg',
        'a22590c69f3df8dc45e6d6888b11728b46102838.jpg'
    ],
    INITIAL_COUNT: 5,
    MAX_COUNT: 12,
    SPEED_MIN: 0.5,
    SPEED_MAX: 1.5,
    SIZE_MIN: 50,
    SIZE_MAX: 100,
    POPUP_SIZE_MIN: 40,
    POPUP_SIZE_MAX: 70,
    POPUP_DURATION: 2500,
    MIN_DISTANCE: 130,
    HORIZONTAL_GAP: 200,
    CLICK_THRESHOLD: 10
};

let phoebeCount = 0;
let clickCount = 0;
const phoebeList = [];
const container = document.getElementById('scrollContainer');
const counterValue = document.getElementById('counterValue');

function getRandomSize() {
    return Math.random() * (CONFIG.SIZE_MAX - CONFIG.SIZE_MIN) + CONFIG.SIZE_MIN;
}

function getRandomSpeed() {
    return Math.random() * (CONFIG.SPEED_MAX - CONFIG.SPEED_MIN) + CONFIG.SPEED_MIN;
}

function getRandomImage() {
    return CONFIG.IMAGES[Math.floor(Math.random() * CONFIG.IMAGES.length)];
}

function getRandomPopupSize() {
    return Math.random() * (CONFIG.POPUP_SIZE_MAX - CONFIG.POPUP_SIZE_MIN) + CONFIG.POPUP_SIZE_MIN;
}

function checkOverlap(x, y, size, speed = 0) {
    const threshold = CONFIG.MIN_DISTANCE + size / 2;
    
    for (const phoebe of phoebeList) {
        const cx = parseFloat(phoebe.el.style.left);
        const cy = parseFloat(phoebe.el.style.top);
        const cs = phoebe.size;
        
        const distance = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
        
        if (distance < threshold + cs / 2) {
            return true;
        }
        
        if (x > cx && speed > 0) {
            const speedDiff = speed - phoebe.speed;
            if (speedDiff > 0) {
                const timeToCollision = (x - cx) / speedDiff;
                if (timeToCollision > 0 && timeToCollision < 300 && Math.abs(y - cy) < threshold + cs / 2) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

function findValidPosition(size, speed = 0, isNewEntry = false) {
    let attempts = 0;
    const maxAttempts = 200;
    
    while (attempts < maxAttempts) {
        let x, y;
        
        if (isNewEntry) {
            x = window.innerWidth + 200;
            
            const rightMost = phoebeList.reduce((max, c) => {
                const cx = parseFloat(c.el.style.left);
                return Math.max(max, cx);
            }, 0);
            
            x = Math.max(x, rightMost + CONFIG.HORIZONTAL_GAP + Math.random() * 200);
            y = Math.random() * (window.innerHeight - 150) + 80;
        } else {
            x = Math.random() * window.innerWidth;
            y = Math.random() * (window.innerHeight - 150) + 80;
        }
        
        if (!checkOverlap(x, y, size, speed)) {
            return { x, y };
        }
        
        attempts++;
    }
    
    return {
        x: window.innerWidth + 200,
        y: Math.random() * (window.innerHeight - 150) + 80
    };
}

function createPhoebeElement(isPopup = false, x = 0, y = 0) {
    const el = document.createElement('div');
    const size = isPopup ? getRandomPopupSize() : getRandomSize();
    const imgSrc = 'assets/images/' + getRandomImage();
    
    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.width = size + 'px';
    img.style.height = size + 'px';
    img.style.objectFit = 'contain';
    img.style.borderRadius = '12px';
    img.draggable = false;
    
    el.appendChild(img);
    
    if (isPopup) {
        el.className = 'phoebe-popup';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        
        document.body.appendChild(el);
        
        setTimeout(() => {
            el.remove();
        }, CONFIG.POPUP_DURATION);
    } else {
        if (phoebeList.length >= CONFIG.MAX_COUNT) {
            return;
        }
        
        el.className = 'phoebe-item';
        
        const speed = getRandomSpeed();
        const pos = findValidPosition(size, speed, true);
        
        el.style.left = pos.x + 'px';
        el.style.top = pos.y + 'px';
        
        const phoebe = {
            el: el,
            speed: speed,
            size: size,
            id: phoebeCount++
        };
        
        phoebeList.push(phoebe);
        container.appendChild(el);
    }
}

function updateScrollAnimation() {
    phoebeList.forEach((phoebe) => {
        const currentLeft = parseFloat(phoebe.el.style.left);
        phoebe.el.style.left = (currentLeft - phoebe.speed) + 'px';

        if (currentLeft < -300) {
            const size = getRandomSize();
            const speed = getRandomSpeed();
            const pos = findValidPosition(size, speed, true);
            const imgSrc = 'assets/images/' + getRandomImage();
            
            phoebe.el.style.left = pos.x + 'px';
            phoebe.el.style.top = pos.y + 'px';
            phoebe.size = size;
            phoebe.speed = speed;
            
            const img = phoebe.el.querySelector('img');
            img.src = imgSrc;
            img.style.width = size + 'px';
            img.style.height = size + 'px';
        }
    });

    requestAnimationFrame(updateScrollAnimation);
}

function playAudioFile() {
    const audioFiles = ['phoebe_01.mp3', 'phoebe_02.mp3', 'phoebe_03.wav'];
    const randomFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];
    const audio = new Audio('assets/audio/' + randomFile);
    audio.volume = 0.5;
    
    audio.addEventListener('error', () => {
        console.log('音频文件未找到，使用Web Audio API生成提示音');
        playToneSound();
    });
    
    audio.play().catch(() => {
        playToneSound();
    });
}

function playToneSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 600);
}

function triggerEasterEgg() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const angle = (i / 20) * Math.PI * 2;
            const radius = 100 + Math.random() * 200;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            const popup = document.createElement('div');
            const img = document.createElement('img');
            img.src = 'assets/images/' + getRandomImage();
            img.style.width = '50px';
            img.style.height = '50px';
            img.style.objectFit = 'contain';
            img.style.borderRadius = '12px';
            img.draggable = false;
            popup.appendChild(img);
            
            popup.className = 'phoebe-popup';
            popup.style.left = x + 'px';
            popup.style.top = y + 'px';
            document.body.appendChild(popup);
            
            setTimeout(() => {
                popup.remove();
            }, CONFIG.POPUP_DURATION);
        }, i * 50);
    }
    
    playToneSound();
    setTimeout(playToneSound, 150);
    setTimeout(playToneSound, 300);
}

function handleClick(e) {
    createPhoebeElement(true, e.clientX, e.clientY);
    createClickEffect(e.clientX, e.clientY);
    playAudioFile();
    
    clickCount++;
    counterValue.textContent = clickCount;
    
    if (clickCount > 0 && clickCount % CONFIG.CLICK_THRESHOLD === 0) {
        triggerEasterEgg();
    }
}

function tryAddNewPhoebe() {
    if (phoebeList.length < CONFIG.MAX_COUNT) {
        createPhoebeElement();
    }
}

function init() {
    
    document.addEventListener('click', handleClick);
    
    for (let i = 0; i < CONFIG.INITIAL_COUNT; i++) {
        const el = document.createElement('div');
        const size = getRandomSize();
        const imgSrc = 'assets/images/' + getRandomImage();
        
        const img = document.createElement('img');
        img.src = imgSrc;
        img.style.width = size + 'px';
        img.style.height = size + 'px';
        img.style.objectFit = 'contain';
        img.style.borderRadius = '12px';
        img.draggable = false;
        
        el.appendChild(img);
        el.className = 'phoebe-item';
        
        const pos = findValidPosition(size);
        
        el.style.left = pos.x + 'px';
        el.style.top = pos.y + 'px';
        
        const phoebe = {
            el: el,
            speed: getRandomSpeed(),
            size: size,
            id: phoebeCount++
        };
        
        phoebeList.push(phoebe);
        container.appendChild(el);
    }
    
    updateScrollAnimation();
    
    setInterval(() => {
        tryAddNewPhoebe();
    }, 4000);
}

init();