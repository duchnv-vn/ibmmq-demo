const {
  ConnxPromise,
  OpenPromise,
  PutPromise,
  MQC,
  MQCNO,
  MQOD,
  MQMD,
  MQPMO,
  MQCSP,
  MQCD,
  MQDLH,
} = require('ibmmq');
const { Buffer } = require('buffer');

const MQ_SERVER_HOSTNAME = ''; // Message queue server hostname (eg. 9.110.182.197)
const TCP_PORT = 1418; // Message queue server port
const QUEUE_MANAGER = 'QM1'; // Queue manager
const CHANNEL_NAME = '';
const INPUT_QUEUE = ''; // Input queue name
const RNAME = ''; // Dest Queue
const RQMNAME = ''; // Dest QMgr
const TRANSMISSION_QUEUE = '';

const connectionSecurityParams = new MQCSP();

const demo = async () => {
  const channelDefinition = new MQCD();
  channelDefinition.ChannelName = CHANNEL_NAME;
  channelDefinition.ConnectionName = `${MQ_SERVER_HOSTNAME}(${TCP_PORT})`;

  const connectOptions = new MQCNO();
  connectOptions.Options = MQC.MQCNO_CLIENT_BINDING;
  connectOptions.ClientConn = channelDefinition;
  const queueManager = await ConnxPromise(QUEUE_MANAGER, connectOptions);

  const objectDescriptor = new MQOD();
  objectDescriptor.ObjectName = INPUT_QUEUE;
  const openOptions = MQC.MQOO_OUTPUT;
  const mqObject = await OpenPromise(
    queueManager,
    objectDescriptor,
    openOptions
  );

  const messageQueueDescriptor = new MQMD();
  messageQueueDescriptor.Format = MQC.MQFMT_STRING;
  messageQueueDescriptor.;

  const putMessageOptions = new MQPMO();
  putMessageOptions.Options =
    MQC.MQPMO_NO_SYNCPOINT | MQC.MQPMO_NEW_MSG_ID | MQC.MQPMO_NEW_CORREL_ID;

  const deadLetterHeader = new MQDLH();
  deadLetterHeader.DestQName = RNAME;
  deadLetterHeader.DestQMgrName = RQMNAME;

  const messageContent = `<xml></xml>`;
  const fullMessage = Buffer.concat([
    deadLetterHeader.getBuffer(),
    Buffer.from(messageContent),
  ]);
  await PutPromise(
    mqObject,
    messageQueueDescriptor,
    putMessageOptions,
    fullMessage
  );
};
