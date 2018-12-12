import childProcess from 'child_process';
import { promisify } from 'util';
import commandLineArgs from 'command-line-args';

const optionDefinitions = [
  { name: 'ip', alias: 'i', type: String },
  { name: 'port', alias: 'p', type: Number, defaulOption: 80 },
  { name: 'connections', alias: 'c', type: Number },
  { name: 'protocol', alias: 'h', type: String, defaulOption: 'http' },
];

const options = commandLineArgs(optionDefinitions);

const exec = promisify(childProcess.exec);

const curl = ({
  protocol = 'http',
  ip,
  port,
}) => exec(`curl ${protocol}://${ip}:${port}`);

for (let i = 0; i < options.connections; i++) {
  const { ip, port, protocol } = options;
  curl({ ip, port, protocol }).then(() => console.log(i));
}
