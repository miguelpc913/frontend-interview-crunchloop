import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workspaceRoot = path.resolve(__dirname, '..');
const transcriptsDir = path.resolve(
  process.env.HOME ?? '',
  '.cursor',
  'projects',
  'workspaces-frontend',
  'agent-transcripts',
);
const exportsDir = path.resolve(workspaceRoot, 'exports');
const outputPath = path.join(exportsDir, 'agent-chats.jsonl');

function isRoleLine(line) {
  return line.startsWith('user:') || line.startsWith('assistant:');
}

function detectRole(line) {
  if (line.startsWith('user:')) return 'user';
  if (line.startsWith('assistant:')) return 'assistant';
  return null;
}

function parseTranscriptFile(filePath, sessionId) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/);

  const messages = [];
  let currentRole = null;
  let currentLines = [];

  const flush = () => {
    if (!currentRole || currentLines.length === 0) return;
    const content = currentLines.join('\n').trim();
    if (content.length === 0) return;
    messages.push({ role: currentRole, content });
  };

  for (const line of lines) {
    if (isRoleLine(line)) {
      flush();
      currentRole = detectRole(line);
      currentLines = [];
      continue;
    }

    if (currentRole) {
      currentLines.push(line);
    }
  }

  flush();

  return messages.map((msg, index) => ({
    session_id: sessionId,
    role: msg.role,
    content: msg.content,
    index,
  }));
}

function main() {
  if (!fs.existsSync(transcriptsDir)) {
    console.error(`Transcripts directory not found: ${transcriptsDir}`);
    process.exit(1);
  }

  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  const files = fs
    .readdirSync(transcriptsDir)
    .filter((name) => name.endsWith('.txt'))
    .sort();

  const writeStream = fs.createWriteStream(outputPath, { encoding: 'utf8' });

  let totalMessages = 0;

  for (const file of files) {
    const sessionId = file.replace(/\.txt$/, '');
    const fullPath = path.join(transcriptsDir, file);
    const messages = parseTranscriptFile(fullPath, sessionId);
    for (const msg of messages) {
      writeStream.write(`${JSON.stringify(msg)}\n`);
      totalMessages += 1;
    }
  }

  writeStream.end();

  writeStream.on('finish', () => {
    console.log(
      `Wrote ${totalMessages} messages from ${files.length} sessions to ${outputPath}`,
    );
  });
}

main();

