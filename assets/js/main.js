const CONFIG = {
    IMAGES: [],
    INITIAL_COUNT: 5,
    MAX_COUNT: 15,
    SPEED_MIN: 0.5,
    SPEED_MAX: 1.5,
    SIZE_MIN: 120,
    SIZE_MAX: 195,
    POPUP_SIZE_MIN: 80,
    POPUP_SIZE_MAX: 120,
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
    const imgSrc = getRandomImage();
    
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
            const imgSrc = getRandomImage();
            
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
    const audioCount = 16;
    const randomNum = Math.floor(Math.random() * audioCount) + 1;
    const randomFile = `phoebe_${randomNum.toString().padStart(3, '0')}.mp3`;
    const audio = new Audio('assets/audio/' + randomFile);
    audio.volume = 0.5;
    audio.play();
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
            img.src = getRandomImage();
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

async function loadImages() {
    try {
        const response = await fetch('assets/images_nobg/');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a');
        
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && imageExtensions.some(ext => href.toLowerCase().endsWith(ext))) {
                const fileName = href.replace(/^.*[\\/]/, '');
                CONFIG.IMAGES.push('assets/images_nobg/' + fileName);
            }
        });
        
        CONFIG.IMAGES.sort();
        console.log(`加载了 ${CONFIG.IMAGES.length} 个图片`);
        
        // 预缓存所有图片，确保点击时立即显示
        const preloadPromises = CONFIG.IMAGES.map(src => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = resolve;
                img.src = src;
            });
        });
        await Promise.all(preloadPromises);
        console.log(`预缓存 ${CONFIG.IMAGES.length} 个图片完成`);
    } catch (error) {
        console.error('加载图片列表失败:', error);
    }
}

function tryAddNewPhoebe() {
    if (phoebeList.length < CONFIG.MAX_COUNT) {
        createPhoebeElement();
    }
}

async function init() {
    await loadImages();
    
    document.addEventListener('click', handleClick);
    
    for (let i = 0; i < CONFIG.INITIAL_COUNT; i++) {
        const el = document.createElement('div');
        const size = getRandomSize();
        const imgSrc = getRandomImage();
        
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