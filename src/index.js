import childProcess from 'child_process';
import { promisify } from 'util';
import commandLineArgs from 'command-line-args';
import { Bar, Presets } from 'cli-progress';

const optionDefinitions = [
  { name: 'ip', alias: 'i', type: String },
  { name: 'port', alias: 'p', type: Number, defaulOption: 80 },
  { name: 'connections', alias: 'c', type: Number },
  { name: 'protocol', alias: 'h', type: String, defaulOption: 'http' },
];

const options = commandLineArgs(optionDefinitions);

const exec = promisify(childProcess.exec);

const progress = new Bar({}, Presets.shades_classic);

const curl = ({
  protocol = 'http',
  ip,
  port,
}) => exec(`curl ${protocol}://${ip}:${port}`);

progress.start(options.connections, 0);

const curls = [];
let failed = 0;

for (let i = 0; i < options.connections; i++) {
  const { ip, port, protocol } = options;
  progress.update(i + 1);
  curls.push(
    curl({ ip, port, protocol }).catch(() => failed++),
  );
}

Promise.all(curls).finally(() => {
  progress.stop();
  console.error(`${failed} connections failed`);
});
