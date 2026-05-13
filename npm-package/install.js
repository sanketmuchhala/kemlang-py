#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🧡 Installing KemLang...');

function checkPython() {
    for (const cmd of ['python3', 'python']) {
        try {
            const version = execSync(`${cmd} --version`, { encoding: 'utf8' }).trim();
            console.log(`✓ Found ${version}`);
            return cmd;
        } catch (e) {}
    }
    console.error('❌ Python 3.10+ is required but not found.');
    console.error('   Install it from https://www.python.org/downloads/');
    process.exit(1);
}

function checkPip(python) {
    for (const cmd of ['pip', 'pip3', `${python} -m pip`]) {
        try {
            execSync(`${cmd} --version`, { encoding: 'utf8' });
            console.log('✓ pip is available');
            return cmd;
        } catch (e) {}
    }
    console.error('❌ pip not found. Install it with: python -m ensurepip');
    process.exit(1);
}

function installKemLang() {
    const python = checkPython();
    const pip = checkPip(python);

    console.log('📦 Installing kemlang-py via pip...');

    // When installed from source (local dev), pyproject.toml is one level up.
    // When installed from the npm registry, that parent dir is node_modules — no pyproject.toml there.
    const parentDir = path.join(__dirname, '..');
    const isLocalSource = fs.existsSync(path.join(parentDir, 'pyproject.toml'));

    if (isLocalSource) {
        console.log('📁 Detected local source — installing in editable mode...');
        execSync(`${pip} install -e "${parentDir}"`, { stdio: 'inherit' });
    } else {
        execSync(`${pip} install kemlang-py`, { stdio: 'inherit' });
    }

    // Verify
    try {
        const version = execSync('kem version', { encoding: 'utf8' }).trim();
        console.log(`✓ ${version}`);
        console.log('');
        console.log('🎉 Installation complete! Try:');
        console.log('   kem version          — show version');
        console.log('   kem repl             — interactive REPL');
        console.log('   kem run hello.jsk    — run a file');
        console.log('');
    } catch (e) {
        console.warn('⚠️  kem not found in PATH after install.');
        console.warn('   You may need to restart your terminal.');
    }
}

function createBinScript() {
    const binDir = path.join(__dirname, 'bin');
    if (!fs.existsSync(binDir)) {
        fs.mkdirSync(binDir);
    }

    const script = `#!/usr/bin/env node
const { spawn } = require('child_process');
const child = spawn('kem', process.argv.slice(2), { stdio: 'inherit' });
child.on('close', (code) => process.exit(code));
child.on('error', (err) => {
    if (err.code === 'ENOENT') {
        console.error('❌ KemLang not found. Try: npm install -g kemlang-py');
    } else {
        console.error('Error:', err.message);
    }
    process.exit(1);
});
`;

    fs.writeFileSync(path.join(binDir, 'kem'), script);
    if (os.platform() !== 'win32') {
        fs.chmodSync(path.join(binDir, 'kem'), '755');
    }
}

try {
    installKemLang();
    createBinScript();
} catch (error) {
    console.error('❌ Installation failed:', error.message);
    console.error('   Try manually: pip install kemlang-py');
    process.exit(1);
}
