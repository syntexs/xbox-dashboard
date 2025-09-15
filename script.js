// Xbox Dashboard JavaScript - Interactive Functionality

class XboxDashboard {
    constructor() {
        this.currentTab = 'home';
        this.selectedItem = null;
        this.init();
    }

    init() {
        this.updateClock();
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.startClock();
        this.addSoundEffects();
    }

    // Update the clock display
    updateClock() {
        const clockElement = document.getElementById('clock');
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        clockElement.textContent = timeString;
    }

    // Start the clock update interval
    startClock() {
        setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    // Setup event listeners for navigation
    setupEventListeners() {
        // Tab navigation
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });

            // Add hover sound effect
            tab.addEventListener('mouseenter', () => {
                this.playSound('hover');
            });
        });

        // Game items
        const gameItems = document.querySelectorAll('.game-item');
        gameItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectItem(item, 'game');
            });
        });

        // Music items
        const musicItems = document.querySelectorAll('.music-item');
        musicItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectItem(item, 'music');
            });
        });

        // Video items
        const videoItems = document.querySelectorAll('.video-item');
        videoItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectItem(item, 'video');
            });
        });

        // Setting items
        const settingItems = document.querySelectorAll('.setting-item');
        settingItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectItem(item, 'setting');
            });
        });

        // Action buttons
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleActionButton(button);
            });
        });
    }

    // Setup keyboard navigation (Xbox controller simulation)
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.navigateLeft();
                    break;
                case 'ArrowRight':
                    this.navigateRight();
                    break;
                case 'ArrowUp':
                    this.navigateUp();
                    break;
                case 'ArrowDown':
                    this.navigateDown();
                    break;
                case 'Enter':
                case ' ':
                    this.selectCurrentItem();
                    break;
                case 'Escape':
                    this.goBack();
                    break;
            }
        });
    }

    // Switch between tabs
    switchTab(tabName) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;
        this.selectedItem = null;
        this.playSound('tabSwitch');
    }

    // Select an item
    selectItem(item, type) {
        // Remove selection from all items
        document.querySelectorAll('.game-item, .music-item, .video-item, .setting-item').forEach(el => {
            el.classList.remove('selected');
        });

        // Add selection to clicked item
        item.classList.add('selected');
        this.selectedItem = item;
        this.playSound('select');
    }

    // Handle action button clicks
    handleActionButton(button) {
        const action = button.textContent.toLowerCase();
        this.playSound('action');

        // Simulate action based on button text
        switch (action) {
            case 'play':
                this.showNotification(`Starting ${this.getSelectedItemTitle()}...`);
                break;
            case 'copy':
                this.showNotification(`Copying ${this.getSelectedItemTitle()}...`);
                break;
            case 'delete':
                this.showNotification(`Deleting ${this.getSelectedItemTitle()}...`);
                break;
        }
    }

    // Get the title of the currently selected item
    getSelectedItemTitle() {
        if (!this.selectedItem) return 'item';

        const titleElement = this.selectedItem.querySelector('.game-title, .music-title, .video-title, .setting-title');
        return titleElement ? titleElement.textContent : 'item';
    }

    // Navigation methods (for keyboard/controller support)
    navigateLeft() {
        const currentTabIndex = Array.from(document.querySelectorAll('.nav-tab')).findIndex(tab =>
            tab.classList.contains('active')
        );
        if (currentTabIndex > 0) {
            const prevTab = document.querySelectorAll('.nav-tab')[currentTabIndex - 1];
            this.switchTab(prevTab.dataset.tab);
        }
    }

    navigateRight() {
        const currentTabIndex = Array.from(document.querySelectorAll('.nav-tab')).findIndex(tab =>
            tab.classList.contains('active')
        );
        const allTabs = document.querySelectorAll('.nav-tab');
        if (currentTabIndex < allTabs.length - 1) {
            const nextTab = allTabs[currentTabIndex + 1];
            this.switchTab(nextTab.dataset.tab);
        }
    }

    navigateUp() {
        // Implement vertical navigation within current tab
        this.playSound('navigate');
    }

    navigateDown() {
        // Implement vertical navigation within current tab
        this.playSound('navigate');
    }

    selectCurrentItem() {
        if (this.selectedItem) {
            this.selectedItem.click();
        }
    }

    goBack() {
        this.playSound('back');
        // Implement back navigation logic
    }

    // Sound effects (using Web Audio API for authentic Xbox sounds)
    addSoundEffects() {
        this.audioContext = null;
        this.sounds = {};

        // Initialize audio context on first user interaction
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });
    }

    playSound(type) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Different sound frequencies for different actions
        switch (type) {
            case 'hover':
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.1);
                break;
            case 'select':
                oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.2);
                break;
            case 'tabSwitch':
                oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.2);
                break;
            case 'action':
                oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.25, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.3);
                break;
            case 'navigate':
                oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.1);
                break;
            case 'back':
                oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.2);
                break;
        }
    }

    // Show notification (simulating Xbox notifications)
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'xbox-notification';
        notification.textContent = message;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #00ff00;
            border-radius: 8px;
            padding: 20px 30px;
            color: #00ff00;
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            font-size: 1.2rem;
            text-shadow: 0 0 10px #00ff00;
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
            z-index: 1000;
            animation: notificationSlideIn 0.3s ease-out;
        `;

        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes notificationSlideIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -60%);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                    }
                }
                @keyframes notificationSlideOut {
                    from {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                    }
                    to {
                        opacity: 0;
                        transform: translate(-50%, -40%);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'notificationSlideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Add some dynamic effects
    addDynamicEffects() {
        // Add random sparkle effects
        setInterval(() => {
            this.createSparkle();
        }, 2000);

        // Add subtle background animation
        this.animateBackground();
    }

    createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #00ff00;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            box-shadow: 0 0 10px #00ff00;
            animation: sparkleAnimation 2s ease-out forwards;
        `;

        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';

        // Add sparkle animation
        if (!document.querySelector('#sparkle-styles')) {
            const style = document.createElement('style');
            style.id = 'sparkle-styles';
            style.textContent = `
                @keyframes sparkleAnimation {
                    0% {
                        opacity: 0;
                        transform: scale(0);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(sparkle);

        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 2000);
    }

    animateBackground() {
        const dashboard = document.querySelector('.xbox-dashboard');
        let time = 0;

        setInterval(() => {
            time += 0.01;
            const x = Math.sin(time) * 10;
            const y = Math.cos(time * 0.7) * 10;

            dashboard.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
        }, 50);
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new XboxDashboard();
    dashboard.addDynamicEffects();

    // Add some initial sparkles
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            dashboard.createSparkle();
        }, i * 200);
    }
});

// Enhanced visual effects for the spaceship control panel feel
const enhancedEffects = `
    /* Additional depth effects */
    .xbox-dashboard {
        perspective: 2000px;
    }
    
    /* Subtle parallax effect on scroll */
    .main-content {
        transform-style: preserve-3d;
    }
    
    /* Enhanced glow for active elements */
    .nav-tab.active .tab-icon,
    .game-item.selected .game-icon,
    .music-item.selected .music-icon,
    .video-item.selected .video-icon,
    .setting-item.selected .setting-icon {
        filter: drop-shadow(0 0 15px #00ff00) drop-shadow(0 0 25px #00ff00);
        animation: iconPulse 2s ease-in-out infinite alternate;
    }
    
    @keyframes iconPulse {
        from {
            filter: drop-shadow(0 0 15px #00ff00) drop-shadow(0 0 25px #00ff00);
        }
        to {
            filter: drop-shadow(0 0 20px #00ff00) drop-shadow(0 0 35px #00ff00);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = enhancedEffects;
document.head.appendChild(styleSheet);
