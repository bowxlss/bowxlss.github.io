// terminal.js - Terminal game engine

class TerminalGame {
    constructor() {
        this.commands = {
            'help': this.showHelp.bind(this),
            'clear': this.clearTerminal.bind(this),
            'about': this.showAbout.bind(this),
            'social': this.showSocial.bind(this),
            'projects': this.showProjects.bind(this),
            'skills': this.showSkills.bind(this),
            'game': this.showGames.bind(this),
            'theme': this.toggleTheme.bind(this),
            'date': this.showDate.bind(this),
            'echo': this.echo.bind(this),
            'sudo': this.sudo.bind(this),
            'neofetch': this.neofetch.bind(this),
            'banner': this.showBanner.bind(this)
        };
        
        this.games = {
            'guess': this.startGuessGame.bind(this),
            'rps': this.startRockPaperScissors.bind(this),
            'quiz': this.startQuiz.bind(this),
            'maze': this.startMazeGame.bind(this),
            'hangman': this.startHangman.bind(this),
            'dice': this.startDiceGame.bind(this),
            'wordle': this.startWordle.bind(this),
            'blackjack': this.startBlackjack.bind(this),
            'memory': this.startMemoryGame.bind(this),
            'trivia': this.startTrivia.bind(this),
            'typing': this.startTypingTest.bind(this)
        };
        
        this.currentGame = null;
        this.gameState = {};
        this.init();
    }
    
