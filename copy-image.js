const fs = require('fs');
try {
  fs.copyFileSync('C:\\Users\\athen\\.gemini\\antigravity-ide\\brain\\ee59009a-7b52-4223-a858-5b4e95ac9c99\\media__1782175112299.png', 'c:\\Users\\athen\\OneDrive\\Documentos\\PW1\\Cooperatica-Luthiers\\apps\\frontend\\public\\login-bg.png');
  console.log('Copied successfully!');
} catch (err) {
  console.error('Error copying file:', err);
}