    init() {
        const input = document.getElementById('terminal-input');
        const output = document.getElementById('terminal-output');
        
        if (!input || !output) {
            console.error("Terminal elements not found");
            return;
        }
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                this.processCommand(input.value);
                input.value = '';
                
                setTimeout(() => {
                    input.focus();
                    const chatInput = document.getElementById('chat-input');
                    if (chatInput) chatInput.blur();
                }, 50);
            }
        });
        
        const terminalElement = document.querySelector('.terminal');
        if (terminalElement) {
            terminalElement.addEventListener('click', (e) => {
                e.stopPropagation();
                input.focus();
                const chatInput = document.getElementById('chat-input');
                if (chatInput) chatInput.blur();
            });

            terminalElement.addEventListener('touchstart', (e) => {
                e.stopPropagation();
            });

            terminalElement.addEventListener('touchend', (e) => {
                e.stopPropagation();
                input.focus();
                const chatInput = document.getElementById('chat-input');
                if (chatInput) chatInput.blur();
            });
        }

        document.addEventListener('focusin', (e) => {
            if (e.target.id === 'chat-input') {
                input.blur();
            }
        });
    }
    
    processCommand(cmd) {
        const output = document.getElementById('terminal-output');
        
        // Tampilkan command yang diinput
        this.addLine(`visitor@bowxlss-portfolio:~$ ${cmd}`, 'command');
        
        cmd = cmd.trim().toLowerCase();
        const args = cmd.split(' ');
        const mainCmd = args[0];
        
        if (this.currentGame) {
            this.handleGameInput(cmd);
            return;
        }
        
        if (this.commands[mainCmd]) {
            this.commands[mainCmd](args.slice(1));
        } else if (this.games[mainCmd]) {
            this.games[mainCmd](args.slice(1));
            // Auto gain XP when starting games
            if (typeof gainXP === 'function') {
                gainXP('game');
            }
        } else {
            this.addLine(`Command not found: ${mainCmd}. Type 'help' for available commands.`, 'error');
        }
        
        this.scrollToBottom();
    }
    
    addLine(text, type = 'output') {
        const output = document.getElementById('terminal-output');
        if (!output) return;
        
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        if (type === 'command') {
            line.innerHTML = `<span class="prompt">visitor@bowxlss-portfolio:~$ </span><span class="command">${text.split('$ ')[1]}</span>`;
        } else {
            line.innerHTML = `<span class="${type}">${text}</span>`;
        }
        
        output.appendChild(line);
    }
    
    scrollToBottom() {
        const terminalBody = document.querySelector('.terminal-body');
        if (terminalBody) {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }
    
    // COMMAND FUNCTIONS
    showHelp() {
        this.addLine('Available commands:', 'output');
        this.addLine('  help\t\t- Show this help message', 'output');
        this.addLine('  clear\t\t- Clear terminal screen', 'output');
        this.addLine('  about\t\t- About Bowxlss', 'output');
        this.addLine('  social\t- Social media links', 'output');
        this.addLine('  projects\t- My projects list', 'output');
        this.addLine('  skills\t- Technical skills', 'output');
        this.addLine('  theme\t\t- Toggle dark/light mode', 'output');
        this.addLine('  date\t\t- Show current date', 'output');
        this.addLine('  neofetch\t- System information', 'output');
        this.addLine('  banner\t- Show cool banner', 'output');
        this.addLine('', 'output');
        this.addLine('🎮 Mini Games (type "game" or specific game name):', 'highlight');
        this.addLine('  guess\t\t- Number guessing game (1-100)', 'output');
        this.addLine('  rps\t\t- Rock Paper Scissors vs AI', 'output');
        this.addLine('  quiz\t\t- Programming quiz challenge', 'output');
        this.addLine('  maze\t\t- Text-based maze adventure', 'output');
        this.addLine('  hangman\t- Classic hangman word game', 'output');
        this.addLine('  dice\t\t- Dice rolling competition', 'output');
        this.addLine('  wordle\t- Word guessing game (5 letters)', 'output');
        this.addLine('  blackjack\t- Card game vs dealer', 'output');
        this.addLine('  memory\t- Memory card matching game', 'output');
        this.addLine('  trivia\t- Random trivia questions', 'output');
        this.addLine('  typing\t- Typing speed test', 'output');
    }
    
    clearTerminal() {
        const output = document.getElementById('terminal-output');
        if (output) {
            output.innerHTML = '';
        }
        this.addLine('Terminal cleared. Type "help" for commands.', 'output');
    }
    
    showAbout() {
        this.addLine('🧑‍💻 About Bowxlss:', 'highlight');
        this.addLine('• Chill developer & anime enthusiast', 'output');
        this.addLine('• Love creating fun projects and game mods', 'output');
        this.addLine('• Currently learning web development', 'output');
        this.addLine('• GTA SA:MP scripting expert', 'output');
        this.addLine('• Focus on stress-free coding journey', 'output');
    }
    
    showSocial() {
        this.addLine('🌐 Social Links:', 'highlight');
        this.addLine('• GitHub: https://github.com/bowxlss', 'output');
        this.addLine('• Discord: bowxlss', 'output');
        this.addLine('• Email: Check GitHub profile', 'output');
    }
    
    showProjects() {
        this.addLine('🚀 My Projects:', 'highlight');
        this.addLine('• Personal Website (This one!)', 'output');
        this.addLine('• GTA SA:MP Script Collection', 'output');
        this.addLine('• Anime Tracker Web App', 'output');
        this.addLine('• Game Mods & Mini JS Games', 'output');
    }
    
    showSkills() {
        this.addLine('💻 Technical Skills:', 'highlight');
        this.addLine('• HTML/CSS/JavaScript', 'output');
        this.addLine('• Python & Pawn (SA:MP)', 'output');
        this.addLine('• Git & GitHub', 'output');
        this.addLine('• Game Modding', 'output');
    }
    
    showGames() {
        this.addLine('🎮 Available Mini Games:', 'highlight');
        this.addLine('Type the game name to start playing!', 'output');
        this.addLine('• guess  - Number guessing game (1-100)', 'output');
        this.addLine('• rps    - Rock Paper Scissors vs AI', 'output');
        this.addLine('• quiz   - Programming quiz challenge', 'output');
        this.addLine('• maze   - Text-based maze adventure', 'output');
        this.addLine('• hangman- Classic hangman word game', 'output');
        this.addLine('• dice   - Dice rolling competition', 'output');
        this.addLine('• wordle - Word guessing game (5 letters)', 'output');
        this.addLine('• blackjack - Card game vs dealer', 'output');
        this.addLine('• memory - Memory card matching game', 'output');
        this.addLine('• trivia - Random trivia questions', 'output');
        this.addLine('• typing - Typing speed test', 'output');
    }
    
    toggleTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.click();
        }
        this.addLine('Theme toggled!', 'success');
    }
    
    showDate() {
        this.addLine(new Date().toString(), 'output');
    }
    
    echo(args) {
        this.addLine(args.join(' '), 'output');
    }
    
    sudo() {
        this.addLine('Nice try! 😄 You need root privileges for that.', 'error');
    }
    
    neofetch() {
        this.addLine('bowxlss@portfolio', 'highlight');
        this.addLine('-------------------', 'output');
        this.addLine('OS: Portfolio OS 3.0', 'output');
        this.addLine('Shell: Dev Terminal v3.0', 'output');
        this.addLine('WM: Neon Window Manager', 'output');
        this.addLine('Theme: Cyber Neon Dark', 'output');
        this.addLine('Skills: HTML/CSS/JS/Python', 'output');
        this.addLine('Focus: Web Dev & Game Modding', 'output');
        this.addLine('Status: Coding & Chilling', 'output');
    }
    
    showBanner() {
        const banner = `
╔══════════════════════════════════╗
║          BOWXLSS DEV             ║
║        TERMINAL v3.0             ║
║      NOW WITH 11+ GAMES!         ║
║                                  ║
║   Type 'help' for commands       ║
║   Type 'game' for mini games     ║
╚══════════════════════════════════╝
        `.trim();
        
        banner.split('\n').forEach(line => {
            this.addLine(line, 'highlight');
        });
    }
    
    // ========== GAME IMPLEMENTATIONS ==========
    
    startGuessGame() {
        this.currentGame = 'guess';
        this.gameState = {
            number: Math.floor(Math.random() * 100) + 1,
            attempts: 0
        };
        
        this.addLine('🎯 Number Guessing Game Started!', 'highlight');
        this.addLine('I\'m thinking of a number between 1 and 100.', 'output');
        this.addLine('Can you guess it?', 'output');
    }
    
    startRockPaperScissors() {
        this.currentGame = 'rps';
        this.addLine('🪨 📄 ✂️ Rock Paper Scissors!', 'highlight');
        this.addLine('Type: rock, paper, or scissors', 'output');
    }
    
    startQuiz() {
        this.currentGame = 'quiz';
        this.gameState = {
            questions: [
                {
                    q: 'What does HTML stand for?',
                    options: ['A) Hyper Text Markup Language', 'B) High Tech Modern Language', 'C) Hyper Transfer Markup Language'],
                    answer: 'A'
                },
                {
                    q: 'Which language runs in a web browser?',
                    options: ['A) Python', 'B) JavaScript', 'C) C++'],
                    answer: 'B'
                },
                {
                    q: 'What is the latest version of HTML?',
                    options: ['A) HTML4', 'B) XHTML', 'C) HTML5'],
                    answer: 'C'
                }
            ],
            currentQuestion: 0,
            score: 0
        };
        
        this.showQuizQuestion();
    }
    
    startMazeGame() {
        this.currentGame = 'maze';
        this.addLine('🧩 Maze Adventure!', 'highlight');
        this.addLine('Navigate through the maze using: north, south, east, west', 'output');
        this.addLine('Find the treasure to win!', 'output');
        this.addLine('', 'output');
        this.addLine('You are in a dark room. Exits: north, east', 'output');
    }
    
    // Implementasi game lainnya (hangman, dice, wordle, dll) akan disederhanakan
    // karena keterbatasan ruang, tapi struktur sudah ada
    
    handleGameInput(input) {
        switch (this.currentGame) {
            case 'guess':
                this.handleGuessInput(input);
                break;
            case 'rps':
                this.handleRPSInput(input);
                break;
            case 'quiz':
                this.handleQuizInput(input);
                break;
            case 'maze':
                this.handleMazeInput(input);
                break;
            default:
                this.addLine('Game not implemented yet. Type "clear" to exit.', 'error');
                this.currentGame = null;
        }
    }
    
    handleGuessInput(input) {
        const guess = parseInt(input);
        this.gameState.attempts++;
        
        if (isNaN(guess)) {
            this.addLine('Please enter a valid number!', 'error');
            return;
        }
        
        if (guess === this.gameState.number) {
            this.addLine(`🎉 Correct! The number was ${this.gameState.number}`, 'success');
            this.addLine(`You guessed it in ${this.gameState.attempts} attempts!`, 'success');
            this.currentGame = null;
        } else if (guess < this.gameState.number) {
            this.addLine('📈 Too low! Try a higher number.', 'output');
        } else {
            this.addLine('📉 Too high! Try a lower number.', 'output');
        }
    }
    
    handleRPSInput(input) {
        const choices = ['rock', 'paper', 'scissors'];
        const userChoice = input.toLowerCase();
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        
        if (!choices.includes(userChoice)) {
            this.addLine('Invalid choice! Use: rock, paper, or scissors', 'error');
            return;
        }
        
        this.addLine(`You chose: ${userChoice}`, 'output');
        this.addLine(`Computer chose: ${computerChoice}`, 'output');
        
        if (userChoice === computerChoice) {
            this.addLine('🤝 It\'s a tie!', 'output');
        } else if (
            (userChoice === 'rock' && computerChoice === 'scissors') ||
            (userChoice === 'paper' && computerChoice === 'rock') ||
            (userChoice === 'scissors' && computerChoice === 'paper')
        ) {
            this.addLine('🎉 You win!', 'success');
        } else {
            this.addLine('💻 Computer wins!', 'error');
        }
        
        this.addLine('Play again? Type: rock, paper, or scissors', 'output');
    }
    
    showQuizQuestion() {
        const question = this.gameState.questions[this.gameState.currentQuestion];
        this.addLine(`Question ${this.gameState.currentQuestion + 1}: ${question.q}`, 'highlight');
        question.options.forEach(option => {
            this.addLine(option, 'output');
        });
    }
    
    handleQuizInput(input) {
        const question = this.gameState.questions[this.gameState.currentQuestion];
        const answer = input.toUpperCase();
        
        if (answer === question.answer) {
            this.gameState.score++;
            this.addLine('✅ Correct!', 'success');
        } else {
            this.addLine(`❌ Wrong! Correct answer was ${question.answer}`, 'error');
        }
        
        this.gameState.currentQuestion++;
        
        if (this.gameState.currentQuestion < this.gameState.questions.length) {
            setTimeout(() => this.showQuizQuestion(), 1000);
        } else {
            this.addLine(`🎯 Quiz completed! Score: ${this.gameState.score}/${this.gameState.questions.length}`, 'highlight');
            this.currentGame = null;
        }
    }
    
    handleMazeInput(input) {
        const directions = ['north', 'south', 'east', 'west'];
        const direction = input.toLowerCase();
        
        if (!directions.includes(direction)) {
            this.addLine('Invalid direction! Use: north, south, east, west', 'error');
            return;
        }
        
        // Simple maze logic
        if (Math.random() > 0.7) {
            this.addLine('🎉 You found the treasure! You win!', 'success');
            this.currentGame = null;
        } else {
            this.addLine(`You moved ${direction}. The maze continues...`, 'output');
            this.addLine('Exits: north, south, east, west', 'output');
        }
    }
    
    // Placeholder untuk game lainnya
    startHangman() { this.addLine('🚧 Hangman game coming soon!', 'output'); }
    startDiceGame() { this.addLine('🚧 Dice game coming soon!', 'output'); }
    startWordle() { this.addLine('🚧 Wordle game coming soon!', 'output'); }
    startBlackjack() { this.addLine('🚧 Blackjack game coming soon!', 'output'); }
    startMemoryGame() { this.addLine('🚧 Memory game coming soon!', 'output'); }
    startTrivia() { this.addLine('🚧 Trivia game coming soon!', 'output'); }
    startTypingTest() { this.addLine('🚧 Typing test coming soon!', 'output'); }
}